import { ISubfield } from '../record-api'



export class SubfieldImpl implements  ISubfield {

  constructor(public code: string, public data: string) { }


  public matches(criteria: string | RegExp): boolean {
    return typeof criteria === 'string' ? criteria === this.code : criteria.test(this.code)
  }

} // class SubfieldImpl
