import { z } from 'zod'

export const orientationQuestionFormSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(1, 'La question est obligatoire.'),

  questionOrder: z
    .number({
      error: "L'ordre doit être un nombre.",
    })
    .int("L'ordre doit être un nombre entier.")
    .min(1, "L'ordre doit être supérieur ou égal à 1."),

  active: z.boolean(),
})

export type OrientationQuestionFormValues = z.infer<
  typeof orientationQuestionFormSchema
>