import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme.slice";
import conversationReducer from "./conversation.slice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        conversation: conversationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store