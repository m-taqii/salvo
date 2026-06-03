import mongoose, { Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    description?: string;
    website?: string;
    comparePassword(password: string): Promise<boolean>;
}

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    }
});

UserSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
});

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcryptjs.compare(password, this.password);
};

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
export default User;