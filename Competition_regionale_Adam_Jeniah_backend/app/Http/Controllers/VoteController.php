<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:Bof,Excellent,Technique,Wow!!',
        ]);

        $user = $request->user();

        // Empêche de voter deux fois pour le même type sur la même anecdote
        $exists = Vote::where('user_id', $user->id)
            ->where('anecdote_id', $id)
            ->where('type', $request->type)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Vous avez déjà voté ce type pour cette anecdote.'
            ], 409);
        }

        // Création du vote
        $vote = Vote::create([
            'user_id' => $user->id,
            'anecdote_id' => $id,
            'type' => $request->type,
        ]);

        return response()->json([
            'message' => 'Vote enregistré avec succès.',
            'vote' => $vote
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vote $vote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vote $vote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vote $vote)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vote $vote)
    {
        //
    }
}
