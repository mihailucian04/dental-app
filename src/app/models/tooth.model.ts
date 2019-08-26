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

export const DEFAULT_DENTAL_MAP: Tooth[] = [
    {number: 1, state: ToothState.Healty, operationDetails: '' },
    {number: 2, state: ToothState.Healty, operationDetails: '' },
    {number: 3, state: ToothState.Healty, operationDetails: '' },
    {number: 4, state: ToothState.Healty, operationDetails: '' },
    {number: 5, state: ToothState.Healty, operationDetails: '' },
    {number: 6, state: ToothState.Healty, operationDetails: '' },
    {number: 7, state: ToothState.Healty, operationDetails: '' },
    {number: 8, state: ToothState.Healty, operationDetails: '' },

    {number: 9, state: ToothState.Healty, operationDetails: '' },
    {number: 10, state: ToothState.Healty, operationDetails: '' },
    {number: 11, state: ToothState.Healty, operationDetails: '' },
    {number: 12, state: ToothState.Healty, operationDetails: '' },
    {number: 13, state: ToothState.Healty, operationDetails: '' },
    {number: 14, state: ToothState.Healty, operationDetails: '' },
    {number: 15, state: ToothState.Healty, operationDetails: '' },
    {number: 16, state: ToothState.Healty, operationDetails: '' },

    {number: 17, state: ToothState.Healty, operationDetails: '' },
    {number: 18, state: ToothState.Healty, operationDetails: '' },
    {number: 19, state: ToothState.Healty, operationDetails: '' },
    {number: 20, state: ToothState.Healty, operationDetails: '' },
    {number: 21, state: ToothState.Healty, operationDetails: '' },
    {number: 22, state: ToothState.Healty, operationDetails: '' },
    {number: 23, state: ToothState.Healty, operationDetails: '' },
    {number: 24, state: ToothState.Healty, operationDetails: '' },

    {number: 25, state: ToothState.Healty, operationDetails: '' },
    {number: 26, state: ToothState.Healty, operationDetails: '' },
    {number: 27, state: ToothState.Healty, operationDetails: '' },
    {number: 28, state: ToothState.Healty, operationDetails: '' },
    {number: 29, state: ToothState.Healty, operationDetails: '' },
    {number: 30, state: ToothState.Healty, operationDetails: '' },
    {number: 31, state: ToothState.Healty, operationDetails: '' },
    {number: 32, state: ToothState.Healty, operationDetails: '' },
];
