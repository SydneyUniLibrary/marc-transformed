import { IDataField, IDataFieldValue, ISubfield, ISubfieldValue } from '../record-api'
import { DataFieldImpl } from '../record-impl'
import { Subfield } from './subfield'



export class DataField {

  public static from(value: IDataFieldValue | IDataField ): IDataField
  public static from(
    tag: string,
    indicators?: string | string[],
    subfields?: string[] | Array<ISubfieldValue | ISubfield>,
  ): IDataField
  public static from(
    p1: IDataFieldValue | IDataField | string,
    p2?: string | string[],
    p3?: string[] | Array<ISubfieldValue | ISubfield>,
  ): IDataField {
    if (typeof p1 !== 'string') {
      ({ tag: p1, indicators: p2, subfields: p3 } = p1)
    }
    return new DataFieldImpl(
      p1,
      p2 === undefined ? undefined : [ ...p2 ],
      p3 === undefined ? undefined : Subfield.arrayFrom(p3),
    )
  }

} // class DataField
