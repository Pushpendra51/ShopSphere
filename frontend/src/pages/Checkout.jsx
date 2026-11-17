import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    let active = true;
    API.get("/cart")
      .then(({ data }) => {
        if (active) setCart(data.cart);
      })
      .catch(() => {
        if (active) setError("Cart could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cartTotal =
    cart?.items?.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.product.discountPrice > 0
        ? item.product.discountPrice
        : item.product.price;
      return sum + price * item.quantity;
    }, 0) || 0;
  const finalAmount = Math.max(cartTotal - discount, 0);

  const applyCoupon = async () => {
    try {
      const normalizedCode = couponCode.trim().toUpperCase();
      const { data } = await API.post("/coupons/validate", {
        code: normalizedCode,
      });

      setDiscount(data.discountAmount);
      setAppliedCoupon(normalizedCode);
      setCouponCode(normalizedCode);
      setError("");
      alert("Coupon applied successfully");
    } catch (requestError) {
      setDiscount(0);
      setAppliedCoupon("");
      setError(requestError.response?.data?.message || "Invalid coupon");
    }
  };

  const placeOrder = async () => {
    if (
      ["fullName", "phone", "street", "city", "state", "pincode"].some(
        (field) => !shippingAddress[field].trim()
      )
    ) {
      setError("Complete all required shipping fields before placing the order.");
      return;
    }

    try {
      const normalizedCode = couponCode.trim().toUpperCase();
      const { data } = await API.post("/orders", {
        shippingAddress,
        paymentMethod,
        couponCode: normalizedCode === appliedCoupon ? normalizedCode : "",
      });

      alert(
        paymentMethod === "Cash on Delivery"
          ? "Order placed with Cash on Delivery"
          : "Demo payment successful and order placed"
      );
      navigate("/dashboard", { state: { orderId: data.order._id } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {error && <p role="alert" className="mb-5 text-red-600">{error}</p>}

        {loading ? (
          <p>Loading checkout...</p>
        ) : !cart?.items?.length ? (
          <div>
            <p>Your cart is empty.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 text-indigo-600 underline"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {Object.entries(shippingAddress).map(([field, value]) => (
              <input
                key={field}
                required={field !== "country"}
                placeholder={field}
                aria-label={field}
                value={value}
                onChange={(event) =>
                  setShippingAddress({
                    ...shippingAddress,
                    [field]: event.target.value,
                  })
                }
                className="w-full border px-4 py-3 rounded-lg mb-4"
              />
            ))}

            <div className="bg-slate-50 p-5 rounded-xl mt-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                    setAppliedCoupon("");
                    setDiscount(0);
                  }}
                  className="flex-1 border px-4 py-3 rounded-lg"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-yellow-500 text-white px-5 rounded-lg"
                >
                  Apply
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Try coupon: WELCOME10
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              {["Cash on Delivery", "UPI", "Card", "Net Banking"].map((method) => (
                <label
                  key={method}
                  className={`block border rounded-lg px-4 py-3 mb-3 cursor-pointer ${
                    paymentMethod === method
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-3"
                  />
                  {method}
                </label>
              ))}
              {paymentMethod !== "Cash on Delivery" && (
                <p className="text-sm text-green-600 mt-2">
                  Demo payment will be marked as successful.
                </p>
              )}
            </div>

            <div className="bg-slate-100 p-5 rounded-xl mb-6">
              <p className="flex justify-between">
                <span>Cart Total:</span>
                <strong>₹{cartTotal.toFixed(2)}</strong>
              </p>
              <p className="flex justify-between mt-2">
                <span>Discount:</span>
                <strong>₹{discount.toFixed(2)}</strong>
              </p>
              <p className="flex justify-between mt-2">
                <span>Payment:</span>
                <strong>{paymentMethod}</strong>
              </p>
              <p className="flex justify-between mt-2 text-lg">
                <span>Final Amount:</span>
                <strong>₹{finalAmount.toFixed(2)}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              {paymentMethod === "Cash on Delivery"
                ? "Place Order"
                : "Pay & Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
