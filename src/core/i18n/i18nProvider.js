// https://github.com/marmelab/react-admin/blob/master/docs/Translation.md

import polyglotI18nProvider from 'ra-i18n-polyglot';
import farsiMessages from './faAdmin';
import fa from './fa';
import englishMessages from './enAdmin';
import en from './en';
import arMessages from './arAdmin';
import ar from './ar';
import { getValue, CONFIG_LOCALE } from '../configProvider';

const messages = {
  fa: {
    ...farsiMessages,
    ...fa,
  },
  en: {
    ...englishMessages,
    ...en,
  },
  ar: {
    ...arMessages,
    ...ar,
  },
};

export default polyglotI18nProvider(
  locale => messages[locale],
  getValue(CONFIG_LOCALE), // default locale
);
