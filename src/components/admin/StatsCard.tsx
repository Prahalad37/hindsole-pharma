import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Tailwind color class prefix (e.g. 'emerald', 'blue')
}

export const StatsCard = ({ title, value, icon: Icon, trend, trendUp, color = 'emerald' }: StatsCardProps) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900">{value}</h3>

                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{trend}</span>
                            <span className="text-slate-400 font-medium ml-1">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};
