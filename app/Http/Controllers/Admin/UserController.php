<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index', ['users' => User::orderBy('name')->paginate(10)]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', ['userRecord' => $user]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $user->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'in:member,admin'],
            'gender' => ['nullable', 'in:male,female'],
        ]));

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }
}
