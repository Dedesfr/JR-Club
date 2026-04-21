<?php

namespace App\Imports;

use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;

class LeagueParticipantsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public function __construct(public League $league)
    {
    }

    public function model(array $row)
    {
        $player1 = User::where('email', $row['player1_email'])->first();
        $player2 = isset($row['player2_email']) ? User::where('email', $row['player2_email'])->first() : null;

        if (!$player1) {
            return null; // Skip if main player not found
        }

        $entry = LeagueEntry::create([
            'league_id' => $this->league->id,
            'player1_id' => $player1->id,
            'player2_id' => $player2?->id,
            'group_name' => $row['group_name'] ?? null,
            'status' => 'approved', // Auto-approve imported participants
        ]);

        if (!empty($row['substitute_emails'])) {
            $subEmails = array_map('trim', explode(',', $row['substitute_emails']));
            $subIds = User::whereIn('email', $subEmails)->pluck('id')->toArray();
            
            if (!empty($subIds)) {
                $entry->substitutes()->sync($subIds);
            }
        }

        return current([$entry]); // Need to return the model, wrapper in array per ToModel spec
    }

    public function rules(): array
    {
        return [
            'player1_email' => ['required', 'email', 'exists:users,email'],
            'player2_email' => ['nullable', 'email', 'exists:users,email'],
            'substitute_emails' => ['nullable', 'string'],
            'group_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}