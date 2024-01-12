import { App } from 'vue'

export default function registerProperties(app: App) {
  const { $t } = app.config.globalProperties;
  app.config.globalProperties.$rules = {
    inputRules(field: string, required = true) {
      return [
        {
          required,
          message: $t('pages.form.requiredText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
        {
          whitespace: true,
          message: $t('pages.form.whitespaceText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
      ];
    },
    selectRules(field: string, required = true) {
      return [
        {
          required,
          message: $t('pages.form.selectPlaceholder', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
      ];
    },
    inputNumberRules(field: string, required = true) {
      return [
        {
          required,
          message: $t('pages.form.requiredText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
        {
          number: true,
          message: $t('pages.form.errorText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
      ]
    },
    idCardInputRules(field: string, required = true) {
      return [
        {
          required,
          message: $t('pages.form.requiredText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
        {
          whitespace: true,
          message: $t('pages.form.whitespaceText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
        {
          idcard: true,
          message: $t('pages.form.errorText', { field: $t(field) }),
          type: 'error',
          trigger: 'change',
        },
      ];
    }
  }
}
