import FemaleModel from "@/models/FemaleModel";
import MaleModel from "@/models/MaleModel";
import PairModel from "@/models/PairModel";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(){

  try {

    await dbConnect();

    const randomMale = await MaleModel.aggregate([ { $sample: {size : 1} }])
    const randomFemale = await FemaleModel.aggregate([ { $sample: {size : 1} }])

    const response = await PairModel.create({
      maleID : randomMale[0]._id,
      femaleID : randomFemale[0]._id
    })

    // populate the generated pair
    const populatedPair = await PairModel.findById(response._id).populate('maleID femaleID')

    return NextResponse.json(
      { pair : populatedPair },
      { status : 200 }
    )
    
  } catch (error) {

    return NextResponse.json(
      { error : "Unable to generate pair" },
      { status : 500 }
    )
    
  }

}