import Truncate from "@/Components/Truncate";
import { Document } from "@/Types/Employee";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Image, Space, Tooltip } from "antd";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import AddDocumentModal from "../AddDocumentModal";
import DeleteDocumentModal from "../DeleteDocument";
import styles from "./styles.module.less";

interface DocumentProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentProps> = ({ document }) => {
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Card className={styles.card} hoverable>
      <div className={styles.cardHeader}>
        <h1>
          <b>
            <Truncate text={document.name} />
          </b>
        </h1>
        <Space>
          <Tooltip title={formatMessage({ id: "generic.update" })}>
            <Button
              icon={<EditOutlined id="update_document" />}
              onClick={() => setShowModal(true)}
            />
          </Tooltip>
          <Tooltip title={formatMessage({ id: "generic.delete" })}>
            <span>
              <DeleteDocumentModal document={document} />
            </span>
          </Tooltip>
        </Space>
      </div>
      <div className={styles.imageContainer}>
        {document.file.endsWith(".pdf") || document.file.endsWith(".doc") ? (
          <Tooltip
            title={formatMessage(
              {
                id: "employee.messages.document.noPreview.tooltip",
              },
              {
                document: document.name,
              }
            )}
          >
            <a
              href={`${process.env.REACT_APP_BASE_API}${document.file}`}
              target="_blank"
            >
              <Button type="primary">
                {formatMessage(
                  {
                    id: "employee.messages.document.noPreview.text",
                  },
                  {
                    document: document.name,
                  }
                )}
              </Button>
            </a>
          </Tooltip>
        ) : (
          <Image
            width={200}
            height={200}
            src={`${process.env.REACT_APP_BASE_API}${document.file}`}
            alt={document.file}
            preview={false}
          />
        )}
      </div>
      <AddDocumentModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        document={document}
      />
    </Card>
  );
};

export default DocumentCard;
