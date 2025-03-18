import mongoose, { Schema } from "mongoose";

export interface Pair {
    _id?: string,
    maleID: mongoose.Types.ObjectId,
    femaleID: mongoose.Types.ObjectId,
    smashVotes: number,
    totalVotes: number,
    bayesianScore: number,
}

const PairSchema = new Schema<Pair>(
    {
        maleID: {
            type: Schema.Types.ObjectId,
            ref: "MaleModel",
            required: true,
        },
        femaleID: {
            type: Schema.Types.ObjectId,
            ref: "FemaleModel",
            required: true,
        },
        smashVotes: {
            type: Number,
            default: 0,
        },
        totalVotes: {
            type: Number,
            default: 0,
        },
        bayesianScore: {
            type: Number,
            default: 1500
        }
    }
)

const PairModel = (mongoose.models.PairModel as mongoose.Model<Pair>) || mongoose.model<Pair>("PairModel", PairSchema)

export default PairModel;