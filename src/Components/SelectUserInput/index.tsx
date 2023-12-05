import { Loader } from "@/Components/Loader";
import { useUser, useUsers } from "@/Hooks/emloyee";
import { Select, SelectProps } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import debounce from "lodash/debounce";
import React, { useMemo, useState } from "react";

const SelectUser: React.FC<SelectProps> = ({ ...props }) => {
  const [managerSearch, setManagerSearch] = useState("");

  const { data: userResponse, isLoading: isUserLoading } = useUsers({
    search: managerSearch,
  });

  const { data: userData } = useUser(props.value);

  const handleManagerSearch = debounce((searchedManager: string) => {
    setManagerSearch(searchedManager);
  }, 500);

  const handleManagerChange = (
    searchedManager: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setManagerSearch(searchedManager);
    props.onChange?.(searchedManager, option);
  };

  const allUsers = useMemo(() => {
    const user = userData?.data?.data;

    const users = userResponse?.data || [];

    if (user && !users.find(({ _id }) => _id === user._id)) {
      users.push(user);
    }

    return users.map(({ name, _id }) => ({ label: name, value: _id }));
  }, [userResponse, userData]);

  return (
    <Select
      placeholder="Select manager"
      size="large"
      options={allUsers}
      onSearch={handleManagerSearch}
      onChange={handleManagerChange}
      loading={isUserLoading}
      showSearch
      allowClear
      filterOption={false}
      defaultActiveFirstOption={false}
      notFoundContent={
        isUserLoading ? <Loader isLoading={isUserLoading} /> : null
      }
      {...props}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      placement="bottomLeft"
      listHeight={200}
    />
  );
};

export default SelectUser;
