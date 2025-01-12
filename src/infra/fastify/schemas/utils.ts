import { z } from "zod";

export const PaginateSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        total: z.number().nonnegative(),
        limit: z.number().positive(),
        page: z.number().positive(),
        pages: z.number().nonnegative(),
    });
