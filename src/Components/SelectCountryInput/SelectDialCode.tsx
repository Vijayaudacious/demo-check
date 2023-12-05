import { Select, SelectProps } from "antd";
import CountryList from "country-list-with-dial-code-and-flag";
import { debounce } from "lodash";
import React, { useState } from "react";
const { Option } = Select;

const allCountries = CountryList.getAll();
const initialDialCodes = allCountries.map((data) => {
  return {
    label: `${data.dial_code}`,
    value: data.dial_code,
  };
});

const SelectDialCode: React.FC<SelectProps> = (props) => {
  const [options, setOptions] = useState(initialDialCodes);

  const getDialCodes = (dialCode: string) => {
    const filteredDialCode = CountryList.findByDialCode(dialCode);
    return filteredDialCode.map((data) => ({
      label: `${data.dial_code}`,
      value: data.dial_code,
    }));
  };

  const handleCountrySearch = debounce((searchedDialCode: string) => {
    setOptions(
      searchedDialCode.length
        ? getDialCodes(searchedDialCode)
        : initialDialCodes
    );
  }, 1000);

  return (
    <Select
      style={{ width: 70 }}
      onSearch={handleCountrySearch}
      size="large"
      options={options}
      showSearch
      filterOption={false}
      defaultActiveFirstOption={false}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      {...props}
    >
      {options.map((data, index) => {
        return (
          <Option value={data.value} key={index}>
            {data.label}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectDialCode;
