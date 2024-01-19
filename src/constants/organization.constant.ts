import { t } from '@/locales';

export const OrganizationType = {
  Admin: 1,
  School: 2,
  Company: 3,
}

export const OrganizationCategory = {
  // 幼儿园
  Kindergarten: {
    value: 1,
    label: t('pages.school.categoryMap.kindergarten'),
  },
  // 小学
  PrimarySchool: {
    value: 2,
    label: t('pages.school.categoryMap.primarySchool'),
  },
  // 初级中学
  JuniorMiddleSchool: {
    value: 3,
    label: t('pages.school.categoryMap.juniorMiddleSchool'),
  },
  // 九年一贯制学校
  NineYearCombinedSchool: {
    value: 4,
    label: t('pages.school.categoryMap.nineYearCombinedSchool'),
  },
  // 职业初中
  VocationalJuniorMiddleSchool: {
    value: 5,
    label: t('pages.school.categoryMap.vocationalJuniorMiddleSchool'),
  },
  // 完全中学
  FullMiddleSchool: {
    value: 6,
    label: t('pages.school.categoryMap.fullMiddleSchool'),
  },
  // 高级中学
  SeniorMiddleSchool: {
    value: 7,
    label: t('pages.school.categoryMap.seniorMiddleSchool'),
  },
  // 十二年一贯制学校
  TwelveYearCombinedSchool: {
    value: 8,
    label: t('pages.school.categoryMap.twelveYearCombinedSchool'),
  },
  // 职业高中学校
  VocationalHighSchool: {
    value: 9,
    label: t('pages.school.categoryMap.vocationalHighSchool'),
  },
  // 盲人学校
  BlindSchool: {
    value: 10,
    label: t('pages.school.categoryMap.blindSchool'),
  },
  // 聋人学校
  DeafSchool: {
    value: 11,
    label: t('pages.school.categoryMap.deafSchool'),
  },
  // 其他特殊教育学校
  SpecialEducationSchool: {
    value: 12,
    label: t('pages.school.categoryMap.specialEducationSchool'),
  },
  // 学校大类
  School: {
    value: 100,
    label: t('pages.school.categoryMap.school'),
  },
  // 保安公司
  SecurityCompany: {
    value: 200,
    label: t('pages.school.categoryMap.securityCompany'),
  },
  // 虚拟组织
  VirtualOrganization: {
    value: 300,
    label: t('pages.school.categoryMap.virtualOrganization'),
  },
}

export const SchoolCategoryTreeData = [
  OrganizationCategory.VirtualOrganization,
  {
    ...OrganizationCategory.School,
    children: [
      OrganizationCategory.Kindergarten,
      OrganizationCategory.PrimarySchool,
      OrganizationCategory.JuniorMiddleSchool,
      OrganizationCategory.NineYearCombinedSchool,
      OrganizationCategory.VocationalJuniorMiddleSchool,
      OrganizationCategory.FullMiddleSchool,
      OrganizationCategory.SeniorMiddleSchool,
      OrganizationCategory.TwelveYearCombinedSchool,
      OrganizationCategory.VocationalHighSchool,
      OrganizationCategory.BlindSchool,
      OrganizationCategory.DeafSchool,
      OrganizationCategory.SpecialEducationSchool,
    ]
  }
]
