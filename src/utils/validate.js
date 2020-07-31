import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";
import zhCN from "vee-validate/dist/locale/zh_CN";
import en from "vee-validate/dist/locale/en";

import { attributesCh, attributesEn } from "common/js/validateRule";

Vue.use(VeeValidate);

Validator.localize("zh_CN", {
  messages: zhCN.messages,
  attributes: attributesCh,
});
Validator.localize("en", {
  messages: en.messages,
  attributes: attributesEn,
});

export function setMessage(validName, errMsgZh, errMsgEn, validate) {
  Validator.locale = "en";
  Validator.extend(validName, {
    getMessage: (field, [args]) => {
      return errMsgEn;
    },
    validate: validate,
  });
  Validator.locale = "zh_CN";
  Validator.extend(validName, {
    getMessage: (field, [args]) => {
      return errMsgZh;
    },
    validate: validate,
  });
}
