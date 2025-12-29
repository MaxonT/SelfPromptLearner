import { Sidebar } from "@/components/Sidebar";
import { SyncStatusBanner } from "@/components/SyncStatusBanner";
import { useAnalytics, useAccountStatus } from "@/hooks/use-prompts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { LoadingState } from "@/components/states/LoadingState";
import { EmptyState } from "@/components/states/EmptyState";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Info } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: accountStatus, isLoading: isLoadingStatus, isError: isStatusError, refetch: refetchStatus } = useAccountStatus();

  // Prepare Chart Data
  const siteData = analytics ? Object.entries(analytics.bySite).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count
  })) : [];

  // Only show radar chart if we have real clarity data
  const radarData = analytics && analytics.averageClarity > 0 ? [
    { subject: 'Clarity', A: analytics.averageClarity, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto page-transition">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 mb-2">
            数据分析
          </h1>
          <p className="text-muted-foreground">深入了解您的提示使用习惯和改进趋势</p>
        </header>

        {isLoading ? (
          <LoadingState message="正在加载分析数据..." />
        ) : !analytics || analytics.totalPrompts === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-10 h-10 text-muted-foreground/50" />}
            title="暂无分析数据"
            description="需要至少记录一些提示后才能显示数据分析。继续使用扩展程序记录提示，系统将自动生成分析报告。"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Prompts by Site Chart */}
            {siteData.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">平台使用分布</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3 h-3" />
                    <span>基于全部提示数据</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={siteData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#18181b", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        formatter={(value: number) => [`${value} 条`, "提示数量"]}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8 flex items-center justify-center"
              >
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">暂无平台数据</p>
                </div>
              </motion.div>
            )}

            {/* Quality Radar Chart - Only show if we have data */}
            {radarData.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">质量指标</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3 h-3" />
                    <span>清晰度评分</span>
                  </div>
                </div>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="评分"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#18181b", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}
                        formatter={(value: number) => [`${Math.round(value)}%`, "评分"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  清晰度评分基于提示的明确性和可理解性，分数越高表示提示质量越好
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-8 flex items-center justify-center"
              >
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg mb-2">质量指标</p>
                  <p className="text-sm">需要更多数据才能显示质量分析</p>
                </div>
              </motion.div>
            )}

            {/* Traits Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-card rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">使用特征</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-3 h-3" />
                  <span>基于最近30天的提示分析</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics?.recentTraits && analytics.recentTraits.length > 0 ? (
                  analytics.recentTraits.map((trait, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center text-center hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">{trait}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground mb-2">暂无足够数据来推断特征</p>
                    <p className="text-xs text-muted-foreground/70">继续使用扩展记录更多提示，系统将自动分析您的使用习惯</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </main>
    </div>
  );
}
