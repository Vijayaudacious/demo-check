import Modal from "@/Components/Modal";
import { useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";

interface FooterModalProps {
  columns: string[];
}

const FooterModal: React.FC<FooterModalProps> = ({ columns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { formatMessage } = useIntl();
  return (
    <div className={styles.footerContainer}>
      <h3 className={styles.footerLink} onClick={() => setIsOpen(true)}>
        {formatMessage({ id: "payrollProcessing.list.footer.text" })}
      </h3>
      <Modal
        open={isOpen}
        width={1200}
        closeIcon={null}
        onCancel={() => setIsOpen(false)}
        title={formatMessage({ id: "payrollProcessing.list.footer.title" })}
        footer={false}
      >
        <h3>
          {formatMessage({ id: "payrollProcessing.list.footer.content" })}
        </h3>
        <div className={styles.modalBody}>
          {columns.map((column: string, index: number) => (
            <h3 key={index} className={styles.links}>
              {column}
            </h3>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default FooterModal;
