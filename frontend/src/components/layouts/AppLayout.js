import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-grow overflow-auto">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
