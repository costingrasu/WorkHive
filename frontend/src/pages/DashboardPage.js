import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Forms.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("/api/reservations/my-reservations");
        setReservations(response.data);
      } catch (err) {
        console.error("Loading rezervations error:", err);
        setError("Couldn't load reservations. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ro-RO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-container">
      <h2>My Reservations</h2>

      {loading && <p>Loading...</p>}

      {error && <div className="form-error">{error}</div>}

      {!loading && !error && (
        <>
          {reservations.length === 0 ? (
            <p className="no-reservations">No reservations yet.</p>
          ) : (
            <div className="reservations-list">
              {reservations.map((res) => (
                <div key={res.id} className="reservation-card">
                  <div className="reservation-header">
                    <span className="res-location">{res.locationName}</span>
                    <span
                      className={`res-status status-${res.status.toLowerCase()}`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="res-details">
                    <p>
                      <strong>Space:</strong> {res.spaceName}
                    </p>
                    <p>
                      <strong>From-To:</strong> {formatDate(res.start)} -{" "}
                      {formatDate(res.end)}
                    </p>
                    <p>
                      <strong>Parking:</strong> {res.parkingSpot}
                    </p>
                    {res.notes && (
                      <p>
                        <strong>Notes:</strong> {res.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <p style={{ marginTop: "2rem" }}>Reserve the place you need to bee!</p>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
