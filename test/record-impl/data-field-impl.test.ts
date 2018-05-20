import { DataField } from 'record-factories'
import { ControlFieldImpl, DataFieldImpl, isADataFieldImpl, SubfieldImpl  } from 'record-impl'



describe('DataFieldImpl', () => {

  const TAG = '987'

  const SUBFIELDS = [
    new SubfieldImpl('f', 'data 1'),
    new SubfieldImpl('a', 'data 2'),
    new SubfieldImpl('u', 'data 3'),
    new SubfieldImpl('a', 'data 4'),
  ]

  const INDICATORS = [ '4', 'a' ]

  const FIELD = new DataFieldImpl('987', INDICATORS, SUBFIELDS)


  describe('constructor', () => {

    it('sets the tag when given just a tag', () => {
      let f = new DataFieldImpl(TAG)
      expect(f.tag).toEqual(TAG)
      expect(f.indicators).toEqual([])
      expect(f.subfields).toEqual([])
    })

    it('sets the tag and indicators when given a tag and indicators', () => {
      let x = new DataFieldImpl(TAG, INDICATORS)
      expect(x.tag).toEqual(TAG)
      expect(x.indicators).toEqual(INDICATORS)
      expect(x.subfields).toEqual([])
    })

    it('sets the tag, indicators and subfields when given a tag, indicators and subfields', () => {
      let x = new DataFieldImpl(TAG, INDICATORS, SUBFIELDS)
      expect(x.tag).toEqual(TAG)
      expect(x.indicators).toEqual(INDICATORS)
      expect(x.subfields).toEqual(SUBFIELDS)
    })

  }) // describe('constructor')


  describe('isAControlField', () => {

    it('is false', () => {
      expect(FIELD.isAControlField()).toBe(false)
    })

  }) // describe('isAControlField')


  describe('isADataField', () => {

    it('is true', () => {
      expect(FIELD.isADataField()).toBe(true)
    })

  }) // describe('isADataField')


  describe('matches', () => {

    it('returns true when a given string exactly matches the field tag', () => {
      expect(FIELD.matches('987')).toBeTruthy()
    })

    it('returns false when a given string does not match the field tag', () => {
      expect(FIELD.matches('123')).toBeFalsy()
    })

    it('returns true when a given string exactly matches the field tag and indicators', () => {
      expect(FIELD.matches('9874a')).toBeTruthy()
    })

    it('returns false when a given string exactly matches the field tag but not the indicators', () => {
      expect(FIELD.matches('9874z')).toBeFalsy()
      expect(FIELD.matches('987za')).toBeFalsy()
    })

    it('returns true when a given regexp matches the field tag and indicators', () => {
      expect(FIELD.matches(/^987/)).toBeTruthy()
      expect(FIELD.matches(/4a$/)).toBeTruthy()
      expect(FIELD.matches(/^9874/)).toBeTruthy()
      expect(FIELD.matches(/^9874a$/)).toBeTruthy()
    })

    it('returns false when a given regexp does not match the field tag and indicators', () => {
      expect(FIELD.matches(/^123/)).toBeFalsy()
      expect(FIELD.matches(/^987zz$/)).toBeFalsy()
    })

  }) // describe ('matches')


  describe('subfieldCodes', () => {

    it('returns an array of the codes from the subfields in field order', () => {
      expect(FIELD.subfieldCodes).toEqual([ 'f', 'a', 'u', 'a' ])
    })

    it('returns an empty array if the field has no subfields', () => {
      let f = new DataFieldImpl(TAG)
      expect(f.subfieldCodes).toEqual([ ])
    })

  }) // describe('subfieldCodes')


  describe('value', () => {

    it('returns the data from each subfield, concatenated, separated by a space character, in field order', () => {
      expect(FIELD.value).toEqual('data 1 data 2 data 3 data 4')
    })

    it('returns an empty string if the field has no subfields', () => {
      let f = new DataFieldImpl(TAG)
      expect(f.value).toEqual('')
    })

  }) // describe('value')


  describe('findFirst', () => {

    it('returns the only occurrence when only one exists', () => {
      expect(FIELD.findFirst('f')).toEqual(SUBFIELDS[0])
      expect(FIELD.findFirst('u')).toEqual(SUBFIELDS[2])
      expect(FIELD.findFirst(/f/)).toEqual(SUBFIELDS[0])
      expect(FIELD.findFirst(/u/)).toEqual(SUBFIELDS[2])
    })

    it('returns the first occurrence when multiple exist', () => {
      expect(FIELD.findFirst('a')).toEqual(SUBFIELDS[1])
      expect(FIELD.findFirst(/a/)).toEqual(SUBFIELDS[1])
    })

    it('returns the first occurrence in argument order not field order', () => {
      expect(FIELD.findFirst('u', 'f', 'a')).toEqual(SUBFIELDS[2])
      expect(FIELD.findFirst(/a/, /f/, /u/)).toEqual(SUBFIELDS[1])
      expect(FIELD.findFirst(/f/, 'a', 'u')).toEqual(SUBFIELDS[0])
    })

    it('is not affected by duplicated arguments', () => {
      expect(FIELD.findFirst(/f/, 'f', 'f', /[fau]/)).toEqual(SUBFIELDS[0])
    })

    it('returns undefined if the field has no subfields', () => {
      let f = new DataFieldImpl(TAG)
      expect(f.findFirst(/f/, 'a', 'u')).toBeUndefined()
    })

    it('returns undefined when given no subfields', () => {
      expect(FIELD.findFirst()).toBeUndefined()
    })

    it('returns undefined when none of the give subfields exist', () => {
      expect(FIELD.findFirst(/[&%$]/, 'o', '7')).toBeUndefined()
    })

  }) // describe('findFirst')


  describe('each', () => {

    it('iterates over all subfields when given no arguments', () => {
      let it = FIELD.each()
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[0] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[1] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[2] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[3] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('iterates over all occurrences of a subfield', () => {
      let it = FIELD.each('a')
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[1] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[3] })
      expect(it.next()).toMatchObject({ done: true })
      it = FIELD.each(/^a$/)
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[1] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[3] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('iterates over all occurrences of all given subfields, in field order not argument order', () => {
      let it = FIELD.each('u', 'f')
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[0] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[2] })
      expect(it.next()).toMatchObject({ done: true })
      it = FIELD.each(/[uf]/)
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[0] })
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[2] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('is not affected by duplicated arguments', () => {
      let it = FIELD.each('u', 'u', /u/, /^u$/)
      expect(it.next()).toMatchObject({ done: false, value: SUBFIELDS[2] })
      expect(it.next()).toMatchObject({ done: true })
    })

    it('returns an already-done iterator if the field has no subfields', () => {
      let f = new DataFieldImpl(TAG)
      let it = f.each()
      expect(it.next()).toMatchObject({ done: true })
    })

    it('returns an already-done iterator if there are no occurrences of any of the given subfields', () => {
      let it = FIELD.each('$', /[#@]/, '!')
      expect(it.next()).toMatchObject({ done: true })
    })

  }) // describe('each')


  describe('hasAll', () => {

    it('returns true when all the given subfields exist in the field', () => {
      expect(FIELD.hasAll('f')).toBe(true)
      expect(FIELD.hasAll(/a/)).toBe(true)
      expect(FIELD.hasAll('a', 'u')).toBe(true)
      expect(FIELD.hasAll('u', /f/, 'a')).toBe(true)
    })

    it('returns false when any of the given subfields do not exist in the field', () => {
      expect(FIELD.hasAll('z')).toBe(false)
      expect(FIELD.hasAll(/@/)).toBe(false)
      expect(FIELD.hasAll('z', 'a')).toBe(false)
      expect(FIELD.hasAll('u', /f/, 'a', /@/)).toBe(false)
    })

    it('throws when given no subfield codes', () => {
      expect(() => FIELD.hasAll()).toThrow(/at least one subfield code must be given/i)
    })

  }) // describe('hasAll')


  describe('hasAny', () => {

    it('returns true when any of the given subfields exist in the field', () => {
      expect(FIELD.hasAny('a')).toBe(true)
      expect(FIELD.hasAny(/u/)).toBe(true)
      expect(FIELD.hasAny('@', 'f')).toBe(true)
    })

    it('returns false when all of the given subfields do not exist in the field', () => {
      expect(FIELD.hasAny('z')).toBe(false)
      expect(FIELD.hasAny(/%/)).toBe(false)
      expect(FIELD.hasAny('z', /%/, '')).toBe(false)
    })

    it('throws when given no subfield codes', () => {
      expect(() => FIELD.hasAny()).toThrow(/at least one subfield code must be given/i)
    })

  }) // describe('hasAny')


  describe('pick', () => {

    it('returns all occurrences of all given subfields, in field order not argument order', () => {
      expect(FIELD.pick('f')).toEqual([ SUBFIELDS[0] ])
      expect(FIELD.pick(/a/)).toEqual([ SUBFIELDS[1], SUBFIELDS[3] ])
      expect(FIELD.pick(/a/, 'f')).toEqual([ SUBFIELDS[0], SUBFIELDS[1], SUBFIELDS[3] ])
      expect(FIELD.pick('!', /u/)).toEqual([ SUBFIELDS[2] ])
    })

    it('returns an empty array if the field has no subfields', () => {
      let f = new DataFieldImpl(TAG)
      expect(f.pick('f')).toEqual([])
    })

    it('returns an empty array when given no arguments', () => {
      expect(FIELD.pick()).toEqual([])
    })

    it('returns an empty array if the field has none of the given subfields', () => {
      expect(FIELD.pick('!')).toEqual([])
      expect(FIELD.pick(/z/)).toEqual([])
    })

    it('is not affected by duplicated arguments', () => {
      expect(FIELD.pick('u', /^u/, /u$/, 'u')).toEqual([ SUBFIELDS[2] ])
    })

  }) // describe('pick')


  describe('append', () => {

    it('changes nothing when given no arguments, and does not throw', () => {
      let subfieldsBefore = [ ...FIELD.subfields ]
      expect(FIELD.append()).toEqual(FIELD.subfields.length)
      expect(FIELD.subfields).toEqual(subfieldsBefore)
    })

    it('adds subfields given as an array of strings to the end of the field', () => {
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.append('z', 'data 5', 'w', 'data 6', 'w', 'data 7', '8', 'data 8')).toEqual(8)
      expect(f.subfields).toEqual([
        ...SUBFIELDS,
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
      ])
    })

    it('adds subfields given as an array of values to the end of the field', () => {
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(
        f.append(
          { code: 'z', data: 'data 5' },
          { code: 'w', data: 'data 6' },
          { code: 'w', data: 'data 7' },
          { code: '8', data: 'data 8' },
        ),
      ).toEqual(8)
      expect(f.subfields).toEqual([
        ...SUBFIELDS,
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
      ])
    })

    it('add an SubfieldImpl array to the end of the field', () => {
      let a = [
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
      ]
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.append(...a)).toEqual(8)
      expect(f.subfields).toEqual([ ...SUBFIELDS, ...a ])
    })

  }) // describe('append')


  describe('push', () => {

    it('is an alias for append', () => {
      expect(FIELD.push).toBe(FIELD.append)
    })

  }) // describe('push')


  describe('prepend', () => {

    it('changes nothing when given no arguments, and does not throw', () => {
      let subfieldsBefore = [ ...FIELD.subfields ]
      expect(FIELD.prepend()).toEqual(FIELD.subfields.length)
      expect(FIELD.subfields).toEqual(subfieldsBefore)
    })

    it('adds subfields given as an array of strings to the start of the field', () => {
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.prepend('z', 'data 5', 'w', 'data 6', 'w', 'data 7', '8', 'data 8')).toEqual(8)
      expect(f.subfields).toEqual([
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
        ...SUBFIELDS,
      ])
    })

    it('adds subfields given as an array of values to the start of the field', () => {
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(
        f.prepend(
          { code: 'z', data: 'data 5' },
          { code: 'w', data: 'data 6' },
          { code: 'w', data: 'data 7' },
          { code: '8', data: 'data 8' },
        ),
      ).toEqual(8)
      expect(f.subfields).toEqual([
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
        ...SUBFIELDS,
      ])
    })

    it('add an SubfieldImpl array to the start of the field', () => {
      let a = [
        new SubfieldImpl('z', 'data 5'),
        new SubfieldImpl('w', 'data 6'),
        new SubfieldImpl('w', 'data 7'),
        new SubfieldImpl('8', 'data 8'),
      ]
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.prepend(...a)).toEqual(8)
      expect(f.subfields).toEqual([ ...a, ...SUBFIELDS ])
    })

  }) // describe('prepend')


  describe('unshift', () => {

    it('is an alias for prepend', () => {
      expect(FIELD.unshift).toBe(FIELD.prepend)
    })

  }) // describe('unshift')


  describe('delete', () => {

    it('deletes all subfields whose subfield code matches the given strings', () => {
      let f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.delete('a')).toBe(f)
      expect(f.subfields).toEqual([ SUBFIELDS[0], SUBFIELDS[2] ])
      f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.delete(/a/)).toBe(f)
      expect(f.subfields).toEqual([ SUBFIELDS[0], SUBFIELDS[2] ])
      f = new DataFieldImpl(FIELD.tag, FIELD.indicators, [ ...SUBFIELDS ])
      expect(f.delete(/u/, 'f')).toBe(f)
      expect(f.subfields).toEqual([ SUBFIELDS[1], SUBFIELDS[3] ])
    })

    it('changes nothing when given no arguments, and does not throw', () => {
      let f = DataField.from(FIELD)
      expect(f.delete()).toBe(f)
      expect(f).toEqual(FIELD)
    })

    it('changes nothing if the field does not have any of the given subfields', () => {
      let f = DataField.from(FIELD)
      expect(f.delete('z', /@/)).toBe(f)
      expect(f).toEqual(FIELD)
    })

  }) // describe('delete')

}) // describe('DataFieldImpl')



