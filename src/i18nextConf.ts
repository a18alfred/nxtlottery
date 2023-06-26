import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './assets/locales/en/translation.json';
import translationRU from './assets/locales/ru/translation.json';

export const enum Language {
	EN = 'en',
	RU = 'ru',
};

export type LocaleType = {
	key: string
	label: string
}

const fallbackLng = [Language.EN];
const availableLanguages = [Language.EN, Language.RU];


const resources = {
	en: {
		translation: translationEN
	},
	ru: {
		translation: translationRU
	}
};

export const SUPPORTED_LOCALES: LocaleType[] = [
	{
		key: Language.EN,
		label: 'English'
	},
	{
		key: Language.RU,
		label: 'Русский'
	}
];

const options = {
	order: ['localStorage', 'sessionStorage', 'navigator']
};

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng,

		detection: options,
		supportedLngs: availableLanguages,
		interpolation: {
			escapeValue: false
		},
		debug: false
	});

export default i18n;


