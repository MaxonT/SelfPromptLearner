import { z } from 'zod';
import { insertPromptSchema, prompts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  prompts: {
    list: {
      method: 'GET' as const,
      path: '/api/prompts',
      input: z.object({
        search: z.string().optional(),
        site: z.string().optional(),
        tag: z.string().optional(),
        taskType: z.string().optional(),
        intent: z.string().optional(),
        riskFlag: z.string().optional(),
        sortBy: z.enum(['date', 'clarity']).optional(),
        limit: z.coerce.number().int().min(1).max(200).optional(),
        offset: z.coerce.number().int().min(0).optional(),
      }).optional(),
      responses: {
        200: z.object({
          items: z.array(z.custom<typeof prompts.$inferSelect>()),
          total: z.number(),
          limit: z.number(),
          offset: z.number(),
        }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/prompts/:id',
      responses: {
        200: z.custom<typeof prompts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/prompts',
      input: insertPromptSchema,
      responses: {
        201: z.custom<typeof prompts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/prompts/:id',
      input: insertPromptSchema.partial(),
      responses: {
        200: z.custom<typeof prompts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/prompts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    analytics: {
      method: 'GET' as const,
      path: '/api/analytics/summary',
      responses: {
        200: z.object({
          totalPrompts: z.number(),
          bySite: z.record(z.number()),
          averageClarity: z.number(),
          recentTraits: z.array(z.string()),
        }),
      },
    }
  },
  tags: {
    list: {
      method: 'GET' as const,
      path: '/api/tags',
      responses: {
        200: z.object({ tags: z.array(z.string()) }),
      },
    },
  },
  taxonomy: {
    list: {
      method: 'GET' as const,
      path: '/api/taxonomy',
      responses: {
        200: z.object({
          taskTypes: z.array(z.string()),
          intents: z.array(z.string()),
          riskFlags: z.array(z.string()),
        }),
      },
    },
  },
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: z.object({ email: z.string().email(), password: z.string().min(8) }),
      responses: {
        201: z.object({ ok: z.literal(true), apiToken: z.string(), email: z.string() }),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ email: z.string().email(), password: z.string().min(8) }),
      responses: {
        200: z.object({ ok: z.literal(true), apiToken: z.string(), email: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ ok: z.literal(true) }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({ ok: z.literal(true), email: z.string(), apiToken: z.string() }),
      },
    },
    rotateToken: {
      method: 'POST' as const,
      path: '/api/auth/token/rotate',
      responses: {
        200: z.object({ ok: z.literal(true), apiToken: z.string() }),
      },
    },
  },
  account: {
    exportJson: {
      method: 'GET' as const,
      path: '/api/account/export/json',
      responses: {
        200: z.any(),
      },
    },
    exportCsv: {
      method: 'GET' as const,
      path: '/api/account/export/csv',
      responses: {
        200: z.string(),
      },
    },
    deleteAll: {
      method: 'POST' as const,
      path: '/api/account/delete',
      responses: {
        200: z.object({ ok: z.literal(true) }),
      },
    },
  },

};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PromptInput = z.infer<typeof api.prompts.create.input>;
export type PromptResponse = z.infer<typeof api.prompts.create.responses[201]>;
export type AnalyticsResponse = z.infer<typeof api.prompts.analytics.responses[200]>;
