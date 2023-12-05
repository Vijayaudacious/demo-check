import { Loader } from "@/Components/Loader";
import { useCategories, useCategory } from "@/Hooks/categories";
import { Select, SelectProps } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import debounce from "lodash/debounce";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";

const SelectCategory: React.FC<SelectProps> = ({ ...props }) => {
  const { formatMessage } = useIntl();
  const [categorySearch, setCategorySearch] = useState("");

  const { data: categoryResponse, isLoading: isCategoryLoading } =
    useCategories({
      search: categorySearch,
    });

  const { data: categoryData } = useCategory(props.value);

  const handleCategorySearch = debounce((categorySearch: string) => {
    setCategorySearch(categorySearch);
  }, 500);

  const handleCategoryChange = (
    categorySearch: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setCategorySearch(categorySearch);
    props.onChange?.(categorySearch, option);
  };

  const allCategories = useMemo(() => {
    const category = categoryData?.data;

    const categories = categoryResponse?.data || [];

    if (category && !categories.find(({ _id }) => _id === category._id)) {
      categories.push(category);
    }

    return categories.map(({ name, _id }) => ({ label: name, value: _id }));
  }, [categoryResponse, categoryData]);

  return (
    <Select
      placeholder={formatMessage({
        id: "incomesExpenses.selectCategory.placeholder",
      })}
      size="large"
      options={allCategories}
      onSearch={handleCategorySearch}
      onChange={handleCategoryChange}
      loading={isCategoryLoading}
      showSearch
      allowClear
      filterOption={false}
      defaultActiveFirstOption={false}
      notFoundContent={
        isCategoryLoading ? <Loader isLoading={isCategoryLoading} /> : null
      }
      {...props}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      placement="bottomLeft"
      listHeight={200}
    />
  );
};

export default SelectCategory;
