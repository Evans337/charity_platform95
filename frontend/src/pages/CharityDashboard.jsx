import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CharityDashboard() {
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [donationsByCampaign, setDonationsByCampaign] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/campaigns/")
      .then(async (res) => {
        const all = res.data.results ?? res.data;

        const mine = all.filter(
          (c) => c.organization_id === user.id
        );

        setCampaigns(mine);

        const entries = await Promise.all(
          mine.map((c) =>
            api
              .get(`/campaigns/${c.id}/donations/`)
              .then((r) => [c.id, r.data])
              .catch(() => [c.id, []])
          )
        );

        setDonationsByCampaign(Object.fromEntries(entries));
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const totalRaised = campaigns.reduce(
    (sum, c) => sum + Number(c.raised_amount),
    0
  );

  const totalGoal = campaigns.reduce(
    (sum, c) => sum + Number(c.goal_amount),
    0
  );

  const totalDonations = Object.values(
    donationsByCampaign
  ).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Your campaigns</h1>

        <Link
          to="/campaigns/new"
          className="btn btn-accent"
        >
          Start a campaign
        </Link>
      </div>

      {!loading && campaigns.length > 0 && (
        <p className="muted">
          {campaigns.length} campaign
          {campaigns.length === 1 ? "" : "s"} ·{" "}
          {totalDonations} donation
          {totalDonations === 1 ? "" : "s"} · $
          {totalRaised.toLocaleString()} raised of $
          {totalGoal.toLocaleString()} goal
        </p>
      )}

      {loading && (
        <p className="loading">Loading...</p>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="empty-state">
          You haven't started a campaign yet.
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <table
          className="data-table"
          style={{ marginTop: "1em" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Donations</th>
              <th>Raised</th>
              <th>Goal</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/campaigns/${c.id}`}>
                    {c.title}
                  </Link>
                </td>

                <td>{c.status}</td>

                <td>
                  {donationsByCampaign[c.id]?.length ?? "..."}
                </td>

                <td>
                  ${Number(c.raised_amount).toLocaleString()}
                </td>

                <td>
                  ${Number(c.goal_amount).toLocaleString()}
                </td>

                <td>
                  <Link to={`/campaigns/${c.id}/edit`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}