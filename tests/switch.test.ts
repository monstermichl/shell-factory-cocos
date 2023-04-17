import { expect } from 'chai';
import {
    Switch,
    SwitchType,
} from '../src/base/switch.mjs';

describe('Switch tests', () => {
    describe('constructor', () => {
        describe('successful', () => {
            it('short key', () => {
                const key = '-o';
                const argument = new Switch(key);

                expect(argument.value).to.be.equal(key);
                expect(argument.type).to.be.equal(SwitchType.Short);
            });

            it('long key', () => {
                const key = '--output';
                const argument = new Switch(key);

                expect(argument.value).to.be.equal(key);
                expect(argument.type).to.be.equal(SwitchType.Long);
            });
        });

        describe('failed', () => {
            it('no key provided', () => {
                expect(function() {
                    new Switch(undefined as any);
                }).to.throw('No key provided');
            });

            it('invalid key type provided', () => {
                expect(function() {
                    new Switch({} as any);
                }).to.throw('Invalid key type provided');
            });

            it('key is not a valid switch', () => {
                expect(function() {
                    new Switch('v');
                }).to.throw('Key is not a valid switch');
            });
        });
    });
});
