import {
    convertToString,
    ConvertToStringError,
} from 'shell-factory/helpers';
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
export class Switch extends ArgumentBase {
    private readonly _type: SwitchType;

    /**
     * Switch constructor. This constructor is private since
     * switches can have multiple short arguments which cannot
     * be handled properly by a usual constructor as multiple
     * instance are required. Instead use the parse-method.
     *
     * @param key Argument key (e.g. -o/--output).
     */
    private constructor(key: string) {
        const type = Switch._validateSwitch(key);

        super(key);
        this._type = type;
    }

    public get type(): SwitchType {
        return this._type;
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
     * Parses the provided switch key. This can result in several switch
     * instances as short switches can be combined.
     *
     * @param key Switch key to be parsed.
     * @returns Switch instances.
     */
    public static parse(key: string): Switch[] {
        const type = Switch._validateSwitch(key);
        let switches: Switch[];

        if (type === SwitchType.Short) {
            /* If it's a short switchtype, it might contain several
               switches. These switches are instantiated separately. */
            switches = [...key.replace(/^-/, '')].map((c) => new Switch(`-${c}`));
        } else {
            switches = [new Switch(key)];
        }
        return switches;
    }

    /**
     * If the provided value is empty, this function is being called
     * by the _convertValue method.
     *
     * @returns Empty string.
     */
    protected _handleEmptyValue(): string {
        return '';
    }

    /**
     * Validates the provided switch and throws an error if the switch
     * is invalid.
     *
     * @param key Switch key to validate.
     * @returns Evaluated switch type.
     */
    private static _validateSwitch(key: string): SwitchType {
        /* Make sure key is convertible. */
        key = convertToString(key, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.EmptyValue: throw new Error('No key provided');
                case ConvertToStringError.InvalidType: throw new Error('Invalid key type provided');
            }
        });
        const type = Switch.evaluateSwitch(key);

        /* Make sure key is switch. */
        if (!type) {
            throw new Error('Key is not a valid switch');
        }
        return type;
    }
}
