<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $admin = $request->user();

        return Inertia::render('Admin/Users/Index', [
            'users' => User::query()
                ->with('branch')
                ->when(! $admin->isPusatAdmin(), fn ($query) => $query->where('branch_id', $admin->branch_id))
                ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                }))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'search' => $search->toString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'branches' => $this->branchOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:member,admin'],
            'gender' => ['nullable', 'in:male,female'],
            'branch_id' => ['required', 'exists:branch,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            $validated['branch_id'] = $request->user()->branch_id;
        }

        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        $this->authorizeUserBranch($user);

        return Inertia::render('Admin/Users/Edit', [
            'userRecord' => $user->load('branch'),
            'branches' => $this->branchOptions(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorizeUserBranch($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'in:member,admin'],
            'gender' => ['nullable', 'in:male,female'],
            'branch_id' => ['required', 'exists:branch,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            $validated['branch_id'] = $request->user()->branch_id;
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }

    private function authorizeUserBranch(User $user): void
    {
        $admin = request()->user();

        abort_if(! $admin->isPusatAdmin() && $user->branch_id !== $admin->branch_id, 403);
    }

    private function branchOptions()
    {
        $admin = request()->user();

        return Branch::query()
            ->when(! $admin->isPusatAdmin(), fn ($query) => $query->whereKey($admin->branch_id))
            ->orderBy('name')
            ->get(['id', 'name', 'is_global']);
    }
}
