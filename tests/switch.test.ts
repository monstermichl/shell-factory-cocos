import { expect } from 'chai';
import {
    Switch,
    SwitchType,
} from '../src/base/switch.mjs';

describe('Switch tests', () => {
    describe('parse', () => {
        describe('successful', () => {
            it('short key', () => {
                const key = '-o';
                const switches = Switch.parse(key);

                expect(switches.length).to.be.equal(1);
                expect(switches[0].value).to.be.equal(key);
                expect(switches[0].type).to.be.equal(SwitchType.Short);
            });

            it('long key', () => {
                const key = '--output';
                const switches = Switch.parse(key);

                expect(switches.length).to.be.equal(1);
                expect(switches[0].value).to.be.equal(key);
                expect(switches[0].type).to.be.equal(SwitchType.Long);
            });

            it('several short keys', () => {
                const addDash = (c: string) => `-${c}`;
                const keys = 'oRc';
                const switches = Switch.parse(addDash(keys));

                expect(switches.length).to.be.equal(3);
                expect(switches[0].value).to.be.equal(addDash(keys[0]));
                expect(switches[0].type).to.be.equal(SwitchType.Short);
                expect(switches[1].value).to.be.equal(addDash(keys[1]));
                expect(switches[1].type).to.be.equal(SwitchType.Short);
                expect(switches[2].value).to.be.equal(addDash(keys[2]));
                expect(switches[2].type).to.be.equal(SwitchType.Short);
            });
        });

        describe('failed', () => {
            it('empty string provided', () => {
                expect(function() {
                    Switch.parse('');
                }).to.throw('No key provided');
            });

            it('no key provided', () => {
                expect(function() {
                    Switch.parse(undefined as any);
                }).to.throw('No key provided');
            });

            it('invalid key type provided', () => {
                expect(function() {
                    Switch.parse({} as any);
                }).to.throw('Invalid key type provided');
            });

            it('key is not a valid switch', () => {
                expect(function() {
                    Switch.parse('v');
                }).to.throw('Key is not a valid switch');
            });
        });
    });
});
