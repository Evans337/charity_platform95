import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function DonorDashboard() {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/donations/my-donations/")
      .then((res) => setDonations(res.data))
      .finally(() => setLoading(false));
  }, []);

  const successful = donations.filter(
    (d) => d.status === "success"
  );

  const total = successful.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  return (
    <div className="container page">
      <h1>Welcome back, {user.name.split(" ")[0]}</h1>

      <h2 style={{ marginTop: "1.5em" }}>
        Donation history
      </h2>

      {loading && <p className="loading">Loading...</p>}

      {!loading && donations.length === 0 && (
        <div className="empty-state">
          You haven't made a donation yet. Find a campaign below
          to get started.
        </div>
      )}

      {!loading && donations.length > 0 && (
        <>
          <p className="muted">
            {successful.length} donation
            {successful.length === 1 ? "" : "s"} · $
            {total.toLocaleString()} given total
          </p>

          <table
            className="data-table"
            style={{ marginTop: "0.8em" }}
          >
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link to={`/campaigns/${d.campaign}`}>
                      {d.campaign_title}
                    </Link>
                  </td>

                  <td>
                    ${Number(d.amount).toLocaleString()}
                  </td>

                  <td>{d.status}</td>

                  <td>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}