import { Select, SelectProps } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import CountryList from "country-list-with-dial-code-and-flag";
import { debounce } from "lodash";
import React, { useState } from "react";
import { Loader } from "../Loader";

const SelectCountry: React.FC<SelectProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const allCountries = CountryList.getAll();
  const initialCountries = allCountries.map((data) => ({
    label: `${data.flag}  ${data.name}`,
    value: data.name,
  }));

  const [options, setOptions] = useState(initialCountries);

  const getCountries = (countryName: string) => {
    setIsLoading(true);
    const filteredCountries = CountryList.findByKeyword(countryName);
    setIsLoading(false);
    return filteredCountries.map((data) => ({
      label: `${data.flag}  ${data.name}`,
      value: data.name,
    }));
  };

  const handleCountrySearch = debounce((searchedCountry: string) => {
    setOptions(getCountries(searchedCountry));
  }, 1000);

  const handleCountryChange = (
    searchedCountry: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setOptions(getCountries(searchedCountry));
    props.onChange?.(searchedCountry, option);
  };

  return (
    <Select
      placeholder="Select country"
      size="large"
      options={options}
      onSearch={handleCountrySearch}
      onChange={handleCountryChange}
      loading={isLoading}
      showSearch
      filterOption={false}
      defaultActiveFirstOption={false}
      notFoundContent={isLoading ? <Loader isLoading={isLoading} /> : null}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      allowClear
      {...props}
    />
  );
};

export default SelectCountry;
