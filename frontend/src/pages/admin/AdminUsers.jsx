
import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/admin/users");

      setUsers(data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const managerCount = users.filter(
    (user) => user.role === "manager"
  ).length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "manager":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Users
            </h1>
            <p className="text-slate-500 mt-2">
              View registered users and their account activity.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg"
          >
            {loading ? "Refreshing..." : "Refresh Users"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-slate-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold mt-2">
              {users.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-slate-500 text-sm">Customers</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {customerCount}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-slate-500 text-sm">Admins</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {adminCount}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-slate-500 text-sm">Managers</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {managerCount}
            </h2>
          </div>

        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-xl font-bold">
              Registered Users
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredUsers.length} users found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-300 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-slate-300 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
                <option value="manager">Managers</option>
              </select>

            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 text-sm">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4">Last Login</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="p-4 text-sm text-slate-600">
                        {user.phone || "Not provided"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                        {user.lastLoginAt
                          ? formatDate(user.lastLoginAt)
                          : "Never logged in"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
