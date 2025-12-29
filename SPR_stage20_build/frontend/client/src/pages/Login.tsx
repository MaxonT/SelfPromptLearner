import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@backend/shared/routes";

async function postJson<T = unknown>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  
  let data: { message?: string; error?: string; [key: string]: unknown } = {};
  try {
    const text = await res.text();
    if (text) {
      data = JSON.parse(text) as typeof data;
    }
  } catch {
    // If response is not JSON, use empty object
  }
  
  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  
  return data as T;
}

// 将技术错误信息转换为用户友好的提示
function getFriendlyErrorMessage(error: string): string {
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes("401") || lowerError.includes("unauthorized") || lowerError.includes("invalid") || lowerError.includes("incorrect")) {
    return "邮箱或密码错误，请检查后重试";
  }
  if (lowerError.includes("409") || lowerError.includes("already exists") || lowerError.includes("duplicate")) {
    return "该邮箱已被注册，请直接登录或使用其他邮箱";
  }
  if (lowerError.includes("400") || lowerError.includes("bad request")) {
    return "输入格式不正确，请检查邮箱和密码格式";
  }
  if (lowerError.includes("500") || lowerError.includes("server error") || lowerError.includes("internal")) {
    return "服务器暂时无法响应，请稍后再试";
  }
  if (lowerError.includes("network") || lowerError.includes("fetch") || lowerError.includes("timeout")) {
    return "网络连接失败，请检查网络后重试";
  }
  if (lowerError.includes("password") && lowerError.includes("short")) {
    return "密码长度至少需要8个字符";
  }
  
  // 如果错误信息本身已经很友好，直接返回
  if (error.length < 100 && !error.includes("status") && !error.includes("request failed")) {
    return error;
  }
  
  return "操作失败，请稍后再试";
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (mode === "register") {
        const data = await postJson<{ apiToken: string; email: string }>(api.auth.register.path, { email, password });
        toast({ 
          title: "注册成功", 
          description: "账户已创建，正在跳转...",
          duration: 2000
        });
      } else {
        const data = await postJson<{ apiToken: string; email: string }>(api.auth.login.path, { email, password });
        toast({ 
          title: "登录成功", 
          description: "正在跳转...",
          duration: 2000
        });
      }
      
      // 刷新认证状态查询，确保 AuthGate 能检测到登录状态
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      
      // 等待一下确保状态更新
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setLocation("/");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      const friendlyMessage = getFriendlyErrorMessage(errorMessage);
      toast({ 
        title: mode === "login" ? "登录失败" : "注册失败", 
        description: friendlyMessage, 
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "登录" : "注册"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "使用您的账户登录以访问提示历史" : "创建账户以开始同步您的提示"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input 
            data-testid="email" 
            placeholder="邮箱地址" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                onSubmit();
              }
            }}
          />
          <Input 
            data-testid="password" 
            placeholder="密码（至少8个字符）" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                onSubmit();
              }
            }}
          />
          <Button 
            data-testid="submit" 
            className="w-full" 
            onClick={onSubmit}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <span className="mr-2">⏳</span>
                {mode === "login" ? "登录中..." : "注册中..."}
              </>
            ) : (
              mode === "login" ? "登录" : "注册"
            )}
          </Button>
          <Button 
            data-testid="toggle-mode" 
            variant="ghost" 
            className="w-full" 
            onClick={() => {
              if (!isLoading) {
                setMode(mode === "login" ? "register" : "login");
              }
            }}
            disabled={isLoading}
          >
            {mode === "login" ? "还没有账户？立即注册" : "已有账户？直接登录"}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            登录后，前往 <b>设置</b> 页面复制 <b>同步密钥</b> 到扩展程序中进行同步。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
