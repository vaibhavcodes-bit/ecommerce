import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    const orderId = sessionStorage.getItem("currentOrderId");

    console.log("🟢 PayPal Return Params →", { paymentId, payerId, orderId });

    // If any missing → redirect to failed
    if (!paymentId || !payerId || !orderId) {
      console.error("❌ Missing PayPal parameters.");
      navigate("/shop/payment-failed");
      return;
    }

    const payload = { paymentId, payerId, orderId };
    console.log("📤 Dispatching capturePayment →", payload);

    dispatch(capturePayment(payload)).then((res) => {
      console.log("✅ Capture API Response →", res);
      if (res?.payload?.success) {
        sessionStorage.removeItem("currentOrderId");
        navigate("/shop/payment-success");
      } else {
        console.error("❌ Payment capture failed:", res);
        navigate("/shop/payment-failed");
      }
    });
  }, [dispatch, location, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-10 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Processing your payment... please wait.
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;
