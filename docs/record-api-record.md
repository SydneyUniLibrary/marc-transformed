# Record

NOTE: `marc-transformed` only supports MARC records encoded in Unicode, not records encoded in MARC-8.

TIP: You can operate directly on the [`fields`](#fields) array. The methods on `IRecord` are just for your convenience.


 ```typescript
class Record {
  public static from(value: IRecordValue | IRecord): IRecord
  public static from(leader: string, fields?: Array<IFieldValue | IField>, id?: string, type?: RecordType): IRecord
}

interface IRecord {
  
  leader: string
  fields: IField[]
  id?: string
  type?: RecordType

  each(...criteria: Array<string | RegExp>): IterableIterator<IField>
  findFirst(...criteria: Array<string | RegExp>): IField | undefined
  hasAll(...criteria: Array<string | RegExp>): boolean
  hasAny(...criteria: Array<string | RegExp>): boolean

  add(...fields: Array<IField | IFieldValue>): this
  delete(...criteria: Array<string | RegExp>): this

  sort(sortType: SortType = 'strict'): void

}

type RecordType = 'Bibliographic' | 'Authority' | 'Holdings' | 'Classification' | 'Community'
type SortType = 'strict' | 'loose'
```



## Record.from

Constructs a `Record` from a given [record value](record-api-values.md#record-value) or from given parts, or by deeply
cloning an existing `Record`.

```typescript
let existingRecord: IRecord
// Creates an empty record with a minimal leader
Record.form('     nam a22        4500')
// Creates a record from a record value
Record.from({
  leader: '00000cam a2200349 i 4500',
  fields: [
    { tag: '001', data: '000050741712' },
    { tag: '003', data: 'AuCNLKIN' },
    { tag: '100', indicators: '1 ', subfields: [ 'a', 'Ismail, Yasmeen,', 'e', 'author,', 'e', 'illustrator.' ] },
    { tag: '245', indicators: '10', subfields: [ 'a', 'Time for bed, Fred! /', 'c', 'Yasmeen Ismail.' ] },
    { tag: '500', subfields: [ 'a', 'A child has a very difficult time getting Fred, the dog, to bed.' ] },
  ]
})
// Deeply clones an existing Record, including cloning the existing record's fields and subfields.
Record.from(existingRecord)
```



## properties

### leader

A fixed field that occurs at the beginning of each record and provides information for the processing of the record.
The interpretation of the leader depends on the type of the record.

### fields

The fields, in the order they appear in the record.

WARNING: The fields array must only have [`ControlField`](record-api-control-field.md) and
[`DataField`](record-api-data-field.md) objects, not [field values](record-api-values.md#field-values). If you want to
add field values, use the [add](#add) method.

### id
 
This is (only?) represented in the id attribute on the record element in MARCXML transport format.
It is not represented in and is ignored by the other transport formats.
If present, the id needs to start with a letter or underscore and then contain only letters, digits, underscores,
hyphens and periods.

### type

This is (only?) represented in the type attribute of the record element in MARCXML transport format.
It is not represented in and is ignored by the other transport formats.
If present, it must be exactly one of the strings: `'Bibliographic'`, `'Authority'`, `'Holdings'`, `'Classification'`
or `'Community'`.



## add

Adds fields or [field values](record-api-values.md#field-values) to the record, while keeping the record's fields
strictly ordered.

If the records already has fields with the same tag as a field being added, the added fields are placed after the
existing fields.

WARNING: If the fields are not strictly sorted beforehand, there is no guarantee about where the new fields are added or what
happens to the order of the existing fields.

```typescript
let r: IRecord
r.add(
  { tag: '001', data: '000050741712' },
  { tag: '003', data: 'AuCNLKIN' },
  { tag: '245', incidators: '10', subfields: [ 'a', 'Time for bed, Fred! /', 'c', 'Yasmeen Ismail.' ] },
)
```



## delete

Deletes all the fields matching the given [criteria](record-api-field-criteria.md).

```typescript
let r: IRecord
// Deletes all the 650 fields
r.delete('650')     
// Deletes all the 650 fields that have indicator 1 of ' ' and indicator 2 of '0'
r.delete('650 0')
// Deletes all the 336, 337 and 338 fields.
r.delete('336', '337', '338')
r.delete(/^33[6-8]/)
// Deletes all fields with indicator 2 of 'x', regardless of tag.
r.delete(/x$/)
// Deletes all the locally defined fields.
r.delete(/^9/, /^.9/, /^..9/)
```



## each

Provides a `for...of` compatible iterator that retrieves the record's fields matching the given
[criteria](record-api-field-criteria.md).

NOTE: The fields are retrieved in the order they appear in the record, not in the order you give as arguments to `each`.

```typescript
let r: IRecord
// Retrieve all the fields with tags 082 and 090.
for (let field of r.each('082', '090')) {
  //…
}
// Retrieve all the fields with tags 65x that have indicator 2 of '0'.
for (let field of r.each(/^65..0/)) {
  //…
}
```

```typescript
let r: IRecord
// Retrieve all the fields
for (let fields of r.fields) {
  //…
}
```

```typescript
let r: IRecord
// Retrieve all the 880 field into an array
let a = [ ...r.each('880') ]
```



## findFirst

Finds the first field in the record matching one of the given [criteria](record-api-field-criteria.md).

The criteria are searched in the order they are given. If the first given criteria matches a field that appears after
a field matching a subsequently given criteria, the field matching the first criteria is returned. In other words, the
later criteria you give are only searched if there are no fields in the record with tags matching any of the former
criteria.

```typescript
let r: IRecord
// Retrieve the first 264 field, or the first 260 field if there are no 264 fields
r.findFirst('264', '260')
// Retrieve the first 856 field with indicator 1 of '4'
r.findFirst(/^8564/)
```



## hasAll

Returns `true` if each given [criteria](record-api-field-criteria.md) matches at least one of the record's fields.

NOTE: The criteria given have an implicit AND operator, not an implicit OR operator. Use [`hasAny`](#hasany) for OR.

```typescript
let r: IRecord
// Returns true if the record has both a 001 and 003 field
r.hasAll('001', '003')
// Returns true if the record has a 130 field and 245 field with indicator 1 of '1'
r.hasAll('130', /^2451/)
```



## hasAny

Returns `true` if the record has at least one of field that matches one of the given
[criteria](record-api-field-criteria.md).

NOTE: The criteria given have an implicit OR operator, not an implicit AND operator. Use [`hasAll`](#hasall) for AND.

```typescript
let r: IRecord
// Returns true if the record has either a 260 or 264 field
r.findFirst('264', '260')
r.findFirst(/^26[04]/)
```



## sort

Sort the fields of the record by tag.

In a (default) strict sort, the fields are sorted by their full tag.
In a loose sort, the fields are sorted only by the first character of their tag.

The sort is guaranteed to be stable, meaning fields with the same tag will not change their position in the record
relative to each other.
