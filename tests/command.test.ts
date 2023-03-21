import { expect } from 'chai';
import { Argument } from '../src/base/argument.mjs';
import { Command } from '../src/base/command.mjs';
import { SwitchArgument } from '../src/base/switch-argument.mjs';

/* Helper class to instantiate Command. */
class CommandHelper extends Command {
    /* Nothing to do. */
}

describe('Command tests', () => {
    describe('constructor', () => {
        describe('successful', () => {
            it('simple argument', () => {
                const executable = 'echo';
                const argument = 'echo me';
                const command = new CommandHelper(executable, argument);

                expect(command.executable).to.be.equal(executable);
                expect(command.arguments.length).to.be.equal(1);
                expect(command.arguments[0].argument).to.be.equal(`"${argument}"`);
                expect(command.value).to.be.equal(`${executable} "${argument}"`);
            });

            it('keyword argument', () => {
                const executable = 'echo';
                const key = '-v';
                const argument = 'echo me';
                const command = new CommandHelper(executable, key, argument);
                
                expect(command.arguments.length).to.be.equal(1);
                expect(command.arguments[0].argument).to.be.equal(`${key} "${argument}"`);
                expect(command.value).to.be.equal(`${executable} ${key} "${argument}"`);
            });

            it('one key', () => {
                const executable = 'echo';
                const key = '-v';
                const command = new CommandHelper(executable, key);
                
                expect(command.arguments.length).to.be.equal(1);
                expect(command.arguments[0].argument).to.be.equal(key);
                expect(command.value).to.be.equal(`${executable} ${key}`);
            });

            it('two keys', () => {
                const executable = 'echo';
                const key1 = '-v';
                const key2 = '-o';
                const command = new CommandHelper(executable, key1, key2);
                
                expect(command.arguments.length).to.be.equal(2);
                
                expect(command.arguments[0].argument).to.be.equal(key1);
                expect(command.arguments[1].argument).to.be.equal(key2);

                expect(command.value).to.be.equal(`${executable} ${key1} ${key2}`);
            });

            it('argument', () => {
                const executable = 'echo';
                const argument = new Argument('arg1');
                const command = new CommandHelper(executable, argument);
                
                expect(command.arguments.length).to.be.equal(1);
                expect(command.arguments[0]).to.be.equal(argument);
                expect(command.value).to.be.equal(`${executable} ${argument.argument}`);
            });

            it('switch-argument', () => {
                const executable = 'echo';
                const argument = new SwitchArgument('-v', 6);
                const command = new CommandHelper(executable, argument);
                
                expect(command.arguments.length).to.be.equal(1);
                expect(command.arguments[0]).to.be.equal(argument);
                expect(command.value).to.be.equal(`${executable} ${argument.argument}`);
            });
        });

        describe('failed', () => {
            it('invalid executable type provided', () => {
                expect(function() {
                    new CommandHelper({} as any);
                }).to.throw('Invalid executable type provided');
            });
            
            it('no executable provided', () => {
                expect(function() {
                    new CommandHelper(undefined as any);
                }).to.throw('No executable provided');
            });
        });
    });
});