describe('isADataFieldImpl', () => {

  it('returns true when given a DataFieldImpl instance', () => {
    expect(isADataFieldImpl(new DataFieldImpl('254'))).toBe(true)
  })

  it('returns false when given a ControlFieldImpl instance', () => {
    expect(isADataFieldImpl(new ControlFieldImpl('005', '0987654321'))).toBe(false)
  })

}) // describe('isADataFieldImpl')



describe('Jest expect.toEqual with DataFieldImpl', () => {

  it('detects two data fields with the same tag as being equal', () => {
    expect(new DataFieldImpl('100')).toEqual(new DataFieldImpl('100'))
  })

  it('detects two data fields with the differing tags as being not equal', () => {
    expect(new DataFieldImpl('900')).not.toEqual(new DataFieldImpl('901'))
  })

  it('detects two data fields with the same tag and indicators as being equal', () => {
    expect(new DataFieldImpl('900', [ '1', '2' ])).toEqual(new DataFieldImpl('900', [ '1', '2' ]))
  })

  it('detects two data fields with the differing indicators as being not equal', () => {
    expect(new DataFieldImpl('900', [ '1', '2' ])).not.toEqual(new DataFieldImpl('900', [ '#', '2' ]))
    expect(new DataFieldImpl('900', [ '1', '2' ])).not.toEqual(new DataFieldImpl('900', [ '1', '#' ]))
  })

  it('detects two data fields with the same tag and subfields as being equal', () => {
    let a = new DataFieldImpl('900', [], [ new SubfieldImpl('a', 'data') ])
    let b = new DataFieldImpl('900', [], [ new SubfieldImpl('a', 'data') ])
    expect(a).toEqual(b)
  })

  it('detects two data fields with differing subfields as being not equal', () => {
    let a = new DataFieldImpl('900', [], [ new SubfieldImpl('a', 'data') ])
    let b = new DataFieldImpl('900', [], [ new SubfieldImpl('b', 'data') ])
    let c = new DataFieldImpl('900', [], [ new SubfieldImpl('a', 'data 2') ])
    expect(a).not.toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('detects a data field as not being equal to a control field', () => {
    expect(new DataFieldImpl('100')).not.toEqual(new ControlFieldImpl('100', ''))
  })

}) // describe('Jest expect.toEqual with DataFieldImpl')
