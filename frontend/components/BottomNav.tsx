"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Bell, UserCircle2 } from "lucide-react";
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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50 pb-safe">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
              isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive ? "scale-110 stroke-[2.5px]" : "stroke-2"
                )}
              />
              {tab.name === "Alerts" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
