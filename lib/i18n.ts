import i18n from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import Backend from 'i18next-http-backend'; // Use http-backend for loading translations
import LanguageDetector from 'i18next-browser-languagedetector'; // Optional: for client-side language detection if needed

i18n
  // Load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // Learn more: https://github.com/i18next/i18next-http-backend
  // Want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // For all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable debug output in development
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    // Default namespace
    ns: ['common'],
    defaultNS: 'common',
    // Backend options for loading translations from /public/locales
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // React-i18next options
    react: {
      useSuspense: false, // Set to false if you don't want to use Suspense
    },
  });

export default i18n;