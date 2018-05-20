import { IControlFieldValue, IDataFieldValue } from 'record-api'
import { Field } from 'record-factories'
import { ControlFieldImpl, DataFieldImpl, SubfieldImpl } from 'record-impl'



describe('Field', () => {

  describe('arrayFrom', () => {

    it('deeply clones an FieldImpl array', () => {
      let a1 = [
        new ControlFieldImpl('001', 'data 1'),
        new DataFieldImpl('035', [ 'a', 'b' ], [ new SubfieldImpl('a', 'data 3') ]),
      ]
      let a2 = Field.arrayFrom(a1)
      expect(a2).not.toBe(a1)
      for (let i = 0; i < a2.length; i++) {
        let f1 = a1[i]
        let f2 = a2[i]
        expect(f2).not.toBe(f1)
        if (f2.isADataField() && f1.isADataField()) {
          expect(f2.indicators).not.toBe(f1.indicators)
          expect(f2.subfields).not.toBe(f1.subfields)
          for (let j = 0; j < f2.subfields.length; j++) {
            expect(f2.subfields[j]).not.toBe(f1.subfields[j])
          }
        }
      }
      expect(a2).toEqual(a1)
    })

    it('constructs a FieldImpl array from an IFieldValue array', () => {
      let a1: Array<IControlFieldValue | IDataFieldValue> = [
        { tag: '001', data: 'data 1' },
        { tag: '035', indicators: [ 'a', 'b' ], subfields: [ { code: 'a', data: 'data 3' } ] },
        { tag: '100', indicators: '  ', subfields: [ { code: 'a', data: 'data 4' } ] },
        { tag: '245', indicators: [ '1', '2' ], subfields: [ 'a', 'data 5', 'b', 'data 6' ] },
        { tag: '999', indicators: '34', subfields: [ 'z', 'data 7', 'u', 'data 8' ] },
      ]
      let a2 = Field.arrayFrom(a1)
      expect(a2).toHaveLength(5)
      expect(a2[0]).toEqual(new ControlFieldImpl('001', 'data 1'))
      expect(a2[1]).toEqual(
        new DataFieldImpl('035', [ 'a', 'b' ], [ new SubfieldImpl('a', 'data 3') ]),
      )
      expect(a2[2]).toEqual(
        new DataFieldImpl('100', [ ' ', ' ' ], [ new SubfieldImpl('a', 'data 4') ]),
      )
      expect(a2[3]).toEqual(
        new DataFieldImpl('245', [ '1', '2' ], [
          new SubfieldImpl('a', 'data 5'),
          new SubfieldImpl('b', 'data 6'),
        ]),
      )
      expect(a2[4]).toEqual(
        new DataFieldImpl('999', [ '3', '4' ], [
          new SubfieldImpl('z', 'data 7'),
          new SubfieldImpl('u', 'data 8'),
        ]),
      )
    })

  }) // describe('arrayFrom')


  describe('isAControlFieldTag', () => {

    it('returns true for control field tags', () => {
      expect(Field.isAControlFieldTag('001')).toBe(true)
      expect(Field.isAControlFieldTag('009')).toBe(true)
      expect(Field.isAControlFieldTag('00a')).toBe(true)
      expect(Field.isAControlFieldTag('00z')).toBe(true)
      expect(Field.isAControlFieldTag('00A')).toBe(true)
      expect(Field.isAControlFieldTag('00Z')).toBe(true)
    })

    it('returns false for data field tags', () => {
      expect(Field.isAControlFieldTag('010')).toBe(false)
      expect(Field.isAControlFieldTag('999')).toBe(false)
      expect(Field.isAControlFieldTag('0aa')).toBe(false)
      expect(Field.isAControlFieldTag('zzz')).toBe(false)
      expect(Field.isAControlFieldTag('0AA')).toBe(false)
      expect(Field.isAControlFieldTag('ZZZ')).toBe(false)
    })

  }) // describe('isAControlFieldTag')

}) // describe('Field')
