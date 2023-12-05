import { Loader } from "@/Components/Loader";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { UploadEmployeesSheet } from "@/Types/Attendance";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, message } from "antd";
import { useState } from "react";
import * as xlsx from "xlsx";
import UploadedSheetTable from "./UploadedSheetTable";
import styles from "./styles.module.less";

const { Dragger } = Upload;

const SheetUpload = () => {
  const [employeeDetails, setEmployeeDetails] = useState<
    UploadEmployeesSheet[]
  >([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [month, setMonth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const props: UploadProps = {
    name: "file",
    accept: ".xlsx,.csv",
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    maxCount: 1,
    onChange: async (info) => {
      setIsLoading(true);
      if (info.file.name.endsWith(".xlsx") || info.file.name.endsWith(".csv")) {
        const file: any = info.file;
        const data = await file.arrayBuffer(file, {
          Headers: false,
        });
        const excelfile = xlsx.read(data);
        const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
        const exceljson = xlsx.utils.sheet_to_csv(excelsheet);
        const filterdData = exceljson.split("\n").map((str) => str.split(","));
        setMonth(filterdData[0]?.at(-3) || "");
        const validator =
          filterdData[1]?.at(0) === "Empcode" &&
          filterdData[1]?.at(6) === "Name" &&
          filterdData[4]?.at(0) === "IN" &&
          filterdData[5]?.at(0) === "OUT" &&
          filterdData[9]?.at(0) === "Status";
        if (validator) {
          let serialNumber = 1;
          const employeeArr = [];
          for (
            let i = 0, j = 0;
            i < filterdData.length, j < filterdData.length;
            i++, j++
          ) {
            const countName = i * 10 + 1;
            const employeeRow = filterdData[countName];
            const attendanceRow = filterdData[countName + 8]?.splice(1);
            const inTimeRow = filterdData[countName + 3]?.splice(1);
            const outTimeRow = filterdData[countName + 4]?.splice(1);

            if (employeeRow && employeeRow !== undefined && employeeRow[0]) {
              employeeArr.push({
                serialNumber,
                ["id"]: employeeRow[2],
                ["attendance"]: attendanceRow,
                ["inTime"]: inTimeRow,
                ["outTime"]: outTimeRow,
                ["employeeName"]: employeeRow[8],
                ["employeecode"]: employeeRow[2],
                ["present"]: employeeRow[17],
                ["apsent"]: employeeRow[22],
                ["totalWork"]: employeeRow[26],
              });
              serialNumber++;
            } else {
              break;
            }
          }
          setEmployeeDetails(employeeArr);
        } else {
          message.error("File data mismatched");
        }
      } else {
        message.error("Only .xlsx and .csv format acceptable");
      }
      setFileList([]);
      setIsLoading(false);
    },
  };
  return (
    <PageLayoutWrapper
      breadcurmbs={[
        { breadcrumbName: "Attendance", path: "/attendance" },
        { breadcrumbName: "Upload", path: "/attendance/upload" },
      ]}
    >
      {isLoading && <Loader isLoading centered />}
      {employeeDetails.length && !isLoading ? (
        <UploadedSheetTable
          sheetData={employeeDetails}
          handleReset={() => setEmployeeDetails([])}
          selectedMonth={month}
        />
      ) : (
        <>
          <div className={styles.uploadSheetContainer}>
            <div className={styles.dragger}>
              <Dragger {...props} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <PlusOutlined className={styles.plusIcon} />
                </p>
              </Dragger>
            </div>
          </div>
          <h3 className="text-center">
            Please select and upload the Excel or CSV file <br />
            otherwise, you are drag and drop this file
          </h3>
        </>
      )}
    </PageLayoutWrapper>
  );
};

export default SheetUpload;
