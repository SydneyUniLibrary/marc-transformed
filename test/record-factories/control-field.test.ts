import { IControlFieldValue } from 'record-api'
import { ControlField } from 'record-factories'
import { ControlFieldImpl } from 'record-impl'



describe('ControlField', () => {

  describe('from', () => {

    it('deeply clones a given ControlFieldImpl', () => {
      let f1 = new ControlFieldImpl('003', 'qwerty')
      let f2 = ControlField.from(f1)
      expect(f2).not.toBe(f1)
      expect(f2).toEqual(f1)
    })

    it('constructs a ControlFieldImpl from a IControlFieldValue', () => {
      let v: IControlFieldValue = { tag: '003', data: 'qwerty' }
      let f = ControlField.from(v)
      expect(f).toEqual(v)
    })

    it('constructs a ControlFieldImpl from a tag and data', () => {
      let v: IControlFieldValue = { tag: '003', data: 'qwerty' }
      let f = ControlField.from(v.tag, v.data)
      expect(f).toEqual(v)
    })

  }) // describe('from')

}) // describe('ControlField')
