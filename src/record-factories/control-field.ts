import { IControlField, IControlFieldValue } from '../record-api'
import { ControlFieldImpl } from '../record-impl'



export class ControlField {

  public static from(value: IControlFieldValue | IControlField): IControlField
  public static from(tag: string, data: string): IControlField
  public static from(p1: IControlFieldValue | IControlField | string, p2?: string): IControlField {
    if (typeof p1 !== 'string') {
      ({ tag: p1, data: p2 } = p1)
    }
    return new ControlFieldImpl(p1, p2!)
  }

} // class ControlField
