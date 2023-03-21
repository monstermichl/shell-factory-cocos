import { expect } from 'chai';
import { Argument } from '../src/base/argument.mjs';

describe('Argument tests', () => {
    describe('constructor', () => {
        describe('successful', () => {
            it('empty value', () => {
                const argument = new Argument('');

                expect(argument.argument).to.be.equal('""');
            });

            it('undefined value', () => {
                const argument = new Argument(undefined as any);

                expect(argument.argument).to.be.equal('""');
            });
        });
    });
});
