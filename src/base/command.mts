import { Statement } from 'shell-factory';
import {
    ConvertToStringError,
    convertToString,
    wrapInQuotes,
} from 'shell-factory/dist/helpers/string.mjs';
import { Argument } from './argument.mjs';
import {
    SwitchArgument,
    SwitchType,
} from './switch-argument.mjs';

export abstract class Command extends Statement {
    private _executable: string;
    private _arguments = [] as Argument[];

    constructor(executable: string, ...args: string[]);
    constructor(executable: string, ...args: number[]);
    constructor(executable: string, ...args: boolean[]);
    constructor(executable: string, ...args: Argument[]);
    constructor(executable: string, ...args: SwitchArgument[]);
    constructor(executable: string, ...args: (string | number | boolean | Argument | SwitchArgument)[]);
    constructor(executable: string, ...args: unknown[]) {
        const convertedArgs = [] as Argument[];

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
            if (!(arg instanceof Argument)) {
                /* Consider argument as value. If it's a switch it
                   will not have whitespaces and thefore will not
                   be wrapped in quotes. Afterwards it can be
                   trimmed. */
                arg = Argument.convertValue(arg).trim();

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
    public get arguments(): Argument[] {
        return this._arguments;
    }
}
