"use client"
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { store } from '@/store';

function ThemeSync({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const currentTheme = store.getState().theme.mode;
        if (currentTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return <>{children}</>;
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ThemeSync>
                {children}
            </ThemeSync>
        </Provider>
    )
}