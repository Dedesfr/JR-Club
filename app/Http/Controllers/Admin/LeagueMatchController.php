<?php

namespace App\Http\Controllers\Admin;

use App\Events\MatchScoreUpdated;
use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\MatchSet;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use App\Support\MatchFormat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeagueMatchController extends Controller
{
    public function store(Request $request, GameMatch $match, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
        $this->authorize('update', $match->league);

        if ($match->status === 'completed') {
            return back()->withErrors(['sets' => 'Match is already completed. No more sets can be added.']);
        }

        $validated = $request->validate([
            'home_points' => ['required', 'integer', 'min:0'],
            'away_points' => ['required', 'integer', 'min:0', 'different:home_points'],
        ]);

        if ($error = $this->validateSetScore($match, $validated, $match->sets()->count() + 1)) {
            return back()->withErrors(['sets' => $error]);
        }

        MatchSet::updateOrCreate(
            ['match_id' => $match->id, 'set_number' => $match->sets()->count() + 1],
            $validated,
        );

        $match->refresh();
        $this->recomputeMatchOutcome($match, $leagueFormatService, $bracketService);

        return back()->with('success', 'Set recorded.');
    }

    public function updateSet(Request $request, GameMatch $match, MatchSet $set, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
        $this->authorize('update', $match->league);
        abort_unless($set->match_id === $match->id, 404);

        $validated = $request->validate([
            'home_points' => ['required', 'integer', 'min:0'],
            'away_points' => ['required', 'integer', 'min:0', 'different:home_points'],
        ]);

        if ($error = $this->validateSetScore($match, $validated, $set->set_number)) {
            return back()->withErrors(['sets' => $error]);
        }

        $set->update($validated);

        $match->refresh();
        $this->recomputeMatchOutcome($match, $leagueFormatService, $bracketService);

        return back()->with('success', 'Set updated.');
    }

    public function destroySet(GameMatch $match, MatchSet $set, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
        $this->authorize('update', $match->league);
        abort_unless($set->match_id === $match->id, 404);

        DB::transaction(function () use ($match, $set, $leagueFormatService, $bracketService) {
            $set->delete();

            $match->sets()->orderBy('set_number')->get()->values()->each(function (MatchSet $remaining, int $index) {
                $remaining->update(['set_number' => $index + 1]);
            });

            $match->refresh();
            $this->recomputeMatchOutcome($match, $leagueFormatService, $bracketService);
        });

        return back()->with('success', 'Set deleted.');
    }

    public function lock(GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        if (! in_array($match->status, ['live', 'completed'], true)) {
            return back()->withErrors(['status' => 'Only live or completed matches can be locked.']);
        }

        $match->update(['locked' => true]);

        return back()->with('success', 'Match locked.');
    }

    public function unlock(GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $match->update(['locked' => false]);

        return back()->with('success', 'Match unlocked.');
    }

    public function updateSchedule(Request $request, GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $validated = $request->validate([
            'scheduled_at' => ['required', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $match->update($validated);

        return back()->with('success', 'Match schedule updated.');
    }

    public function substitute(Request $request, GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $validated = $request->validate([
            'entry_id' => ['required', 'exists:league_entries,id'],
            'original_player_id' => ['required', 'exists:users,id'],
            'substitute_id' => ['required', 'exists:users,id'],
            'reason' => ['nullable', 'string'],
        ]);

        $entry = $match->league->entries()->findOrFail($validated['entry_id']);

        if (!$entry->substitutes()->where('users.id', $validated['substitute_id'])->exists()) {
            return back()->withErrors(['substitute_id' => 'The selected user is not a declared substitute for this entry.']);
        }

        $match->substitutions()->create($validated);

        return back()->with('success', 'Substitution recorded successfully.');
    }

    public function uploadDocuments(Request $request, GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $request->validate([
            'documents' => ['required', 'array', 'max:10'],
            'documents.*' => ['required', 'file', 'mimes:jpeg,png,webp', 'max:5120'], // 5MB
        ]);

        foreach ($request->file('documents') as $file) {
            $path = $file->store('matches', 'public');
            $match->documents()->create([
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'uploaded_by' => auth()->id(),
            ]);
        }

        return back()->with('success', 'Documents uploaded successfully.');
    }

    public function destroyDocument(GameMatch $match, $documentId): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $document = $match->documents()->findOrFail($documentId);

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($document->path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($document->path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }

    public function complete(GameMatch $match): RedirectResponse
    {
        $this->authorize('update', $match->league);

        $match->update(['status' => 'completed']);

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam', 'homeEntry.player1', 'homeEntry.player2', 'homeEntry.substitutes', 'awayEntry.player1', 'awayEntry.player2', 'awayEntry.substitutes', 'sets', 'league'])));

        return back()->with('success', 'Match completed.');
    }

    private function recomputeMatchOutcome(GameMatch $match, LeagueFormatService $leagueFormatService, BracketService $bracketService): void
    {
        $homeSets = $match->sets->filter(fn ($set) => $set->home_points > $set->away_points)->count();
        $awaySets = $match->sets->filter(fn ($set) => $set->away_points > $set->home_points)->count();
        $rules = $match->league->formatRules();
        $setCount = $match->sets->count();
        $setsToWin = (int) $rules['sets_to_win'];

        $status = match ($rules['completion_mode']) {
            MatchFormat::ALL_SETS => $setCount >= $setsToWin ? 'completed' : ($setCount > 0 ? 'live' : 'scheduled'),
            MatchFormat::SINGLE_BLOCK => $setCount >= 1 ? 'completed' : 'scheduled',
            default => max($homeSets, $awaySets) >= $setsToWin ? 'completed' : ($setCount > 0 ? 'live' : 'scheduled'),
        };

        $match->update([
            'home_score' => $homeSets,
            'away_score' => $awaySets,
            'status' => $status,
            'locked' => $status === 'completed',
        ]);

        if ($status === 'completed') {
            if ($match->stage === 'group') {
                $leagueFormatService->recomputeGroupPoints($match->league->fresh());
            }

            if (in_array($match->stage, ['upper', 'lower'], true) && $match->winner_entry_id !== null) {
                $bracketService->advanceWinner($match->fresh('league', 'nextMatch'), $match->winner_entry_id);
            }
        }

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam', 'homeEntry.player1', 'homeEntry.player2', 'homeEntry.substitutes', 'awayEntry.player1', 'awayEntry.player2', 'awayEntry.substitutes', 'sets', 'league'])));
    }

    private function validateSetScore(GameMatch $match, array $score, int $setNumber): ?string
    {
        $rules = $match->league->formatRules();
        $maxSets = match ($rules['completion_mode']) {
            MatchFormat::ALL_SETS => (int) $rules['sets_to_win'],
            MatchFormat::SINGLE_BLOCK => 1,
            default => null,
        };

        if ($maxSets !== null && $setNumber > $maxSets) {
            return "This format only allows {$maxSets} set" . ($maxSets === 1 ? '.' : 's.');
        }

        $winnerPoints = max($score['home_points'], $score['away_points']);
        $loserPoints = min($score['home_points'], $score['away_points']);
        $target = (int) $rules['points_per_set'];
        $minimumMargin = $rules['deuce'] ? 2 : 1;

        if ($winnerPoints < $target) {
            return "A set must reach at least {$target} points.";
        }

        if (($winnerPoints - $loserPoints) < $minimumMargin) {
            return $rules['deuce'] ? 'Deuce format sets must be won by 2 points.' : 'A set must have a clear winner.';
        }

        return null;
    }
}
