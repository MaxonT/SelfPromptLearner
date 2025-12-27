import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { usePrompts, useAnalytics } from "@/hooks/use-prompts";
import { PromptCard } from "@/components/PromptCard";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Sparkles, MessageSquare, Trophy, Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "clarity">("date");

  const { data: prompts, isLoading: isLoadingPrompts } = usePrompts({
    search,
    site: siteFilter === "all" ? undefined : siteFilter,
    sortBy,
  });

  const { data: analytics } = useAnalytics();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto page-transition">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 mb-4">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Track and analyze your interactions with AI models.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                 <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Current Streak</p>
                 <p className="text-2xl font-mono text-primary font-bold">12 Days 🔥</p>
               </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Prompts"
            value={analytics?.totalPrompts ?? 0}
            icon={<MessageSquare className="w-6 h-6" />}
            trend="12% vs last week"
            trendUp
            delay={0.1}
          />
          <StatCard
            title="Avg. Clarity Score"
            value={analytics ? `${Math.round(analytics.averageClarity * 100)}%` : "-"}
            icon={<Sparkles className="w-6 h-6" />}
            trend="Improved"
            trendUp
            delay={0.2}
          />
          <StatCard
            title="Top Platform"
            value={analytics ? Object.entries(analytics.bySite).sort(([,a], [,b]) => b - a)[0]?.[0] ?? "None" : "-"}
            icon={<Trophy className="w-6 h-6" />}
            className="capitalize"
            delay={0.3}
          />
        </div>

        {/* Filters & Controls */}
        <div className="sticky top-4 z-40 glass-card p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/10 shadow-lg">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={siteFilter} onValueChange={setSiteFilter}>
              <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Platform" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="chatgpt">ChatGPT</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="clarity">Best Clarity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Grid */}
        {isLoadingPrompts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : prompts && prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Ghost className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No prompts found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Try adjusting your filters or use the extension to save your first prompt.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
