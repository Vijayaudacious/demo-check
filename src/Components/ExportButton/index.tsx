import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";

interface ExportButtonProps extends ButtonProps {
  data: object[];
  filename?: string;
  headers?: string[];
}

const ExportButton: React.FC<React.PropsWithChildren<ExportButtonProps>> = ({
  children,
  data,
  filename = "sheet",
  headers,
  ...props
}) => {
  const generateHeaders = (data: object[]): string[] => {
    if (!headers) {
      const sampleData = data[0];
      if (!sampleData) {
        return [];
      }
      return Object.keys(sampleData);
    }
    return headers;
  };

  const handleDownload = () => {
    const generatedHeaders = generateHeaders(data);

    const csvContent = [
      generatedHeaders.join(","),
      ...data.map((row: any) =>
        generatedHeaders.map((header) => row[header]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} {...props}>
      {children}
    </Button>
  );
};

export default ExportButton;
