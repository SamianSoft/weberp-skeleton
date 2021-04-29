import React from 'react';
import { useLocale } from 'react-admin';

export default HocComponent => props => {
  const locale = useLocale();

  return <HocComponent {...props} locale={locale} />;
};
