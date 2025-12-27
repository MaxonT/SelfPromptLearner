import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cloud, Download, Trash2, Github, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [cloudSync, setCloudSync] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download.",
    });
    // Mock export
    setTimeout(() => {
       const blob = new Blob([JSON.stringify({ mock: "data" }, null, 2)], { type: "application/json" });
       const url = URL.createObjectURL(blob);
       const a = document.createElement("a");
       a.href = url;
       a.download = "spr-export.json";
       a.click();
       URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleClearData = () => {
    if (confirm("Are you SURE? This will wipe all local data and cannot be undone.")) {
      toast({
        title: "Data Cleared",
        description: "All local prompts have been removed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto page-transition">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage preferences and data controls.</p>
        </header>

        <div className="space-y-6">
          
          {/* Sync Section */}
          <div className="glass-card rounded-2xl p-8 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Cloud Sync</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  Sync your prompts across devices securely. Requires a Pro account.
                </p>
              </div>
            </div>
            <Switch 
              checked={cloudSync}
              onCheckedChange={setCloudSync}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Data Management */}
          <div className="glass-card rounded-2xl p-8">
             <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Data Management
             </h3>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-xs text-muted-foreground mt-1">Download all your prompts and analysis in JSON format.</p>
                  </div>
                  <Button variant="outline" onClick={handleExport} className="gap-2">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div>
                    <h4 className="font-medium text-red-200">Danger Zone</h4>
                    <p className="text-xs text-red-200/60 mt-1">Permanently delete all data from this device.</p>
                  </div>
                  <Button variant="destructive" onClick={handleClearData} className="gap-2">
                    <Trash2 className="w-4 h-4" /> Clear All Data
                  </Button>
                </div>
             </div>
          </div>

           {/* About */}
           <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Self-Prompt Reflection (SPR) v1.0.0
              </p>
              <div className="flex justify-center gap-4">
                 <a href="#" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <Github className="w-3 h-3" /> GitHub
                 </a>
                 <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                 </a>
                 <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                 </a>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
