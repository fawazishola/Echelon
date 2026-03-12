"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Bell, UserCircle2, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    {
        name: "Discover",
        href: "/dashboard/discover",
        icon: Compass,
    },
    {
        name: "Tracker",
        href: "/dashboard/tracker",
        icon: LayoutDashboard,
    },
    {
        name: "Alerts",
        href: "/dashboard/alerts",
        icon: Bell,
    },
    {
        name: "Profile",
        href: "/dashboard/profile",
        icon: UserCircle2,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-slate-100 flex-col z-40">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Zap className="w-5 h-5 text-white" fill="white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900">Echelon</h1>
                    <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Scholarship Intelligence</p>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 mt-4 space-y-1">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "w-5 h-5 transition-transform duration-200",
                                        isActive ? "stroke-[2.5px]" : "stroke-2 group-hover:scale-110"
                                    )}
                                />
                                {tab.name === "Alerts" && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <span>{tab.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-slate-100">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 mb-3">
                    <p className="text-xs font-semibold text-indigo-700 mb-1">AI Matching Active</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Your scholarship feed is personalized using 6-factor AI scoring.</p>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-500 transition-colors w-full px-3 py-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
