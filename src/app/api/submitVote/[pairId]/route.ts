import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST( request: Request, { params }: { params: Promise<{ pairId: string }> } ) {

    const { pairId } = await params;

    try {

        // first connect to the database
        await dbConnect();

        // take user input for the vote
        const { vote } = await request.json();

        if (vote !== 0 && vote !== 1) {
            return NextResponse.json(
              { error: "Invalid vote value, must be 0 or 1" },
              { status: 400 }
            );
          }

        const pair = await PairModel.findById(pairId);

        if(!pair){
            return NextResponse.json(
                { error : "Pair not found" },
                { status : 404 }
            )
        }

        // if the pair is found, increment totalVotes
        pair.totalVotes += vote;

        // if the vote is 0 or 1, update it
        await pair.save();

        return NextResponse.json(
            { message : "Vote recorded successfully" },
            { status : 200 },
        )
        
        
    } catch (error) {

        return NextResponse.json(
            { error : "Failed to update vote" },
            { status : 500 }
        )
        
    }

}