export interface Patient {
    resourceName: string;
    name: string;
    surname: string;
    age: string;
    dob: string;
    lastConsult: string;
    imageUrl: string;
    company: string;
    email?: string;
    phoneNumber?: string;
}

export interface NewPatient {
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    phoneNumber: string;
    emailAddress: string;
}
