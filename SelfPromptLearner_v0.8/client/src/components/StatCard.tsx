import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, trend, trendUp, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={cn("glass-card rounded-2xl p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold font-display mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {value}
          </h3>
          {trend && (
            <p className={cn("text-xs mt-2 font-medium flex items-center gap-1", 
              trendUp ? "text-emerald-400" : "text-rose-400"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
