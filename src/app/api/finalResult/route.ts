import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        await dbConnect();

        const mostVotedPair = await PairModel.findOne().sort({ smashVotes : -1 })

        if(!mostVotedPair){
            return NextResponse.json(
                { error : "Unable to find most voted pair" },
                { status : 404 }
            )
        }

        // if the most voted pair is found
        return NextResponse.json(
            { mostVotedPair : mostVotedPair},
            { status : 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { error : "Failed to fetch most voted pair" },
            { status : 500 }
        )
        
    }

}