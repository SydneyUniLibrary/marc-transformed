import { SubfieldImpl } from 'record-impl'



describe('SubfieldImpl', () => {

  const CODE = 'a'

  const DATA = 'data'

  const SUBFIELD = new SubfieldImpl(CODE, DATA)


  describe('constructor', () => {

    it('sets the code and data properties from its arguments', () => {
      expect(SUBFIELD.code).toEqual('a')
      expect(SUBFIELD.data).toEqual('data')
    })

  }) // describe('constructor')


  describe('matches', () => {

    it('returns true when a given string exactly matches the subfield code', () => {
      expect(SUBFIELD.matches('a')).toBeTruthy()
    })

    it('returns false when a given string does not match the subfield code', () => {
      expect(SUBFIELD.matches('b')).toBeFalsy()
    })

    it('returns true when a given regexp matches the subfield code', () => {
      expect(SUBFIELD.matches(/^[abcd]$/)).toBeTruthy()
    })

    it('returns false when a given regexp does not match the subfield code', () => {
      expect(SUBFIELD.matches(/^\d$/)).toBeFalsy()
    })

  }) // describe('matches')

}) // describe('SubfieldImpl')



describe('Jest expect.toEqual with SubfieldImpl', () => {

  it('detects two subfields with the same code and data as being equal', () => {
    expect(new SubfieldImpl('a', 'data')).toEqual(new SubfieldImpl('a', 'data'))
  })

  it('detects two subfields with the same code but difference data as being not equal', () => {
    expect(new SubfieldImpl('a', 'data')).not.toEqual(new SubfieldImpl('a', 'blah'))
  })

  it('detects two subfields with the different codes but the same data as being not equal', () => {
    expect(new SubfieldImpl('a', 'data')).not.toEqual(new SubfieldImpl('z', 'data'))
  })

  it('detects two arrays of subfields with matching codes and data as being equal', () => {
    let a = [
      new SubfieldImpl('r', 'data r'),
      new SubfieldImpl('e', 'data e'),
    ]
    let b = [
      new SubfieldImpl('r', 'data r'),
      new SubfieldImpl('e', 'data e'),
    ]
    expect(a).toEqual(b)
  })

  it('detects two arrays of subfields with matching codes but differing data as being not equal', () => {
    let a = [
      new SubfieldImpl('r', 'data r'),
      new SubfieldImpl('e', 'data e'),
    ]
    let b = [
      new SubfieldImpl('r', 'data r'),
      new SubfieldImpl('e', 'data #'),
    ]
    expect(a).not.toEqual(b)
  })

  it('detects two arrays of subfields with differing codes but matching data as being not equal', () => {
    let a = [
      new SubfieldImpl('r', 'data r'),
      new SubfieldImpl('e', 'data e'),
    ]
    let b = [
      new SubfieldImpl('!', 'data r'),
      new SubfieldImpl('e', 'data e'),
    ]
    expect(a).not.toEqual(b)
  })

}) // describe('Jest expect.toEqual with SubfieldImpl')
