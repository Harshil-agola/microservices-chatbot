import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConversationType } from "@/types";

export const conversation = createSlice({
    name: "conversation",
    initialState: {
        conversations: [] as ConversationType[],
        activeConversationId: null as string | null,
        isSidebarCollapsed: false,
        sidebarWidth: 280,
        isSearchOpen: false,
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
        },
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        setSidebarWidth: (state, action: PayloadAction<number>) => {
            state.sidebarWidth = action.payload;
        },
        setSearchOpen: (state, action: PayloadAction<boolean>) => {
            state.isSearchOpen = action.payload;
        }
    },
});

export const {
    setConversations,
    addConversation,
    setActiveConversationId,
    renameConversation,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarWidth,
    setSearchOpen
} = conversation.actions;

export default conversation.reducer;