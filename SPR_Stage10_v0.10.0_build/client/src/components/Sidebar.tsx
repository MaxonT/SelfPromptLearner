import { Link, useLocation } from "wouter";
import { LayoutGrid, BarChart3, Settings, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Timeline", icon: LayoutGrid },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-panel flex flex-col z-50 hidden md:flex">
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            SPR
          </h1>
        </Link>
        <p className="mt-2 text-xs text-muted-foreground pl-1">Self-Prompt Reflection</p>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-border/50">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20">
          <h4 className="text-sm font-semibold text-white">Pro Tip</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Review your prompts weekly to spot recurring patterns in your thinking.
          </p>
        </div>
      </div>
    </aside>
  );
}
