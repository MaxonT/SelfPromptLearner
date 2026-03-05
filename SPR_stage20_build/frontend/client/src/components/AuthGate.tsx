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
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch session");
      return await res.json();
    },
    retry: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (q.isError && !q.isLoading && !q.isFetching) {
      setLocation("/login");
    }
  }, [q.isError, q.isLoading, q.isFetching, setLocation]);

  if (q.isLoading || q.isFetching) return null;
  if (q.isError) return null;
  return <>{children}</>;
}
