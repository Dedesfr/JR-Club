<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Imports\LeagueParticipantsImport;
use App\Exports\LeagueParticipantsExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ParticipantImportExportController extends Controller
{
    public function template(): BinaryFileResponse
    {
        return response()->download(public_path('templates/participants_template.xlsx'), 'participants_template.xlsx');
    }

    public function import(Request $request, League $league)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        $import = new LeagueParticipantsImport($league);
        
        try {
            Excel::import($import, $request->file('file'));
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];
            foreach ($failures as $failure) {
                $errors[] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
            }
            return back()->withErrors(['import_errors' => $errors]);
        }

        return back()->with('success', 'Participants imported successfully.');
    }

    public function export(League $league): BinaryFileResponse
    {
        return Excel::download(new LeagueParticipantsExport($league), "league_{$league->id}_participants.xlsx");
    }
}
