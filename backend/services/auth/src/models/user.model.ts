import mongoose, { Document, Schema } from "mongoose";

export interface UserTypes extends Document {
  firebaseUID: string;
  name: string;
  email: string;
  profileImage?: string;
}

const userSchema = new Schema<UserTypes>(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserTypes>("User", userSchema);