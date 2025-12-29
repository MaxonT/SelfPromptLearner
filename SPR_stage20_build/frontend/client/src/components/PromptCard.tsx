import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Star, Sparkles, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@backend/shared/schema";
import { useDeletePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  const { mutate: deletePrompt } = useDeletePrompt();
  const { mutate: updatePrompt } = useUpdatePrompt();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deletePrompt(prompt.id, {
      onSuccess: () => {
        toast({ 
          title: "已删除", 
          description: "提示已从历史记录中移除",
          duration: 2000
        });
      },
    });
    setShowDeleteDialog(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavoriting(true);
    updatePrompt(
      { id: prompt.id, isFavorite: !prompt.isFavorite },
      {
        onSuccess: () => {
          toast({
            title: prompt.isFavorite ? "已取消收藏" : "已收藏",
            description: prompt.isFavorite 
              ? "提示已从收藏中移除" 
              : "提示已添加到收藏",
            duration: 2000,
          });
        },
        onSettled: () => {
          setTimeout(() => setIsFavoriting(false), 300);
        },
      }
    );
  };

  // Determine clarity score color
  const clarityScore = prompt.analysis?.scores?.clarity ?? 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (score >= 50) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-rose-400 bg-rose-400/10 border-rose-400/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/prompts/${prompt.id}`}>
        <div className="glass-card rounded-2xl p-6 group cursor-pointer hover:border-primary/50 hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
          {/* Top Row: Meta & Actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-secondary text-secondary-foreground border border-white/5 uppercase tracking-wider">
                {prompt.site}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            {/* Actions - Always visible on mobile, hover on desktop */}
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "p-2.5 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
                  "hover:bg-white/10 active:scale-95",
                  prompt.isFavorite ? "text-yellow-400" : "text-muted-foreground"
                )}
                aria-label={prompt.isFavorite ? "取消收藏" : "收藏"}
              >
                <motion.div
                  animate={isFavoriting ? { scale: [1, 1.3, 1], rotate: [0, 180, 360] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Star className={cn("w-4 h-4", prompt.isFavorite && "fill-current")} />
                </motion.div>
              </button>
              <button
                onClick={handleDelete}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                aria-label="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative min-h-[4.5rem]">
            <p className="text-foreground/90 font-medium leading-relaxed line-clamp-3 group-hover:text-primary/90 transition-colors font-mono text-sm break-words">
              {prompt.promptText}
            </p>
            {/* Improved gradient fade for text truncation */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
          </div>

          {/* Footer: Stats & Tags */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(prompt.tags ?? []).slice(0, 2).map((t, i) => (
                <span key={`t-${i}`} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-white/5">
                  {t}
                </span>
              ))}
            </div>

            {prompt.analysis?.scores && (
              <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", getScoreColor(clarityScore))}>
                <Sparkles className="w-3 h-3" />
                {Math.round(clarityScore)}% Clarity
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条提示吗？此操作无法撤销，提示将从您的历史记录中永久移除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(false);
            }}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
