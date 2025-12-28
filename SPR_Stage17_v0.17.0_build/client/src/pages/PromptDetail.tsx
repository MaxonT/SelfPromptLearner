import { useRoute, useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { usePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Link as LinkIcon, Edit3, Tag, BarChart2, Lightbulb, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PromptDetail() {
  const [, params] = useRoute("/prompts/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;
  const { toast } = useToast();

  const { data: prompt, isLoading } = usePrompt(id || "");
  const { mutate: updatePrompt, isPending: isSaving } = useUpdatePrompt();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedTags, setEditedTags] = useState("");

  useEffect(() => {
    if (prompt) {
      setEditedText(prompt.promptText);
      setEditedTags((prompt.tags ?? []).join(", "));
    }
  }, [prompt]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 p-8 text-center">
          <h2 className="text-xl font-bold">Prompt not found</h2>
          <Button variant="ghost" onClick={() => setLocation("/")}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    if (!id) return;
    updatePrompt(
      {
        id,
        promptText: editedText,
        tags: editedTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({ title: "Changes saved", description: "Your prompt has been updated." });
        },
      }
    );
  };

  const scoreData = prompt.analysis?.scores ? [
    { label: "Clarity", value: Math.min(100, Math.max(0, prompt.analysis.scores.clarity)), color: "bg-emerald-500" },
    { label: "Ambiguity", value: Math.min(100, Math.max(0, prompt.analysis.scores.ambiguity)), color: "bg-amber-500" },
    { label: "Reproducibility", value: Math.min(100, Math.max(0, prompt.analysis.scores.reproducibility)), color: "bg-blue-500" },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-5xl mx-auto page-transition">
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Timeline
        </button>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 uppercase tracking-wider">
                {prompt.site}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(prompt.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <a 
              href={prompt.pageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              View Original Context
            </a>
          </div>

          <Button 
            variant={isEditing ? "default" : "secondary"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
            className="gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Prompt"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-violet-600" />
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </span>
                Prompt Content
              </h3>
              
              {isEditing ? (
                <Textarea 
                  value={editedText} 
                  onChange={(e) => setEditedText(e.target.value)}
                  className="font-mono text-base min-h-[300px] bg-black/20 border-white/10 focus:ring-primary/50"
                />
              ) : (
                <div className="font-mono text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {prompt.promptText}
                </div>
              )}
            </motion.div>

            {/* Suggestions Card */}
            {prompt.analysis?.suggestions && prompt.analysis.suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5"
              >
                <h3 className="text-lg font-semibold mb-4 text-amber-200 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-3">
                  {prompt.analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-3 text-amber-100/80 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Scores Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Quality Metrics
              </h3>
              
              <div className="space-y-6">
                {scoreData.length > 0 ? scoreData.map((score) => (
                  <div key={score.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{score.label}</span>
                      <span className="font-mono font-bold">{Math.round(score.value)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", score.color)} 
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic">No analysis scores available.</p>
                )}
              </div>
            </motion.div>

            {/* Tags Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>

              {/* User tags */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">User Tags</p>
                {isEditing ? (
                  <Input
                    value={editedTags}
                    onChange={(e) => setEditedTags(e.target.value)}
                    placeholder="e.g. coding, react, writing"
                    className="bg-black/20 border-white/10 focus:ring-primary/50"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(prompt.tags ?? []).length > 0 ? (
                      (prompt.tags ?? []).map((t, i) => (
                        <span key={`ut-${i}`} className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs border border-white/5">
                          {t}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No user tags.</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Comma-separated. Saved with the "Save Changes" button.</p>
              </div>

              {/* Taxonomy */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Taxonomy</p>
              
              <div className="flex flex-wrap gap-2">
                {prompt.analysis?.taxonomy?.intent?.map((tag, i) => (
                  <span key={`intent-${i}`} className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs border border-white/5">
                    {tag}
                  </span>
                ))}
                {prompt.analysis?.taxonomy?.taskType?.map((tag, i) => (
                  <span key={`task-${i}`} className="px-3 py-1 rounded-md bg-primary/10 text-primary-foreground text-xs border border-primary/20">
                    {tag}
                  </span>
                ))}
                {!prompt.analysis?.taxonomy && (
                  <p className="text-sm text-muted-foreground italic">No tags detected.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
