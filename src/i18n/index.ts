import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locale/en.json';
import ru from './locale/ru.json';
import kr from './locale/kr.json';
import vi from './locale/vi.json';
import uz from './locale/uz.json';
i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    uz: { translation: uz },
    en: { translation: en },
    ru: { translation: ru },
    kr: { translation: kr },
  },
  lng: 'ru',
  fallbackLng: 'ru',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
