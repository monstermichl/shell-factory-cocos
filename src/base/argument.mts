import { ArgumentBase } from './argument-base.mjs';

/**
 * Represents a simple shell argument.
 */
export class Argument extends ArgumentBase {
    /**
     * Argument constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    public constructor(value: string);
    /**
     * Argument constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    public constructor(value: number);
    /**
     * Argument constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    public constructor(value: boolean);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    public constructor(value: any) {
        super(value);
    }

    /**
     * If the provided value is empty, this function is being called
     * by the _convertValue method.
     *
     * @returns Quoted empty string.
     */
    protected _handleEmptyValue(): string {
        return '""';
    }
}
