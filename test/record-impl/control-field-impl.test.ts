import { ControlFieldImpl, DataFieldImpl, isAControlFieldImpl } from 'record-impl'



describe ('ControlFieldImpl', () => {

  const TAG = '001'

  const DATA = 'data'

  const FIELD = new ControlFieldImpl(TAG, DATA)


  describe('constructor', () => {

    it('sets the tag and data properties from its arguments', () => {
      expect(FIELD.tag).toEqual(TAG)
      expect(FIELD.data).toEqual(DATA)
    })

  }) // describe('constructor')


  describe('isAControlField', () => {

    it('is true', () => {
      expect(FIELD.isAControlField()).toBe(true)
    })

  }) // describe('isAControlField')


  describe('isADataField', () => {

    it('is false', () => {
      expect(FIELD.isADataField()).toBe(false)
    })

  }) // describe('isADataField')


  describe('matches', () => {

    it('returns true when a given string exactly matches the field tag', () => {
      expect(FIELD.matches('001')).toBeTruthy()
    })

    it('returns false when a given string does not match the field tag', () => {
      expect(FIELD.matches('009')).toBeFalsy()
    })

    it('returns true when a given regexp matches the field tag', () => {
      expect(FIELD.matches(/01/)).toBeTruthy()
    })

    it('returns false when a given regexp does not match the field tag', () => {
      expect(FIELD.matches(/011/)).toBeFalsy()
    })

  }) // describe ('matches')

}) // describe ('ControlFieldImpl')



describe('isAControlFieldImpl', () => {

  it('returns true when given a ControlFieldImpl instance', () => {
    expect(isAControlFieldImpl(new ControlFieldImpl('005', '0987654321'))).toBe(true)
  })

  it('returns false when given a DataFieldImpl instance', () => {
    expect(isAControlFieldImpl(new DataFieldImpl('254'))).toBe(false)
  })

}) // describe('isAControlFieldImpl')



describe('Jest expect.toEqual with ControlFieldImpl', () => {

  it('detects two control fields with the same tag and data as being equal', () => {
    expect(new ControlFieldImpl('001', 'data')).toEqual(new ControlFieldImpl('001', 'data'))
  })

  it('detects two control fields with the same code but difference data as being not equal', () => {
    expect(new ControlFieldImpl('001', 'data')).not.toEqual(new ControlFieldImpl('001', 'blah'))
  })

  it('detects two control fields with the different codes but the same data as being not equal', () => {
    expect(new ControlFieldImpl('001', 'data')).not.toEqual(new ControlFieldImpl('00a', 'data'))
  })

  it('detected a control field as not being equal to a data field', () => {
    expect(new ControlFieldImpl('001', 'data')).not.toEqual(new DataFieldImpl('001'))
  })

  it('detects two arrays of subfields with matching codes and data as being equal', () => {
    let a = [
      new ControlFieldImpl('004', 'data 4'),
      new ControlFieldImpl('008', 'data 8'),
    ]
    let b = [
      new ControlFieldImpl('004', 'data 4'),
      new ControlFieldImpl('008', 'data 8'),
    ]
    expect(a).toEqual(b)
  })

  it('detects two arrays of subfields with matching codes but differing data as being not equal', () => {
    let a = [
      new ControlFieldImpl('004', 'data 4'),
      new ControlFieldImpl('008', 'data 8'),
    ]
    let b = [
      new ControlFieldImpl('004', 'data 4'),
      new ControlFieldImpl('008', 'data #'),
    ]
    expect(a).not.toEqual(b)
  })

  it('detects two arrays of subfields with differing codes but matching data as being not equal', () => {
    let a = [
      new ControlFieldImpl('004', 'data 4'),
      new ControlFieldImpl('008', 'data 8'),
    ]
    let b = [
      new ControlFieldImpl('00a', 'data 4'),
      new ControlFieldImpl('008', 'data 8'),
    ]
    expect(a).not.toEqual(b)
  })

}) // describe('Jest expect.toEqual with ControlFieldImpl'
