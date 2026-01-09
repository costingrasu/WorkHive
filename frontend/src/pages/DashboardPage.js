import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateUtils";
import "../styles/Forms.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("/api/reservations/my-reservations");
        setReservations(response.data);
      } catch (err) {
        console.error("Loading reservations error:", err);
        setError("Couldn't load reservations. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [refreshTrigger]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initiateCancel = (id) => {
    setReservationToCancel(id);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!reservationToCancel) return;

    try {
      await axios.put(`/api/reservations/${reservationToCancel}/cancel`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert("Could not cancel reservation.");
      console.error(err);
    } finally {
      setShowModal(false);
      setReservationToCancel(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setReservationToCancel(null);
  };

  return (
    <div className="dashboard-container">
      {showModal &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Cancel Reservation?</h3>
              <p>
                Are you sure you want to cancel this reservation? This action
                cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="form-button secondary" onClick={closeModal}>
                  No, Keep it
                </button>
                <button className="form-button danger" onClick={confirmCancel}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

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
                      className={`res-status status-${
                        res.status ? res.status.toLowerCase() : "confirmed"
                      }`}
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

                  {res.status !== "CANCELLED" && (
                    <button
                      className="cancel-res-btn"
                      onClick={() => initiateCancel(res.id)}
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={handleLogout}
        className="logout-button"
        style={{ marginTop: "2rem" }}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
