import { motion } from "framer-motion";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Star, Sparkles, MessageSquare, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@shared/schema";
import { useDeletePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  const { mutate: deletePrompt } = useDeletePrompt();
  const { mutate: updatePrompt } = useUpdatePrompt();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(prompt.id, {
        onSuccess: () => {
          toast({ title: "Prompt deleted", description: "The prompt has been removed from your history." });
        },
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePrompt({ id: prompt.id, isFavorite: !prompt.isFavorite });
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
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "p-2 rounded-lg transition-colors hover:bg-white/10",
                  prompt.isFavorite ? "text-yellow-400" : "text-muted-foreground"
                )}
              >
                <Star className={cn("w-4 h-4", prompt.isFavorite && "fill-current")} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative">
            <p className="text-foreground/90 font-medium leading-relaxed line-clamp-3 group-hover:text-primary/90 transition-colors font-mono text-sm">
              {prompt.promptText}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
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
    </motion.div>
  );
}
