import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/campaigns/")
      .then((res) => {
        setCampaigns(res.data.results || res.data);
      })
      .catch(() => {
        setError("Could not load campaigns.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container page">
      <h1>Dashboard</h1>

      <p>
        Welcome, <strong>{user?.name}</strong>.
      </p>

      {user?.role === "charity" && (
        <p>
          <Link className="btn btn-primary" to="/campaigns/new">
            Create campaign
          </Link>
        </p>
      )}

      <section>
        <h2>Your Campaigns</h2>

        {loading && <p>Loading campaigns...</p>}

        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && campaigns.length === 0 && (
          <p>No campaigns found.</p>
        )}

        {!loading && !error && campaigns.length > 0 && (
          <div className="campaign-grid">
            {campaigns.map((campaign) => (
              <div className="card" key={campaign.id}>
                <h3>{campaign.title}</h3>

                <p>{campaign.description}</p>

                <p>
                  <strong>Goal:</strong> {campaign.goal_amount}
                </p>

                <Link to={`/campaigns/${campaign.id}`}>
                  View campaign
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}