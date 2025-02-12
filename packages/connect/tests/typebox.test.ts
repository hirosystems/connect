import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import { ClarityValueTypeBoxSchema, PostConditionTypeBoxSchema } from '../src/types/typebox';

describe('Clarity Value TypeBox Schemas', () => {
  it('should validate uint representation', () => {
    const validUint = { type: 'uint', value: '12' };
    const invalidUint = { type: 'uint', value: {} };
    expect(Value.Check(ClarityValueTypeBoxSchema, validUint)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidUint)).toBe(false);
  });

  it('should validate int representation', () => {
    const validInt = { type: 'int', value: '42' };
    const invalidInt = { type: 'int', value: true };
    expect(Value.Check(ClarityValueTypeBoxSchema, validInt)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidInt)).toBe(false);
  });

  it('should validate buffer representation', () => {
    const validBuffer = { type: 'buffer', value: 'beaf' };
    const invalidBuffer = { type: 'buffer', value: 'xyz!' };
    expect(Value.Check(ClarityValueTypeBoxSchema, validBuffer)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidBuffer)).toBe(false);
  });

  it('should validate boolean representations', () => {
    const validTrue = { type: 'true' };
    const validFalse = { type: 'false' };
    const invalidBoolean = { type: 'boolean', value: true };
    expect(Value.Check(ClarityValueTypeBoxSchema, validTrue)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, validFalse)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidBoolean)).toBe(false);
  });

  it('should validate principal representations', () => {
    const validStandardPrincipal = {
      type: 'address',
      value: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    };
    const validContractPrincipal = {
      type: 'contract',
      value: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.contract-name',
    };
    const invalidPrincipal = {
      type: 'address',
      value: 'invalid-address',
    };
    expect(Value.Check(ClarityValueTypeBoxSchema, validStandardPrincipal)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, validContractPrincipal)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidPrincipal)).toBe(false);
  });

  it('should validate optional representations', () => {
    const validNone = { type: 'none' };
    const validSome = {
      type: 'some',
      value: { type: 'uint', value: '12' },
    };
    const invalidSome = {
      type: 'some',
      value: 12,
    };
    expect(Value.Check(ClarityValueTypeBoxSchema, validNone)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, validSome)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidSome)).toBe(false);
  });

  it('should validate string representations', () => {
    const validAscii = { type: 'ascii', value: 'hello there' };
    const validUtf8 = { type: 'utf8', value: 'hello 👋' };
    const invalidString = { type: 'string', value: 'wrong type' };
    expect(Value.Check(ClarityValueTypeBoxSchema, validAscii)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, validUtf8)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidString)).toBe(false);
  });

  it('should validate tuple representation', () => {
    const validTuple = {
      type: 'tuple',
      value: {
        amount: { type: 'uint', value: '10' },
        recipient: { type: 'address', value: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6' },
      },
    };
    const invalidTuple = {
      type: 'tuple',
      value: ['not', 'an', 'object'],
    };
    expect(Value.Check(ClarityValueTypeBoxSchema, validTuple)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidTuple)).toBe(false);
  });

  it('should validate list representation', () => {
    const validList = {
      type: 'list',
      value: [
        { type: 'int', value: '4' },
        { type: 'int', value: '8' },
      ],
    };
    const invalidList = {
      type: 'list',
      value: { key: 'not an array' },
    };
    expect(Value.Check(ClarityValueTypeBoxSchema, validList)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidList)).toBe(false);
  });

  it('should validate response representation', () => {
    const validOk = {
      type: 'ok',
      value: { type: 'uint', value: '4' },
    };
    const validErr = {
      type: 'err',
      value: { type: 'uint', value: '4' },
    };
    const invalidResponse = {
      type: 'ok',
      value: 'not a clarity value',
    };
    expect(Value.Check(ClarityValueTypeBoxSchema, validOk)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, validErr)).toBe(true);
    expect(Value.Check(ClarityValueTypeBoxSchema, invalidResponse)).toBe(false);
  });
});

describe('Post-Condition TypeBox Schemas', () => {
  it('should validate STX post-condition', () => {
    const validStxPostCondition = {
      type: 'stx-postcondition',
      address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      amount: '10000',
      condition: 'gt',
    };
    const invalidStxPostCondition = {
      type: 'stx-postcondition',
      address: 'invalid-address',
      amount: { type: 'utf8', value: 'not a number' },
      condition: 'invalid',
    };
    expect(Value.Check(PostConditionTypeBoxSchema, validStxPostCondition)).toBe(true);
    expect(Value.Check(PostConditionTypeBoxSchema, invalidStxPostCondition)).toBe(false);
  });

  it('should validate FT post-condition', () => {
    const validFtPostCondition = {
      type: 'ft-postcondition',
      address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      asset: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.tokencoin::tkn',
      amount: '1000',
      condition: 'gt',
    };
    const invalidFtPostCondition = {
      type: 'ft-postcondition',
      address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      asset: 'invalid-asset-format',
      amount: '12000',
      condition: 'invalid',
    };
    expect(Value.Check(PostConditionTypeBoxSchema, validFtPostCondition)).toBe(true);
    expect(Value.Check(PostConditionTypeBoxSchema, invalidFtPostCondition)).toBe(false);
  });

  it('should validate NFT post-condition', () => {
    const validNftPostCondition = {
      type: 'nft-postcondition',
      address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.vault',
      asset: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.tokencoin::tkn',
      assetId: { type: 'uint', value: '12' },
      condition: 'not-sent',
    };
    const invalidNftPostCondition = {
      type: 'nft-postcondition',
      address: 'invalid-address',
      asset: 'invalid-asset',
      assetId: '12',
      condition: 'invalid',
    };
    expect(Value.Check(PostConditionTypeBoxSchema, validNftPostCondition)).toBe(true);
    expect(Value.Check(PostConditionTypeBoxSchema, invalidNftPostCondition)).toBe(false);
  });
});
