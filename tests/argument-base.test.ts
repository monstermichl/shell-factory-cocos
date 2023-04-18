import { expect } from 'chai';
import { ArgumentBase } from '../src/base/argument-base.mjs';

/* Helper class to instantiate ArgumentBase. */
class ArgumentBaseHelper extends ArgumentBase {
    public constructor(key?: any) {
        super(key);
    }

    /**
     * If the provided value is empty, this function is being called
     * by the _convertValue method.
     *
     * @returns Undefined.
     */
    protected _handleEmptyValue(): undefined {
        return undefined;
    }
}

describe('ArgumentBase tests', () => {
    describe('constructor', () => {
        describe('successful', () => {
            it('value without whitespaces', () => {
                const value = 'value';
                const argument = new ArgumentBaseHelper(value);

                expect(argument.value).to.be.equal(value);
            });

            it('value with whitespaces', () => {
                const value = 'whitespace value';
                const argument = new ArgumentBaseHelper(value);

                expect(argument.value).to.be.equal(`"${value}"`);
            });

            it('empty value', () => {
                const argument = new ArgumentBaseHelper('');

                expect(argument.value).to.be.equal(undefined);
            });

            it('undefined value', () => {
                const argument = new ArgumentBaseHelper();

                expect(argument.value).to.be.equal(undefined);
            });
        });

        describe('failed', () => {
            it('invalid value type provided', () => {
                expect(function() {
                    new ArgumentBaseHelper({} as any);
                }).to.throw('Invalid value type provided');
            });
        });
    });
});
