import * as _ from 'lodash'

import { IControlField, IDataField, IField, ISubfield, ISubfieldValue } from '../record-api'
import { FieldImpl } from './field-impl'
import { SubfieldImpl } from './subfield-impl'



export class DataFieldImpl extends FieldImpl implements IDataField {

  constructor(public tag: string, public indicators: string[] = [], public subfields: ISubfield[] = []) {
    super()
  }


  public isAControlField(): this is IControlField { return false }


  public isADataField(): this is IDataField { return true }


  get subfieldCodes(): string[] {
    return this.subfields.map(x => x.code)
  }


  get value(): string {
    return this.subfields.map(x => x.data).join(' ')
  }


  public append(...subfields: string[]): number
  public append(...subfields: ISubfieldValue[]): number
  public append(...subfields: SubfieldImpl[]): number
  public append(...subfields: Array<string | ISubfieldValue | SubfieldImpl>): number {
    if (_isStringArray(subfields)) {
      let a = new Array<SubfieldImpl>(subfields.length / 2)
      for (let i = 0, j = 0; i < subfields.length; i += 2, j++) {
        a[j] = new SubfieldImpl(subfields[i], subfields[i + 1])
      }
      return this.subfields.push(...a)
    } else if (_isSubfieldImplArray(subfields)) {
      return this.subfields.push(...subfields)
    } else {
      let a = (subfields as ISubfieldValue[]).map(_1 => new SubfieldImpl(_1.code, _1.data))
      return this.subfields.push(...a)
    }
  }


  public delete(...codes: Array<string | RegExp>): this {
    if (codes.length > 0) {
      _.pullAll(this.subfields, [...this.each(...codes)])
    }
    return this
  }


  public hasAll(...codes: Array<string | RegExp>): boolean {
    if (codes.length === 0) {
      throw new Error('at least one subfield code must be given to hasAll')
    }
    let seen: Array<string | RegExp> = [...codes]
    for (let s of this.each(...codes)) {
      _.remove(seen, (c: string | RegExp) => s.matches(c))
      if (seen.length === 0) {
        break
      }
    }
    return seen.length === 0
  }


  public hasAny(...codes: Array<string | RegExp>): boolean {
    if (codes.length === 0) {
      throw new Error('at least one subfield code must be given to hasAny')
    }
    // If iterator from each is not able to return any subfields, that is it immediately becomes done,
    // it means none of the subfields matched any of the given subfield codes.
    return !this.each(...codes).next().done
  }


  public findFirst(...subfieldCodes: Array<string | RegExp>): ISubfield | undefined {
    for (let c of subfieldCodes) {
      let s = this.subfields.find(_1 => _1.matches(c))
      if (s) { return s }
    }
  }


  public * each(...codes: Array<string | RegExp>): IterableIterator<ISubfield> {
    if (codes.length === 0) {
      for (let s of this.subfields) {
        yield s
      }
    } else {
      for (let s of this.subfields) {
        for (let c of codes) {
          if (s.matches(c)) {
            yield s
            break
          }
        }
      }
    }
  }


  public pick(...codes: Array<string | RegExp>): ISubfield[] {
    return (codes.length === 0) ? [] : [ ...this.each(...codes) ]
  }


  public matches(criteria: string | RegExp): boolean {
      if (typeof criteria === 'string') {
        if (this.tag === criteria) {
          return true
        } else {
          let target = [ this.tag, ...this.indicators ].join('')
          return target === criteria
        }
      } else {
        let target = [ this.tag, ...this.indicators ].join('')
        return criteria.test(target)
      }
    }


  public prepend(...subfields: string[]): number
  public prepend(...subfields: ISubfieldValue[]): number
  public prepend(...subfields: SubfieldImpl[]): number
  public prepend(...subfields: Array<string | ISubfieldValue | SubfieldImpl>): number {
    if (_isStringArray(subfields)) {
      let a = new Array<SubfieldImpl>(subfields.length / 2)
      for (let i = 0, j = 0; i < subfields.length; i += 2, j++) {
        a[j] = new SubfieldImpl(subfields[i], subfields[i + 1])
      }
      return this.subfields.unshift(...a)
    } else if (_isSubfieldImplArray(subfields)) {
      return this.subfields.unshift(...subfields)
    } else {
      let a = (subfields as ISubfieldValue[]).map(_1 => new SubfieldImpl(_1.code, _1.data))
      return this.subfields.unshift(...a)
    }
  }

} // class DataFieldImpl



// Sets up (in a TypeScript compatible way) push and unshift as being aliases for append and prepend respectively.

export interface DataFieldImpl { // tslint:disable-line interface-name
  push: typeof DataFieldImpl.prototype.append
  unshift: typeof DataFieldImpl.prototype.prepend
}
DataFieldImpl.prototype.push = DataFieldImpl.prototype.append
DataFieldImpl.prototype.unshift = DataFieldImpl.prototype.prepend



export function isADataFieldImpl(field: any): field is DataFieldImpl {
  return field instanceof DataFieldImpl
}



function _isStringArray(value: any[]): value is string[] {
  return typeof value[0] === 'string'
}



function _isSubfieldImplArray(value: any[]): value is SubfieldImpl[] {
  return value[0] instanceof SubfieldImpl
}
