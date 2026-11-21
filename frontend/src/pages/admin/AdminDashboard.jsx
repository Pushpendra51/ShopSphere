
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    API.get("/admin/analytics")
      .then(({ data }) => {
        if (active) setAnalytics(data.analytics);
      })
      .catch(() => {
        if (active) setError("Dashboard data could not be loaded.");
      });

    return () => {
      active = false;
    };
  }, []);

  const exportReport = async () => {
    try {
      const { data } = await API.get("/admin/export/sales-report", {
        responseType: "blob",
      });

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "shopsphere-sales-report.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      alert(
        requestError.response?.data?.message || "Report export failed."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <p role="alert" className="mb-6 text-red-600">
          {error}
        </p>
      )}

      {analytics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            ["Users", analytics.totalUsers],
            ["Products", analytics.totalProducts],
            ["Orders", analytics.totalOrders],
            ["Paid Revenue", `₹${analytics.totalRevenue}`],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-5 rounded-xl shadow">
              <p className="text-slate-500">{label}</p>
              <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold">Manage Products</h2>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold">Manage Orders</h2>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold">Manage Users</h2>
          <p className="text-sm text-slate-500 mt-2">
            View registered users and their login activity.
          </p>
        </Link>

        <button
          type="button"
          onClick={exportReport}
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
        >
          <h2 className="text-xl font-bold">Export CSV</h2>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
