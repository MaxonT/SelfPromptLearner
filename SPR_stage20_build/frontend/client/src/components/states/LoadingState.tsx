import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "加载中...", className = "" }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </motion.div>
  );
}

