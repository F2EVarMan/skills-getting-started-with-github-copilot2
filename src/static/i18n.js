// 国际化配置文件
const translations = {
  en: {
    // Header
    schoolName: "Mergington High School",
    pageTitle: "Extracurricular Activities",
    
    // Activities section
    availableActivities: "Available Activities",
    loadingActivities: "Loading activities...",
    failedToLoad: "Failed to load activities. Please try again later.",
    schedule: "Schedule",
    availability: "Availability",
    spotsLeft: "spots left",
    
    // Activities data
    activities: {
      "Chess Club": {
        name: "Chess Club",
        description: "Learn strategies and compete in chess tournaments"
      },
      "Programming Class": {
        name: "Programming Class", 
        description: "Learn programming fundamentals and build software projects"
      },
      "Gym Class": {
        name: "Gym Class",
        description: "Physical education and sports activities"
      }
    },
    
    // Signup form
    signUpTitle: "Sign Up for an Activity",
    studentEmail: "Student Email:",
    emailPlaceholder: "your-email@mergington.edu",
    selectActivity: "Select Activity:",
    selectActivityOption: "-- Select an activity --",
    signUpButton: "Sign Up",
    
    // Messages
    signUpSuccess: "Successfully signed up!",
    signUpFailed: "Failed to sign up. Please try again.",
    studentAlreadySignedUp: "Student already signed up",
    activityNotFound: "Activity not found",
    
    // Footer
    copyright: "© 2023 Mergington High School",
    
    // Language switch
    language: "Language",
    switchToEnglish: "English",
    switchToChinese: "中文"
  },
  
  zh: {
    // Header
    schoolName: "默里顿高中",
    pageTitle: "课外活动",
    
    // Activities section
    availableActivities: "可参加活动",
    loadingActivities: "正在加载活动...",
    failedToLoad: "加载活动失败，请稍后再试。",
    schedule: "时间安排",
    availability: "可用名额",
    spotsLeft: "个名额剩余",
    
    // Activities data
    activities: {
      "Chess Club": {
        name: "象棋俱乐部",
        description: "学习象棋策略并参加象棋比赛"
      },
      "Programming Class": {
        name: "编程课程",
        description: "学习编程基础知识并开发软件项目"
      },
      "Gym Class": {
        name: "体育课",
        description: "体育教育和运动活动"
      }
    },
    
    // Signup form
    signUpTitle: "报名参加活动",
    studentEmail: "学生邮箱：",
    emailPlaceholder: "your-email@mergington.edu",
    selectActivity: "选择活动：",
    selectActivityOption: "-- 请选择活动 --",
    signUpButton: "报名",
    
    // Messages
    signUpSuccess: "报名成功！",
    signUpFailed: "报名失败，请重试。",
    studentAlreadySignedUp: "学生已经报名",
    activityNotFound: "未找到活动",
    
    // Footer
    copyright: "© 2023 默里顿高中",
    
    // Language switch
    language: "语言",
    switchToEnglish: "English",
    switchToChinese: "中文"
  }
};

// 当前语言
let currentLanguage = localStorage.getItem('language') || 'en';

// 获取翻译文本
function t(key, language = currentLanguage) {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // 如果找不到翻译，返回原始key
    }
  }
  
  return value || key;
}

// 切换语言
function switchLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('language', language);
  updatePageLanguage();
}

// 更新页面语言
function updatePageLanguage() {
  // 更新HTML lang属性
  document.documentElement.lang = currentLanguage;
  
  // 更新页面标题
  document.title = t('schoolName') + ' - ' + t('pageTitle');
  
  // 更新静态文本内容
  updateStaticContent();
  
  // 重新获取并显示活动数据（如果fetchActivities已经定义）
  if (typeof window.fetchActivities === 'function') {
    window.fetchActivities();
  }
  
  // 更新语言切换按钮状态
  updateLanguageButtons();
}

// 更新静态内容
function updateStaticContent() {
  // Header
  const schoolNameEl = document.querySelector('header h1');
  const pageTitleEl = document.querySelector('header h2');
  if (schoolNameEl) schoolNameEl.textContent = t('schoolName');
  if (pageTitleEl) pageTitleEl.textContent = t('pageTitle');
  
  // Activities section
  const availableActivitiesEl = document.querySelector('#activities-container h3');
  if (availableActivitiesEl) availableActivitiesEl.textContent = t('availableActivities');
  
  // Signup form
  const signUpTitleEl = document.querySelector('#signup-container h3');
  if (signUpTitleEl) signUpTitleEl.textContent = t('signUpTitle');
  
  const emailLabelEl = document.querySelector('label[for="email"]');
  if (emailLabelEl) emailLabelEl.textContent = t('studentEmail');
  
  const emailInputEl = document.getElementById('email');
  if (emailInputEl) emailInputEl.placeholder = t('emailPlaceholder');
  
  const activityLabelEl = document.querySelector('label[for="activity"]');
  if (activityLabelEl) activityLabelEl.textContent = t('selectActivity');
  
  const signUpButtonEl = document.querySelector('button[type="submit"]');
  if (signUpButtonEl) signUpButtonEl.textContent = t('signUpButton');
  
  // Footer
  const copyrightEl = document.querySelector('footer p');
  if (copyrightEl) copyrightEl.textContent = t('copyright');
  
  // 更新选择框的默认选项
  const defaultOption = document.querySelector('#activity option[value=""]');
  if (defaultOption) defaultOption.textContent = t('selectActivityOption');
}

// 更新语言切换按钮状态
function updateLanguageButtons() {
  const buttons = document.querySelectorAll('.language-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    }
  });
}

// 初始化语言设置
function initializeLanguage() {
  updatePageLanguage();
}