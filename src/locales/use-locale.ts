import tr_TR from "antd/locale/tr_TR";
import en_US from "antd/locale/en_US";
import de_DE from "antd/locale/de_DE";
import { useTranslation } from "react-i18next";

import type { Locale as AntdLocal } from "antd/es/locale";
import { LocalEnum } from "#/enum";

type Locale = keyof typeof LocalEnum;
type Language = {
	locale: keyof typeof LocalEnum;
	icon: string;
	label: string;
	antdLocal: AntdLocal;
};

export const LANGUAGE_MAP: Record<Locale, Language> = {
	[LocalEnum.tr_TR]: {
		locale: LocalEnum.tr_TR,
		label: "Türkçe",
		icon: "ic-locale_tr_TR",
		antdLocal: tr_TR,
	},
	[LocalEnum.en_US]: {
		locale: LocalEnum.en_US,
		label: "English",
		icon: "ic-locale_en_US",
		antdLocal: en_US,
	},
	[LocalEnum.de_DE]: {
		locale: LocalEnum.de_DE,
		label: "Deutsch",
		icon: "ic-locale_de_DE",
		antdLocal: de_DE,
	},
};

export default function useLocale() {
	const { i18n } = useTranslation();

	/**
	 * localstorage -> i18nextLng change
	 */
	const setLocale = (locale: Locale) => {
		i18n.changeLanguage(locale);
	};

	const locale = (i18n.resolvedLanguage || LocalEnum.tr_TR) as Locale;

	const language = LANGUAGE_MAP[locale];

	return {
		locale,
		language,
		setLocale,
	};
}
