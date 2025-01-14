import { Type } from '@sinclair/typebox';

// SUB-TYPES

const IntegerTypeBoxSchema = Type.Union([Type.Number(), Type.BigInt(), Type.String()]);

const HexTypeBoxSchema = Type.RegEx(/^(?:0x)?[A-Fa-f0-9]+$/);

const AddressNameTypeBoxSchema = Type.RegEx(/^[A-Za-z0-9]+$/);

const ContractNameTypeBoxSchema = Type.RegEx(/^[A-Za-z0-9]+\.[A-Za-z0-9-]+$/);

const PostConditionAddressTypeBoxSchema = Type.Union([
  Type.Literal('origin'),
  AddressNameTypeBoxSchema,
  ContractNameTypeBoxSchema,
]);

const PostConditionAssetTypeBoxSchema = Type.RegEx(/^[A-Z0-9]+\.[A-Za-z0-9]+::[A-Za-z0-9]+$/);

const ConditionTypeBoxSchema = Type.Union([
  Type.Literal('eq'),
  Type.Literal('gt'),
  Type.Literal('gte'),
  Type.Literal('lt'),
  Type.Literal('lte'),
]);

// CLARITY VALUES

const UIntTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('uint'),
    value: IntegerTypeBoxSchema,
  },
  { $id: 'UInt' }
);

const IntTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('int'),
    value: IntegerTypeBoxSchema,
  },
  { $id: 'Int' }
);

const BufferTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('buffer'),
    value: HexTypeBoxSchema,
  },
  { $id: 'Buffer' }
);

const TrueTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('true'),
  },
  { $id: 'True' }
);

const FalseTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('false'),
  },
  { $id: 'False' }
);

const BooleanTypeBoxSchema = Type.Union([TrueTypeBoxSchema, FalseTypeBoxSchema], {
  $id: 'Boolean',
});

const StandardPrincipalTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('address'),
    value: AddressNameTypeBoxSchema,
  },
  { $id: 'StandardPrincipal' }
);

const ContractPrincipalTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('contract'),
    value: ContractNameTypeBoxSchema,
  },
  { $id: 'ContractPrincipal' }
);

const StringAsciiTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('ascii'),
    value: Type.String(),
  },
  { $id: 'StringAscii' }
);

const StringUtf8TypeBoxSchema = Type.Object(
  {
    type: Type.Literal('utf8'),
    value: Type.String(),
  },
  { $id: 'StringUtf8' }
);

const NoneTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('none'),
  },
  { $id: 'None' }
);

export const ClarityValueTypeBoxSchema = Type.Recursive(self =>
  Type.Union(
    [
      UIntTypeBoxSchema,
      IntTypeBoxSchema,
      BufferTypeBoxSchema,
      BooleanTypeBoxSchema,
      StandardPrincipalTypeBoxSchema,
      ContractPrincipalTypeBoxSchema,
      StringAsciiTypeBoxSchema,
      StringUtf8TypeBoxSchema,
      NoneTypeBoxSchema,
      Type.Object(
        {
          type: Type.Literal('some'),
          value: self,
        },
        { $id: 'Some' }
      ),
      Type.Object(
        {
          type: Type.Literal('tuple'),
          value: Type.Record(Type.String(), self),
        },
        { $id: 'Tuple' }
      ),
      Type.Object(
        {
          type: Type.Literal('list'),
          value: Type.Array(self),
        },
        { $id: 'List' }
      ),
      Type.Union(
        [
          Type.Object({
            type: Type.Literal('ok'),
            value: self,
          }),
          Type.Object({
            type: Type.Literal('err'),
            value: self,
          }),
        ],
        { $id: 'Response' }
      ),
    ],
    { $id: 'ClarityValue' }
  )
);

// POST-CONDITIONS

const StxPostConditionTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('stx-postcondition'),
    address: PostConditionAddressTypeBoxSchema,
    condition: ConditionTypeBoxSchema,
    amount: IntegerTypeBoxSchema,
  },
  { $id: 'StxPostCondition' }
);

const FungiblePostConditionTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('ft-postcondition'),
    address: PostConditionAddressTypeBoxSchema,
    condition: ConditionTypeBoxSchema,
    amount: IntegerTypeBoxSchema,
    asset: PostConditionAssetTypeBoxSchema,
  },
  { $id: 'FungiblePostCondition' }
);

const NonFungiblePostConditionTypeBoxSchema = Type.Object(
  {
    type: Type.Literal('nft-postcondition'),
    address: PostConditionAddressTypeBoxSchema,
    condition: Type.Union([Type.Literal('sent'), Type.Literal('not-sent')]),
    asset: PostConditionAssetTypeBoxSchema,
    assetId: ClarityValueTypeBoxSchema,
  },
  { $id: 'NonFungiblePostCondition' }
);

export const PostConditionTypeBoxSchema = Type.Union([
  StxPostConditionTypeBoxSchema,
  FungiblePostConditionTypeBoxSchema,
  NonFungiblePostConditionTypeBoxSchema,
]);
