import {
    ConvertToStringError,
    convertToString,
} from 'shell-factory/dist/helpers/string.mjs';
import { ArgumentBase } from './argument-base.mjs';

/**
 * SwitchArgument switch-type.
 */
export enum SwitchType {
    None  = 0, /* No switch. */
    Short = 1, /* E.g. -v */
    Long  = 2, /* E.g. --version */
}

/**
 * Represents a shell argument with a switch (e.g. -o result.txt).
 */
export class SwitchArgument extends ArgumentBase {
    private _key: string;

    /**
     * SwitchArgument constructor.
     *
     * @param key   Argument key (e.g. -o/--output).
     * @param value Argument value (e.g. test.txt).
     */
    constructor(key: string, value?: string);
    /**
     * SwitchArgument constructor.
     *
     * @param key   Argument key (e.g. -o/--output).
     * @param value Argument value (e.g. test.txt).
     */
    constructor(key: string, value?: number);
    /**
     * SwitchArgument constructor.
     *
     * @param key   Argument key (e.g. -o/--output).
     * @param value Argument value (e.g. test.txt).
     */
    constructor(key: string, value?: boolean);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    constructor(key: string, value?: any) {
        /* Make sure key is convertible. */
        key = convertToString(key, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.EmptyValue: throw new Error('No key provided');
                case ConvertToStringError.InvalidType: throw new Error('Invalid key type provided');
            }
        });

        /* Make sure key is switch. */
        if (!SwitchArgument.evaluateSwitch(key)) {
            throw new Error('Key is not a valid switch');
        }
        super(value);

        /* Store key and value. */
        this._key = key;
    }

    /**
     * Evaluates what kind of switch type the provided key is (see SwitchType).
     *
     * @param key  Key to check.
     * @param trim If true, the string is being trimmed before it's checked.
     *
     * @returns SwitchType.
     */
    public static evaluateSwitch(key: string, trim=true): SwitchType {
        let switchType = SwitchType.None;

        /* Make sure key is string. */
        if (typeof key === 'string') {
            /* Trim if allowed. */
            if (trim) {
                key = key.trim();
            }

            /* If only a single dash is being provided,
               consider it a shorthand key. */
            if (key.match(/^-\w[\w-]*/)) {
                switchType = SwitchType.Short;
            } else if (key.match(/^--\w[\w-]+/)) {
                switchType = SwitchType.Long;
            }
        }
        return switchType;
    }

    /**
     * Returns the argument's switch key.
     */
    public get key(): string {
        return this._key;
    }

    /**
     * Returns the full argument string.
     */
    public override get argument(): string {
        return this.value ? `${this.key} ${this.value}` : this.key;
    }

    /**
     * If the provided value is empty, this function is being called
     * by the convertValue method.
     *
     * @returns Undefined.
     */
    protected _handleEmptyValue(): undefined {
        return undefined;
    }
}
