import { ISubfieldValue } from 'record-api'
import { Subfield } from 'record-factories'
import { SubfieldImpl } from 'record-impl'


describe('Subfield', () => {

  describe('from', () => {

    it('deeply clones a given SubfieldImpl', () => {
      let code = 'f'
      let data = 'something'
      let s1 = new SubfieldImpl(code, data)
      let s2 = Subfield.from(s1)
      expect(s2).not.toBe(s1)
      expect(s2).toEqual(s1)
    })

    it('constructs a SubfieldImpl from a ISubfieldValue', () => {
      let v: ISubfieldValue = { code: '8', data: '245-01' }
      let s = Subfield.from(v)
      expect(s).toEqual(v)
    })

    it('constructs a SubfieldImpl from a code and data string', () => {
      let v: ISubfieldValue = { code: '8', data: '245-01' }
      let s = Subfield.from(v.code, v.data)
      expect(s).toEqual(v)
    })

  }) // describe('from')


  describe('arrayFrom', () => {

    it('deeply clones an SubfieldImpl array', () => {
      let a1 = [
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ]
      let a2 = Subfield.arrayFrom(a1)
      expect(a2).not.toBe(a1)
      for (let i = 0; i < a2.length; i++) {
        expect(a2[i]).not.toBe(a1[i])
      }
      expect(a2).toEqual(a1)
    })

    it('constructs a SubfieldImpl array from a ISubfieldValue array', () => {
      let a1: ISubfieldValue[] = [
        { code: 'a', data: 'A title :' },
        { code: 'b', data: 'of a book /' },
        { code: 'c', data: 'by An Author.' },
      ]
      let a2 = Subfield.arrayFrom(a1)
      expect(a2).not.toBe(a1)
      expect(a2).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a SubfieldImpl array from a string array', () => {
      let a1 = [
        'a', 'A title :',
        'b', 'of a book /',
        'c', 'by An Author.',
      ]
      let a2 = Subfield.arrayFrom(a1)
      expect(a2).not.toBe(a1)
      expect(a2).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

  }) // describe('arrayFrom')

}) // describe('Subfield')
