import { model, Schema, Types } from "mongoose";

export interface MessageType extends Document {
    conversationId: Types.ObjectId;
    role: "user" | "ai";
    content: string;
}

const messageSchema = new Schema<MessageType>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })


export const Message = model<MessageType>("Message", messageSchema)