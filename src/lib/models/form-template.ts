import type { FormType } from "$lib/enums/form-type";

export interface FormTemplate {
  id: string;
  type: FormType;
  project: string;
}