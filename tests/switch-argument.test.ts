import { expect } from 'chai';
import { SwitchArgument } from '../src/base/switch-argument.mjs';

describe('Argument tests', () => {
    describe('constructor', () => {
        describe('successful', () => {
            it('short key', () => {
                const key = '-o';
                const argument = new SwitchArgument(key);

                expect(argument.key).to.be.equal(key);
                expect(argument.value).to.be.equal(undefined);
                expect(argument.argument).to.be.equal(key);
            });

            it('long key', () => {
                const key = '--output';
                const value = 'test.txt';
                const argument = new SwitchArgument(key, value);

                expect(argument.key).to.be.equal(key);
                expect(argument.value).to.be.equal(value);
                expect(argument.argument).to.be.equal(`${key} ${value}`);
            });
        });

        describe('failed', () => {
            it('no key provided', () => {
                expect(function() {
                    new SwitchArgument(undefined as any);
                }).to.throw('No key provided');
            });

            it('invalid key type provided', () => {
                expect(function() {
                    new SwitchArgument({} as any);
                }).to.throw('Invalid key type provided');
            });

            it('key is not a valid switch', () => {
                expect(function() {
                    new SwitchArgument('v');
                }).to.throw('Key is not a valid switch');
            });
        });
    });
});
