import Icon, { ZestLogo } from "@/Assets/Images";
import Modal from "@/Components/Modal";
import { useOrganization } from "@/Hooks/organization";
import { useCreateSubscription, usePlans } from "@/Hooks/payment";
import { Col, Row, Skeleton, Switch, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaymentForm from "./PaymentModal";
import PlanCard from "./PlanCard";
import styles from "./styles.module.less";
import useCurrency from "@/Hooks/useCurrency";

export type Currency = "inr" | "usd";

const Plans = () => {
  const currency = useCurrency();
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const { data: organization } = useOrganization();
  const { data: plansResponse, isLoading } = usePlans();
  const allPlans = plansResponse?.data || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const preSelectedPlanId = searchParams.get("plan") || "";

  useEffect(() => {
    if (preSelectedPlanId) {
      setSelectedPlanId(preSelectedPlanId);
    }
  }, [preSelectedPlanId]);

  const {
    isLoading: isCreatingSubscription,
    mutateAsync: createSubscriptionMutation,
  } = useCreateSubscription();

  const onSubscribe = async () => {
    try {
      const data = await createSubscriptionMutation({
        planId: selectedPlanId,
        currency,
      });
      if (data.subscription.status !== "active") {
        window.location.href = data.invoice.hosted_invoice_url;
      } else {
        notification.success({
          message: "Subscribed successfully.",
        });
      }
      setSelectedPlanId("");
    } catch (error: any) {
      notification.error({
        message: error.message || "Unable to process",
      });
    }
  };

  const handleClose = () => {
    setSelectedPlanId("");
    searchParams.delete("plan");
    setSearchParams(searchParams);
  };
  return (
    <div className={styles.plansContainer}>
      <Row className={styles.cardSection} gutter={16}>
        <Col span={24}>
          <div className={styles.headingSection}>
            <Icon icon={ZestLogo} width={200} />
            <h1>Please Select Your Pricing Plan</h1>
          </div>
        </Col>
        {isLoading &&
          new Array(4).fill(null).map((_, index: number) => (
            <Col xxl={5} xl={5} lg={10} md={10} xs={22} key={index}>
              <Skeleton
                loading
                active
                paragraph={{
                  rows: 20,
                }}
              />
            </Col>
          ))}
        {allPlans.map((plan) => (
          <Col xxl={5} xl={5} lg={10} md={10} xs={22} key={plan._id}>
            <PlanCard
              plan={plan}
              onSelect={() => setSelectedPlanId(plan._id)}
              isSelected={organization?.data?.planId?._id === plan._id}
              currency={currency}
            />
          </Col>
        ))}

        <Col span={24}>
          <div className={styles.footerSection}>
            <span>
              © Copyright {dayjs().get("year")} All Rights Reserved by{" "}
              <a href="https://www.zesthrm.com/">ZestHRM</a>
            </span>
          </div>
        </Col>
      </Row>
      <Modal
        open={Boolean(selectedPlanId)}
        onCancel={handleClose}
        title="Start Payment"
        footer={null}
      >
        <PaymentForm
          isLoading={isCreatingSubscription}
          onSubscribe={onSubscribe}
        />
      </Modal>
    </div>
  );
};

export default Plans;
