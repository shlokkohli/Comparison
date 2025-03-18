import mongoose, { Document, Schema } from "mongoose";
import { Gender } from "./MaleModel";

const FemaleSchema = new Schema<Gender>(
    {
        imageURL: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true }
)

const FemaleModel = (mongoose.models.FemaleModel as mongoose.Model<Gender>) || mongoose.model<Gender>("FemaleModel", FemaleSchema);

export default FemaleModel;