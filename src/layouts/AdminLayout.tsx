import { ReactNode } from 'react';
import { Sidebar } from '../components/admin/Sidebar';
import { AdminHeader } from '../components/admin/Header';

interface AdminLayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userEmail: string;
    onLogout: () => void;
}

export const AdminLayout = ({ children, activeTab, setActiveTab, userEmail, onLogout }: AdminLayoutProps) => {
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">

            {/* 1. Sidebar (Fixed Left) */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

            {/* 2. Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Header (Sticky Top) */}
                <AdminHeader userEmail={userEmail} title={activeTab} />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
};
