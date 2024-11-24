import { ProjectType } from "$lib/enums/projects";
import type { Project } from "$lib/models/project";
import { getClinicTotalBalanceDue, getClinicTotalPayments, getPatientsCount } from "./clinic.db";

export const getTotalPayments = async (project: Project): Promise<number> => {
  switch (project.type) {
    case ProjectType.Clinic:
      return getClinicTotalPayments(project);
    default:
      break;
  }
  return 0;
}

export const getTotalBalanceDue = async (project: Project): Promise<number> => {
  switch (project.type) {
    case ProjectType.Clinic:
      return getClinicTotalBalanceDue(project);
    default:
      break;
  }
  return 0;
}

export const getTotalPatients = async (project: Project): Promise<number | undefined> => {
  switch (project.type) {
    case ProjectType.Clinic:
      return getPatientsCount(project);
    default:
      break;
  }
  return 0;
}
