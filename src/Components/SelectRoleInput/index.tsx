import { Loader } from "@/Components/Loader";
import { useRoles } from "@/Hooks/Roles";
import { Select, SelectProps } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import debounce from "lodash/debounce";
import React, { useMemo, useState } from "react";

const SelectRoles: React.FC<SelectProps> = (props) => {
  const [rolesSearch, setRolesSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { data: userResponse, isLoading: isRolesLoading } = useRoles({
    search:
      rolesSearch ||
      (selectedRoles.length ? JSON.stringify(selectedRoles) : null),
  });

  const allRoles = useMemo(() => {
    const roles = userResponse?.data || [];
    const output = (props.value || []).filter(
      (num: string) => !roles.some((obj) => obj.id === num)
    );
    if (output.length) {
      setSelectedRoles(output);
    }
    return roles.map(({ name, _id }) => ({ label: name, value: _id }));
  }, [userResponse]);

  const handleRolesSearch = debounce((searchedRole: string) => {
    setRolesSearch(searchedRole);
  }, 1000);

  const handleRolesChange = (
    searchedRole: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setRolesSearch(searchedRole);
    props.onChange?.(searchedRole, option);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select role"
      size="large"
      options={allRoles}
      onSearch={handleRolesSearch}
      onChange={handleRolesChange}
      loading={isRolesLoading}
      showSearch
      filterOption={false}
      defaultActiveFirstOption={false}
      notFoundContent={
        isRolesLoading ? <Loader isLoading={isRolesLoading} /> : null
      }
      {...props}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
    />
  );
};

export default SelectRoles;
