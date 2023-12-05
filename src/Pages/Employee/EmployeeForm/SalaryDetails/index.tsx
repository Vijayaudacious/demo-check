import { Input } from "@/Components/InputField";
import Select from "@/Components/InputField/Select";
import { Loader } from "@/Components/Loader";
import { FILTER } from "@/Constant";
import { useSalaryTemplates } from "@/Hooks/templates";
import { EmployeeDetailsContext } from "@/Layouts/AddEmployeeLayout";
import { SalaryTemplate } from "@/Types/SalaryTemplate";
import { titleCase } from "@/Utils/generic";
import {
  Card,
  Checkbox,
  Col,
  Form,
  Pagination,
  PaginationProps,
  Row,
  Skeleton,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classNames from "classnames";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useParams, useSearchParams } from "react-router-dom";
import FormWrapper from "../FormWrapper";
import ShowEarningDeduction from "./ShowEarningDeduction";
import styles from "./styles.module.less";

const { LIMIT, CUREENT_PAGE } = FILTER;

const SalaryDetails = () => {
  const { employeeId } = useParams();
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const details = useContext(EmployeeDetailsContext);

  useEffect(() => {
    setInitialValues();
  }, [employeeId, details]);

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const page = params.get("currentPage") || CUREENT_PAGE;
  const size = params.get("limit") || LIMIT;

  const { data: templateResponse, isLoading } = useSalaryTemplates({
    currentPage: String(page),
    limit: size,
    search,
  });
  const templates = get(templateResponse, "data", []);

  const templateOptions = useMemo(() => {
    return templates.map(({ _id, templateName }: SalaryTemplate) => ({
      label: titleCase(templateName),
      value: _id,
    }));
  }, [templates]);

  const handleTemplateSearch = debounce((searchedTemplate: string) => {
    setParams({ ...params, search: searchedTemplate });
  }, 500);

  const onChange: PaginationProps["onChange"] = (pageNumber, limit) => {
    setParams({
      ...params,
      currentPage: String(pageNumber),
      limit: String(limit),
    });
  };

  const handleSelect = (checked: boolean, templateId: string) => {
    const currentId = checked ? templateId : "";
    setSelectedTemplate(currentId);
    form.setFieldsValue({ salaryTemplates: currentId });
  };

  const setInitialValues = () => {
    if (!details) {
      return;
    }
    if (employeeId && details) {
      const { salary, salaryTemplates } = details;
      setSelectedTemplate(salaryTemplates);
      form.setFieldsValue({
        salary,
        salaryTemplates,
      });
    }
  };

  return (
    <FormWrapper
      nextStep={`/employees/${employeeId}/documents`}
      previousStep={`/employees/${employeeId}/educational-details`}
      showSkipButton
      form={form}
    >
      <Row gutter={16} className={styles.cardsWrapper}>
        <Col lg={12} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.salary.label",
            })}
            name="salary"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.salary.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "employee.form.salary.placeholder",
              })}
              id="salary"
            />
          </Form.Item>
        </Col>
        <Col lg={12} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.salaryTemplate.label",
            })}
            name="salaryTemplates"
          >
            <Select
              placeholder={formatMessage({
                id: "employee.form.salaryTemplate.placeholder",
              })}
              size="large"
              options={templateOptions}
              onSearch={handleTemplateSearch}
              loading={isLoading}
              showSearch
              allowClear
              filterOption={false}
              defaultActiveFirstOption={false}
              onChange={(value: string) => setSelectedTemplate(value)}
            />
          </Form.Item>
        </Col>
        {isLoading
          ? new Array(6).fill(null).map((_, index: number) => (
              <Col lg={4} md={10} xs={22} key={index}>
                <Skeleton
                  loading
                  active
                  paragraph={{
                    rows: 7,
                  }}
                />
              </Col>
            ))
          : templates?.map((template: SalaryTemplate) => (
              <Col lg={4} xs={24} key={template._id}>
                <Card
                  title={
                    <Row>
                      <Col xs={20}>{titleCase(template.templateName)}</Col>
                      <Col xs={4}>
                        <Checkbox
                          checked={selectedTemplate === template._id}
                          onChange={({
                            target: { checked },
                          }: CheckboxChangeEvent) =>
                            handleSelect(checked, template._id)
                          }
                        />
                      </Col>
                    </Row>
                  }
                  className={classNames(styles.cardContainer, {
                    [styles.selectedCard]: selectedTemplate === template._id,
                  })}
                  headStyle={{
                    padding: "0 5px",
                    backgroundColor: "#3f3f4594",
                    color: "#fff",
                  }}
                >
                  <ShowEarningDeduction template={template} type="earnings" />
                  <hr />
                  <ShowEarningDeduction template={template} type="deductions" />
                </Card>
              </Col>
            ))}

        <Col xs={24}>
          <h3 className={styles.positionEnd}>
            {formatMessage({ id: "generic.totalRecords" })}:
            {isLoading ? <Loader isLoading /> : templates?.length}
          </h3>
          <hr />
          <Pagination
            showSizeChanger
            className={styles.pagination}
            onChange={onChange}
            defaultCurrent={Number(page)}
            total={templateResponse?.totalItems}
          />
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default SalaryDetails;
