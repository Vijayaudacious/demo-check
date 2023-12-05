import Icon, { CopyIcon } from "@/Assets/Images";
import TimePicker from "@/Components/TimePicker";
import OrganizationWrapper from "@/Components/Wrappers/OrganizationWrapper";
import { DATE_FORMATS } from "@/Constant";
import {
  useSetWorkingDaysMutation,
  useGetWorkingDays as useWorkingHours,
} from "@/Hooks/organization";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { CreateWorkingDay } from "@/Types/Organization";
import { titleCase } from "@/Utils/generic";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Row,
  Skeleton,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";

const { HOUR_MINUTE_SECOND, HOUR_MINUTE_MERIDIEM } = DATE_FORMATS;

type Timing = Record<string, { startTime: Dayjs; endTime: Dayjs }>;
type SameAll = {
  days: string[];
  timing: { startTime: Dayjs; endTime: Dayjs };
  shouldShow: boolean;
};
const SetOrganizationWorkingHours = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const { isMobile } = useWindowDimensions();
  const { isLoading, mutateAsync: setWorkingHoursMutation } =
    useSetWorkingDaysMutation();

  const { data: getWorkingDay, isLoading: loadingWorkingDays } =
    useWorkingHours();

  const workingDateTime = get(getWorkingDay, "workingDays");

  useEffect(() => {
    if (workingDateTime) {
      const fieldValues: Timing = {};

      workingDateTime.forEach((workingTime: CreateWorkingDay) => {
        fieldValues[workingTime.day] = {
          startTime: dayjs(workingTime.timing[0].startTime, HOUR_MINUTE_SECOND),
          endTime: dayjs(workingTime.timing[0].endTime, HOUR_MINUTE_SECOND),
        };
      });
      form.setFieldsValue({
        days: workingDateTime.map(({ day }: CreateWorkingDay) => day),
        ...fieldValues,
      });
    }
  }, [workingDateTime]);

  const handleSubmit = async (values: { days: string[] } & Timing) => {
    try {
      const workingDays = values.days.map((day: string, index: number) => ({
        day,
        timing: [
          {
            startTime: values[day].startTime.format(HOUR_MINUTE_SECOND),
            endTime: values[day].endTime.format(HOUR_MINUTE_SECOND),
          },
        ],
      }));

      await setWorkingHoursMutation(workingDays);
      message.success(
        formatMessage({
          id: "settings.workingHours.form.messages.success",
        })
      );
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          formatMessage({
            id: "settings.workingHours.form.messages.error",
          })
      );
    }
  };

  const options = [
    {
      label: formatMessage({
        id: "settings.workingHours.days.mon",
      }),
      value: "monday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.tue",
      }),
      value: "tuesday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.wed",
      }),
      value: "wednesday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.thu",
      }),
      value: "thursday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.fri",
      }),
      value: "friday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.sat",
      }),
      value: "saturday",
    },
    {
      label: formatMessage({
        id: "settings.workingHours.days.sun",
      }),
      value: "sunday",
    },
  ];

  const SameForAll = ({ days, timing, shouldShow }: SameAll) => {
    return (
      shouldShow && (
        <p
          className={styles.copyText}
          onClick={() => {
            const newTimings: Timing = {};
            days.forEach((day) => {
              newTimings[day] = timing;
            });
            form.setFieldsValue(newTimings);
          }}
        >
          <Icon icon={CopyIcon} />
          <span>
            {formatMessage({
              id: "settings.workingHours.button.copy",
            })}
          </span>
        </p>
      )
    );
  };
  return (
    <OrganizationWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.settings",
          }),
          path: "/settings/employee",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.organization",
          }),
          path: "/settings/organization",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.workingHours",
          }),
          path: "/settings/organization/working-hours",
        },
      ]}
    >
      <div className={styles.timingContainer}>
        <div className={styles.checkboxs}>
          <h2>
            {formatMessage({
              id: "settings.workingHours.form.title",
            })}
          </h2>
          <Skeleton loading={loadingWorkingDays}>
            <Form onFinish={handleSubmit} form={form}>
              <Form.Item name="days">
                <Checkbox.Group
                  className={styles.checkboxGroups}
                  options={options}
                />
              </Form.Item>
              <Divider />
              <Form.Item
                shouldUpdate={(prevValues, curValues) =>
                  !isEqual(curValues.days, prevValues.days)
                }
              >
                {({ getFieldValue }) => {
                  const days: string[] = getFieldValue("days") || [];
                  const timing = getFieldValue(days[0]);
                  return (
                    <>
                      {days.map((day, index: number) => (
                        <Row
                          key={day}
                          gutter={[20, 10]}
                          align="middle"
                          className={styles.timing}
                        >
                          <SameForAll
                            days={days}
                            timing={timing}
                            shouldShow={Boolean(isMobile) && index === 0}
                          />
                          <Col xl={5} lg={12} md={8} sm={24} xs={24}>
                            <Form.Item
                              name={[day, "startTime"]}
                              rules={[
                                {
                                  required: true,
                                  message: formatMessage({
                                    id: "settings.workingHours.form.messages.startTime",
                                  }),
                                },
                              ]}
                              label={
                                <p className={styles.formLabel}>
                                  {titleCase(day)}
                                </p>
                              }
                            >
                              <TimePicker
                                format={HOUR_MINUTE_MERIDIEM}
                                className={styles.startTime}
                                placeholder={formatMessage({
                                  id: "settings.workingHours.form.startTime.placeholder",
                                })}
                                allowClear
                                minuteStep={15}
                              />
                            </Form.Item>
                          </Col>
                          <Col xl={4} lg={12} md={8} sm={18} xs={24}>
                            <Form.Item
                              name={[day, "endTime"]}
                              rules={[
                                {
                                  required: true,
                                  message: formatMessage({
                                    id: "settings.workingHours.form.messages.endTime",
                                  }),
                                },
                              ]}
                            >
                              <TimePicker
                                format={HOUR_MINUTE_MERIDIEM}
                                className={styles.startTime}
                                placeholder={formatMessage({
                                  id: "settings.workingHours.form.endTime.placeholder",
                                })}
                                allowClear
                                minuteStep={15}
                              />
                            </Form.Item>
                          </Col>
                          <SameForAll
                            days={days}
                            timing={timing}
                            shouldShow={Boolean(!isMobile) && index === 0}
                          />
                        </Row>
                      ))}
                    </>
                  );
                }}
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
                className={styles.submitButton}
              >
                {formatMessage({
                  id: "generic.save",
                })}
              </Button>
            </Form>
          </Skeleton>
        </div>
      </div>
    </OrganizationWrapper>
  );
};

export default SetOrganizationWorkingHours;
