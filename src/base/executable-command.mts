import { Command } from 'shell-factory';
import {
    convertToString,
    ConvertToStringError,
    wrapInQuotes,
} from 'shell-factory/helpers';
import { ArgumentBase } from './argument-base.mjs';
import { Argument } from './argument.mjs';
import { Switch } from './switch.mjs';

/**
 * Represents a Bourne Shell executable call.
 */
export class ExecutableCommand extends Command {
    private static readonly _DEFAULT_ROOT_COMMAND = 'sudo';

    private static _rootCommand = ExecutableCommand._DEFAULT_ROOT_COMMAND;

    private _rootCommand = ExecutableCommand._rootCommand;
    private _executeAsRoot = false;
    private readonly _executable: string;
    private readonly _arguments = [] as ArgumentBase[];

    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: string[]);
    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: number[]);
    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: boolean[]);
    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: Argument[]);
    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: Switch[]);
    /**
     * CommonCommand constructor.
     *
     * @param executable CommonCommand to execute.
     * @param args       CommonCommand arguments.
     */
    constructor(executable: string, ...args: (string | number | boolean | Argument | Switch)[]);
    constructor(executable: string, ...args: unknown[]) {
        const convertedArgs = [] as ArgumentBase[];

        /* Make sure executable is valid. */
        executable = convertToString(executable, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.InvalidType: throw new Error('Invalid executable type provided');
                case ConvertToStringError.EmptyValue: throw new Error('No executable provided');
            }
        }, { trim: true, emptyAllowed: false }); /* Don't trim value string. */
        executable = wrapInQuotes(executable);

        /* Interpret arguments. */
        args?.forEach((arg) => {
            /* If value is not already Argument instance, evaluate what it is. */
            if (!(arg instanceof ArgumentBase)) {
                /* Evaluate if value is a switch. */
                const switchType = Switch.evaluateSwitch(arg as string);

                /* If current argument is considered a value. */
                if (!switchType) {
                    convertedArgs.push(new Argument(arg as string));
                } else {
                    convertedArgs.push(...Switch.parse(arg as string));
                }
            } else {
                convertedArgs.push(arg); /* If it is an argument, push it directly. */
            }
        });
        super();

        this._executable = executable;
        this._arguments = convertedArgs;

        this._updateStatement();
    }

    /**
     * Returns the general root command.
     *
     * @returns Root command string.
     */
    public static getRootCommand(): string {
        return ExecutableCommand._rootCommand;
    }

    /**
     * Returns the instance' root command.
     *
     * @returns Root command string.
     */
    public getRootCommand(): string {
        return this._rootCommand;
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
     */
    public get asRoot(): this {
        return this._asRoot(true);
    }

    /**
     * Sets the command to be executed as current user.
     */
    public get notAsRoot(): this {
        return this._asRoot(false);
    }

    /**
     * Sets the root-command for the current instance.
     *
     * @param command Root command (e.g. sudo)-
     */
    public rootCommand(command?: string): this {
        this._rootCommand = ExecutableCommand._convertRootCommand(command, ExecutableCommand._rootCommand);
        return this._updateStatement();
    }

    /**
     * Sets the root-command for all future instances.
     *
     * @param command Root command (e.g. sudo)-
     */
    public static rootCommand(command?: string): void {
        ExecutableCommand._rootCommand = ExecutableCommand._convertRootCommand(command, ExecutableCommand._DEFAULT_ROOT_COMMAND);
    }

    /**
     * Makes sure that passed root command is valid.
     *
     * @param command Root command (e.g. sudo)-
     */
    private static _convertRootCommand(command: string, defaultCommand: string): string {
        command = convertToString(command, (e: ConvertToStringError) => {
            switch(e) {
                case ConvertToStringError.InvalidType: throw new Error('Invalid root command type provided');
            }
        }, { emptyAllowed: true });

        return command || defaultCommand;
    }

    /**
     * Updates the Statement's value.
     */
    private _updateStatement(): this {
        const rootPart = this._executeAsRoot ? `${this._rootCommand} ` : '';

        this.statement = `${rootPart}${this.executable} ${this.arguments.map((command) => command.value).join(' ')}`;
        return this;
    }

    /**
     * Sets the command to be executed as root or not as root
     *
     * @param executeAsRoot If true, the command is executed as root.
     */
    private _asRoot(executeAsRoot=true): this {
        this._executeAsRoot = !!executeAsRoot;
        this._updateStatement();

        return this;
    }
}
