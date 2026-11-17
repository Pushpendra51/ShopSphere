import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([API.get("/auth/profile"), API.get("/orders")])
      .then(([profileResponse, ordersResponse]) => {
        if (active) {
          setUser(profileResponse.data.user);
          setOrders(ordersResponse.data.orders || []);
        }
      })
      .catch(() => {
        if (active) setError("Profile information could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (error || !user) {
    return (
      <div className="p-10 text-red-600" role="alert">
        {error || "Profile information could not be loaded."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <div className="space-y-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Total Orders:</strong> {orders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
