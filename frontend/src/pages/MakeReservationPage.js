import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useBlocker } from "react-router-dom";
import { createPortal } from "react-dom";
import { formatDate } from "../utils/dateUtils";
import "../styles/Forms.css";

const MakeReservationPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState([]);

  const [locationId, setLocationId] = useState("");
  const [spaceType, setSpaceType] = useState("WORKSPACE");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [wantsParking, setWantsParking] = useState(false);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDirty = locationId !== "" || start !== "" || end !== "" || step > 1;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  const resetFormState = () => {
    setLocationId("");
    setStart("");
    setEnd("");
    setStep(1);
  };

  useEffect(() => {
    axios
      .get("/api/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/spaces/available", {
        params: {
          locationId: locationId,
          type: spaceType,
          start: start,
          end: end,
        },
      });

      setAvailableSpaces(response.data);
      if (response.data.length === 0) {
        setError(
          "No spaces available for this time slot. Try different hours."
        );
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("Search failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const selectSpace = (space) => {
    setSelectedSpace(space);
    setStep(3);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axios.post("/api/reservations", {
        spaceId: selectedSpace.id,
        start: start,
        end: end,
        wantsParking: wantsParking,
        notes: notes,
      });

      resetFormState();
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Could not save reservation. Parking might be full.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedLocationName = () => {
    const loc = locations.find((l) => l.id === Number(locationId));
    return loc ? loc.name : "Unknown Location";
  };

  return (
    <div className="form-container reservation-wizard">
      {blocker.state === "blocked"
        ? createPortal(
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Unsaved Changes</h3>
                <p>
                  You have started a reservation. If you leave, your progress
                  will be lost.
                </p>
                <div className="modal-actions">
                  <button
                    className="form-button secondary"
                    onClick={() => blocker.reset()}
                  >
                    Keep Editing
                  </button>
                  <button
                    className="form-button danger"
                    onClick={() => blocker.proceed()}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <h2>Make Reservation</h2>

      <div className="steps-indicator">
        <div className={`step ${step === 1 ? "active" : ""}`}>1. Search</div>
        <div className={`step ${step === 2 ? "active" : ""}`}>2. Select</div>
        <div className={`step ${step === 3 ? "active" : ""}`}>3. Confirm</div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {step === 1 && (
        <form onSubmit={handleSearch} className="wizard-form">
          <div className="form-group">
            <label>Location</label>
            <div className="input-wrapper">
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select a building...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city}) - {loc.totalSpaces} spaces
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Space Type</label>
            <div className="radio-group-container">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={spaceType === "WORKSPACE"}
                  onChange={() => setSpaceType("WORKSPACE")}
                />{" "}
                Workspace
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={spaceType === "MEETING_ROOM"}
                  onChange={() => setSpaceType("MEETING_ROOM")}
                />{" "}
                Meeting Room
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <div className="input-wrapper">
              <input
                type="datetime-local"
                className="form-input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Time</label>
            <div className="input-wrapper">
              <input
                type="datetime-local"
                className="form-input"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Searching..." : "Find Spaces"}
          </button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h3 className="step-title">Available Spaces</h3>

          <div className="spaces-grid">
            {availableSpaces.map((space) => (
              <div
                key={space.id}
                className="space-card"
                onClick={() => selectSpace(space)}
              >
                <div className="space-name">{space.name}</div>
                <p>{space.description}</p>

                <div className="resource-tags-container">
                  {space.resourceNames.map((res, idx) => (
                    <span key={idx} className="resource-tag">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="form-button secondary" onClick={() => setStep(1)}>
            Back
          </button>
        </div>
      )}

      {step === 3 && selectedSpace && (
        <div>
          <h3 className="step-title">Confirm Reservation</h3>

          <div className="confirmation-details">
            <p>
              <strong>Location:</strong> {getSelectedLocationName()}
            </p>
            <p>
              <strong>Space:</strong> {selectedSpace.name}
            </p>

            <p>
              <strong>From - To:</strong>
            </p>
            <p>
              {formatDate(start)} &mdash; {formatDate(end)}
            </p>
          </div>

          <div className="parking-option">
            <input
              type="checkbox"
              id="parkingCheck"
              checked={wantsParking}
              onChange={(e) => setWantsParking(e.target.checked)}
            />
            <label htmlFor="parkingCheck" className="parking-label-content">
              <strong>Include Parking Spot?</strong>
              <br />
              <span className="parking-hint">
                System will auto-assign a spot if available.
              </span>
            </label>
          </div>

          <div className="notes-container">
            <label>Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
            />
          </div>

          <div className="form-actions">
            <button
              className="form-button secondary btn-flex-1"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="form-button btn-flex-2"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeReservationPage;
