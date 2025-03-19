import FemaleModel from "@/models/FemaleModel";
import MaleModel from "@/models/MaleModel";
import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// first we need to create a function that helps us in selecting random images but in a smart way using bayesian algorithm
const randomWeights = (totalItems: number[], weights: number[]) : number => {

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
        const pairs = await PairModel.find().populate('maleId femaleID');

        // if there are no pairs, create one
        if(pairs.length === 0){
            const randomMale = await MaleModel.aggregate([ {$sample : {size : 1} }]);
            const randomFemale = await FemaleModel.aggregate([ {$sample : {size : 1} }]);

            console.log("This is the randomMale", randomMale)

            if(randomMale.length === 0 || randomFemale.length === 0){
                return NextResponse.json(
                    { error : "Unable to fetch images" },
                    { status : 500 }
                )
            }

            // save this pair to the database
            console.log("This is the randomMale", randomMale)

            return NextResponse.json({ message: "Testing complete" });

        }
        
    } catch (error) {

        console.log("Error in the getPair: ", error);
        
    }

}