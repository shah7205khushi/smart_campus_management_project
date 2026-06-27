import React, { useEffect, useState } from "react";

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/student/notifications")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data || []).filter(
          (n) => n.target === "student" || n.target === "all"
        );

        setNotifications(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ICONS
  const getIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "exam":
        return "📘";
      case "assignment":
        return "📝";
      case "holiday":
        return "🎉";
      case "warning":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  // COLORS
  const getColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "exam":
        return "#3b82f6";
      case "assignment":
        return "#22c55e";
      case "holiday":
        return "#f59e0b";
      case "warning":
        return "#ef4444";
      default:
        return "#8b5cf6";
    }
  };

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loader}></div>
        <h3>Loading Notifications...</h3>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🔔 Notifications</h1>
        <p>All your important updates in one place</p>
      </div>

      {/* EMPTY */}
      {notifications.length === 0 && (
        <div style={styles.empty}>
          📭 No notifications yet
        </div>
      )}

      {/* SCROLL AREA */}
      <div style={styles.scrollArea}>
        <div style={styles.grid}>
          {visibleNotifications.map((n) => (
            <div key={n.notification_id} style={styles.card}>

              <div
                style={{
                  ...styles.bar,
                  background: getColor(n.type),
                }}
              />

              <div style={styles.icon}>
                {getIcon(n.type)}
              </div>

              <div style={styles.content}>
                <div style={styles.title}>
                  {(n.type || "notice").toUpperCase()}
                </div>

                <div style={styles.msg}>
                  {n.message || "No message"}
                </div>

                <div style={styles.time}>
                  🕒{" "}
                  {n.created_at
                    ? new Date(n.created_at).toLocaleString()
                    : "No date"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      {notifications.length > 5 && (
        <div style={styles.btnBox}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={styles.button}
          >
            {showAll ? "⬆ Show Less" : "⬇ Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentNotifications;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "20px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    overflow: "hidden",
  },

  header: {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "15px",
    flexShrink: 0,
  },

  scrollArea: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "5px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "16px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "white",
    padding: "14px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    position: "relative",
  },

  bar: {
    width: "5px",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: "10px",
  },

  icon: {
    fontSize: "24px",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: "8px",
  },

  title: {
    fontWeight: "700",
    fontSize: "13px",
  },

  msg: {
    fontSize: "13px",
    color: "#4b5563",
    marginTop: "3px",
  },

  time: {
    fontSize: "11px",
    marginTop: "5px",
    color: "#9ca3af",
  },

  btnBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    flexShrink: 0,
  },

  button: {
    padding: "10px 16px",
    borderRadius: "20px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
  },

  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },

  loader: {
    width: "45px",
    height: "45px",
    border: "5px solid #ddd",
    borderTop: "5px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};