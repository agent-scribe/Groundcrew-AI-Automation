"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  LayoutTemplate,
  RadioTower,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/onboardings", label: "Onboardings", icon: ClipboardList },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/tower", label: "Tower", icon: RadioTower },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-[60px] items-center border-b border-border px-5">
        <Link href="/dashboard" aria-label="Groundcrew dashboard">
          <Logo size={20} />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Main">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-ctl)] px-3 py-2 text-sm font-medium transition-colors duration-[140ms]",
                active
                  ? "bg-surface-2 text-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text"
              )}
            >
              <item.icon size={20} strokeWidth={1.5} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-xs text-text-2">
        <p className="font-medium text-text">Northbeam Digital</p>
        <p className="mt-0.5">Pro plan · demo workspace</p>
      </div>
    </aside>
  );
}
