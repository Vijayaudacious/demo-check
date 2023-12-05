import { useIntl } from "react-intl";

export const numberToWords = (num: number, suffix?: string) => {
  const { formatMessage } = useIntl();
  const units = [
    "",
    formatMessage({ id: "number.one" }),
    formatMessage({ id: "number.two" }),
    formatMessage({ id: "number.three" }),
    formatMessage({ id: "number.four" }),
    formatMessage({ id: "number.five" }),
    formatMessage({ id: "number.six" }),
    formatMessage({ id: "number.seven" }),
    formatMessage({ id: "number.eight" }),
    formatMessage({ id: "number.nine" }),
  ];
  const teens = [
    "",
    formatMessage({ id: "number.eleven" }),
    formatMessage({ id: "number.twelve" }),
    formatMessage({ id: "number.thirteen" }),
    formatMessage({ id: "number.fourteen" }),
    formatMessage({ id: "number.fifteen" }),
    formatMessage({ id: "number.sixteen" }),
    formatMessage({ id: "number.seventeen" }),
    formatMessage({ id: "number.eighteen" }),
    formatMessage({ id: "number.nineteen" }),
  ];
  const tens = [
    "",
    formatMessage({ id: "number.ten" }),
    formatMessage({ id: "number.twenty" }),
    formatMessage({ id: "number.thirty" }),
    formatMessage({ id: "number.forty" }),
    formatMessage({ id: "number.fifty" }),
    formatMessage({ id: "number.sixty" }),
    formatMessage({ id: "number.seventy" }),
    formatMessage({ id: "number.eighty" }),
    formatMessage({ id: "number.ninety" }),
  ];

  const convertThreeDigits = (num: number) => {
    if (num === 0) {
      return "";
    } else if (num < 10) {
      return units[num];
    } else if (num < 20) {
      return teens[num - 10];
    } else {
      const digit1 = Math.floor(num / 100);
      const digit2 = Math.floor((num % 100) / 10);
      const digit3 = num % 10;
      let result = "";
      if (digit1 > 0) {
        result += units[digit1] + formatMessage({ id: "number.hundred" });
      }
      if (digit2 > 0) {
        result += tens[digit2] + " ";
      }
      if (digit3 > 0) {
        result += units[digit3];
      }
      return result;
    }
  };

  if (num === 0) {
    return formatMessage({ id: "number.zero" });
  } else {
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;
    let result = "";
    if (billion > 0) {
      result +=
        convertThreeDigits(billion) + formatMessage({ id: "number.billion" });
    }
    if (million > 0) {
      result +=
        convertThreeDigits(million) + formatMessage({ id: "number.million" });
    }
    if (thousand > 0) {
      result +=
        convertThreeDigits(thousand) + formatMessage({ id: "number.thousand" });
    }
    if (remainder > 0) {
      result += convertThreeDigits(remainder);
    }
    return `${result.trim()} ${suffix || ""}`;
  }
};
