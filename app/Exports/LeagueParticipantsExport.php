<?php

namespace App\Exports;

use App\Models\League;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LeagueParticipantsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(public League $league)
    {
    }

    public function collection()
    {
        return $this->league->entries()->with(['player1', 'player2', 'substitutes'])->get();
    }

    public function headings(): array
    {
        return [
            'player1_email',
            'player2_email',
            'substitute_emails',
            'group_name',
        ];
    }

    public function map($entry): array
    {
        return [
            $entry->player1?->email,
            $entry->player2?->email,
            $entry->substitutes->pluck('email')->implode(','),
            $entry->group_name,
        ];
    }
}