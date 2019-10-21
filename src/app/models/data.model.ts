import { Tooth } from './tooth.model';
import { Consult } from './consult.model';

export interface DriveData {
    dashboardData: DashboardData;
    patients: PatientMap[];
}

export interface DashboardData {
    emcPoints?: EMCPoints;
    lineChartData?: ChartDataModel[];
    barChartData?: ChartDataModel[];
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
    patientFileFolderId?: string;
    blankPatientFileId?: string;
    blankDentalFileId?: string;
}

export interface ChartDataModel {
    data: number[];
    label: string;
    stack?: string;
}

export interface PatientMappings {
    dentalMap: Tooth[];
    lastConsults: Consult[];
}

export interface UserInfo {
    id: string;
    fullName: string;
    givenName: string;
    familyName: string;
    imageUrl: string;
    email: string;
}

export enum MymeType {
    document = 'application/vnd.google-apps.document',
    folder = 'application/vnd.google-apps.folder',
    plainText = 'text/plain'
}

export const DEFAULT_MAPPINGS: DriveData = {
    dashboardData: {
        emcPoints: {
            maxPoints: 500,
            points: 150,
        },
        lineChartData: [{
            data: [45, 50, 80, 81, 60, 55, 65, 77, 68, 38, 22, 65],
            label: 'Current Year'
        }, {
            data: [30, 65, 40, 19, 86, 27, 90, 30, 60, 38, 22, 15],
            label: 'Last Year'
        }],
        barChartData: [{
            data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 55, 42, 35],
            label: 'Last Year',
            stack: 'a'
        }, {
            data: [28, 73, 40, 19, 86, 27, 90, 22, 35, 48, 33, 20],
            label: 'Current Year',
            stack: 'a'
        }]
    },
    patients: []
};

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];
