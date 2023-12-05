import { UserContext } from "@/Auth";
import DatePicker from "@/Components/DatePicker";
import { Table } from "@/Components/Table";
import TimePicker from "@/Components/TimePicker";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { ABSENTCASETIME, ATTENDANCE_STATUS, DATE_FORMATS } from "@/Constant";
import { useAttendance, useCreateAttendanceMutation } from "@/Hooks/attendance";
import { useUsers } from "@/Hooks/emloyee";
import { useGetWorkingDays, useOrganization } from "@/Hooks/organization";
import { AttendanceMark, GetAttendance } from "@/Types/Attendance";
import { CreateWorkingDay } from "@/Types/Organization";
import { Button, Checkbox, Col, Form, Row, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import get from "lodash/get";
import { useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./styles.module.less";

const { HOUR_MINUTE_SECOND, DAY_MONTH_YEAR, YEAR_MONTH_DAY, WEEK_NAME } =
  DATE_FORMATS;
const { ABSENT, PRESENT, HALFDAY } = ATTENDANCE_STATUS;

const MarkAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format(YEAR_MONTH_DAY)
  );
  const [form] = Form.useForm();
  const [params, setParams] = useSearchParams();
  const { formatMessage } = useIntl();
  const limit = params.get("limit") || 100;
  const currentPage = params.get("currentPage") || 1;
  const { organisationId } = useContext(UserContext);
  const { data: organizationResponse } = useOrganization();
  const { data: getWorkingDay } = useGetWorkingDays();
  const { data: attendanceResponse } = useAttendance();
  const { data, isLoading } = useUsers({
    limit,
    currentPage: String(currentPage),
  });
  const { isLoading: isUpdating, mutateAsync: createAttendance } =
    useCreateAttendanceMutation();
  const fetchedAllEmployees = get(data, "data", []);
  const allAttendance: GetAttendance[] = get(attendanceResponse, "items", []);
  const workingDateTime = get(getWorkingDay, "workingDays");

  const defaultTimes = useMemo(() => {
    const preSetWorkingDay = (workingDateTime || []).find(
      ({ day }: CreateWorkingDay) =>
        day === dayjs(selectedDate).format(WEEK_NAME).toLowerCase()
    );
    return {
      inTime: preSetWorkingDay?.timing[0]?.startTime || undefined,
      outTime: preSetWorkingDay?.timing[0]?.endTime || undefined,
    };
  }, [selectedDate, workingDateTime]);

  const totalEmployees = useMemo(() => {
    return (fetchedAllEmployees || []).map((employee) => {
      const markedEmployee = (allAttendance || []).find(
        (attObj) =>
          attObj.empId === employee.employeeCode &&
          dayjs(attObj.date).format(YEAR_MONTH_DAY) ===
            dayjs(selectedDate).format(YEAR_MONTH_DAY)
      );
      const employeeStatus = markedEmployee ? markedEmployee.status : PRESENT;
      const inTime = markedEmployee?.inTime
        ? dayjs(markedEmployee.inTime).format(HOUR_MINUTE_SECOND)
        : defaultTimes.inTime;
      const outTime = markedEmployee?.outTime
        ? dayjs(markedEmployee.outTime).format(HOUR_MINUTE_SECOND)
        : defaultTimes.outTime;

      form.setFieldsValue({
        [employee.employeeCode]: {
          status: employeeStatus,
          inTime: inTime ? dayjs(inTime, HOUR_MINUTE_SECOND) : undefined,
          outTime: outTime ? dayjs(outTime, HOUR_MINUTE_SECOND) : undefined,
        },
      });
      return {
        _id: employee._id,
        name: employee.name,
        employeeCode: employee.employeeCode,
      };
    });
  }, [allAttendance, selectedDate, defaultTimes, fetchedAllEmployees]);

  const columns: ColumnsType<AttendanceMark> = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "number",
      render: (_, __, index: number) =>
        (Number(currentPage) - 1) * Number(limit) + index + 1,
    },
    {
      title: formatMessage({
        id: "attendance.list.columns.employeeId",
      }),
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: formatMessage({
        id: "attendance.list.columns.employeeName",
      }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: formatMessage({
        id: "attendance.markAttendance.list.columns.present",
      }),
      key: "present",
      render: ({ employeeCode }) => {
        return (
          <Form.Item
            shouldUpdate={(prevValues, curValues) => {
              return !isEqual(
                prevValues[employeeCode].status,
                curValues[employeeCode].status
              );
            }}
          >
            {({ getFieldValue }) => {
              const { status } = getFieldValue(employeeCode);
              return (
                <Form.Item
                  name={[employeeCode, "status"]}
                  rules={[
                    {
                      required: !status,
                      message: "Select one",
                    },
                  ]}
                >
                  <Checkbox.Group
                    name={employeeCode}
                    onChange={(value) => {
                      return form.setFieldsValue({
                        [employeeCode]: {
                          status: value[0] || undefined,
                        },
                      });
                    }}
                  >
                    <Checkbox checked={status === PRESENT} value={PRESENT} />
                  </Checkbox.Group>
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: formatMessage({
        id: "attendance.markAttendance.list.columns.absent",
      }),
      key: "absent",
      render: ({ employeeCode }) => {
        return (
          <Form.Item
            shouldUpdate={(prevValues, curValues) => {
              return !isEqual(
                prevValues[employeeCode].status,
                curValues[employeeCode].status
              );
            }}
          >
            {({ getFieldValue }) => {
              const { status } = getFieldValue(employeeCode);
              return (
                <Form.Item
                  name={[employeeCode, "status"]}
                  rules={[
                    {
                      required: !status,
                      message: "Select one",
                    },
                  ]}
                >
                  <Checkbox.Group
                    name={employeeCode}
                    onChange={(value) =>
                      form.setFieldsValue({
                        [employeeCode]: {
                          status: value[0],
                        },
                      })
                    }
                  >
                    <Checkbox checked={status === ABSENT} value={ABSENT} />
                  </Checkbox.Group>
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: formatMessage({
        id: "attendance.markAttendance.list.columns.halfDay",
      }),
      key: "halfDay",
      render: ({ employeeCode }) => {
        return (
          <Form.Item
            shouldUpdate={(prevValues, curValues) => {
              return !isEqual(
                prevValues[employeeCode].status,
                curValues[employeeCode].status
              );
            }}
          >
            {({ getFieldValue }) => {
              const { status } = getFieldValue(employeeCode);
              return (
                <Form.Item
                  name={[employeeCode, "status"]}
                  rules={[
                    {
                      required: !status,
                      message: "Select one",
                    },
                  ]}
                >
                  <Checkbox.Group
                    name={employeeCode}
                    onChange={(value) =>
                      form.setFieldsValue({
                        [employeeCode]: {
                          status: value[0],
                        },
                      })
                    }
                  >
                    <Checkbox checked={status === HALFDAY} value={HALFDAY} />
                  </Checkbox.Group>
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: formatMessage({
        id: "attendance.markAttendance.list.columns.inTime",
      }),
      key: "inTime",
      render: ({ employeeCode }) => {
        return (
          <Form.Item
            shouldUpdate={(prevValues, curValues) => {
              return !isEqual(
                prevValues[employeeCode].status,
                curValues[employeeCode].status
              );
            }}
          >
            {({ getFieldValue }) => {
              const { status } = getFieldValue(employeeCode);
              return (
                <>
                  {status !== ABSENT ? (
                    <Form.Item
                      name={[employeeCode, "inTime"]}
                      rules={[
                        { required: true, message: "In time is required" },
                      ]}
                      initialValue={
                        defaultTimes.inTime
                          ? dayjs(defaultTimes.inTime).format(
                              HOUR_MINUTE_SECOND
                            )
                          : undefined
                      }
                    >
                      <TimePicker />
                    </Form.Item>
                  ) : (
                    "-"
                  )}
                </>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: formatMessage({
        id: "attendance.markAttendance.list.columns.outTime",
      }),
      key: "outTime",
      render: ({ employeeCode }) => {
        return (
          <Form.Item
            shouldUpdate={(prevValues, curValues) => {
              return !isEqual(
                prevValues[employeeCode].status,
                curValues[employeeCode].status
              );
            }}
          >
            {({ getFieldValue }) => {
              const { status } = getFieldValue(employeeCode);
              return (
                <>
                  {status !== ABSENT ? (
                    <Form.Item
                      name={[employeeCode, "outTime"]}
                      initialValue={
                        defaultTimes.outTime
                          ? dayjs(defaultTimes.outTime).format(
                              HOUR_MINUTE_SECOND
                            )
                          : undefined
                      }
                      rules={[
                        { required: true, message: "Out time is required" },
                      ]}
                    >
                      <TimePicker />
                    </Form.Item>
                  ) : (
                    "-"
                  )}
                </>
              );
            }}
          </Form.Item>
        );
      },
    },
  ];

  const onFinish = async (formData: Record<string, any>) => {
    const finalValues = Object.keys(formData).map((key) => {
      const inTime = dayjs(formData[key].inTime).format(HOUR_MINUTE_SECOND);
      const outTime = dayjs(formData[key].outTime).format(HOUR_MINUTE_SECOND);
      const status = formData[key].status;
      return {
        date: selectedDate,
        orgId: organisationId,
        empId: key,
        inTime:
          status !== ABSENT
            ? selectedDate.concat(" ", inTime)
            : selectedDate.concat(" ", ABSENTCASETIME),
        outTime:
          status !== ABSENT
            ? selectedDate.concat(" ", outTime)
            : selectedDate.concat(" ", ABSENTCASETIME),

        status,
      };
    });
    try {
      await createAttendance({ data: finalValues });
      message.success(
        formatMessage({
          id: "attendance.markAttendance.apiSuccess",
        })
      );
    } catch (error: any) {
      await message.error(
        error?.data.message ||
          formatMessage({
            id: "generic.errorMessage",
          })
      );
    }
  };
  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   // Can not select days before today and today
  //   return current && current < dayjs().endOf("day");
  // };
  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.attendance",
          }),
          path: "/attendance",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.mark",
          }),
          path: "/attendance/mark ",
        },
      ]}
    >
      <Row className={styles.header}>
        <Col xs={24} lg={5}>
          <h2 className={styles.title}>
            {formatMessage({
              id: "attendance.markAttendance.list.title",
            })}
          </h2>
        </Col>
        <Col xs={24} lg={8}>
          <div className={styles.filter}>
            <span>
              {formatMessage({
                id: "attendance.markAttendance.list.filterLabel.calendar",
              })}
            </span>
            <br />
            <DatePicker
              format={DAY_MONTH_YEAR}
              onChange={(date) => {
                setSelectedDate(dayjs(date).format(YEAR_MONTH_DAY));
              }}
              clearIcon={false}
              value={dayjs(selectedDate, YEAR_MONTH_DAY)}
              disabledDate={(current) =>
                current.isAfter(dayjs().format(YEAR_MONTH_DAY))
              }
            />
          </div>
        </Col>
        <Col xs={24} lg={4}>
          <Link to="/attendance">
            <Button className={styles.savebtn}>
              {formatMessage({
                id: "generic.cancel",
              })}
            </Button>
          </Link>
          <Button
            className={styles.savebtn}
            type="primary"
            onClick={() => form.submit()}
            loading={isUpdating}
            disabled={isUpdating}
          >
            {formatMessage({
              id: "generic.save",
            })}
          </Button>
        </Col>
      </Row>
      <div className={styles.formWrapper}>
        <Form form={form} onFinish={onFinish} scrollToFirstError>
          <Table
            columns={columns}
            dataSource={totalEmployees}
            loading={isLoading}
            pagination={{
              pageSize: Number(limit),
              current: Number(currentPage),
              onChange: (currentPage: number, pageSize: number) => {
                setParams({
                  limit: String(pageSize),
                  currentPage: String(currentPage),
                });
              },
              showSizeChanger: true,
              total: data?.totalRecords,
            }}
          />
        </Form>
      </div>
    </PageLayoutWrapper>
  );
};

export default MarkAttendance;
