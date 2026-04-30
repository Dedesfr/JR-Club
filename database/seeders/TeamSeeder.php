<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@jasaraharja.co.id')->first();

        $teams = [
            'Divisi Asuransi',
            'Divisi Pelayanan',
            'Divisi Human Capital (HC)',
            'Divisi Umum',
            'Divisi Teknologi Informasi dan Komunikasi (TIK)',
            'Divisi Investasi',
            'Divisi Akuntansi',
            'Divisi Keuangan',
            'Aktuaria Perusahaan',
            'Divisi Strategi Transformasi dan Korporasi',
            'Divisi Manajemen Risiko (MR)',
            'Divisi Kepatuhan dan Hukum (DKH)',
            'Kanwil DKI Jakarta',
            'Unit Bisnis Strategis (UBS)',
            'Satuan Pengawasan Intern (SPI)',
            'Sekretariat Perusahaan (Sekper)',
        ];

        foreach ($teams as $name) {
            Team::create([
                'name' => $name,
                'created_by' => $admin->id,
            ]);
        }
    }
}
