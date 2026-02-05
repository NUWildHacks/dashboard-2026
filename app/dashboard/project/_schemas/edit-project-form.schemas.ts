import z from "zod";

import { secureUrlSchema } from "@/lib";

import { createProjectFormSchema } from "./create-project-form.schemas";

export const editProjectFormSchema = createProjectFormSchema.extend({
  demo_url: secureUrlSchema.optional().or(z.literal("")),
});

export type EditProjectFormSchema = z.infer<typeof editProjectFormSchema>;
