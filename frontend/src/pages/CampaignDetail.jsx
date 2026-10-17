import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import ProgressBar from "../components/ProgressBar";
import DonateForm from "../components/DonateForm";
import { useAuth } from "../context/AuthContext";