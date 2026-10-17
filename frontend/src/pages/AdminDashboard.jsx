import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/users/"), api.get("/campaigns/")])
      .then(([usersRes, campaignsRes]) => {
        setUsers(usersRes.data.results ?? usersRes.data);
        setCampaigns(campaignsRes.data.results ?? campaignsRes.data);
      })
      .catch(() => setError("Could not load admin data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container page loading">Loading...</div>;

  if (error)
    return (
      <div className="container page">
        <div className="error-banner">{error}</div>
      </div>
    );

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container page">
      <h1>System overview</h1>

      <p className="muted">
        {users.length} users (
        {Object.entries(roleCounts)
          .map(([r, n]) => `${n} ${r}`)
          .join(", ")}
        ) · {campaigns.length} campaigns
      </p>

      <h2 style={{ marginTop: "2em" }}>Users</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "2em" }}>All campaigns</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Raised / Goal</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.status}</td>
              <td>
                ${Number(c.raised_amount).toLocaleString()} / $
                {Number(c.goal_amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}