import { DropdownOption } from 'tdesign-vue-next';
import { computed } from 'vue';
import { createI18n } from 'vue-i18n';

// 导入语言文件
const localeModules = import.meta.glob('./lang/*.ts', { eager: true });

const localeModuleMap = new Map<string, () => Promise<any>>();
// 获取浏览器默认语言环境
const browserLanguage = navigator.language;
export const DefaultLocale = 'zh-CN';
export const LocaleCodes: Array<string> = [];

const currentLocale = localStorage.getItem('locale') || browserLanguage || DefaultLocale;

// 生成语言模块列表
const generateLocaleModuleMap = () => {
  const fullPaths = Object.keys(localeModules);
  fullPaths.forEach((fullPath) => {
    const k = fullPath.replace('./lang', '');
    const startIndex = 1;
    const lastIndex = k.lastIndexOf('.');
    const code = k.substring(startIndex, lastIndex);
    LocaleCodes.push(code);
    localeModuleMap.set(code, localeModules[fullPath] as any);
  });
};

// 导出Message
const importMessages = computed(() => {
  generateLocaleModuleMap();

  const message: any = {};
  localeModuleMap.forEach((value: any, key) => {
    message[key] = value.default;
  });
  return message;
});

export const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: currentLocale,
  fallbackLocale: DefaultLocale,
  messages: importMessages.value,
});
export const localeList = computed(() => {
  if (localeModuleMap.size === 0) generateLocaleModuleMap();

  const list: DropdownOption[] = [];
  localeModuleMap.forEach((value: any, key) => {
    list.push({
      content: value.default.lang,
      value: key,
    });
  });

  return list;
});
export default i18n;
