import "@fullcalendar/react/dist/vdom";
import "antd/dist/antd.less";
import "./App.less";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import relativeTime from "dayjs/plugin/relativeTime";
import { createContext, useState } from "react";
import LanguageProvider from "./Languages/Provider";
import { SUPPORTED_LAGUAGES } from "./Languages/constants";
import Routing from "./Routes";

dayjs.extend(AdvancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(quarterOfYear);
dayjs.locale("en");

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

Spin.setDefaultIndicator(antIcon);

export const SelectLanguageContext = createContext({
  getLanguage: (language: string) => {},
  showTrialDay: false,
  getShowTrialBoolean: (isShow: boolean) => {},
});

const App = () => {
  const [locale, setLocale] = useState(
    localStorage.getItem("language") || SUPPORTED_LAGUAGES.ENGLISH
  );
  const [showTrialDay, setShowTrialDay] = useState(false);

  const getLanguage = (language: string) => {
    setLocale(language);
  };
  const getShowTrialBoolean = (isShow: boolean) => {
    setShowTrialDay(isShow);
  };

  return (
    <LanguageProvider locale={locale}>
      <SelectLanguageContext.Provider
        value={{
          getLanguage,
          showTrialDay,
          getShowTrialBoolean,
        }}
      >
        <Routing />
      </SelectLanguageContext.Provider>
    </LanguageProvider>
  );
};
export default App;
