import { LayoutDashboard, ShoppingBag, Users, Package, FileText, Star, Mail, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'consults', label: 'Consultations', icon: Users },
        { id: 'products', label: 'Inventory', icon: Package },
        { id: 'blogs', label: 'Content (Blogs)', icon: FileText },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'subscribers', label: 'Subscribers', icon: Mail },
    ];

    return (
        <aside className={`bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 flex flex-col border-r border-slate-800 ${collapsed ? 'w-20' : 'w-64'}`}>

            {/* Brand */}
            <div className="h-16 flex items-center justify-center border-b border-slate-800 relative">
                {collapsed ? (
                    <span className="font-bold text-xl text-emerald-500">H</span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-white tracking-tight">HINDSULE</span>
                        <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">ADMIN</span>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-700 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 px-3 ${collapsed && 'text-center'}`}>
                    {collapsed ? 'MENU' : 'Main Menu'}
                </p>

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                                    : 'hover:bg-slate-800 hover:text-white'}
                ${collapsed ? 'justify-center' : ''}
              `}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon size={20} className={`min-w-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                            {!collapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}

                            {isActive && !collapsed && (
                                <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onLogout}
                    className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="text-sm font-bold">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};
