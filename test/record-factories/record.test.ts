import { IField, IFieldValue, IRecordValue } from 'record-api'
import { Record } from 'record-factories'
import { ControlFieldImpl, DataFieldImpl, RecordImpl, SubfieldImpl } from 'record-impl'



describe('Record', () => {

  const RECORD_ID = 'anp20170336'

  const RECORD_TYPE = 'Bibliographic'

  const LEADER = '02259cam a2200457 a 4500'

  const FIELDS_VALUE: IFieldValue[] = [
    {
      tag: '001', data: 'data 1',
    },
    {
      tag: '035', indicators: [ 'a', 'b' ],
      subfields: [ { code: 'a', data: 'data 2' } ],
    },
    {
      tag: '100', indicators: '  ',
      subfields: [ { code: 'a', data: 'Author, An.' } ],
    },
    {
      tag: '245', indicators: '12',
      subfields: [ 'a', 'A title :', 'b', 'of a book /', 'c', 'by An Author.' ],
    },
  ]

  const FIELDS: IField[] = [
    new ControlFieldImpl('001', 'data 1'),
    new DataFieldImpl('035', [ 'a', 'b' ], [
      new SubfieldImpl('a', 'data 2'),
    ]),
    new DataFieldImpl('100', [ ' ', ' '], [
      new SubfieldImpl('a', 'Author, An.'),
    ]),
    new DataFieldImpl('245', [ '1', '2' ], [
      new SubfieldImpl('a', 'A title :'),
      new SubfieldImpl('b', 'of a book /'),
      new SubfieldImpl('c', 'by An Author.'),
    ]),
  ]


  describe('from', () => {

    it('deeply clones a given RecordImpl', () => {
      let r1 = new RecordImpl(LEADER, FIELDS, RECORD_ID, RECORD_TYPE)
      let r2 = Record.from(r1)
      expect(r2).not.toBe(r1)
      expect(r2.fields).not.toBe(r1.fields)
      for (let i = 0; i < r2.fields.length; i++) {
        let f2 = r2.fields[i]
        let f1 = r1.fields[i]
        expect(f2).not.toBe(f1)
        if (f2.isADataField() && f1.isADataField()) {
          expect(f2.subfields).not.toBe(f1.subfields)
          for (let j = 0; j < f2.subfields.length; j++) {
            expect(f2.subfields[j]).not.toBe(f1.subfields[j])
          }
        }
      }
      expect(r2).toEqual(r1)
    })

    it('constructs a RecordImpl from a IRecordValue having just a leader', () => {
      let v: IRecordValue = { leader: LEADER }
      let r = Record.from(v)
      expect(r.leader).toEqual(v.leader)
      expect(r.fields).toEqual([])
      expect(r.id).toBeUndefined()
      expect(r.type).toBeUndefined()
    })

    it('constructs a RecordImpl from a IRecordValue having a leader, id, and type', () => {
      let v: IRecordValue = { leader: LEADER, id: RECORD_ID, type: RECORD_TYPE }
      let r = Record.from(v)
      expect(r.leader).toEqual(v.leader)
      expect(r.fields).toEqual([])
      expect(r.id).toEqual(RECORD_ID)
      expect(r.type).toEqual(RECORD_TYPE)
    })

    it('constructs a RecordImpl from a complete IRecordValue', () => {
      let v: IRecordValue = { leader: LEADER, id: RECORD_ID, type: RECORD_TYPE, fields: FIELDS_VALUE }
      let r = Record.from(v)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toEqual(FIELDS)
      expect(r.id).toEqual(RECORD_ID)
      expect(r.type).toEqual(RECORD_TYPE)
    })

    it('constructs a RecordImpl when given just a leader', () => {
      let r = Record.from(LEADER)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toEqual([])
      expect(r.id).toBeUndefined()
      expect(r.type).toBeUndefined()
    })

    it('constructs a RecordImpl when given a leader, id, and type', () => {
      let r = Record.from(LEADER, undefined, RECORD_ID, RECORD_TYPE)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toEqual([])
      expect(r.id).toEqual(RECORD_ID)
      expect(r.type).toEqual(RECORD_TYPE)
    })

    it('constructs a RecordImpl when given a leader, fields, id and type', () => {
      let r = Record.from(LEADER, FIELDS_VALUE, RECORD_ID, RECORD_TYPE)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toEqual(FIELDS)
      expect(r.id).toEqual(RECORD_ID)
      expect(r.type).toEqual(RECORD_TYPE)
    })

  }) // describe('from')

}) // describe('Record')
