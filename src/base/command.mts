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
    private static readonly _DEFAULT_ROOT_COMMAND = 'sudo';

    private static _rootCommand = Command._DEFAULT_ROOT_COMMAND;

    private _rootCommand = Command._rootCommand;
    private _executeAsRoot = false;
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
        super();

        this._executable = executable;
        this._arguments = convertedArgs;

        this._updateStatement();
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

    /**
     * Sets the command to be executed as root.
     * 
     * @param executeAsRoot If true, the command is executed as root.
     */
    public asRoot(executeAsRoot=true): this {
        this._executeAsRoot = !!executeAsRoot;
        this._updateStatement();

        return this;
    }

    /**
     * Sets the root-command for the current instance.
     *
     * @param command Root command (e.g. sudo)-
     */
    public rootCommand(command: string): this {
        this._rootCommand = command || Command._DEFAULT_ROOT_COMMAND;
        return this;
    }

    /**
     * Sets the root-command for all future instances.
     *
     * @param command Root command (e.g. sudo)-
     */
    public static rootCommand(command: string): void {
        this._rootCommand = command || Command._DEFAULT_ROOT_COMMAND;
    }

    /**
     * Updates the Statement's value.
     */
    private _updateStatement(): void {
        const rootPart = this._executeAsRoot ? `${this._rootCommand} ` : '';
        this.value = `${rootPart}${this.executable} ${this.arguments.map((command) => command.argument).join(' ')}`;
    }
}
