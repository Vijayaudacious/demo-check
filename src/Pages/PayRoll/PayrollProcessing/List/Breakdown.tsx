import Modal from "@/Components/Modal";
import { useSalaryTemplate } from "@/Hooks/templates";
import { Deduction, Earning } from "@/Types/SalaryTemplate";
import { titleCase } from "@/Utils/generic";
import { Col, ModalProps, Row, Skeleton } from "antd";
import React from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";

interface BreakdownProps extends ModalProps {
  templateId?: string;
}
const BreakdownModal: React.FC<BreakdownProps> = ({ templateId, ...props }) => {
  const { formatMessage } = useIntl();
  const { data: salaryTemplate, isLoading } = useSalaryTemplate(
    templateId || ""
  );

  const showData = (key: "deductions" | "earnings") => {
    const hasData = salaryTemplate?.data?.[key].length > 0;
    return (
      <Row gutter={20}>
        <Col lg={24}>
          <h2>{titleCase(key)}</h2>
        </Col>
        {!hasData && (
          <span className={styles.centerContent}>{`No ${key} found.`}</span>
        )}
        {salaryTemplate?.data?.[key].map(
          (data: Deduction | Earning, index: number) => (
            <React.Fragment key={index}>
              <Col lg={8}>
                <p className={styles.content}>{titleCase(data.title)}</p>
              </Col>
              <Col lg={8}>
                <p className={styles.content}>{titleCase(data.type)}</p>
              </Col>
              <Col lg={8}>
                <p className={styles.content}>{data.amount}</p>
              </Col>
            </React.Fragment>
          )
        )}
      </Row>
    );
  };

  return (
    <Modal
      title={formatMessage({ id: "payrollProcessing.list.breakdown.title" })}
      {...props}
      footer={false}
      width={600}
    >
      {isLoading ? (
        <Skeleton
          loading
          active
          paragraph={{
            rows: 10,
          }}
        />
      ) : (
        <>
          {showData("earnings")}
          {showData("deductions")}
        </>
      )}
    </Modal>
  );
};

export default BreakdownModal;
