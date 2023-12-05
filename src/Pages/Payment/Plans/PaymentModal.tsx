import { useCreateCardMutation } from "@/Hooks/payment";
import { LockOutlined } from "@ant-design/icons";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Alert, Button, Space, notification } from "antd";
import React from "react";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY!);

type ActionProps = {
  onSubscribe: () => void;
  isLoading: boolean;
};

const CheckoutForm: React.FC<ActionProps> = ({ onSubscribe, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { isLoading: isCreatingCard, mutateAsync: createCardMutation } =
    useCreateCardMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createToken(elements.getElement("card")!);
    if (result.error) {
      notification.error({ message: result.error.message });
    } else {
      await createCardMutation({
        token: result.token?.id,
      });
      onSubscribe();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Space direction="vertical" size="large" className="w-100">
        <Alert
          type="warning"
          message={
            <>
              You will be redirected to stripe page for completing the payment.{" "}
              <br />
              Once completed come back to the ZestHRM and you can continue using
              the services.
            </>
          }
          showIcon
        />

        <CardElement />

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading || isCreatingCard}
          className="w-100"
          icon={<LockOutlined />}
          size="large"
        >
          Confirm
        </Button>
      </Space>
    </form>
  );
};

const PaymentForm: React.FC<ActionProps> = ({ onSubscribe, isLoading }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: "setup", currency: "inr" }}
    >
      <CheckoutForm onSubscribe={onSubscribe} isLoading={isLoading} />
    </Elements>
  );
};

export default PaymentForm;
