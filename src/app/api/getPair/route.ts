import { Document, Types } from "mongoose";  // Import Types from mongoose
import FemaleModel from "@/models/FemaleModel";
import MaleModel from "@/models/MaleModel";
import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Define an interface for the Pair structure
interface Pair extends Document {
    maleID: { _id: Types.ObjectId }; // Use Types.ObjectId instead of string
    femaleID: { _id: Types.ObjectId };
    totalVotes: number;
}

// Function to select random items using weighted probability
const weightedRandomSelection = (items: Pair[], weights: number[]): Pair => {
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let threshold = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        threshold -= weights[i];
        if (threshold < 0) {
            return items[i];
        }
    }
    return items[0]; // Fallback in case of an edge case
};

// Function to check if a pair was recently shown
const wasRecentlyShown = (pair: Pair, recentPairs: Pair[]): boolean => {
    return recentPairs.some(
        (recent) =>
            recent.maleID._id.equals(pair.maleID._id) &&  // Use .equals() for ObjectId comparison
            recent.femaleID._id.equals(pair.femaleID._id)
    );
};

// Cache of recent pairs to avoid repetition
let recentPairsCache: Pair[] = [];

export async function POST() {
    try {
        await dbConnect();

        // Fetch all pairs with their male and female details
        const pairs = await PairModel.find().populate("maleID femaleID");

        // If no pairs exist, create one
        if (pairs.length === 0) {
            const randomMale = await MaleModel.aggregate([{ $sample: { size: 1 } }]);
            const randomFemale = await FemaleModel.aggregate([{ $sample: { size: 1 } }]);

            if (randomMale.length === 0 || randomFemale.length === 0) {
                return NextResponse.json(
                    { error: "Unable to fetch images" },
                    { status: 500 }
                );
            }

            const newPair = await PairModel.create({
                maleID: randomMale[0]._id,
                femaleID: randomFemale[0]._id,
            });

            return NextResponse.json(
                { message: "Pair created successfully", pair: newPair },
                { status: 200 }
            );
        }

        // Remove pairs that were recently shown
        let filteredPairs = pairs.filter((pair) => !wasRecentlyShown(pair, recentPairsCache));

        // If no unshown pairs exist, clear recent cache to allow reshuffling
        if (filteredPairs.length === 0) {
            recentPairsCache = [];
            filteredPairs = pairs; // Reset the list so that all pairs are considered again
        }

        // Compute Bayesian-inspired weights based on votes
        const weights = filteredPairs.map(
            (pair) => 1 / (1 + pair.totalVotes) + Math.random() * 0.1 // Adding slight randomness for diversity
        );

        // Select a pair using weighted probability
        const selectedPair = weightedRandomSelection(filteredPairs, weights);

        // Update the recent pairs cache to prevent immediate repetition
        recentPairsCache.push(selectedPair);
        if (recentPairsCache.length > 5) recentPairsCache.shift(); // Keep cache limited

        return NextResponse.json(
            { message: "Pair returned successfully", pair: selectedPair },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in fetching a pair: ", error);
        return NextResponse.json(
            { error: "Failed to fetch a pair" },
            { status: 500 }
        );
    }
}
