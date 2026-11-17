import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    API.get("/orders/admin")
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

  const updateOrder = async (orderId, updates) => {
    try {
      const { data } = await API.put(`/orders/${orderId}/status`, updates);
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, ...data.order } : order
        )
      );
    } catch (requestError) {
      alert(requestError.response?.data?.message || "Order update failed.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8">Loading orders...</div>;
  }

  if (error || orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
        <p role={error ? "alert" : undefined}>{error || "No orders found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-xl shadow">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Customer:</strong> {order.user?.name || "N/A"} ({order.user?.email || "N/A"})</p>
            <label className="mt-4 flex items-center gap-3">
              <span>Update status</span>
              <select
                value={order.orderStatus}
                onChange={(event) =>
                  updateOrder(order._id, { orderStatus: event.target.value })
                }
                className="border rounded-lg px-3 py-2"
              >
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex items-center gap-3">
              <span>Payment status</span>
              <select
                value={order.paymentStatus}
                onChange={(event) =>
                  updateOrder(order._id, { paymentStatus: event.target.value })
                }
                className="border rounded-lg px-3 py-2"
              >
                {["Pending", "Paid", "Failed"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
