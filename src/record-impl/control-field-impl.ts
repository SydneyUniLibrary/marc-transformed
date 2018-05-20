import { IControlField, IDataField, IField } from '../record-api'
import { FieldImpl } from './field-impl'



export class ControlFieldImpl extends FieldImpl implements IControlField {

  constructor(public tag: string, public data: string) {
    super()
  }


  public isAControlField(): this is IControlField { return true }


  public isADataField(): this is IDataField { return false }


  public matches(criteria: string | RegExp): boolean {
    return typeof criteria === 'string' ? this.tag === criteria : criteria.test(this.tag)
  }

} // class ControlFieldImpl



export function isAControlFieldImpl(field: any): field is ControlFieldImpl {
  return field instanceof ControlFieldImpl
}
