import { Tooth } from './tooth.model';

export interface DriveData {
    dashboardData: DashboardData;
    patients: Patients[];
}

export interface DashboardData {
    emcPoints: EMCPoints;
}

export interface EMCPoints {
    points: number;
    maxPoints: number;
}

export interface Patients {
    patientId: string;
    dentalMap: Tooth[];
}

