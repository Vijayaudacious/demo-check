import { Role } from "@/Types/Role";
import { titleCase } from "@/Utils/generic";
import { Tag } from "antd";
import React from "react";

interface RoleProps {
  roles: Role[];
}
const ShowRoles: React.FC<RoleProps> = ({ roles }) => {
  return (
    <div>
      {roles.map(({ name, _id }: Role) => (
        <Tag key={_id} color="blue">
          {name ? titleCase(name) : "--"}
        </Tag>
      ))}
    </div>
  );
};

export default ShowRoles;
