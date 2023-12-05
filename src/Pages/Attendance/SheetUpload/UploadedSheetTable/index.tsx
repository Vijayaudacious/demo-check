import { UserContext } from "@/Auth";
import { Table } from "@/Components/Table";
import { ABSENTCASETIME, ATTENDANCE_STATUS, BLANK_DAYS } from "@/Constant";
import { useCreateAttendanceMutation } from "@/Hooks/attendance";
import ListFooter from "@/Pages/Attendance/AttendanceList/ListFooter";
import { UploadEmployeesSheet } from "@/Types/Attendance";
import { Button, message as notification } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import AttandanceStatus from "./AttandanceStatus";
import styles from "./styles.module.less";

const { HALFDAY, PRESENT, ABSENT } = ATTENDANCE_STATUS;

interface SheetTableProps {
  sheetData: UploadEmployeesSheet[];
  handleReset: () => void;
  selectedMonth: string;
}

const UploadedSheetTable: React.FC<SheetTableProps> = ({
  sheetData,
  handleReset,
  selectedMonth,
}) => {
  const { formatMessage } = useIntl();
  const totalDays = dayjs(selectedMonth).daysInMonth();
  const { organisationId } = useContext(UserContext);
  const [attendanceItems, setAttendanceItems] = useState(sheetData);
  const [selectedEmployeesId, setSelectedEmployeesId] = useState<React.Key[]>(
    []
  );
  const navigate = useNavigate();
  const { isLoading: isUpdating, mutateAsync: createAttendance } =
    useCreateAttendanceMutation();

  const columns: ColumnsType<UploadEmployeesSheet> = useMemo(() => {
    const cols: ColumnsType<UploadEmployeesSheet> = [
      {
        title: formatMessage({
          id: "generic.serialNumber",
        }),
        dataIndex: "serialNumber",
        key: "serialNumber",
        fixed: "left",
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.employeeId",
        }),
        dataIndex: "employeecode",
        key: "employeecode",
        fixed: "left",
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.employeeName",
        }),
        dataIndex: "employeeName",
        key: "employeeName",
        fixed: "left",
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.totalWorkingDay",
        }),
        key: "totalWork",
        render: () => totalDays,
        fixed: "right",
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.totalPresent",
        }),
        dataIndex: "present",
        key: "present",
        fixed: "right",
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.totalAbsent",
        }),
        dataIndex: "apsent",
        key: "apsent",
        fixed: "right",
      },
    ];

    for (let i = 0; i <= dayjs(selectedMonth).daysInMonth(); i++) {
      cols.splice(-3, 0, {
        title: (
          <div>
            {
              dayjs(selectedMonth.concat(`-${i + 1}`))
                .add(1, "day")
                .toString()
                .split(",")[0]
            }
            <p>
              {(i + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </p>
          </div>
        ),
        key: String(i),
        width: 70,
        render: (employee: UploadEmployeesSheet) => {
          return (
            <AttandanceStatus
              status={employee.attendance[i]}
              inTime={employee.inTime[i]}
              outTime={employee.outTime[i]}
              onUpdate={handleUpdate}
              employeecode={employee.employeecode}
              uploadingIndex={i}
            />
          );
        },
      });
    }

    return cols;
  }, [selectedMonth]);

  const handleUpdate = (updatedObject: {
    status: string;
    inTime?: string;
    outTime?: string;
    employeecode: string;
    uploadingIndex: number;
  }) => {
    const { status, inTime, outTime, employeecode, uploadingIndex } =
      updatedObject;
    const updatedEmployee: UploadEmployeesSheet[] = attendanceItems.map(
      (obj) => {
        if (obj?.employeecode === employeecode) {
          const userAttendance = obj.attendance;
          userAttendance[uploadingIndex] = status;
          const userInTime = [...obj.inTime];
          const userOutTime = [...obj.outTime];
          if (inTime && outTime) {
            userInTime[uploadingIndex] = inTime;
            userOutTime[uploadingIndex] = outTime;
          }
          let updatedPresent = 0;
          let updatedAbsent = 0;
          userAttendance.forEach((attendance) => {
            if (attendance === PRESENT || attendance === HALFDAY) {
              updatedPresent++;
            } else {
              updatedAbsent++;
            }
          });
          return {
            ...obj,
            attendance: userAttendance,
            inTime: userInTime,
            outTime: userOutTime,
            present: String(updatedPresent),
            apsent: String(updatedAbsent),
          };
        }
        return obj;
      }
    );
    setAttendanceItems(updatedEmployee);
  };

  const onRowSelect = (selectedKeys: React.Key[]) =>
    setSelectedEmployeesId(selectedKeys || []);

  const handleSubmit = async () => {
    const finalData = attendanceItems.filter(
      (obj) => !selectedEmployeesId.includes(obj.employeecode)
    );
    finalData.forEach(async (employee: UploadEmployeesSheet) => {
      try {
        await createAttendance({
          data: (employee.attendance || []).map(
            (attendanceStatus: string, index: number) => {
              const date = dayjs(selectedMonth.concat(`-${index + 1}`))
                .format("YYYY-MM-DD")
                .toString();
              return {
                empId: employee.employeecode,
                date,
                status: attendanceStatus ? attendanceStatus : ABSENT,
                inTime:
                  !employee.inTime[index] ||
                  BLANK_DAYS.includes(employee.inTime[index])
                    ? date.concat(" ", ABSENTCASETIME)
                    : date.concat(" ", `${employee.inTime[index]}:00`),
                outTime:
                  !employee.outTime[index] ||
                  BLANK_DAYS.includes(employee.outTime[index])
                    ? date.concat(" ", ABSENTCASETIME)
                    : date.concat(" ", `${employee.outTime[index]}:00`),
                orgId: organisationId,
              };
            }
          ),
        });
      } catch (error: any) {
        notification.error(
          error?.data.message ||
            formatMessage({
              id: "generic.errorMessage",
            })
        );
      }
    });
    handleReset();
    navigate("/attendance");
  };
  return (
    <div className={styles.table}>
      <div className={styles.actionButton}>
        <Button type="primary" onClick={handleSubmit} loading={isUpdating}>
          {formatMessage({
            id: "generic.save",
          })}
        </Button>
        <Button onClick={handleReset}>
          {formatMessage({
            id: "generic.reset",
          })}
        </Button>
      </div>
      <div className={classNames("d-flex", styles.title)}>
        <h2 className={styles.listDeadingText}>
          {formatMessage({
            id: "attendance.list.title",
          })}
        </h2>
        <h2 className={styles.listDeadingText}>For {selectedMonth}</h2>
      </div>
      <Table
        dataSource={attendanceItems || []}
        columns={columns || []}
        bordered
        rowSelection={{ onChange: onRowSelect }}
        pagination={false}
      />
      <ListFooter />
    </div>
  );
};

export default UploadedSheetTable;
