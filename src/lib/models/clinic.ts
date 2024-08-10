import type { Image } from "./image";

export interface ClinicPatient {
    id: string;
    created_at: number;
    first_name: string;
    sur_name: string;
    personal_id: string;
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
