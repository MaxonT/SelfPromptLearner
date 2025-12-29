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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    try {
      if (mode === "register") {
        const data = await postJson<{ apiToken: string; email: string }>(api.auth.register.path, { email, password });
        toast({ title: "Registered", description: `Token: ${data.apiToken}` });
      } else {
        const data = await postJson<{ apiToken: string; email: string }>(api.auth.login.path, { email, password });
        toast({ title: "Logged in", description: `Token: ${data.apiToken}` });
      }
      
      // 刷新认证状态查询，确保 AuthGate 能检测到登录状态
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      
      // 等待一下确保状态更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLocation("/");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      toast({ title: "Auth failed", description: errorMessage, variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>SPR — Sign in</CardTitle>
          <CardDescription>
            {mode === "login" ? "Use your account to access your prompts." : "Create an account to start syncing."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input data-testid="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input data-testid="password" placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button data-testid="submit" className="w-full" onClick={onSubmit}>
            {mode === "login" ? "Login" : "Register"}
          </Button>
          <Button data-testid="toggle-mode" variant="ghost" className="w-full" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
          </Button>
          <div className="text-sm text-muted-foreground">
            After login, open <b>Settings</b> to copy your API Token into the Extension for sync.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
