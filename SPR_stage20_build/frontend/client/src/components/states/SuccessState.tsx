import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessStateProps {
  message?: string;
  className?: string;
}

export function SuccessState({ message = "操作成功", className = "" }: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
      <p className="text-foreground text-sm font-medium">{message}</p>
    </motion.div>
  );
}

