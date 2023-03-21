import { Statement } from 'shell-factory';
import {
    ConvertToStringError,
    convertToString,
    wrapInQuotes,
} from 'shell-factory/dist/helpers/string.mjs';
import { ArgumentBase } from './argument-base.mjs';
import { Argument } from './argument.mjs';
import {
    SwitchArgument,
    SwitchType,
} from './switch-argument.mjs';

/**
 * Represents a Bourne Shell command.
 */
export class Command extends Statement {
    private _executable: string;
    private _arguments = [] as ArgumentBase[];

    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: string[]);
    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: number[]);
    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: boolean[]);
    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: Argument[]);
    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: SwitchArgument[]);
    /**
     * Command constructor.
     *
     * @param executable Command to execute.
     * @param args       Command arguments.
     */
    constructor(executable: string, ...args: (string | number | boolean | Argument | SwitchArgument)[]);
    constructor(executable: string, ...args: unknown[]) {
        const convertedArgs = [] as ArgumentBase[];

        let previousArg: string | Argument;
        let previousArgSwitchType: SwitchType;

        /* Make sure executable is valid. */
        executable = convertToString(executable, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.InvalidType: throw new Error('Invalid executable type provided');
                case ConvertToStringError.EmptyValue: throw new Error('No executable provided');
            }
        }, { trim: true, emptyAllowed: false }); /* Don't trim value string. */
        executable = wrapInQuotes(executable);

        /* Interpret arguments. */
        args?.forEach((arg, index) => {
            /* If value is not already Argument instance, evaluate what it is. */
            if (!(arg instanceof ArgumentBase)) {
                /* Evaluate if value is a switch. */
                const switchType = SwitchArgument.evaluateSwitch(arg as string);

                /* If current argument is considered a value. */
                if (!switchType) {
                    /* If previous argument was switch, create a SwitchArgument. */
                    if (previousArgSwitchType) {
                        convertedArgs.push(new SwitchArgument(previousArg as string, arg as string));
                    } else {
                        convertedArgs.push(new Argument(arg as string));
                    }
                } else {
                    /* If current and previous arguments are considered switches, push them both
                       without a value. */
                    if (previousArgSwitchType) {
                        convertedArgs.push(new SwitchArgument(previousArg as string));
                        convertedArgs.push(new SwitchArgument(arg as string));

                        previousArgSwitchType = SwitchType.None;
                    } else if (index == (args.length - 1)) { /* If last index, it's a switch without a value. */
                        convertedArgs.push(new SwitchArgument(arg as string));
                    } else {
                        previousArgSwitchType = switchType;
                    }
                }
            } else {
                convertedArgs.push(arg); /* If it is an argument, push it directly. */
            }
            previousArg = arg as string | Argument;
        });
        super(`${executable} ${convertedArgs.map((command) => command.argument).join(' ')}`);

        this._executable = executable;
        this._arguments = convertedArgs;
    }

    /**
     * Returns the executable string.
     */
    public get executable(): string {
        return this._executable;
    }

    /**
     * Returns the arguments list.
     */
    public get arguments(): ArgumentBase[] {
        return this._arguments;
    }
}
