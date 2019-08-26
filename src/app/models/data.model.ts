import { Tooth } from './tooth.model';
import { Consult } from './consult.model';

export interface DriveData {
    dashboardData: DashboardData;
    patients: PatientMap[];
}

export interface DashboardData {
    emcPoints: EMCPoints;
}

export interface EMCPoints {
    points: number;
    maxPoints: number;
}

export interface PatientMap {
    patientId: string;
    patientFolderId: string;
    xRayFolderId?: string;
    dentalMapFileId?: string;
    consultFileId?: string;
}

export interface PatientMappings {
    dentalMap: Tooth[];
    lastConsults: Consult[];
}
