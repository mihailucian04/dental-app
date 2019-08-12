export interface Patient {
    resourceName: string;
    guid: string;
    name: string;
    surname: string;
    age: string;
    cnp: string;
    dob: string;
    lastConsult: string;
    imageUrl: string;
    company: string;
}

export interface NewPatient {
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    phoneNumber: string;
    emailAddress: string;
}
