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

        if(!vote){
            return NextResponse.json(
                { error : "Invalid vote" },
                { status : 400 }
            )
        }

        
        
    } catch (error) {
        
    }

}