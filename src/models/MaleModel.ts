import mongoose, { Document, Schema } from "mongoose";

export interface Gender {
    _id?: string,
    imageURL: string,
}

const maleSchema = new Schema<Gender>(
    {
        imageURL: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true }
)

const MaleModel = (mongoose.models.MaleModel as mongoose.Model<Gender>) || mongoose.model<Gender>("MaleModel", maleSchema);

export default MaleModel;