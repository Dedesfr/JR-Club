<?php

namespace App\Http\Controllers\Admin;

use App\Events\MatchScoreUpdated;
use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\MatchSet;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeagueMatchController extends Controller
{
    public function store(Request $request, GameMatch $match, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
        if ($match->status === 'completed') {
            return back()->withErrors(['sets' => 'Match is already completed. No more sets can be added.']);
        }

        $validated = $request->validate([
            'home_points' => ['required', 'integer', 'min:0'],
            'away_points' => ['required', 'integer', 'min:0', 'different:home_points'],
        ]);

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
        $validated = $request->validate([
            'home_points' => ['required', 'integer', 'min:0'],
            'away_points' => ['required', 'integer', 'min:0', 'different:home_points'],
        ]);

        $set->update($validated);

        $match->refresh();
        $this->recomputeMatchOutcome($match, $leagueFormatService, $bracketService);

        return back()->with('success', 'Set updated.');
    }

    public function destroySet(GameMatch $match, MatchSet $set, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
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
        if (! in_array($match->status, ['live', 'completed'], true)) {
            return back()->withErrors(['status' => 'Only live or completed matches can be locked.']);
        }

        $match->update(['locked' => true]);

        return back()->with('success', 'Match locked.');
    }

    public function unlock(GameMatch $match): RedirectResponse
    {
        $match->update(['locked' => false]);

        return back()->with('success', 'Match unlocked.');
    }

    public function updateSchedule(Request $request, GameMatch $match): RedirectResponse
    {
        $validated = $request->validate([
            'scheduled_at' => ['required', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $match->update($validated);

        return back()->with('success', 'Match schedule updated.');
    }

    public function substitute(Request $request, GameMatch $match): RedirectResponse
    {
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
        $document = $match->documents()->findOrFail($documentId);

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($document->path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($document->path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }

    public function complete(GameMatch $match): RedirectResponse
    {
        $match->update(['status' => 'completed']);

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam', 'homeEntry.player1', 'homeEntry.player2', 'homeEntry.substitutes', 'awayEntry.player1', 'awayEntry.player2', 'awayEntry.substitutes', 'sets', 'league'])));

        return back()->with('success', 'Match completed.');
    }

    private function recomputeMatchOutcome(GameMatch $match, LeagueFormatService $leagueFormatService, BracketService $bracketService): void
    {
        $homeSets = $match->sets->filter(fn ($set) => $set->home_points > $set->away_points)->count();
        $awaySets = $match->sets->filter(fn ($set) => $set->away_points > $set->home_points)->count();

        $setsToWin = $match->league->sets_to_win ?? 2;
        $status = max($homeSets, $awaySets) >= $setsToWin ? 'completed' : ($match->sets->count() > 0 ? 'live' : 'scheduled');

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
}
