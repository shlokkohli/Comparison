import FemaleModel from "@/models/FemaleModel";
import MaleModel from "@/models/MaleModel";
import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// first we need to create a function that helps us in selecting random images but in a smart way using bayesian algorithm
const randomWeights = (totalItems: any[], weights: number[]) : number => {

    let totalWeight = 0;
    weights.forEach((eachWeight: number) => {
        totalWeight = eachWeight + totalWeight
    });

    let threshold = Math.random() * totalWeight;

    for(let i = 0; i < totalItems.length; i++){
        threshold = threshold - weights[i];
        if(threshold < 0){
            return totalItems[i];
        }
    }

    // if the loop does not return anything, return the first item
    return totalItems[0];

}

export async function POST() {

    try {

        await dbConnect();

        // first fetch all the existing pairs
        const pairs = await PairModel.find().populate('maleID femaleID');

        // if there are no pairs, create one
        if(pairs.length === 0){
            const randomMale = await MaleModel.aggregate([ {$sample : {size : 1} }]);
            const randomFemale = await FemaleModel.aggregate([ {$sample : {size : 1} }]);

            if(randomMale.length === 0 || randomFemale.length === 0){
                return NextResponse.json(
                    { error : "Unable to fetch images" },
                    { status : 500 }
                )
            }

            // from the random Male and Female created, create a pair
            const newPair = await PairModel.create({
                maleID : randomMale[0]._id,
                femaleID : randomFemale[0]._id,
            })

            // return the response
            return NextResponse.json(
                { message : "Pair created successfully", pair : newPair },
                { status : 200 }
            )
        }

        // now if the pair already exists, update the weight
        const weights = pairs.map((eachPair) => 1 / (1 + eachPair.totalVotes));

        // pass these weights to the above create function
        const selectedPair = randomWeights(pairs, weights);

        return NextResponse.json(
            { message : "Pair returned successfully", pair : selectedPair },
            { status : 200 }
        )

        
    } catch (error) {

        console.log("Error in the getPair: ", error);
        return NextResponse.json(
            { error : "Failed to create a pair" },
            { status : 500 }
        )
        
    }

}