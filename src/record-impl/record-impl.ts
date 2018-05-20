import * as _ from 'lodash'

import { IField, IFieldValue, IRecord, RecordType, SortType } from '../record-api'
import { ControlField, DataField, Field } from '../record-factories'
import { isAControlFieldImpl } from './control-field-impl'
import { isADataFieldImpl } from './data-field-impl'
import { FieldImpl } from './field-impl'



export class RecordImpl implements IRecord {

  constructor(public leader: string, public fields: FieldImpl[] = [], public id?: string, public type?: RecordType) { }


  public add(...fields: Array<IField | IFieldValue>): this {
    if (fields.length === 0) { return this }
    let fs: FieldImpl[] = fields.map(f => {
      if (isAControlFieldImpl(f) || isADataFieldImpl(f)) {
        return f
      } else if ('data' in f) {
        return ControlField.from(f)
      } else {
        return DataField.from(f)
      }
    })
    if (fs.length === 1) {
      // Optimise the frequent case of adding a single field by inserting it directly in the correct place
      let f = fs[0]
      let insertionPoint = _.findIndex(this.fields, _1 => _1.tag > f.tag)
      if (insertionPoint < 0) { insertionPoint = this.fields.length }
      this.fields.splice(insertionPoint, 0, f)
    } else {
      // For more than one field, add them all to the end of the current fields and then sort the fields
      this.fields.push(...fs)
      this.sort()
    }
    return this
  }


  public delete(...criteria: Array<string | RegExp>): this {
    if (criteria.length > 0) {
      _.pullAll(this.fields, [...this.each(...criteria)])
    }
    return this
  }


  public * each(...criteria: Array<string | RegExp>): IterableIterator<IField> {
    if (criteria.length === 0) {
      for (let f of this.fields) {
        yield f
      }
    } else {
      for (let f of this.fields) {
        for (let c of criteria) {
          if (f.matches(c)) {
            yield f
            break
          }
        }
      }
    }
  }


  public findFirst(...criteria: Array<string | RegExp>): IField | undefined {
    let f: IField | undefined
    for (let c of criteria) {
      f = this.fields.find(_1 => _1.matches(c))
      if (f) {
        break
      }
    }
    return f
  }


  public hasAll(...criteria: Array<string | RegExp>): boolean {
    if (criteria.length === 0) {
      throw new Error('at least one criteria must be given to hasAll')
    }
    let seen: Array<string | RegExp> = [...criteria]
    for (let f of this.each(...criteria)) {
      _.remove(seen, (c: string | RegExp) => f.matches(c))
      if (seen.length === 0) {
        break
      }
    }
    return seen.length === 0
  }


  public hasAny(...criteria: Array<string | RegExp>): boolean {
    if (criteria.length === 0) {
      throw new Error('at least one criteria must be given to hasAny')
    }
    // If the iterator from each is not able to return any fields, it immediately becomes done.
    return !this.each(...criteria).next().done
  }


  public sort(sortType?: SortType): void {
    // Must use _.sortBy and not Array.prototype.sort because only _.sortBy is guaranteed to do a stable sort.
    this.fields = _.sortBy(
      this.fields,
      sortType === 'loose' ? f => f.tag[0].toLowerCase() : f => f.tag.toLowerCase(),
     )
  }

} // class RecordImpl
