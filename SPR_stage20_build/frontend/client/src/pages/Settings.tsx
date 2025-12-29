import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@backend/shared/routes";
import { Copy, Download, RefreshCw, Trash2, LogOut, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { SuccessState } from "@/components/states/SuccessState";

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
  const [showToken, setShowToken] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isExporting, setIsExporting] = useState<"json" | "csv" | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

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
      toast({ 
        title: "已复制", 
        description: "同步密钥已复制到剪贴板，请粘贴到扩展程序设置中",
        duration: 3000
      });
    } catch {
      toast({ 
        title: "复制失败", 
        description: "无法访问剪贴板，请检查浏览器权限", 
        variant: "destructive" 
      });
    }
  }

  async function rotateToken() {
    try {
      const res = await fetch(api.auth.rotateToken.path, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Rotate failed");
      toast({ 
        title: "已更新", 
        description: "同步密钥已更新，请在扩展程序中更新新的密钥",
        duration: 3000
      });
      setShowToken(false); // Hide token after rotation
      me.refetch();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      toast({ 
        title: "更新失败", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  }

  async function exportJson() {
    setIsExporting("json");
    setExportSuccess(false);
    try {
      const res = await fetch(api.account.exportJson.path, { credentials: "include" });
      if (!res.ok) {
        toast({ 
          title: "导出失败", 
          description: "服务器错误，请稍后重试", 
          variant: "destructive" 
        });
        return;
      }
      await downloadBlob(res, "spr-export.json");
      setExportSuccess(true);
      toast({ 
        title: "导出成功", 
        description: "JSON文件已下载",
        duration: 2000
      });
      setTimeout(() => setExportSuccess(false), 2000);
    } finally {
      setIsExporting(null);
    }
  }

  async function exportCsv() {
    setIsExporting("csv");
    setExportSuccess(false);
    try {
      const res = await fetch(api.account.exportCsv.path, { credentials: "include" });
      if (!res.ok) {
        toast({ 
          title: "导出失败", 
          description: "服务器错误，请稍后重试", 
          variant: "destructive" 
        });
        return;
      }
      await downloadBlob(res, "spr-export.csv");
      setExportSuccess(true);
      toast({ 
        title: "导出成功", 
        description: "CSV文件已下载",
        duration: 2000
      });
      setTimeout(() => setExportSuccess(false), 2000);
    } finally {
      setIsExporting(null);
    }
  }

  async function logout() {
    await fetch(api.auth.logout.path, { method: "POST", credentials: "include" });
    toast({ title: "已登出", description: "您已成功登出" });
    setLocation("/login");
  }

  async function deleteAccount() {
    if (deleteConfirmText !== "DELETE") {
      toast({ 
        title: "确认文本不匹配", 
        description: "请输入 DELETE 以确认删除",
        variant: "destructive"
      });
      return;
    }
    
    const res = await fetch(api.account.deleteAll.path, { method: "POST", credentials: "include" });
    if (!res.ok) {
      return toast({ 
        title: "删除失败", 
        description: "服务器错误，请稍后重试", 
        variant: "destructive" 
      });
    }
    toast({ 
      title: "已删除", 
      description: "您的账户和数据已被永久删除" 
    });
    setLocation("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">设置</h1>
          <p className="text-muted-foreground">账户管理、数据导出和扩展程序同步配置</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription>您的登录邮箱和扩展程序同步密钥</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {me.isLoading ? (
              <div className="text-muted-foreground">加载中…</div>
            ) : me.isError ? (
              <div className="text-destructive">加载账户信息失败</div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">邮箱地址</label>
                  <div className="text-sm bg-muted/50 px-3 py-2 rounded-md border">
                    {me.data?.email}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">同步密钥</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showToken ? "text" : "password"}
                      value={me.data?.apiToken ?? ""}
                      readOnly
                      className="font-mono text-sm bg-muted/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowToken(!showToken)}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label={showToken ? "隐藏密钥" : "显示密钥"}
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    此密钥用于扩展程序与服务器同步数据。请妥善保管，不要泄露给他人。
                  </p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={copyToken} className="min-h-[44px]">
                    <Copy className="mr-2 h-4 w-4" />复制密钥
                  </Button>
                  <Button variant="secondary" onClick={rotateToken} className="min-h-[44px]">
                    <RefreshCw className="mr-2 h-4 w-4" />更新密钥
                  </Button>
                  <Button variant="outline" onClick={logout} className="min-h-[44px]">
                    <LogOut className="mr-2 h-4 w-4" />登出
                  </Button>
                </div>
                
                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">扩展程序设置步骤：</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>打开浏览器扩展程序</li>
                    <li>进入扩展程序设置页面</li>
                    <li>将同步密钥粘贴到"服务器密钥"字段</li>
                    <li>保存设置，扩展程序将自动开始同步</li>
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据导出</CardTitle>
            <CardDescription>下载您的提示数据用于备份或迁移</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={exportJson} 
                disabled={isExporting !== null}
                className="min-h-[44px]"
              >
                {isExporting === "json" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />导出中...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />导出 JSON
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={exportCsv}
                disabled={isExporting !== null}
                className="min-h-[44px]"
              >
                {isExporting === "csv" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />导出中...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />导出 CSV
                  </>
                )}
              </Button>
            </div>
            {exportSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>导出成功！文件已下载到您的设备</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              JSON 格式包含完整数据，适合备份和迁移。CSV 格式适合在 Excel 等表格软件中查看。
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">危险操作</CardTitle>
            <CardDescription>删除账户将永久删除您的所有数据，此操作无法撤销</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-destructive">警告：删除账户将导致：</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>所有提示记录被永久删除</li>
                <li>所有分析数据被永久删除</li>
                <li>账户信息被永久删除</li>
                <li>此操作无法撤销</li>
              </ul>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              className="min-h-[44px]"
            >
              <Trash2 className="mr-2 h-4 w-4" />删除账户和数据
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">确认删除账户</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>此操作将永久删除您的账户和所有数据，包括：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>所有提示记录</li>
                  <li>所有分析数据</li>
                  <li>账户信息</li>
                </ul>
                <p className="font-medium text-destructive mt-4">
                  此操作无法撤销！
                </p>
                <p className="mt-4">
                  请输入 <span className="font-mono font-bold">DELETE</span> 以确认删除：
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="输入 DELETE 确认"
                  className="mt-2"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
