import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/Admin.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [editId, setEditId] = useState(null);

  const [stats, setStats] = useState({
    inactiveUsers: [],
    topLocations: [],
    reservations: [],
  });
  const [locations, setLocations] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [resources, setResources] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [users, setUsers] = useState([]);

  const [newLoc, setNewLoc] = useState({
    name: "",
    city: "",
    address: "",
    floor: "",
  });
  const [newRes, setNewRes] = useState({ name: "", description: "" });
  const [newPark, setNewPark] = useState({ locationId: "", spotNumber: "" });
  const [newSpace, setNewSpace] = useState({
    name: "",
    locationId: "",
    type: "WORKSPACE",
    description: "",
    resourceIdsStr: "",
  });

  const resetForms = () => {
    setEditId(null);
    setNewLoc({ name: "", city: "", address: "", floor: "" });
    setNewRes({ name: "", description: "" });
    setNewPark({ locationId: "", spotNumber: "" });
    setNewSpace({
      name: "",
      locationId: "",
      type: "WORKSPACE",
      description: "",
      resourceIdsStr: "",
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const [resInactive, resTop, resAllRes] = await Promise.all([
          axios.get("/api/admin/inactive-users"),
          axios.get("/api/admin/top-locations"),
          axios.get("/api/admin/all-reservations"),
        ]);
        setStats({
          inactiveUsers: resInactive.data,
          topLocations: resTop.data,
          reservations: resAllRes.data,
        });
      } else if (activeTab === "locations") {
        const res = await axios.get("/api/locations");
        setLocations(res.data);
      } else if (activeTab === "spaces") {
        const resLocs = await axios.get("/api/locations");
        setLocations(resLocs.data);
        const resSpaces = await axios.get("/api/admin/spaces-report");
        setSpaces(resSpaces.data);
      } else if (activeTab === "resources") {
        const res = await axios.get("/api/admin/resources-report");
        setResources(res.data);
      } else if (activeTab === "parkings") {
        const resLocs = await axios.get("/api/locations");
        setLocations(resLocs.data);
        const res = await axios.get("/api/admin/parkings-report");
        setParkings(res.data);
      } else if (activeTab === "users") {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
    resetForms();
  }, [fetchData, refreshTrigger]);

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${endpoint}/${id}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert("Error deleting. It might be linked to other data.");
    }
  };

  const handleEditLocation = (loc) => {
    setEditId(loc.id);
    setNewLoc({
      name: loc.name,
      city: loc.city,
      address: loc.address || "",
      floor: loc.floor || "",
    });
    window.scrollTo(0, 0);
  };

  const handleEditResource = (res) => {
    setEditId(res.id);
    setNewRes({ name: res.name, description: "" });
    window.scrollTo(0, 0);
  };

  const handleEditParking = (park) => {
    setEditId(park.id);
    setNewPark({ locationId: "", spotNumber: park.spotNumber });
    window.scrollTo(0, 0);
  };

  const submitLocation = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/admin/locations/${editId}`, newLoc);
    } else {
      await axios.post("/api/admin/locations", newLoc);
    }
    setRefreshTrigger((prev) => prev + 1);
    resetForms();
  };

  const submitResource = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/admin/resources/${editId}`, newRes);
    } else {
      await axios.post("/api/admin/resources", newRes);
    }
    setRefreshTrigger((prev) => prev + 1);
    resetForms();
  };

  const submitParking = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/admin/parkings/${editId}`, newPark);
    } else {
      await axios.post("/api/admin/parkings", newPark);
    }
    setRefreshTrigger((prev) => prev + 1);
    resetForms();
  };

  const submitSpace = async (e) => {
    e.preventDefault();
    const resIds = newSpace.resourceIdsStr
      ? newSpace.resourceIdsStr.split(",").map((s) => parseInt(s.trim()))
      : [];
    const payload = { ...newSpace, resourceIds: resIds };

    if (editId) {
      await axios.put(`/api/admin/spaces/${editId}`, payload);
    } else {
      await axios.post("/api/admin/spaces", payload);
    }
    setRefreshTrigger((prev) => prev + 1);
    resetForms();
  };

  const CancelButton = () =>
    editId ? (
      <button
        type="button"
        className="form-button secondary"
        onClick={resetForms}
        style={{ marginLeft: "10px", background: "#d9534f" }}
      >
        Cancel Edit
      </button>
    ) : null;

  return (
    <div className="admin-container">
      <h2>Admin Panel 🛠️</h2>

      <div className="admin-tabs">
        {[
          "overview",
          "locations",
          "spaces",
          "resources",
          "parkings",
          "users",
        ].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading data...</p>}

      {activeTab === "overview" && (
        <div>
          <h3>📊 Top Locations</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Reservations</th>
              </tr>
            </thead>
            <tbody>
              {stats.topLocations.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.reservationCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: "2rem" }}>😴 Inactive Users</h3>

          {stats.inactiveUsers.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#666" }}>
              Everyone is active! No sleepy users.
            </p>
          ) : (
            <ul className="inactive-users-list">
              {stats.inactiveUsers.map((u) => (
                <li key={u.id} className="inactive-user-item">
                  <span className="pillow-icon">💤</span>
                  <div>
                    <strong>
                      {u.firstName} {u.lastName}
                    </strong>
                    <span className="user-email-muted">({u.email})</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3 style={{ marginTop: "2rem" }}>📅 All Reservations</h3>
          <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Space</th>
                  <th>Start</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.userEmail}</td>
                    <td>{r.spaceName}</td>
                    <td>{new Date(r.startTime).toLocaleString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete("/api/admin/reservations", r.id)
                        }
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "locations" && (
        <div>
          <div className="admin-form">
            <h3>{editId ? `Edit Location #${editId}` : "Add Location"}</h3>
            <form onSubmit={submitLocation}>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder="Name"
                  value={newLoc.name}
                  onChange={(e) =>
                    setNewLoc({ ...newLoc, name: e.target.value })
                  }
                  required
                />
                <input
                  className="form-input"
                  placeholder="City"
                  value={newLoc.city}
                  onChange={(e) =>
                    setNewLoc({ ...newLoc, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row" style={{ marginTop: "10px" }}>
                <input
                  className="form-input"
                  placeholder="Address"
                  value={newLoc.address}
                  onChange={(e) =>
                    setNewLoc({ ...newLoc, address: e.target.value })
                  }
                />
                <input
                  className="form-input"
                  placeholder="Floor info"
                  value={newLoc.floor}
                  onChange={(e) =>
                    setNewLoc({ ...newLoc, floor: e.target.value })
                  }
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <button className="form-button">
                  {editId ? "Update Location" : "Save Location"}
                </button>
                <CancelButton />
              </div>
            </form>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.name}</td>
                  <td>{l.city}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ background: "#f0ad4e", marginRight: "5px" }}
                      onClick={() => handleEditLocation(l)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("/api/admin/locations", l.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "spaces" && (
        <div>
          <div className="admin-form">
            <h3>{editId ? `Edit Space #${editId}` : "Add Space"}</h3>
            <form onSubmit={submitSpace}>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder="Name"
                  value={newSpace.name}
                  onChange={(e) =>
                    setNewSpace({ ...newSpace, name: e.target.value })
                  }
                  required
                />
                <select
                  className="form-input"
                  value={newSpace.locationId}
                  onChange={(e) =>
                    setNewSpace({ ...newSpace, locationId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row" style={{ marginTop: "10px" }}>
                <select
                  className="form-input"
                  value={newSpace.type}
                  onChange={(e) =>
                    setNewSpace({ ...newSpace, type: e.target.value })
                  }
                >
                  <option value="WORKSPACE">WORKSPACE</option>
                  <option value="MEETING_ROOM">MEETING ROOM</option>
                </select>
                <input
                  className="form-input"
                  placeholder="Resource IDs (ex: 1, 2)"
                  value={newSpace.resourceIdsStr}
                  onChange={(e) =>
                    setNewSpace({
                      ...newSpace,
                      resourceIdsStr: e.target.value,
                    })
                  }
                />
              </div>
              <textarea
                className="form-input"
                style={{ marginTop: "10px" }}
                placeholder="Description"
                value={newSpace.description}
                onChange={(e) =>
                  setNewSpace({ ...newSpace, description: e.target.value })
                }
              />
              <div style={{ marginTop: "10px" }}>
                <button className="form-button">
                  {editId ? "Update Space" : "Save Space"}
                </button>
                <CancelButton />
              </div>
            </form>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {spaces.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.type}</td>
                  <td>{s.locationName}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ background: "#f0ad4e", marginRight: "5px" }}
                      onClick={() => {
                        setEditId(s.id);
                        setNewSpace({
                          name: s.name,
                          type: s.type,
                          locationId: "",
                          description: "",
                          resourceIdsStr: "",
                        });
                        window.scrollTo(0, 0);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("/api/admin/spaces", s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "resources" && (
        <div>
          <div className="admin-form">
            <h3>{editId ? `Edit Resource #${editId}` : "Add Resource"}</h3>
            <form onSubmit={submitResource}>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder="Name"
                  value={newRes.name}
                  onChange={(e) =>
                    setNewRes({ ...newRes, name: e.target.value })
                  }
                  required
                />
                <input
                  className="form-input"
                  placeholder="Description"
                  value={newRes.description}
                  onChange={(e) =>
                    setNewRes({ ...newRes, description: e.target.value })
                  }
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <button className="form-button">
                  {editId ? "Update Resource" : "Save Resource"}
                </button>
                <CancelButton />
              </div>
            </form>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.spaceName}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ background: "#f0ad4e", marginRight: "5px" }}
                      onClick={() => handleEditResource(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("/api/admin/resources", r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "parkings" && (
        <div>
          <div className="admin-form">
            <h3>{editId ? `Edit Spot #${editId}` : "Add Parking Spot"}</h3>
            <form onSubmit={submitParking}>
              <div className="form-row">
                <select
                  className="form-input"
                  value={newPark.locationId}
                  onChange={(e) =>
                    setNewPark({ ...newPark, locationId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Spot Number"
                  value={newPark.spotNumber}
                  onChange={(e) =>
                    setNewPark({ ...newPark, spotNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <button className="form-button">
                  {editId ? "Update Spot" : "Save Spot"}
                </button>
                <CancelButton />
              </div>
            </form>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Spot #</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parkings.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.spotNumber}</td>
                  <td>{p.locationName}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ background: "#f0ad4e", marginRight: "5px" }}
                      onClick={() => handleEditParking(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("/api/admin/parkings", p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    {u.firstName} {u.lastName}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("/api/admin/users", u.id)}
                    >
                      Ban User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
