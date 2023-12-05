import { COLOR_STATUS, DATE_FORMATS } from "@/Constant";
import {
  LEAVES_QUERY_KEYS,
  useLeavesByUser,
  useRemoveLeaveMutation,
} from "@/Hooks/Leaves";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { leaveRequest } from "@/Services/Leaves";
import { Leave } from "@/Types/Leaves";
import { getClassNameByStatus, showErrorMessage } from "@/Utils/generic";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugins from "@fullcalendar/interaction";
import FullCalendar, {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/react";
import "@fullcalendar/react/dist/vdom";
import timeGridPlugins from "@fullcalendar/timegrid";
import { Button, Col, Divider, Form, Radio, Row, message } from "antd";
import confirm from "antd/lib/modal/confirm";
import classNames from "classnames";
import dayjs from "dayjs";
import snakeCase from "lodash/snakeCase";
import upperCase from "lodash/upperCase";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import DatePicker from "../DatePicker";
import { Input } from "../InputField";
import LeaveIndicators from "../LeaveIndicators";
import Modal from "../Modal";
import DataVisbilityControl from "../PlanLimitations/MonthAction";
import SelectUser from "../SelectUserInput";
import styles from "./styles.module.less";

interface Permissions {
  userId: string;
  isDashboardCalender?: boolean;
  totalLeaveRefetch?: any;
}
const { YEAR_MONTH_DAY } = DATE_FORMATS;
const SingleIdUserCalender: React.FC<Permissions> = ({
  isDashboardCalender = false,
  totalLeaveRefetch,
  userId,
}) => {
  const { isMobile, isTab } = useWindowDimensions();
  const { formatMessage } = useIntl();

  const queryClient = useQueryClient();
  const { data } = useLeavesByUser(userId);

  const { mutateAsync: removeLeaveMutation } = useRemoveLeaveMutation();
  const currentMoth = {
    startDate: dayjs().startOf("month").format(YEAR_MONTH_DAY),
    endDate: dayjs().endOf("month").format(YEAR_MONTH_DAY),
  };

  const [visibleDateRange, setVisibleDateRange] = useState(currentMoth);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [formValues, setFormValues] = useState({
    description: "",
    title: "",
    start: "",
    end: "",
    _id: "",
  });

  const { mutateAsync: leaveMutation, isLoading } = useMutation(leaveRequest);

  const [form] = Form.useForm();

  const initialEvents = useMemo(() => {
    if (!data) {
      return;
    }

    return (data?.data?.data || []).map((element: Leave) => ({
      leaveId: element._id,
      createdBy: element.createdBy,
      description: element.description,
      start: dayjs(element.startDate).format("YYYY-MM-DD"),
      end: dayjs(element.endDate).add(1, "days").format("YYYY-MM-DD"),
      title: element.reason,
      requestedAt: element.requestedAt,
      requestedBy: element.requestedBy,
      status: element.status,
      totalCountDay: element.totalCountDay,
      color: COLOR_STATUS[upperCase(element.status)],
      startDateHalfDayDetails: element.startDateHalfDayDetails,
      endDateHalfDayDetails: element.startDateHalfDayDetails,
      className: getClassNameByStatus(element),
    }));
  }, [data]);

  const onFinish = async (values: any) => {
    const {
      title,
      description,
      start,
      end,
      startDateHalfDayDetails,
      endDateHalfDayDetails,
      notifyTo,
    } = values;
    try {
      await leaveMutation({
        description,
        requestedBy: userId,
        reason: title,
        startDate: dayjs(start).format("YYYY-MM-DD"),
        endDate: dayjs(end).format("YYYY-MM-DD"),
        startDateHalfDayDetails: startDateHalfDayDetails || "",
        endDateHalfDayDetails: endDateHalfDayDetails || "",
        notifyTo,
      });
      setIsModalVisible(false);
      await message.success(
        formatMessage({
          id: "dashboard.addLeaveForm.apiSuccess",
        })
      );
      queryClient.invalidateQueries([
        LEAVES_QUERY_KEYS.SINGLE_EMPLOYEE_LEAVE_DETAILS,
      ]);
      if (isDashboardCalender) {
        totalLeaveRefetch();
      }
    } catch (error) {
      showErrorMessage(error);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <b id={`leave_applied_${snakeCase(eventContent.event.title)}`}>
        {eventContent.event.title}
      </b>
    );
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (selectInfo.allDay) {
      form.setFieldsValue({
        title: null,
        description: null,
        start: dayjs(selectInfo.startStr),
        end: dayjs(selectInfo.endStr).subtract(1, "days"),
        startDateHalfDayDetails: "",
        endDateHalfDayDetails: "",
      });
    } else {
      form.setFieldsValue({
        title: null,
        description: null,
        start: dayjs(selectInfo.startStr),
        end: dayjs(selectInfo.end),
        startDateHalfDayDetails: "",
        endDateHalfDayDetails: "",
      });
    }
    showModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const leaveId = clickInfo.event._def.extendedProps.leaveId;
    confirm({
      title: "Do you want to delete this leave?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      centered: true,
      cancelText: "No",
      okButtonProps: {
        id: "yes",
      },
      cancelButtonProps: {
        id: "cancal",
      },
      onOk: async () => {
        try {
          await removeLeaveMutation(leaveId);
          queryClient.invalidateQueries([
            LEAVES_QUERY_KEYS.SINGLE_EMPLOYEE_LEAVE_DETAILS,
          ]);
        } catch (error) {
          message.error("Unable to process");
        }
      },
    });
  };

  const start = Form.useWatch("start", form);
  const end = Form.useWatch("end", form);

  //Code for apply id in every div of calender
  const fullCalender = document.getElementById("fullcalendar_apply_id");
  const getTableBody = fullCalender?.getElementsByTagName("tbody")[1];
  const getTableRows = getTableBody?.getElementsByTagName("tr");
  if (getTableRows?.length) {
    for (let i = 0; i < getTableRows?.length; i++) {
      const allTableData = getTableRows[i].getElementsByTagName("td");
      for (let j = 0; j < allTableData.length; j++) {
        const day = allTableData[j]
          .getElementsByTagName("a")[0]
          ?.getAttribute("aria-label");
        if (day) {
          allTableData[j]
            .getElementsByTagName("div")[0]
            .setAttribute("id", snakeCase(day));
        }
      }
    }
  }

  const handleDatesSet = (arg: DatesSetArg) => {
    const startDate = dayjs(arg.view.currentStart).format(YEAR_MONTH_DAY);
    const endDate = dayjs(arg.view.currentEnd)
      .subtract(1, "month")
      .format(YEAR_MONTH_DAY);
    setVisibleDateRange({ startDate, endDate });
  };

  const options = [
    {
      label: formatMessage({
        id: "dashboard.addLeaveForm.options.fullDate",
      }),
      value: "",
    },
    {
      label: formatMessage({
        id: "dashboard.addLeaveForm.options.firstHalf",
      }),
      value: "1",
    },
    {
      label: formatMessage({
        id: "dashboard.addLeaveForm.options.secondHalf",
      }),
      value: "2",
    },
  ];
  return (
    <>
      <div className={classNames(styles.main, "text-center")}>
        <LeaveIndicators />
        <Divider className={styles.divider} />
        {isDashboardCalender && (
          <Row>
            <Col lg={9} sm={6} className={styles.description}>
              <h1>
                {formatMessage({
                  id: "dashboard.fullCalendar.title",
                })}
              </h1>
            </Col>
            <Col lg={15} sm={6}>
              <h1 className={styles.description}>
                <b>
                  {formatMessage({
                    id: "dashboard.fullCalendar.description",
                  })}
                </b>
              </h1>
            </Col>
          </Row>
        )}
        <DataVisbilityControl
          module="leaves"
          startDate={visibleDateRange.startDate}
          endDate={visibleDateRange.endDate}
          extra={
            <Button
              type="primary"
              className={styles.upgradeRestBtn}
              onClick={() => setVisibleDateRange(currentMoth)}
            >
              {formatMessage({
                id: "generic.resetMonth",
              })}
            </Button>
          }
        >
          <div id="fullcalendar_apply_id">
            <FullCalendar
              eventClick={handleEventClick}
              showNonCurrentDates={false}
              plugins={[dayGridPlugin, timeGridPlugins, interactionPlugins]}
              initialEvents={initialEvents}
              timeZone="local"
              headerToolbar={{
                left: "prev,next,today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              eventContent={renderEventContent}
              select={handleDateSelect}
              events={initialEvents}
              weekends={true}
              selectable={true}
              editable={false}
              dateClick={(data) => {
                if (isMobile) {
                  form.setFieldsValue({
                    title: null,
                    description: null,
                    start: dayjs(data.dateStr),
                    end: dayjs(data.dateStr),
                  });
                  showModal();
                }
              }}
              datesSet={handleDatesSet}
            />
          </div>
        </DataVisbilityControl>

        <Modal
          title={formatMessage({
            id: "dashboard.addLeaveForm.title",
          })}
          className={classNames({ [styles.leaveModal]: isTab && !isMobile })}
          open={isModalVisible}
          onOk={form.submit}
          onCancel={handleCancel}
          centered={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={form.submit}
              loading={isLoading}
              id="save"
            >
              {formatMessage({
                id: "generic.save",
              })}
            </Button>,
            <Button key="back" onClick={handleCancel} id="cancel">
              {formatMessage({
                id: "generic.cancel",
              })}
            </Button>,
          ]}
        >
          <Form
            wrapperCol={{ xs: { span: 24 } }}
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              start: formValues.start,
              startDateHalfDayDetails: "",
              endDateHalfDayDetails: "",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="title"
              label={formatMessage({
                id: "dashboard.addLeaveForm.lable",
              })}
              rules={[
                { required: true, message: "Title is required" },
                { whitespace: true, message: "Title is required" },
              ]}
            >
              <Input
                name="title"
                id="leave_title"
                placeholder="Enter title"
                maxLength={30}
                value={formValues.title}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={formatMessage({
                id: "dashboard.addLeaveForm.description",
              })}
              rules={[
                { required: true, message: "Description is required" },
                { whitespace: true, message: "Desciption is required" },
              ]}
            >
              <Input
                type="textArea"
                name="description"
                placeholder="Enter description"
                value={formValues.description}
                maxLength={100}
                id="leave_description"
              />
            </Form.Item>
            <Form.Item
              name="start"
              label={formatMessage({
                id: "dashboard.addLeaveForm.startDate",
              })}
            >
              <DatePicker
                className={styles.startDate}
                format="DD-MM-YYYY"
                name="start"
                id="leave_start"
                disabledDate={(d) => !d || d.isAfter(dayjs(end, "YYYY-MM-DD"))}
              />
            </Form.Item>
            <Form.Item name="startDateHalfDayDetails">
              <Radio.Group options={options} optionType="button" />
            </Form.Item>
            <Form.Item
              name="end"
              label={formatMessage({
                id: "dashboard.addLeaveForm.endDate",
              })}
            >
              <DatePicker
                className={styles.endDate}
                format="DD-MM-YYYY"
                name="end"
                id="leave_end"
                disabledDate={(d) =>
                  !d ||
                  d.isSame(dayjs(start, "YYYY-MM-DD")) ||
                  d.isBefore(dayjs(start, "YYYY-MM-DD"))
                }
              />
            </Form.Item>
            <Form.Item name="endDateHalfDayDetails">
              <Form.Item
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.start !== curValues.start ||
                  prevValues.end !== curValues.end
                }
              >
                {({ getFieldValue }) => {
                  const start = getFieldValue("start");
                  const end = getFieldValue("end");
                  const isEndDateSameAsStartDate =
                    start && end && start.isSame(end, "day");

                  return (
                    <Radio.Group
                      options={options}
                      optionType="button"
                      disabled={isEndDateSameAsStartDate}
                    />
                  );
                }}
              </Form.Item>
            </Form.Item>

            <Form.Item name="notifyTo" label="Select persons to notify">
              <SelectUser mode="multiple" placeholder="Select persons" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default SingleIdUserCalender;
