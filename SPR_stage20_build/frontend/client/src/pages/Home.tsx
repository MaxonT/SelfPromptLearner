import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { usePrompts, useAnalytics, useTags, useTaxonomy, useAccountStatus, useExtensionStatus, useRetryFailed } from "@/hooks/use-prompts";
import { PromptCard } from "@/components/PromptCard";
import { SyncStatusBanner } from "@/components/SyncStatusBanner";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/states/LoadingState";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Search, Filter, Sparkles, MessageSquare, Trophy, Ghost, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [riskFlagFilter, setRiskFlagFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "clarity">("date");
  const [page, setPage] = useState(0);
  const limit = 24;

  const { data: promptsResult, isLoading: isLoadingPrompts, isError: isPromptsError, refetch: refetchPrompts } = usePrompts({
    search,
    site: siteFilter === "all" ? undefined : siteFilter,
    tag: tagFilter === "all" ? undefined : tagFilter,
    taskType: taskTypeFilter === "all" ? undefined : taskTypeFilter,
    riskFlag: riskFlagFilter === "all" ? undefined : riskFlagFilter,
    sortBy,
    limit,
    offset: page * limit,
  });

  const prompts = promptsResult?.items ?? [];
  const total = promptsResult?.total ?? 0;

  // 计算激活的过滤器数量
  const activeFiltersCount = [
    search,
    siteFilter !== "all",
    tagFilter !== "all",
    taskTypeFilter !== "all",
    riskFlagFilter !== "all",
  ].filter(Boolean).length;

  // 清除所有过滤器
  const clearAllFilters = () => {
    setSearch("");
    setSiteFilter("all");
    setTagFilter("all");
    setTaskTypeFilter("all");
    setRiskFlagFilter("all");
    setPage(0);
  };

  const { data: taxonomyData } = useTaxonomy();
  const { data: tagsData } = useTags();
  const tags = tagsData?.tags ?? [];
  const taskTypes = taxonomyData?.taskTypes ?? [];
  const riskFlags = taxonomyData?.riskFlags ?? [];

  const { data: analytics } = useAnalytics();
  const { data: accountStatus, isLoading: isLoadingStatus, isError: isStatusError, refetch: refetchStatus } = useAccountStatus();

  const { data: extStatus } = useExtensionStatus();
  const retryFailed = useRetryFailed();
  const devices = extStatus?.devices ?? [];
  const extPending = devices.reduce((s, d) => s + (d.pending || 0), 0);
  const extFailed = devices.reduce((s, d) => s + (d.failed || 0), 0);
  const extSending = devices.reduce((s, d) => s + (d.sending || 0), 0);
  const extLastSeenAt = devices[0]?.updatedAt ?? null;

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
            </div>
          </div>
        </header>

        <div className="mb-8">
          <SyncStatusBanner
            totalPrompts={accountStatus?.totalPrompts ?? 0}
            lastIngestAt={accountStatus?.lastIngestAt ?? null}
            extPending={devices.length ? extPending : undefined}
            extFailed={devices.length ? extFailed : undefined}
            extSending={devices.length ? extSending : undefined}
            extLastSeenAt={extLastSeenAt}
            isLoading={isLoadingStatus}
            isError={isStatusError}
            onRetry={() => { refetchStatus(); refetchPrompts(); }}
            onRetryFailed={() => retryFailed.mutate(undefined)}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Prompts"
            value={analytics?.totalPrompts ?? 0}
            icon={<MessageSquare className="w-6 h-6" />}
            delay={0.1}
          />
          <StatCard
            title="Avg. Clarity Score"
            value={analytics ? `${Math.round(analytics.averageClarity)}%` : "-"}
            icon={<Sparkles className="w-6 h-6" />}
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
        <div className="sticky top-4 z-40 glass-card p-4 rounded-xl mb-8 border border-white/10 shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索提示..."
                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:ring-primary/50"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <Select value={siteFilter} onValueChange={(v) => { setSiteFilter(v); setPage(0); }}>
                  <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10 min-h-[44px]">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="平台" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">全部平台</SelectItem>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tagFilter} onValueChange={(v) => { setTagFilter(v); setPage(0); }}>
                  <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10 min-h-[44px]">
                    <SelectValue placeholder="标签" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">全部标签</SelectItem>
                    {tags.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={taskTypeFilter} onValueChange={(v) => { setTaskTypeFilter(v); setPage(0); }}>
                  <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10 min-h-[44px]">
                    <SelectValue placeholder="任务类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">全部类型</SelectItem>
                    {taskTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={riskFlagFilter} onValueChange={(v) => { setRiskFlagFilter(v); setPage(0); }}>
                  <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10 min-h-[44px]">
                    <SelectValue placeholder="风险标记" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">全部风险</SelectItem>
                    {riskFlags.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v: "date" | "clarity") => { setSortBy(v); setPage(0); }}>
                  <SelectTrigger className="w-full md:w-40 bg-black/20 border-white/10 min-h-[44px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="date">最新优先</SelectItem>
                    <SelectItem value="clarity">清晰度优先</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <X className="w-4 h-4" />
                  清除筛选 ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {isPromptsError ? (
          <ErrorState
            title="无法加载提示"
            message="加载数据时出错，请检查网络连接或稍后重试"
            onRetry={() => refetchPrompts()}
            retryLabel="重试"
          />
        ) : isLoadingPrompts ? (
          <LoadingState message="正在加载您的提示..." />
        ) : prompts && prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Ghost className="w-10 h-10 text-muted-foreground/50" />}
            title="暂无提示"
            description={
              activeFiltersCount > 0
                ? "没有找到匹配筛选条件的提示，尝试调整筛选条件或清除所有筛选"
                : "还没有保存任何提示。安装扩展程序并开始记录您的提示，它们会在这里显示。"
            }
            action={
              activeFiltersCount > 0
                ? {
                    label: "清除所有筛选",
                    onClick: clearAllFilters,
                  }
                : undefined
            }
          />
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Showing <span className="text-foreground font-mono">{Math.min((page + 1) * limit, total)}</span> of <span className="text-foreground font-mono">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                Prev
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * limit >= total}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
