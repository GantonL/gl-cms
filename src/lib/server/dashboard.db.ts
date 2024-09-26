import { ProjectType } from "$lib/enums/projects";
import type { Project } from "$lib/models/project";
import { getClinicTotalPayments } from "./clinic.db";

export const getTotalPayments = async (project: Project): Promise<number> => {
  switch (project.type) {
    case ProjectType.Clinic:
      return getClinicTotalPayments(project);
    default:
      break;
  }
  return 0;
}
