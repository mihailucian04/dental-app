type TaskStatus = 'PENDING' | 'COMPLETED';

export class TaskCompletionSource<T> {
    public promise: Promise<T>;
    private _resolve;
    private _reject;
    private _status: TaskStatus = 'PENDING';

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolve(value?: T | Promise<T>) {

        this._validateState();
        this._resolve(value);
        this._status = 'COMPLETED';
    }

    public reject(cause: any) {
        this._validateState();
        this._reject(cause);
        this._status = 'COMPLETED';
    }

    private _validateState() {
        if (this._status === 'COMPLETED') {
            throw new Error('Cannot change the status of  a completed promise');
        }
    }

}


export function tcs() {
    return new TaskCompletionSource();
}
