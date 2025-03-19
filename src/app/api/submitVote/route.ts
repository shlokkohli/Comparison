import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest) {

    try {

        // first connect to the database
        await dbConnect();

        // take user input for the vote
        const { vote, pairId } = await request.json();

        if(!vote || !pairId){
            return NextResponse.json(
                { error : "Vote and pairId are required" },
                { status : 400 }
            )
        }

        // find the pair in the database
        const pair = await PairModel.findById(pairId);

        if(!pair){
            return NextResponse.json(
                { error : "Pair not found" },
                { status : 404 }
            )
        }

        // if the pair is found, update the vote
        pair.smashVotes += vote;;

        // updae the total votes also
        pair.totalVotes = pair.totalVotes + 1;

        await pair.save();

        return NextResponse.json(
            { message : "Vote updated successfully" },
            { status : 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { error : "Failed to update vote" },
            { status : 500 }
        )
        
    }

}