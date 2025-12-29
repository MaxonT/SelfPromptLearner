import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = "" 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      {icon && (
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

