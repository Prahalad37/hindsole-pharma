import { Bell, Search, Settings, HelpCircle, User } from 'lucide-react';

interface HeaderProps {
    userEmail: string;
    title: string;
}

export const AdminHeader = ({ userEmail, title }: HeaderProps) => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">

            {/* Title / Breadcrumbs */}
            <div>
                <h1 className="text-xl font-bold text-slate-800 capitalize">{title}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">

                {/* Search Bar (Mock) */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Global search..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
                    />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <HelpCircle size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <Settings size={20} />
                    </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">Admin</p>
                        <p className="text-[10px] text-slate-400 font-medium">{userEmail}</p>
                    </div>
                    <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center border border-emerald-200">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};
