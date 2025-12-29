import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto page-transition flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-12 max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
            页面未找到
          </h1>
          
          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
          </p>
          
          <Button
            onClick={() => setLocation("/")}
            className="min-h-[44px] px-6"
          >
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
