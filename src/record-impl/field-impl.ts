import { IControlField, IDataField, IField } from '../record-api'



export abstract class FieldImpl implements IField {

  public abstract tag: string

  public abstract isAControlField(): this is IControlField
  public abstract isADataField(): this is IDataField

  public abstract matches(criteria: string | RegExp): boolean

} // class FieldImpl
