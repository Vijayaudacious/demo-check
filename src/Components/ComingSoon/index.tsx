import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <Result
      icon={<SmileOutlined />}
      title="Coming Soon! We're launching a setting module that will empower you to edit notifications."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Next
        </Button>
      }
    />
  );
};

export default ComingSoon;
