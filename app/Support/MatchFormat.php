<?php

namespace App\Support;

use Illuminate\Validation\Rule;

class MatchFormat
{
    public const FIRST_TO_WIN = 'first_to_win';
    public const ALL_SETS = 'all_sets';
    public const SINGLE_BLOCK = 'single_block';

    private const FORMATS = [
        'semi_klasik' => [
            'label' => 'Padel Semi Klasik',
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'deuce' => false,
            'completion_mode' => self::FIRST_TO_WIN,
        ],
        'padel_best_of_three' => [
            'label' => 'Padel Best of Three',
            'sets_to_win' => 3,
            'points_per_set' => 21,
            'deuce' => false,
            'completion_mode' => self::ALL_SETS,
        ],
        'padel_best_of_five' => [
            'label' => 'Padel Best of Five',
            'sets_to_win' => 5,
            'points_per_set' => 21,
            'deuce' => false,
            'completion_mode' => self::ALL_SETS,
        ],
        'padel_americano' => [
            'label' => 'Padel Americano',
            'sets_to_win' => 1,
            'points_per_set' => 21,
            'deuce' => false,
            'completion_mode' => self::SINGLE_BLOCK,
        ],
        'tenis_meja_best_of_five' => [
            'label' => 'Tenis Meja Best of Five',
            'sets_to_win' => 3,
            'points_per_set' => 11,
            'deuce' => true,
            'completion_mode' => self::FIRST_TO_WIN,
        ],
        'tenis_meja_best_of_seven' => [
            'label' => 'Tenis Meja Best of Seven',
            'sets_to_win' => 4,
            'points_per_set' => 11,
            'deuce' => true,
            'completion_mode' => self::FIRST_TO_WIN,
        ],
    ];

    public static function keys(): array
    {
        return array_keys(self::FORMATS);
    }

    public static function rule(): mixed
    {
        return Rule::in(self::keys());
    }

    public static function rules(?string $format, ?int $setsToWin = null, ?int $pointsPerSet = null): array
    {
        $rules = self::FORMATS[$format] ?? [
            'label' => 'Custom',
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'deuce' => false,
            'completion_mode' => self::FIRST_TO_WIN,
        ];

        return [
            ...$rules,
            'sets_to_win' => $setsToWin ?? $rules['sets_to_win'],
            'points_per_set' => $pointsPerSet ?? $rules['points_per_set'],
        ];
    }

    public static function options(): array
    {
        return collect(self::FORMATS)
            ->map(fn (array $rules, string $value) => ['value' => $value, ...$rules])
            ->values()
            ->all();
    }
}
