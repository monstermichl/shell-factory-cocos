import {
    ConvertToStringError,
    convertToString,
    wrapInQuotes,
} from 'shell-factory/dist/helpers/string.mjs';

export class Argument {
    private _value: string;

    constructor(value?: string);
    constructor(value?: number);
    constructor(value?: boolean);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    constructor(value?: any) {
        /* Make sure argument is convertible. */
        this._value = Argument.convertValue(value);
    }

    /**
     * Returns the argument's value.
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Returns the full argument string.
     */
    public get argument(): string {
        return this._value;
    }

    /**
     * Converts a string, number or boolean to a string which is wrapped
     * into quotes if it contains whitespaces.
     * 
     * @param value Value to convert.
     * @returns Converted value.
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    public static convertValue(value: any): string {
        value = convertToString(value, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.InvalidType: throw new Error('Invalid value type provided');
                case ConvertToStringError.EmptyValue:
                    /* If empty value, wrap it in quotes. */
                    value = wrapInQuotes(value, true);
                    break;
            }
        }, { trim: false }); /* Don't trim value string. */

        /* Make sure value with whitespaces is wrapped in quotes. */
        return wrapInQuotes(value);
    }
}
