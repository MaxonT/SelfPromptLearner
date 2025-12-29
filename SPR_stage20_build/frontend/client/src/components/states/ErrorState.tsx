import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ 
  title = "出错了",
  message = "无法加载数据，请稍后重试",
  onRetry,
  retryLabel = "重试",
  className = "" 
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}

