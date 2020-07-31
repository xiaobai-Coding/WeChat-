import {
  setMessage
} from './validate.js'
import {
  idCardNoUtil
} from 'common/js/validateExternal'

setMessage('phoneNum', '手机号不正确', 'phoneNum error', (value, [args]) => {
  const reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
  return reg.test(value)
})
setMessage('personName', '姓名只能包括中文字或英文字母', 'username no yes', (value, [args]) => {
  const reg = /^([\u4e00-\u9fa5\s]|[a-zA-Z])*$/
  return reg.test(value)
})
// 别名中文
export const attributesCh = {
  relation: '关系',
  relationDesc: '关系描述'

}
// 别名英文
export const attributesEn = {
  phoneNum: 'phoneNum',
  userName: 'name',
  idCard: 'idCard'

}
