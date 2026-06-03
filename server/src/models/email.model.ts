import mongoose, { Document } from "mongoose";

interface IEmail extends Document {
    to: string;
    from: string;
    subject: string;
    content: string;
    status: "sent" | "failed" | "pending";
}

const emailSchema = new mongoose.Schema<IEmail>({
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["sent", "failed", "pending"],
        default: "pending",
    }
}, {
    timestamps: true
});

export const Email = (mongoose.models.Email as mongoose.Model<IEmail>) || mongoose.model<IEmail>("Email", emailSchema);
export default Email;