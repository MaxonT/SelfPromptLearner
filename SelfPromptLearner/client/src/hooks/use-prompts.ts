import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PromptInput } from "@shared/routes";

export function usePrompts(filters?: { search?: string; site?: string; sortBy?: 'date' | 'clarity' }) {
  const queryKey = [api.prompts.list.path, filters];
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string manually or use URLSearchParams
      const url = new URL(api.prompts.list.path, window.location.origin);
      if (filters?.search) url.searchParams.set("search", filters.search);
      if (filters?.site && filters.site !== "all") url.searchParams.set("site", filters.site);
      if (filters?.sortBy) url.searchParams.set("sortBy", filters.sortBy);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prompts");
      return api.prompts.list.responses[200].parse(await res.json());
    },
  });
}

export function usePrompt(id: string) {
  return useQuery({
    queryKey: [api.prompts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.prompts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch prompt details");
      return api.prompts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: [api.prompts.analytics.path],
    queryFn: async () => {
      const res = await fetch(api.prompts.analytics.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return api.prompts.analytics.responses[200].parse(await res.json());
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.prompts.delete.path, { id });
      const res = await fetch(url, { method: api.prompts.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete prompt");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prompts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.prompts.analytics.path] });
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PromptInput>) => {
      const url = buildUrl(api.prompts.update.path, { id });
      const res = await fetch(url, {
        method: api.prompts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update prompt");
      return api.prompts.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.prompts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.prompts.get.path, data.id] });
    },
  });
}
