import {
    convertToString,
    ConvertToStringError,
    wrapInQuotes,
} from 'shell-factory/helpers';

/**
 * Serves as the base for argument classes.
 */
export abstract class ArgumentBase {
    private readonly _value: string;

    /**
     * ArgumentBase constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    protected constructor(value?: string);
    /**
     * ArgumentBase constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    protected constructor(value?: number);
    /**
     * ArgumentBase constructor.
     *
     * @param value Argument value (e.g. test.txt).
     */
    protected constructor(value?: boolean);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    protected constructor(value?: any) {
        /* Make sure argument is convertible. */
        this._value = this._convertValue(value);
    }

    /**
     * Returns the argument's value.
     */
    public get value(): string {
        return this._value;
    }

    /**
     * If the provided value is empty, this function is being called
     * by the _convertValue method.
     *
     * @returns Whatever the subclass decides is a good choice.
     */
    protected abstract _handleEmptyValue(): string | undefined;

    /**
     * Converts a string, number or boolean to a string which is wrapped
     * into quotes if it contains whitespaces.
     *
     * @param value Value to convert.
     * @returns Converted value.
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    protected _convertValue(value: any): string {
        let emptyValue = false;

        value = convertToString(value, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.InvalidType: throw new Error('Invalid value type provided');
                case ConvertToStringError.EmptyValue:
                    emptyValue = true;
                    break;
            }
        }, { trim: false }); /* Don't trim value string. */

        /* Make sure value with whitespaces is wrapped in quotes if a value
           has been provided. Otherwise, call subclass' _handleEmptyValue
           method to decide what to do. */
        return emptyValue ? this._handleEmptyValue() : wrapInQuotes(value);
    }
}
