"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    mode: "dark" | "light"
}

const initialState: InitialState = {
    mode: "dark",
}

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<"dark" | "light">) => {
            state.mode = action.payload;
            if (typeof document !== "undefined") {
                if (action.payload === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
            if (typeof document !== "undefined") {
                if (state.mode === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        }
    }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
