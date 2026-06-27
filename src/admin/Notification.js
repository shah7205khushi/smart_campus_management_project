import React, { useEffect, useState } from "react";

function Notification() {

  const [notifications, setNotifications] = useState([]);

  const [form, setForm] = useState({
    target: "all",
    user_id: "",
    message: "",
    type: "reminder",
    status: "unread"
  });

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================================================
  // FETCH NOTIFICATIONS
  // ==================================================
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==================================================
  // HANDLE CHANGE
  // ==================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ==================================================
  // HANDLE SUBMIT
  // ==================================================
  const handleSubmit = async () => {

    if (loading === true) {
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      user_id: form.target === "single"
        ? form.user_id
        : null
    };

    try {

      let response;

      // =========================
      // UPDATE
      // =========================
      if (editId) {

        response = await fetch(
          `http://localhost:5000/update-notification/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

      }

      // =========================
      // ADD
      // =========================
      else {

        response = await fetch(
          "http://localhost:5000/add-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

      }

      const result = await response.json();

      if (result.success) {

        await fetchNotifications();

        setShowModal(false);
        setEditId(null);

        setForm({
          target: "all",
          user_id: "",
          message: "",
          type: "reminder",
          status: "unread"
        });

      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  // ==================================================
  // EDIT
  // ==================================================
  const handleEdit = (n) => {

    setForm({
      target: n.target || "all",
      user_id: n.user_id || "",
      message: n.message || "",
      type: n.type || "reminder",
      status: n.status || "unread"
    });

    setEditId(n.notification_id);
    setShowModal(true);
  };

  // ==================================================
  // DELETE
  // ==================================================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete notification?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await fetch(
        `http://localhost:5000/delete-notification/${id}`,
        {
          method: "DELETE"
        }
      );

      fetchNotifications();

    } catch (err) {

      console.log(err);

    }
  };

  // ==================================================
  // JSX
  // ==================================================
  return (
    <>

      <style>{`

        .box{
          background:white;
          padding:20px;
          border-radius:15px;
          box-shadow:0 5px 15px rgba(0,0,0,0.08);
        }

        .top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
          border-bottom:3px solid #6366f1;
          padding-bottom:12px;
        }

        .top h2{
          margin:0;
        }

        .btn-primary{
          background:#3b82f6;
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:8px;
          cursor:pointer;
          font-size:13px;
          font-weight:600;
        }

        .btn-primary:hover{
          background:#2563eb;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          background:#f3f4f6;
          padding:12px;
          font-size:13px;
        }

        td{
          padding:12px;
          border-bottom:1px solid #e5e7eb;
          text-align:center;
          font-size:13px;
        }

        .badge{
          padding:5px 10px;
          border-radius:20px;
          color:white;
          font-size:11px;
          font-weight:600;
        }

        .reminder{
          background:#10b981;
        }

        .alert{
          background:#ef4444;
        }

        .status-read{
          background:#3b82f6;
        }

        .status-unread{
          background:#f59e0b;
        }

        .unread-message{
          font-weight:bold;
        }

        .actions{
          display:flex;
          gap:8px;
          justify-content:center;
        }

        .btn-edit{
          background:#f59e0b;
          color:white;
          border:none;
          padding:7px 12px;
          border-radius:6px;
          cursor:pointer;
        }

        .btn-delete{
          background:#ef4444;
          color:white;
          border:none;
          padding:7px 12px;
          border-radius:6px;
          cursor:pointer;
        }

        /* ================= MODAL ================= */

        .modal{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:1000;
          backdrop-filter:blur(5px);
        }

        .modal-content{
          width:430px;
          background:white;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 20px 40px rgba(0,0,0,0.2);
          animation:popup 0.25s ease;
        }

        @keyframes popup{
          from{
            transform:scale(0.9);
            opacity:0;
          }
          to{
            transform:scale(1);
            opacity:1;
          }
        }

        .modal-header{
          background:linear-gradient(90deg,#1e3a8a,#3b82f6);
          color:white;
          padding:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .modal-header h3{
          margin:0;
        }

        .close{
          cursor:pointer;
          font-size:18px;
          font-weight:bold;
        }

        .modal-body{
          padding:18px;
        }

        .modal-body label{
          display:block;
          margin-top:12px;
          margin-bottom:5px;
          font-size:13px;
          font-weight:600;
          color:#374151;
        }

        .modal-body input,
        .modal-body select,
        .modal-body textarea{
          width:100%;
          padding:10px;
          border:1px solid #d1d5db;
          border-radius:8px;
          font-size:13px;
          outline:none;
          box-sizing:border-box;
        }

        .modal-body textarea{
          height:90px;
          resize:none;
        }

        .modal-footer{
          padding:15px;
          display:flex;
          justify-content:flex-end;
          gap:10px;
          background:#f9fafb;
        }

        .btn-cancel{
          background:#e5e7eb;
          border:none;
          padding:10px 16px;
          border-radius:8px;
          cursor:pointer;
        }

        .btn-save{
          background:#3b82f6;
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        }

        .btn-save:disabled{
          background:gray;
          cursor:not-allowed;
        }

      `}</style>

      {/* ================================================== */}
      {/* MAIN BOX */}
      {/* ================================================== */}

      <div className="box">

        <div className="top">

          <h2>🔔 Notifications</h2>

          <button
            className="btn-primary"
            onClick={() => {

              setEditId(null);

              setForm({
                target: "all",
                user_id: "",
                message: "",
                type: "reminder",
                status: "unread"
              });

              setShowModal(true);

            }}
          >
            + Add Notification
          </button>

        </div>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Target</th>
              <th>Message</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {notifications.map((n) => (

              <tr key={n.notification_id}>

                <td>{n.notification_id}</td>

                <td>{n.target}</td>

                <td
                  className={
                    n.status === "unread"
                    ? "unread-message"
                    : ""
                  }
                >
                  {n.message}
                </td>

                <td>
                  <span className={`badge ${n.type}`}>
                    {n.type}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      n.status === "read"
                      ? "status-read"
                      : "status-unread"
                    }`}
                  >
                    {n.status}
                  </span>
                </td>

                <td>
                  {new Date(n.created_at).toLocaleString()}
                </td>

                <td>

                  <div className="actions">

                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(n)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(n.notification_id)}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================================================== */}
      {/* MODAL */}
      {/* ================================================== */}

      {showModal && (

        <div className="modal">

          <div className="modal-content">

            <div className="modal-header">

              <h3>
                {editId
                  ? "Edit Notification"
                  : "New Notification"}
              </h3>

              <span
                className="close"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                ✖
              </span>

            </div>

            <div className="modal-body">

              <label>Target</label>

              <select
                name="target"
                value={form.target}
                onChange={handleChange}
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="single">Specific User</option>
              </select>

              {form.target === "single" && (
                <>
                  <label>User ID</label>

                  <input
                    type="number"
                    name="user_id"
                    placeholder="Enter user id"
                    value={form.user_id}
                    onChange={handleChange}
                  />
                </>
              )}

              <label>Message</label>

              <textarea
                name="message"
                placeholder="Write notification..."
                value={form.message}
                onChange={handleChange}
              />

              <label>Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="reminder">
                  Reminder
                </option>

                <option value="alert">
                  Alert
                </option>
              </select>

              {/* SHOW ONLY IN EDIT */}

              {editId && (
                <>
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="unread">
                      Unread
                    </option>

                    <option value="read">
                      Read
                    </option>
                  </select>
                </>
              )}

            </div>

            <div className="modal-footer">

              <button
                className="btn-cancel"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-save"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editId
                    ? "Update"
                    : "Send"}
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default Notification;