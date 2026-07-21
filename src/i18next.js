import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import tel from './locales/tel.json';
import tr from './locales/tr.json';
import kn from './locales/kn.json';
import nl from './locales/nl.json';
import or from './locales/or.json';
import vihangaEn from './locales/vihanga-en.json';
import vihangaTel from './locales/vihanga-tel.json';
import vihangaTr from './locales/vihanga-tr.json';
import vihangaKn from './locales/vihanga-kn.json';
import vihangaNl from './locales/vihanga-nl.json';
import vihangaHi from './locales/vihanga-hi.json';
import vihangaAr from './locales/vihanga-ar.json';
import vihangaEs from './locales/vihanga-es.json';
import vihangaOr from './locales/vihanga-or.json';
// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

/** Shallow merge loses nested keys when both files define KeyResultForm; merge FormLabels deeply. */
function mergeBaseWithVihanga(base, vihanga) {
  const merged = { ...base, ...vihanga };
  if (base.KeyResultForm || vihanga.KeyResultForm) {
    merged.KeyResultForm = {
      ...vihanga.KeyResultForm,
      ...base.KeyResultForm,
      FormLabels: {
        ...vihanga.KeyResultForm?.FormLabels,
        ...base.KeyResultForm?.FormLabels,
      },
    };
  }
  return merged;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: mergeBaseWithVihanga(en, vihangaEn) },
      hi: { translation: mergeBaseWithVihanga(hi, vihangaHi) },
      es: { translation: mergeBaseWithVihanga(es, vihangaEs) },
      ar: { translation: mergeBaseWithVihanga(ar, vihangaAr) },
      tel: { translation: mergeBaseWithVihanga(tel, vihangaTel) },
      tr: { translation: mergeBaseWithVihanga(tr, vihangaTr) },
      kn: { translation: mergeBaseWithVihanga(kn, vihangaKn) },
      nl: { translation: mergeBaseWithVihanga(nl, vihangaNl) },
      or: { translation: mergeBaseWithVihanga(or, vihangaOr) },
    },
    lng: savedLanguage, // Use saved language or default to 'en'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
