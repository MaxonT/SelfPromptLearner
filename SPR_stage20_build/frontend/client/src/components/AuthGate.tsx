import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@backend/shared/routes";

export function AuthGate({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const q = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch session");
      return await res.json();
    },
    retry: 3,
    retryDelay: 500,
    refetchOnWindowFocus: true, // 窗口聚焦时重新检查
  });

  useEffect(() => {
    if (q.data === null && !q.isLoading && !q.isFetching) {
      setLocation("/login");
    }
  }, [q.data, q.isLoading, q.isFetching, setLocation]);

  if (q.isLoading || q.isFetching) return <div className="p-6">Loading…</div>;
  if (q.data === null) {
    return <div className="p-6">Redirecting…</div>;
  }
  return <>{children}</>;
}
