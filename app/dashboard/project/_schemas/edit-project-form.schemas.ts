import { z } from "zod";

import { createProjectFormSchema } from "./create-project-form.schemas";

export const editProjectFormSchema = createProjectFormSchema.extend({
  demo_url: z.url().optional().or(z.literal("")),
});

export type EditProjectFormSchema = z.infer<typeof editProjectFormSchema>;
