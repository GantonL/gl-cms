import type { Image } from "./image";
import type { PaymentStatus } from "./payment";

export interface ClinicPatient {
    id: string;
    created_at: number;
    first_name: string;
    sur_name: string;
    full_name: string
    personal_id: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    address: string;
    avatar?: Image;
    refered_by?: string;
    files?: Image[];
    notes?: string;
    medical_condition?: string;
    medications?: string;
    images?: Image[];
}

export interface ClinicTreatmentHistoryItem {
    id: string;
    patient_id: string;
    documentation: string;
    date: string;
    time?: string; // bounded to date
    type?: string;
    price?: number;
    payment_status?: PaymentStatus;
}

interface TreatmentType {
    name: string;
}

export interface ClinicSettings {
    treatment_documentation_template?: string;
    treatments_types?: TreatmentType[];
}