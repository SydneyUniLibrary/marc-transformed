import { IField } from 'record-api'
import { ControlFieldImpl, DataFieldImpl, RecordImpl, SubfieldImpl } from 'record-impl'
import { Field, Record } from '../../src/record-factories'



describe('RecordImpl', () => {

  const LEADER = '02259cam a2200457 a 4500'

  const FIELDS: IField[] = [
    new ControlFieldImpl('001', 'data 1'),
    new DataFieldImpl('035', [ 'a', 'b' ], [
      new SubfieldImpl('a', 'data 3'),
    ]),
    new DataFieldImpl('100', [ ' ', ' '], [
      new SubfieldImpl('a', 'Author, An.'),
    ]),
    new DataFieldImpl('245', [ '1', '2' ], [
      new SubfieldImpl('a', 'A title :'),
      new SubfieldImpl('b', 'of a book /'),
      new SubfieldImpl('c', 'by An Author.'),
    ]),
    new DataFieldImpl('910', [ 'a', 'b' ], [
      new SubfieldImpl('a', '910ab data'),
    ]),
    new DataFieldImpl('910', [ 'x', 'y' ], [
      new SubfieldImpl('a', '910xy data'),
    ]),
  ]

  const RECORD_ID = 'anp20170336'

  const RECORD_TYPE = 'Bibliographic'

  const RECORD = new RecordImpl(LEADER, FIELDS, RECORD_ID, RECORD_TYPE)


  describe('constructor', () => {

    it('set the leader when given just the leader', () => {
      let r = new RecordImpl(LEADER)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toEqual([])
      expect(r.id).toBeUndefined()
      expect(r.type).toBeUndefined()
    })

    it('set the leader and fields when given a leader and fields array', () => {
      let r = new RecordImpl(LEADER, FIELDS)
      expect(r.leader).toEqual(LEADER)
      expect(r.fields).toBe(FIELDS)
      expect(r.id).toBeUndefined()
      expect(r.type).toBeUndefined()
    })

    it('set the leader, fields, record id and record type when given all of these', () => {
      expect(RECORD.leader).toEqual(LEADER)
      expect(RECORD.fields).toBe(FIELDS)
      expect(RECORD.id).toEqual(RECORD_ID)
      expect(RECORD.type).toEqual(RECORD_TYPE)
    })

  }) // describe('constructor')


  describe('add', () => {

    it('add a single field to an empty record', () => {
      let r1 = new RecordImpl(LEADER)
      let r2 = r1.add({ tag: '009', data: 'data' })
      expect(r2).toBe(r1)
      expect(r2.fields).toEqual([
        new ControlFieldImpl('009', 'data'),
      ])
    })

    it('add a single field, keeping strict field order', () => {
      let r1 = Record.from(RECORD)
      let r2 = r1.add({ tag: '200', indicators: '  ', subfields: [ 'a', '200 data' ] })
      expect(r2).toBe(r1)
      expect(r2).toBe(r1)
      expect(r2.fields).toEqual([
        new ControlFieldImpl('001', 'data 1'),
        new DataFieldImpl('035', [ 'a', 'b' ], [
          new SubfieldImpl('a', 'data 3'),
        ]),
        new DataFieldImpl('100', [ ' ', ' '], [
          new SubfieldImpl('a', 'Author, An.'),
        ]),
        new DataFieldImpl('200', [ ' ', ' ' ], [
          new SubfieldImpl('a', '200 data'),
        ]),
        new DataFieldImpl('245', [ '1', '2' ], [
          new SubfieldImpl('a', 'A title :'),
          new SubfieldImpl('b', 'of a book /'),
          new SubfieldImpl('c', 'by An Author.'),
        ]),
        new DataFieldImpl('910', [ 'a', 'b' ], [
          new SubfieldImpl('a', '910ab data'),
        ]),
        new DataFieldImpl('910', [ 'x', 'y' ], [
          new SubfieldImpl('a', '910xy data'),
        ]),
      ])
    })

    it('add a single field, after any existing fields with the same tag', () => {
      let r1 = Record.from(RECORD)
      let r2 = r1.add({ tag: '245', indicators: 'zx', subfields: [ 'z', '1', 'y', '2' ] })
      expect(r2).toBe(r1)
      expect(r2).toBe(r1)
      expect(r2.fields).toEqual([
        new ControlFieldImpl('001', 'data 1'),
        new DataFieldImpl('035', [ 'a', 'b' ], [
          new SubfieldImpl('a', 'data 3'),
        ]),
        new DataFieldImpl('100', [ ' ', ' '], [
          new SubfieldImpl('a', 'Author, An.'),
        ]),
        new DataFieldImpl('245', [ '1', '2' ], [
          new SubfieldImpl('a', 'A title :'),
          new SubfieldImpl('b', 'of a book /'),
          new SubfieldImpl('c', 'by An Author.'),
        ]),
        new DataFieldImpl('245', [ 'z', 'x' ], [
          new SubfieldImpl('z', '1'),
          new SubfieldImpl('y', '2'),
        ]),
        new DataFieldImpl('910', [ 'a', 'b' ], [
          new SubfieldImpl('a', '910ab data'),
        ]),
        new DataFieldImpl('910', [ 'x', 'y' ], [
          new SubfieldImpl('a', '910xy data'),
        ]),
      ])
    })

    it('adds multiple fields, keeping strict field order', () => {
      let r1 = Record.from(RECORD)
      let r2 = r1.add(
        { tag: '245', indicators: 'zx', subfields: [ 'z', '1', 'y', '2' ] },
        { tag: '009', data: 'data for 009'},
        new ControlFieldImpl('005', '005 data'),
        new DataFieldImpl('910', [ 'g', 'h' ], [ new SubfieldImpl('z', '910gh data') ]),
        new DataFieldImpl('500', [ ' ', ' ' ], [ new SubfieldImpl('a', 'A note.') ]),
      )
      expect(r2).toBe(r1)
      expect(r2.fields).toEqual([
        new ControlFieldImpl('001', 'data 1'),
        new ControlFieldImpl('005', '005 data'),
        new ControlFieldImpl('009', 'data for 009'),
        new DataFieldImpl('035', [ 'a', 'b' ], [
          new SubfieldImpl('a', 'data 3'),
        ]),
        new DataFieldImpl('100', [ ' ', ' '], [
          new SubfieldImpl('a', 'Author, An.'),
        ]),
        new DataFieldImpl('245', [ '1', '2' ], [
          new SubfieldImpl('a', 'A title :'),
          new SubfieldImpl('b', 'of a book /'),
          new SubfieldImpl('c', 'by An Author.'),
        ]),
        new DataFieldImpl('245', [ 'z', 'x' ], [
          new SubfieldImpl('z', '1'),
          new SubfieldImpl('y', '2'),
        ]),
        new DataFieldImpl('500', [ ' ', ' ' ], [
          new SubfieldImpl('a', 'A note.'),
        ]),
        new DataFieldImpl('910', [ 'a', 'b' ], [
          new SubfieldImpl('a', '910ab data'),
        ]),
        new DataFieldImpl('910', [ 'x', 'y' ], [
          new SubfieldImpl('a', '910xy data'),
        ]),
        new DataFieldImpl('910', [ 'g', 'h' ], [
          new SubfieldImpl('z', '910gh data'),
        ]),
      ])
    })

    it('does not throw when given no arguments', () => {
      expect(() => { RECORD.add() }).not.toThrow()
      expect(RECORD.add()).toBe(RECORD)
    })

  }) // describe('add')


  describe('delete', () => {

    it('deletes all fields matching the given criteria', () => {
      let r = Record.from(RECORD)
      expect(r.delete('001', /^245/, '910xy')).toBe(r)
      expect(r.fields).toEqual([
        new DataFieldImpl('035', [ 'a', 'b' ], [
          new SubfieldImpl('a', 'data 3'),
        ]),
        new DataFieldImpl('100', [ ' ', ' '], [
          new SubfieldImpl('a', 'Author, An.'),
        ]),
        new DataFieldImpl('910', [ 'a', 'b' ], [
          new SubfieldImpl('a', '910ab data'),
        ]),
      ])
    })

    it('changes nothing if none of the field match any of the given criteria', () => {
      let r = Record.from(RECORD)
      expect(r.delete('zzz', '245zz', /^00a/)).toBe(r)
      expect(r).toEqual(RECORD)
    })

    it('does not throw when given no arguments', () => {
      expect(() => { RECORD.delete() }).not.toThrow()
      expect(RECORD.delete()).toBe(RECORD)
    })

  }) // describe('delete')


  describe('each', () => {

    it('iterates over all fields when given no arguments', () => {
      let it = RECORD.each()
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[0] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[1] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[2] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[3] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[4] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[5] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('iterates over all occurrences of a field with a given tag', () => {
      let it = RECORD.each('910')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[4] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[5] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each(/^910/)
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[4] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[5] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each('001')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[0] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each('zzz')
      expect(it.next()).toMatchObject({ done: true })
    })

    it('iterates over all occurrences of a field with a given tag and indicator', () => {
      let it = RECORD.each('910ab')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[4] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each('910xy')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[5] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each('100  ')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[2] })
      expect(it.next()).toMatchObject({ done: true })
      it = RECORD.each('100zz')
      expect(it.next()).toMatchObject({ done: true })
    })

    it('iterates over all occurrences of all given fields, in record order not argument order', () => {
      let it = RECORD.each('910ab', /^001/, '245')
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[0] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[3] })
      expect(it.next()).toMatchObject({ done: false, value: FIELDS[4] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('returns an already-done iterator if the records has no fields', () => {
      let r = new RecordImpl(LEADER)
      let it = r.each()
      expect(it.next()).toMatchObject({ done: true })
    })

  }) // describe('each')


  describe('findFirst', () => {

    it('returns the only occurrence when only one exists', () => {
      expect(RECORD.findFirst('001')).toEqual(FIELDS[0])
      expect(RECORD.findFirst(/^100/)).toEqual(FIELDS[2])
    })

    it('returns the first occurrence when multiple exist', () => {
      expect(RECORD.findFirst('910')).toEqual(FIELDS[4])
      expect(RECORD.findFirst(/^910/)).toEqual(FIELDS[4])
    })

    it('returns the first occurrence in argument order not record order', () => {
      expect(RECORD.findFirst('245', '100')).toEqual(FIELDS[3])
      expect(RECORD.findFirst(/910xy/, /910ab/)).toEqual(FIELDS[5])
      expect(RECORD.findFirst('zzz', '910ab', '100')).toEqual(FIELDS[4])
    })

    it('is not affected by duplicated arguments', () => {
      expect(RECORD.findFirst('100  ', '100', /^100/)).toEqual(FIELDS[2])
    })

    it('returns undefined if the records has no fields', () => {
      let r = new RecordImpl(LEADER)
      expect(r.findFirst('001')).toBeUndefined()
      expect(r.findFirst(/^6501 $/)).toBeUndefined()
    })

    it('returns undefined when given no subfields', () => {
      expect(RECORD.findFirst()).toBeUndefined()
    })

    it('returns undefined when none of the fields match any of the given criteria', () => {
      expect(RECORD.findFirst('999')).toBeUndefined()
      expect(RECORD.findFirst('245zz')).toBeUndefined()
      expect(RECORD.findFirst(/^zzz/)).toBeUndefined()
      expect(RECORD.findFirst(/^6501 $/)).toBeUndefined()
    })

  }) // describe('findFirst')


  describe('hasAll', () => {

    it('returns true when all of the criteria match at least one field', () => {
      expect(RECORD.hasAll('245', '001', '910xy')).toBe(true)
      expect(RECORD.hasAll(/^245/, /^001$/, /^910xy$/)).toBe(true)
    })

    it ('returns false when any of the given criteria do not match any of the fields', () => {
      expect(RECORD.hasAll('zzz')).toBe(false)
      expect(RECORD.hasAll(/^945xx$/)).toBe(false)
      expect(RECORD.hasAll('245', '245xx')).toBe(false)
    })

    it('throws when given no criteria', () => {
      expect(() => RECORD.hasAll()).toThrow(/at least one criteria must be given/i)
    })

  })


  describe('hasAny', () => {

    it('returns true when any of the criteria match at least one field', () => {
      expect(RECORD.hasAny('245')).toBe(true)
      expect(RECORD.hasAny(/^001/)).toBe(true)
      expect(RECORD.hasAny('zzz', /^910ab/, '910xy')).toBe(true)
    })

    it('returns false when all of the given criteria do not match any of the fields', () => {
      expect(RECORD.hasAny('910zz')).toBe(false)
      expect(RECORD.hasAny(/^zzz/)).toBe(false)
      expect(RECORD.hasAny('zzz', /^910zz$/)).toBe(false)
    })

    it('throws when given no criteria', () => {
      expect(() => RECORD.hasAny()).toThrow(/at least one criteria must be given/i)
    })

  }) // describe('hasAny')


  describe('sort', () => {

    it('performs a stable, case-insensitive sort by full field tag when in strict mode', () => {
      let unsortedFields = Field.arrayFrom([
        { tag: '005', data: '' },
        { tag: '001', data: '' },
        { tag: '00Z', data: '' },
        { tag: '00f', data: '' },
        { tag: '910' },
        { tag: '0bc' },
        { tag: 'XYZ' },
        { tag: 'abc' },
        { tag: '300' },
        { tag: '650', indicators: '22' },
        { tag: '650', indicators: '11' },
        { tag: '650', indicators: '33' },
        { tag: '650', indicators: '33' },
      ])
      let expectedSortedFields = Field.arrayFrom([
        { tag: '001', data: '' },
        { tag: '005', data: '' },
        { tag: '00f', data: '' },
        { tag: '00Z', data: '' },
        { tag: '0bc' },
        { tag: '300' },
        { tag: '650', indicators: '22' },
        { tag: '650', indicators: '11' },
        { tag: '650', indicators: '33' },
        { tag: '650', indicators: '33' },
        { tag: '910' },
        { tag: 'abc' },
        { tag: 'XYZ' },
      ])
      let r = new RecordImpl(LEADER, unsortedFields)
      r.sort('strict')
      expect(r.fields).toEqual(expectedSortedFields)
    })

    it('performs a stable, case-insensitive sort by just the first char of the field tag when in loose mode', () => {
      let unsortedFields = Field.arrayFrom([
        { tag: '652', indicators: '22' },
        { tag: '651', indicators: '11' },
        { tag: '653', indicators: '33' },
        { tag: '650', indicators: '00' },
        { tag: '005', data: '' },
        { tag: '001', data: '' },
        { tag: '00Z', data: '' },
        { tag: '00f', data: '' },
        { tag: '300' },
        { tag: 'XYZ' },
        { tag: 'abc' },
      ])
      let expectedSortedFields = Field.arrayFrom([
        { tag: '005', data: '' },
        { tag: '001', data: '' },
        { tag: '00Z', data: '' },
        { tag: '00f', data: '' },
        { tag: '300' },
        { tag: '652', indicators: '22' },
        { tag: '651', indicators: '11' },
        { tag: '653', indicators: '33' },
        { tag: '650', indicators: '00' },
        { tag: 'abc' },
        { tag: 'XYZ' },
      ])
      let r = new RecordImpl(LEADER, unsortedFields)
      r.sort('loose')
      expect(r.fields).toEqual(expectedSortedFields)
    })

    it('performs a strict sort by default', () => {
      let unsortedFields = Field.arrayFrom([
        { tag: '691' },
        { tag: '682' },
        { tag: '673' },
        { tag: '664' },
      ])
      let expectedSortedFields = Field.arrayFrom([
        { tag: '664' },
        { tag: '673' },
        { tag: '682' },
        { tag: '691' },
      ])
      let r = new RecordImpl(LEADER, unsortedFields)
      r.sort()
      expect(r.fields).toEqual(expectedSortedFields)
    })

    it('does not throw even the record has no fields', () => {
      let r = new RecordImpl(LEADER)
      expect(() => r.sort()).not.toThrow()
      expect(() => r.sort('loose')).not.toThrow()
      expect(() => r.sort('strict')).not.toThrow()
    })

  }) // describe('sort')

}) // describe('RecordImpl')
