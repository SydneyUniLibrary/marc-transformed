// tslint:disable max-classes-per-file



export type RecordType = 'Bibliographic' | 'Authority' | 'Holdings' | 'Classification' | 'Community'

export interface IRecordValue {
  id?: string
  type?: RecordType
  leader: string
  fields?: IFieldValue[]
}

export type IFieldValue = IControlFieldValue | IDataFieldValue

export interface IControlFieldValue {
  tag: string
  data: string
}

export interface IDataFieldValue {
  tag: string
  indicators?: string | string[]
  subfields?: string[] | ISubfieldValue[]
}

export interface ISubfieldValue {
  code: string
  data: string
}



export type SortType = 'strict' | 'loose'



export interface IRecord {

  /**
   * Record id.
   *
   * This is (only?) represented in the id attribute on the record element in MARCXML transport format.
   * It is not represented in and is ignored by the other transport formats.
   *
   * If present, the id needs to start with a letter or underscore and then contain only letters, digits, underscores,
   * hyphens and periods.
   */
  id?: string

  /**
   * Record type.
   *
   * This is (only?) represented in the type attribute of the record element in MARCXML transport format.
   * It is not represented in and is ignored by the other transport formats.
   *
   * If present, it must be exactly one of the strings: 'Bibliographic', 'Authority', 'Holdings', 'Classification'
   * or 'Community'.
   */
  type?: RecordType

  /**
   * A fixed field that occurs at the beginning of each record and provides information for the processing of the
   * record.
   */
  leader: string

  /**
   * The control and data fields of the record.
   *
   * The fields are normally ordered by tag, but this is not a requirement.
   * To maintain order, don't change the tag of an existing field and use Record's add method.
   */
  fields: IField[]

  /**
   * Add fields to the record, while keeping the record's fields ordered by tag.
   *
   * If the records already has fields with the same tag as a field being added, the added fields are placed after the
   * existing fields.
   *
   * If the fields are not strictly sorted, there is no guarantee about where the new fields are added or what happens
   * to the order of the existing fields.
   */
  add(...fields: Array<IField | IFieldValue>): this

  /**
   * Deletes all the fields matching the given tags.
   *
   * If you want to delete a specific field, use the Array methods on the fields array directly.
   */
  delete(...criteria: Array<string | RegExp>): this

  /**
   * Returns true if the record as at one of field for each of the given tags.
   *
   * Note that the tags given have an implicit AND operator, not an implicit OR operator. Use hasAny for OR.
   *
   * The record is considered to have a given regular expression if at least one field matches the regular expression.
   */
  hasAll(...criteria: Array<string | RegExp>): boolean

  /**
   * Returns true if the record has at least one of field with one of the given tags.
   *
   * Note that the tags given have an implicit OR operator, not an implicit AND operator. Use hasAll for AND.
   *
   * The record is considered to have a given regular expression if at least one field matches the regular expression.
   */
  hasAny(...criteria: Array<string | RegExp>): boolean

  /**
   * Finds the first field in the record with one of the given tags.
   *
   * The tags are searched in the order they are given. If the first given tag matches a field that appears after
   * a field matching a subsequently given tag, the field matching the first tag is returned. In other words, the later
   * tags you give are only searched if there are no fields in the record with tags matching any of the former tags.
   */
  findFirst(...criteria: Array<string | RegExp>): IField | undefined

  /**
   * Provides a for...of compatible iterator over the record's fields having one of the given tags.
   *
   * You can give a regular expressions instead of a string for matching tags.
   * Strings and regular expressions can be mixed.
   *
   * Giving no tag parameters at all iterates over all the record's fields.
   */
  each(...criteria: Array<string | RegExp>): IterableIterator<IField>

  /**
   * Sort the fields on the record by tag.
   *
   * In a (default) strict sort, the fields are sorted by their full tag.
   * In a loose sort, the fields are sorted only by the first character of their tag.
   *
   * The sort is guaranteed to be stable, meaning fields with the same tag will not change their position in the record
   * relative to each other.
   */
  sort(sortType?: SortType): void

}



/**
 * A field of a record.
 *
 * Fields can either be control fields or data fields.
 */
export interface IField {

  /**
   * Tags are case-sensitive.
   */
  tag: string

  /**
   * Determines if the field is a control field (true) or a data field (false).
   * Opposite of isADataField().
   */
  isAControlField(): this is IControlField

