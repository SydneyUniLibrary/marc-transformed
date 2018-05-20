import { IControlField, IControlFieldValue, IDataField, IDataFieldValue, IField, IFieldValue } from '../record-api'
import { ControlField } from './control-field'
import { DataField } from './data-field'



export class Field {

  /**
   * Creates an array from fields from an array of values, or deep clones an array of fields.
   */
  public static arrayFrom(fields: Array<IFieldValue | IField>): IField[] {
    return fields.map(f =>
      Field.isAControlFieldTag(f.tag)
      ? ControlField.from(f as IControlFieldValue | IControlField)
      : DataField.from(f as IDataFieldValue | IDataField),
    )
  }


  public static isAControlFieldTag(tag: string): boolean {
    return /^(00[0-9a-z])$/i.test(tag)
  }

} // class Field
