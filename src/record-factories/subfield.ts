import { ISubfield, ISubfieldValue } from '../record-api'
import { SubfieldImpl } from '../record-impl'



export class Subfield {

  /**
   * Creates a subfield from parts or a value, or deeply clones another subfield.
   */
  public static from(subfield: ISubfieldValue | ISubfield): ISubfield
  public static from(code: string, data: string): ISubfield
  public static from(p1: ISubfieldValue | ISubfield | string, p2?: string): ISubfield {
    if (typeof p1 !== 'string') {
      ({ code: p1, data: p2 } = p1)
    }
    return new SubfieldImpl(p1, p2!)
  }


  public static arrayFrom(subfields: Array<ISubfieldValue | ISubfield> | string[]): ISubfield[] {
    if (_isStringArray(subfields)) {
      let a = new Array<SubfieldImpl>(subfields.length / 2)
      for (let i = 0, j = 0; i < subfields.length; i += 2, j++) {
        a[j] = new SubfieldImpl(subfields[i], subfields[i + 1])
      }
      return a
    } else {
      return subfields.map(_1 => new SubfieldImpl(_1.code, _1.data))
    }
  }

} // class Subfield



function _isStringArray(value: any[]): value is string[] {
  return typeof value[0] === 'string'
}
