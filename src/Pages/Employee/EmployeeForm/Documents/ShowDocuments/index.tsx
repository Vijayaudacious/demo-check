import { EmployeeDetailsContext } from "@/Layouts/AddEmployeeLayout";
import { Document } from "@/Types/Employee";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";
import AddDocumentModal from "../AddDocumentModal";
import DocumentCard from "./DocumentCard";
import styles from "./styles.module.less";

const ShowDocuments: React.FC = () => {
  const { document: documents, isLoading: isDocumentFetching } = useContext(
    EmployeeDetailsContext
  );
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  return (
    <div className={styles.documentContainer}>
      <Row gutter={20}>
        {(documents || []).map((document: Document) => {
          return (
            <Col lg={8} key={document._id}>
              <DocumentCard document={document} />
            </Col>
          );
        })}
        <Col lg={8}>
          <Card
            className={styles.card}
            hoverable
            bordered
            onClick={() => setShowModal(true)}
          >
            <div>
              <PlusOutlined className={styles.plusIcon} />
              <h1 className={styles.addDocument}>
                {formatMessage({ id: "generic.add" })}
              </h1>
            </div>
          </Card>
        </Col>
      </Row>
      <AddDocumentModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ShowDocuments;
