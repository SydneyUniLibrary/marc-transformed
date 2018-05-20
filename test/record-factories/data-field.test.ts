import { IDataFieldValue } from 'record-api'
import { DataField } from 'record-factories'
import { DataFieldImpl, SubfieldImpl } from 'record-impl'



describe('DataField', () => {

  describe('from', () => {

    it('deeply clones a given DataFieldImpl', () => {
      let f1 = new DataFieldImpl(
        '245',
        [ '1', '2'],
        [
          new SubfieldImpl('a', 'A title :'),
          new SubfieldImpl('b', 'of a book /'),
          new SubfieldImpl('c', 'by An Author.'),
        ],
      )
      let f2 = DataField.from(f1)
      expect(f2).toEqual(f1)
      expect(f2).not.toBe(f1)
      expect(f2.indicators).not.toBe(f1.indicators)
      expect(f2.subfields).not.toBe(f1.subfields)
      for (let i = 0; i < f2.subfields.length; i++) {
        expect(f2.subfields[i]).not.toBe(f1.subfields[i])
      }
    })

    it('constructs a DataFieldImpl from a IDataFieldValue with indicators array and subfields object array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: [ '1', '2' ],
        subfields: [
          { code: 'a', data: 'A title :' },
          { code: 'b', data: 'of a book /' },
          { code: 'c', data: 'by An Author.' },
        ],
      }
      let f = DataField.from(v)
      expect(f).toEqual(v)
      expect(f).not.toBe(v)
    })

    it('constructs a DataFieldImpl from a IDataFieldValue with indicators string and subfields object array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: '12',
        subfields: [
          { code: 'a', data: 'A title :' },
          { code: 'b', data: 'of a book /' },
          { code: 'c', data: 'by An Author.' },
        ],
      }
      let f = DataField.from(v)
      expect(f).not.toBe(v)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual([ '1', '2' ])
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a DataFieldImpl from a IDataFieldValue with indicators array and subfields string array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: [ '1', '2' ],
        subfields: [
          'a', 'A title :',
          'b', 'of a book /',
          'c', 'by An Author.',
        ],
      }
      let f = DataField.from(v)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual(v.indicators)
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a DataFieldImpl from a IDataFieldValue with indicators string and subfields string array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: '12',
        subfields: [
          'a', 'A title :',
          'b', 'of a book /',
          'c', 'by An Author.',
        ],
      }
      let f = DataField.from(v)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual([ '1', '2' ])
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a DataFieldImpl from just a tag', () => {
      let f = DataField.from('245')
      expect(f.tag).toEqual('245')
      expect(f.indicators).toEqual([])
      expect(f.subfields).toEqual([])
    })

    it('constructs a DataFieldImpl from a tag, indicators array and subfields object array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: [ '1', '2' ],
        subfields: [
          { code: 'a', data: 'A title :' },
          { code: 'b', data: 'of a book /' },
          { code: 'c', data: 'by An Author.' },
        ],
      }
      let f = DataField.from(v.tag, v.indicators, v.subfields)
      expect(f).toEqual(v)
      expect(f).not.toBe(v)
    })

    it('constructs a DataFieldImpl from a tag, indicators string and subfields object array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: '12',
        subfields: [
          { code: 'a', data: 'A title :' },
          { code: 'b', data: 'of a book /' },
          { code: 'c', data: 'by An Author.' },
        ],
      }
      let f = DataField.from(v.tag, v.indicators, v.subfields)
      expect(f).not.toBe(v)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual([ '1', '2' ])
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a DataFieldImpl from a tag, indicators array and subfields string array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: [ '1', '2' ],
        subfields: [
          'a', 'A title :',
          'b', 'of a book /',
          'c', 'by An Author.',
        ],
      }
      let f = DataField.from(v.tag, v.indicators, v.subfields)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual(v.indicators)
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

    it('constructs a DataFieldImpl from a tag, indicators string and subfields string array', () => {
      let v: IDataFieldValue = {
        tag: '245',
        indicators: '12',
        subfields: [
          'a', 'A title :',
          'b', 'of a book /',
          'c', 'by An Author.',
        ],
      }
      let f = DataField.from(v.tag, v.indicators, v.subfields)
      expect(f.tag).toEqual(v.tag)
      expect(f.indicators).toEqual([ '1', '2' ])
      expect(f.subfields).toEqual([
        new SubfieldImpl('a', 'A title :'),
        new SubfieldImpl('b', 'of a book /'),
        new SubfieldImpl('c', 'by An Author.'),
      ])
    })

  }) // describe('from')

}) // describe('DataField')
