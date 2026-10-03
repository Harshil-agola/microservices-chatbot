import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConversationType } from "@/types";

export const conversation = createSlice({
    name: "conversation",
    initialState: {
        conversations: [] as ConversationType[],
        activeConversationId: null as string | null
    },
    reducers: {
        setConversations: (state, action: PayloadAction<ConversationType[]>) => {
            state.conversations = action.payload;
        },
        addConversation: (state, action: PayloadAction<ConversationType>) => {
            state.conversations.unshift(action.payload);
            state.activeConversationId = action.payload._id;
        },
        renameConversation: (state, action: PayloadAction<ConversationType>) => {
            const updatedConversation = action.payload;
            state.conversations = state.conversations.map((conversation) =>
                conversation._id === updatedConversation._id ? updatedConversation : conversation
            );
        },
        setActiveConversationId: (state, action: PayloadAction<string>) => {
            state.activeConversationId = action.payload;
        }
    },
});

export const { setConversations, addConversation, setActiveConversationId, renameConversation } = conversation.actions;

export default conversation.reducer;