  /**
   * Determines if the field is a data field (true) or a control field (false).
   * Opposite of isAControlField().
   */
  isADataField(): this is IDataField

  /**
   * Returns true if the field's tag and (any) indicators equals the given string or matches the given regular
   * expression.
   *
   * The tag and (any) indicators are joined together and the given string or reg exp is matched against that.
   *
   * As a special case, if a string is given that matches just the tag, returns true regardless of the indicators.
   */
  matches(criteria: string | RegExp): boolean

}



/**
 * A control field of a record.
 *
 * Control fields, unlike data fields, so not have indicators or subfields. They have a single data element.
 * Control fields have tags 001-009 and (non-MARC) tags 00a-00z.
 */
export interface IControlField extends IField {

  /**
   * The single Unicode data element holdings the data of the control field.
   * Control fields are usually fixed-length, depending on tag.
   */
  data: string

}



/**
 * Abstract description of a data field.
 *
 * Data fields, unlike control fields, have indicators and subfields.
 * Data fields have tags 010-999 and (non-MARC) tags 0aa-zzz.
 */
export interface IDataField extends IField {

  indicators: string[]
  subfields: ISubfield[]

  /**
   * Returns the subfield codes of the subfields, in the order they appear in the field.
   *
   * The resulting array will have duplicate subfield codes if the field has duplicate subfields with the same code.
   *
   * O(n)
   */
  readonly subfieldCodes: string[]

  /**
   * Return the field without tag, indicators and subfield codes.
   *
   * The data from each subfield is concatenated separated by a space character, in the order they appear in the field.
   *
   * O(n)
   */
  readonly value: string

  /**
   * Adds one or more subfields to the end of the field.
   *
   * @returns {number} The number of subfields in the field after adding the new subfields.
   */
  append(...subfields: string[]): number
  append(...subfields: ISubfield[]): number

  /**
   * Alias for {@link #append}.
   */
  push(...subfields: string[]): number
  push(...subfields: ISubfield[]): number

  /**
   * Adds one or more subfields to the start of the field.
   *
   * @returns {number} The number of subfields in the field after adding the new subfields.
   */
  prepend(...subfields: string[]): number
  prepend(...subfields: ISubfield[]): number

  /**
   * Alias for {@link #prepend}.
   */
  unshift(...subfields: string[]): number
  unshift(...subfields: ISubfield[]): number

  /**
   * Deletes all the subfields with given subfield codes.
   *
   * If you want to delete a specific subfield, use the Array methods on the subfields array directly.
   */
  delete(...subfieldCodes: Array<string | RegExp>): this

  /**
   * Returns true if the field has at least one subfield for each of the given subfield codes.
   *
   * Note that the subfield codes given have an implicit AND operator, not an implicit OR operator. Use hasAny for OR.
   */
  hasAll(...subfieldCodes: Array<string | RegExp>): boolean

  /**
   * Returns true if the field has at least one of subfield with one of the given subfield codes.
   *
   * Note that the subfield codes given have an implicit OR operator, not an implicit AND operator. Use hasAll for AND.
   */
  hasAny(...subfieldCodes: Array<string | RegExp>): boolean

  /**
   * Returns the just the subfields with the subfield codes given, in the order they appear in the field.
   */
  pick(...subfieldCodes: Array<string | RegExp>): ISubfield[]

  /**
   * Finds the first subfield in the field with one of the given subfield codes.
   *
   * The subfield codes are searched in the order they are given. If the first given subfield codes matches a subfield
   * that appears after a subfield matching a subsequent subfield tag, the subfield matching the first subfield code is
   * returned. In other words, the later subfield codes you give are only searched if there are no subfields in the
   * field with subfield codes matching any of the former subfield codes.
   */
  findFirst(...subfieldCodes: Array<string | RegExp>): ISubfield | undefined

  /**
   * Provides a for...of compatible iterator over the field's subfields having one of the given subfield codes.
   *
   * Giving no subfield code arguments at all iterates over all the field's subfields.
   */
  each(...subfieldCodes: Array<string | RegExp>): IterableIterator<ISubfield>

}



export interface ISubfield {

  /**
   * Codes are case sensitive.
   */
  code: string

  /**
   * The single Unicode data element holdings the data of the subfield.
   */
  data: string

  /**
   * Returns true if the subfield's code equals the given string or matches the given regular expression.
   */
  matches(targetCode: string | RegExp): boolean

}
