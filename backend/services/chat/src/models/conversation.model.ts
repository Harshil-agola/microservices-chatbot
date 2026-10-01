import { model, Schema, type Document } from "mongoose";

export interface ConversationType extends Document {
    title: string;
    userId: string;
}

const conversationSchema = new Schema<ConversationType>({
    title: {
        type: String,
        default: "New Chat",
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Conversation = model<ConversationType>("Conversation", conversationSchema);