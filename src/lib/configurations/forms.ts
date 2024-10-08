import { FormType } from "$lib/enums/form-type";
import { ProjectType } from "$lib/enums/projects";

export const FormsTypes: Record<ProjectType, FormType[]> = {
  [ProjectType.Clinic]: [
    FormType.AestheFillAgreement,
    FormType.BotoxAgreement,
  ],
  [ProjectType.None]: [],
  [ProjectType.Store]: [],
  [ProjectType.Website]: [],
}