import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import CampaignCard from "../components/CampaignCard";

const CATEGORIES = [
  "Health",
  "Education",
  "Environment",
  "Disaster Relief",
  "Animals",
  "Community",
];

const HERO_IMG = "https://picsum.photos/seed/kinship-hero/1600/800";
const VOLUNTEER_IMG = "https://picsum.photos/seed/kinship-volunteer/600/700";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("active");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);

    const params = {};

    if (status) params.status = status;
    if (category) params.category = category;

    api
      .get("/campaigns/", { params })
      .then((res) => setCampaigns(res.data.results ?? res.data))
      .catch(() => setError("Could not load campaigns. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [status, category]);

  const totalRaised = campaigns.reduce(
    (sum, c) => sum + Number(c.raised_amount),
    0
  );

  return (
    <div>
      {/* Homepage content goes here */}
    </div>
  );
}