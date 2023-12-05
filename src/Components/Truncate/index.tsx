import { Tooltip } from "antd";
import truncate from "lodash/truncate";
import React from "react";

type TruncateProps = {
  text: string;
  length?: number;
};
const Truncate: React.FC<TruncateProps> = ({ text, length = 20 }) => {
  return <Tooltip title={text}>{truncate(text, { length })}</Tooltip>;
};

export default Truncate;
