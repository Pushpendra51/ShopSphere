import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    API.get("/orders")
      .then(({ data }) => {
        if (active) setOrders(data.orders || []);
      })
      .catch(() => {
        if (active) setError("Orders could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 0;
    }
  };

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.orderStatus);

            return (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Order Tracking</h3>

                  <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                      <div
                        key={step}
                        className={`flex flex-col items-center ${
                          currentStep >= index + 1
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            currentStep >= index + 1
                              ? "border-green-600 bg-green-100"
                              : "border-slate-300"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <p className="text-sm mt-2">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
