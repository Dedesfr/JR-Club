<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->user()->update([
            'push_subscription' => $request->validate([
                'endpoint' => ['required', 'string'],
                'keys' => ['required', 'array'],
            ]),
        ]);

        return back()->with('success', 'Notifications enabled.');
    }
}
