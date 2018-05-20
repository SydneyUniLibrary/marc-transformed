import { IField, IFieldValue, IRecord, IRecordValue, RecordType } from '../record-api'
import { FieldImpl, RecordImpl } from '../record-impl'
import { Field } from './field'



export class Record {

  public static from(value: IRecordValue | IRecord): IRecord
  public static from(leader: string, fields?: Array<IFieldValue | IField>, id?: string, type?: RecordType): IRecord
  public static from(
    p1: IRecordValue | string,
    p2?: Array<IFieldValue | IField>,
    p3?: string,
    p4?: RecordType,
  ): IRecord {
    if (typeof p1 !== 'string') {
      ({ leader: p1, fields: p2, id: p3, type: p4 } = p1)
    }
    let fields: FieldImpl[] = p2 ? Field.arrayFrom(p2) : []
    return new RecordImpl(p1, fields, p3, p4)
  }

} // class Record
