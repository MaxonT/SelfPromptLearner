import { Sidebar } from "@/components/Sidebar";
import { useAnalytics } from "@/hooks/use-prompts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {
  const { data: analytics, isLoading } = useAnalytics();

  // Prepare Chart Data
  const siteData = analytics ? Object.entries(analytics.bySite).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count
  })) : [];

  const radarData = [
    { subject: 'Clarity', A: analytics ? analytics.averageClarity : 0, fullMark: 100 },
    { subject: 'Structure', A: 80, fullMark: 100 }, // Mock
    { subject: 'Context', A: 65, fullMark: 100 }, // Mock
    { subject: 'Specificity', A: 90, fullMark: 100 }, // Mock
    { subject: 'Tone', A: 70, fullMark: 100 }, // Mock
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto page-transition">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">Deep dive into your prompting habits and improvements.</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Prompts by Site Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Prompts by Platform</h3>
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
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Quality Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Quality Metrics</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#18181b", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Traits Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-card rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Inferred Traits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics?.recentTraits && analytics.recentTraits.length > 0 ? (
                  analytics.recentTraits.map((trait, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center text-center">
                      <span className="text-sm font-medium text-foreground">{trait}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">Not enough data to infer traits yet.</p>
                )}
                {/* Fallback dummy data if no API data for display purposes */}
                {(!analytics?.recentTraits || analytics.recentTraits.length === 0) && (
                  <>
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <span className="text-sm font-medium text-emerald-400">Direct Style</span>
                      <p className="text-xs text-muted-foreground mt-1">You prefer concise instructions.</p>
                    </div>
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <span className="text-sm font-medium text-amber-400">Iterative</span>
                      <p className="text-xs text-muted-foreground mt-1">You refine prompts often.</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </main>
    </div>
  );
}
