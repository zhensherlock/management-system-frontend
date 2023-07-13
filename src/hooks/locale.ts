import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { DefaultLocale, i18n, LocaleCodes, localeList } from '@/locales';

export function useLocale() {
  const { locale } = useI18n({ useScope: 'global' });
  const currentLocale = computed(() => {
    return locale.value;
  });
  const changeLocale = (value: string) => {
    if (locale.value === value) {
      return;
    }
    // 如果切换的语言不在对应语言文件里则默认为简体中文
    if (!LocaleCodes.includes(value)) {
      value = DefaultLocale;
    }
    locale.value = value;
    localStorage.setItem('locale', value);
    // Message.success(i18.t('navbar.action.locale'));
  };
  const tDesignGlobalConfig = computed(() => {
    return (i18n.global.getLocaleMessage(<string>locale.value) as any).tDesign;
  });
  return {
    localeList,
    currentLocale,
    changeLocale,
    tDesignGlobalConfig,
  };
}
