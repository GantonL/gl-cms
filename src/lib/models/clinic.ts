export interface ClinicPatient {
    id: string;
    name: string;
    email: string;
    files?: string[];
    treatments_history?: string[];
}
