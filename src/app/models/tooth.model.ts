export interface Tooth {
    number: number;
    state: string;
    operationDetails: string;
}

export enum ToothState {
    Healty = 'healty-tooth',
    ExtractedNerve = 'extracted-nerve-tooth',
    Fake = 'fake-tooth',
    Missing = 'missing-tooth'
}
