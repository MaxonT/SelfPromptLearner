import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@backend/shared/routes";
import { Copy, Download, RefreshCw, Trash2, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

async function downloadBlob(res: Response, filename: string) {
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Settings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load session");
      return (await res.json()) as { email: string; apiToken: string };
    },
  });

  async function copyToken() {
    try {
      await navigator.clipboard.writeText(me.data?.apiToken ?? "");
      toast({ title: "Copied", description: "API Token copied. Paste it into the Extension settings." });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard permission blocked.", variant: "destructive" });
    }
  }

  async function rotateToken() {
    try {
      const res = await fetch(api.auth.rotateToken.path, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Rotate failed");
      toast({ title: "Token rotated", description: "Update the Extension with the new token." });
      me.refetch();
    } catch (e: any) {
      toast({ title: "Rotate failed", description: e?.message || "Unknown error", variant: "destructive" });
    }
  }

  async function exportJson() {
    const res = await fetch(api.account.exportJson.path, { credentials: "include" });
    if (!res.ok) return toast({ title: "Export failed", description: "Server error.", variant: "destructive" });
    await downloadBlob(res, "spr-export.json");
  }

  async function exportCsv() {
    const res = await fetch(api.account.exportCsv.path, { credentials: "include" });
    if (!res.ok) return toast({ title: "Export failed", description: "Server error.", variant: "destructive" });
    await downloadBlob(res, "spr-export.csv");
  }

  async function logout() {
    await fetch(api.auth.logout.path, { method: "POST", credentials: "include" });
    setLocation("/login");
  }

  async function deleteAccount() {
    if (!confirm("Delete ALL your data (server) and your account? This cannot be undone.")) return;
    const res = await fetch(api.account.deleteAll.path, { method: "POST", credentials: "include" });
    if (!res.ok) {
      return toast({ title: "Delete failed", description: "Server error.", variant: "destructive" });
    }
    toast({ title: "Deleted", description: "Your account and data have been deleted." });
    setLocation("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Account, privacy, export, and Extension sync token.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Session login + API token for the Extension (Bearer).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {me.isLoading ? (
              <div>Loading…</div>
            ) : me.isError ? (
              <div className="text-destructive">Failed to load account.</div>
            ) : (
              <>
                <div className="text-sm">Email: <b>{me.data?.email}</b></div>
                <div className="text-sm break-all">
                  API Token: <span className="font-mono">{me.data?.apiToken}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={copyToken}><Copy className="mr-2 h-4 w-4" />Copy Token</Button>
                  <Button variant="secondary" onClick={rotateToken}><RefreshCw className="mr-2 h-4 w-4" />Rotate Token</Button>
                  <Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Extension: set <b>Authorization</b> to <b>Bearer &lt;API Token&gt;</b> (the popup will handle it once you paste token).
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Download your prompts for backup / migration.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <Button onClick={exportJson}><Download className="mr-2 h-4 w-4" />Export JSON</Button>
            <Button variant="secondary" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Delete your account and all server data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={deleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />Delete Account & Data
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
