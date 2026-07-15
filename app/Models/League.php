<?php

namespace App\Models;

use App\Models\Concerns\BelongsToBranch;
use App\Services\LeagueFormatService;
use App\Support\MatchFormat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use BelongsToBranch, HasFactory;

    protected $appends = [
        'banner_url',
    ];

    protected $fillable = [
        'name',
        'branch_id',
        'sport_id',
        'sport_category_id',
        'category',
        'entry_type',
        'match_format',
        'description',
        'documentation_url',
        'start_date',
        'end_date',
        'status',
        'stage',
        'start_stage',
        'participant_total',
        'group_count',
        'group_size',
        'group_locked',
        'sets_to_win',
        'points_per_set',
        'advance_upper_count',
        'advance_lower_count',
        'bracket_preset_enabled',
        'bracket_preset_reveal_at',
        'bracket_seed_count',
        'bracket_preset_slots',
        'upper_champion_entry_id',
        'lower_champion_entry_id',
        'third_place_match_id',
        'lower_third_place_match_id',
        'created_by',
        'banner_path',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'participant_total' => 'integer',
            'group_count' => 'integer',
            'group_size' => 'integer',
            'group_locked' => 'boolean',
            'sets_to_win' => 'integer',
            'points_per_set' => 'integer',
            'advance_upper_count' => 'integer',
            'advance_lower_count' => 'integer',
            'bracket_preset_enabled' => 'boolean',
            'bracket_preset_reveal_at' => 'integer',
            'bracket_seed_count' => 'integer',
            'bracket_preset_slots' => 'array',
        ];
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function sportCategory()
    {
        return $this->belongsTo(SportCategory::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'league_teams')
            ->withPivot('registered_at')
            ->withTimestamps();
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class, 'league_id')->orderBy('id', 'asc');
    }

    public function thirdPlaceMatch()
    {
        return $this->belongsTo(GameMatch::class, 'third_place_match_id');
    }

    public function lowerThirdPlaceMatch()
    {
        return $this->belongsTo(GameMatch::class, 'lower_third_place_match_id');
    }

    public function entries()
    {
        return $this->hasMany(LeagueEntry::class)->orderBy('id');
    }

    public function groups()
    {
        return $this->hasMany(LeagueGroup::class);
    }

    public function awards()
    {
        return $this->hasMany(LeagueAward::class)->orderBy('sort_order')->orderBy('id');
    }

    public function upperChampion()
    {
        return $this->belongsTo(LeagueEntry::class, 'upper_champion_entry_id');
    }

    public function lowerChampion()
    {
        return $this->belongsTo(LeagueEntry::class, 'lower_champion_entry_id');
    }

    public function isBadminton(): bool
    {
        return in_array($this->category, ['MS', 'WS', 'MD', 'WD', 'XD'], true);
    }

    public function usesDirectEntries(): bool
    {
        return $this->sport_category_id !== null || in_array($this->entry_type, ['single', 'double'], true);
    }

    public function isTeamBased(): bool
    {
        return $this->entry_type === 'team';
    }

    public function standings(): array
    {
        return app(LeagueFormatService::class)->standings($this);
    }

    public function formatRules(): array
    {
        return MatchFormat::rules($this->match_format, $this->sets_to_win, $this->points_per_set);
    }

    public function getBannerUrlAttribute(): ?string
    {
        if ($this->banner_path) {
            return $this->banner_path;
        }

        return match ($this->name) {
            'JR Men Double Championship' => '/images/badminton-men-double.png',
            'JR Women Double Championship' => '/images/badminton-woman-double.png',
            'Mix Double Championship' => '/images/badminton-mixed-double.png',
            default => null,
        };
    }
}
