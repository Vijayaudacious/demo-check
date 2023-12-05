import React, { Fragment } from "react";
import { IntlProvider } from "react-intl";
import flatten from "flat";

import { SUPPORTED_LAGUAGES } from "./constants";
import messages from "./messages";

interface ProviderProps {
  children: React.ReactNode;
  locale: string;
}
const LanguageProvider: React.FC<ProviderProps> = ({
  children,
  locale = SUPPORTED_LAGUAGES.ENGLISH,
}) => (
  <IntlProvider
    textComponent={Fragment}
    locale={locale}
    messages={flatten(messages[locale])}
  >
    {children}
  </IntlProvider>
);
export default LanguageProvider;
