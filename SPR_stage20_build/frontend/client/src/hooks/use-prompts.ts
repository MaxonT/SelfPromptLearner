import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PromptInput } from "@backend/shared/routes";


export function useAccountStatus() {
  return useQuery({
    queryKey: [api.account.status.path],
    queryFn: async () => {
      const res = await fetch(api.account.status.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch account status");
      return api.account.status.responses[200].parse(await res.json());
    },
    refetchInterval: 30_000,
  });
}

export function useExtensionStatus() {
  return useQuery({
    queryKey: [api.extension.statusGet.path],
    queryFn: async () => {
      const res = await fetch(api.extension.statusGet.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch extension status");
      return api.extension.statusGet.responses[200].parse(await res.json());
    },
    refetchInterval: 15_000,
  });
}

export function useRetryFailed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId?: string) => {
      const res = await fetch(api.extension.retryFailed.path, {
        method: api.extension.retryFailed.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(deviceId ? { deviceId } : {}),
      });
      if (!res.ok) throw new Error("Failed to request retry");
      return api.extension.retryFailed.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.extension.statusGet.path] });
    },
  });
}


export function useTaxonomy() {
  return useQuery({
    queryKey: [api.taxonomy.list.path],
    queryFn: async () => {
      const res = await fetch(api.taxonomy.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch taxonomy");
      return api.taxonomy.list.responses[200].parse(await res.json());
    },
  });
}
export function usePrompts(filters?: {
  search?: string;
  site?: string;
  tag?: string;
  taskType?: string;
  intent?: string;
  riskFlag?: string;
  sortBy?: 'date' | 'clarity';
  limit?: number;
  offset?: number;
}) {
  const queryKey = [api.prompts.list.path, filters];
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string manually or use URLSearchParams
      const url = new URL(api.prompts.list.path, window.location.origin);
      if (filters?.search) url.searchParams.set("search", filters.search);
      if (filters?.site && filters.site !== "all") url.searchParams.set("site", filters.site);
      if (filters?.tag && filters.tag !== "all") url.searchParams.set("tag", filters.tag);
      if (filters?.taskType && filters.taskType !== "all") url.searchParams.set("taskType", filters.taskType);
      if (filters?.intent && filters.intent !== "all") url.searchParams.set("intent", filters.intent);
      if (filters?.riskFlag && filters.riskFlag !== "all") url.searchParams.set("riskFlag", filters.riskFlag);
      if (filters?.sortBy) url.searchParams.set("sortBy", filters.sortBy);
      if (filters?.limit) url.searchParams.set("limit", String(filters.limit));
      if (typeof filters?.offset === 'number') url.searchParams.set("offset", String(filters.offset));

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prompts");
      return api.prompts.list.responses[200].parse(await res.json());
    },
  });
}

export function useTags() {
  return useQuery({
    queryKey: [api.tags.list.path],
    queryFn: async () => {
      const res = await fetch(api.tags.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tags");
      return api.tags.list.responses[200].parse(await res.json());
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
