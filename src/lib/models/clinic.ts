import type { Image } from "./image";

export interface ClinicPatient {
    id: string;
    private_name: string;
    sur_name: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    address: string;
    avatar?: Image;
    refered_by?: string;
    files?: Image[];
    treatments_history?: string[];
    notes?: string;
}
