import { z } from "zod";

export const patientFormSchema = z.object({
  // Form native values (inserted directly to form by user)
  first_name: z.string().min(2),
  sur_name: z.string().min(2),
  personal_id: z.string().length(9),
  phone: z.string().min(9),
  email: z.string().email(),
  date_of_birth: z.string().date(),
  gender: z.string().refine((g) => ['male', 'female', 'other'].includes(g)),
  address: z.string().min(3),
  refered_by: z.string().optional(),
  notes: z.string().optional(),
  medical_condition: z.string().optional(),
  medications: z.string().optional(),

  // Added upon changes from non-form origin
  id: z.string().optional(),
});
 

export type PatientFormSchema = typeof patientFormSchema;

export const patientFileFormSchema = z.object({
  file: z.any(),
  date: z.string().optional(),
});

export type PatientFileFormSchema = typeof patientFileFormSchema;


export const patientTreatmentFormSchema = z.object({

});

export type PatienttreatmentFormSchema = typeof patientTreatmentFormSchema;