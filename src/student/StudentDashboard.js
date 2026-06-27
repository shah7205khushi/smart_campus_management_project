import React, { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import SubjectPerformance from "./SubjectPerformance";
import Timetable from "./TimeTable";
import Calendar from "./Calendar";
import Assignments from "./Assignments";
import Plan_Generator from "./Plan_Generator";
import Notification from "./Notification";

/* ================= MAIN DASHBOARD ================= */

function StudentDashboard({ user, setUser }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "subjects":
        return <SubjectPerformance />;

      case "timetable":
        return <Timetable />;

      case "calendar":
        return <Calendar />;

      case "assignments":
        return <Assignments />;

      case "notification":
        return <Notification />;

      case "plan_generator":
        return <Plan_Generator />;

      default:
        return <StudentHome user={user} />;
    }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoBox}>
          <h1 style={styles.logoText}>🎓 Student Panel</h1>

          <p style={styles.logoSub}>
            Smart Campus Management System
          </p>
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("dashboard")}
        >
          🏠 Dashboard
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("subjects")}
        >
          📚 Subjects
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("timetable")}
        >
          🗓 Timetable
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("calendar")}
        >
          📅 Calendar
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("assignments")}
        >
          📝 Assignments
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("notification")}
        >
          🔔 Notifications
        </div>

        <div
          style={styles.navItem}
          onClick={() => setActivePage("plan_generator")}
        >
          🧠 Study Plan
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <div>
            <h2 style={styles.navTitle}>
              ✨ Smart Campus Dashboard
            </h2>

            <p style={styles.navSub}>
              Modern Student Learning Portal
            </p>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={styles.profileBtn}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              👤 {user?.name}
            </div>

            {profileOpen && (
              <div
  style={styles.dropdownItem}
  onClick={() => {
    if (typeof setUser === "function") {
      setUser(null);
    } else {
      // fallback logout
      localStorage.clear();
      window.location.href = "/login";
    }
  }}
>
  🚪 Logout
</div>
            )}
          </div>
        </div>

        <div style={styles.content}>{renderPage()}</div>
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function StudentHome({ user }) {
  const studentId = 1;

  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState([]);

  const [openSubject, setOpenSubject] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // ASSIGNMENTS
  useEffect(() => {
    fetch("http://localhost:5000/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data || []))
      .catch((err) => console.log(err));
  }, []);

  // NOTIFICATIONS
  useEffect(() => {
    fetch("http://localhost:5000/api/student/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data || []))
      .catch((err) => console.log(err));
  }, []);

  // SUBJECT PERFORMANCE
  useEffect(() => {
    fetch(`http://localhost:5000/api/performance/${studentId}`)
      .then((res) => res.json())
      .then((data) => setData(data || []))
      .catch((err) => console.log(err));
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    const target = (n?.target || "all").toLowerCase();

    return target === "all" || target === "student";
  });

  const donutData = [
    { name: "Subjects", value: data.length },
    { name: "Assignments", value: assignments.length },
    { name: "Notifications", value: filteredNotifications.length },
    { name: "Completed", value: Math.max(1, assignments.length - 2) },
  ];

  const COLORS = ["#6366f1", "#ec4899", "#06b6d4", "#f59e0b"];

  return (
    <div>
      {/* HERO */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heroTitle}>
Welcome Back, {user?.name || "Jil Shah"} 👋          </h1>

          <p style={styles.heroText}>
            Track your assignments, performance,
            timetable & academic progress
          </p>
        </div>

        <div style={styles.heroBadge}>
          🎯 Academic Progress
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, background: styles.grad1 }}>
          <div style={styles.cardIcon}>📚</div>

          <h1 style={styles.cardNumber}>{data.length}</h1>

          <p style={styles.cardText}>Subjects</p>
        </div>

        <div style={{ ...styles.statCard, background: styles.grad2 }}>
          <div style={styles.cardIcon}>📝</div>

          <h1 style={styles.cardNumber}>
            {assignments.length}
          </h1>

          <p style={styles.cardText}>Assignments</p>
        </div>

        <div style={{ ...styles.statCard, background: styles.grad3 }}>
          <div style={styles.cardIcon}>🔔</div>

          <h1 style={styles.cardNumber}>
            {filteredNotifications.length}
          </h1>

          <p style={styles.cardText}>Notifications</p>
        </div>

        {/* DONUT CHART */}
        <div style={styles.chartCard}>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p style={styles.chartText}>
            📊 Overall Progress
          </p>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div style={styles.bottomGrid}>
        {/* SUBJECTS */}
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>
            📚 Subject Materials
          </h2>

          {data.map((sub, i) => (
            <div key={i}>
              <div
                style={styles.subject}
                onClick={() =>
                  setOpenSubject(openSubject === i ? null : i)
                }
              >
                📘 {sub.subject}
              </div>

              {openSubject === i &&
                sub.topics.map((topic, j) => (
                  <div key={j} style={{ marginLeft: 15 }}>
                    <div
                      style={styles.topic}
                      onClick={() =>
                        setOpenTopic(openTopic === j ? null : j)
                      }
                    >
                      📂 {topic.name}
                    </div>

                    {openTopic === j &&
                      topic.materials.map((mat, k) => (
                        <div key={k} style={styles.material}>
                          📄 {mat.title}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* ASSIGNMENTS */}
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>
            📝 Assignments
          </h2>

          {assignments.slice(0, 5).map((a, i) => (
            <div key={i} style={styles.assignmentCard}>
              <div style={styles.assignmentTitle}>
                {a.title}
              </div>

              <div style={styles.assignmentSub}>
                📘 {a.subject}
              </div>
            </div>
          ))}
        </div>

        {/* CALENDAR */}
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>
            📅 Academic Calendar
          </h2>

          <CalendarMini />
        </div>

        {/* NOTIFICATIONS */}
        <div style={{ ...styles.box, gridColumn: "1 / span 3" }}>
          <h2 style={styles.boxTitle}>
            🔔 Notifications
          </h2>

          {filteredNotifications
            .slice(
              0,
              showAll
                ? filteredNotifications.length
                : 3
            )
            .map((n, i) => (
              <div key={i} style={styles.notificationCard}>
                <div style={styles.notificationIcon}>
                  🔔
                </div>

                <div>
                  <div style={styles.notificationText}>
                    {n.message}
                  </div>

                  <div style={styles.notificationSub}>
                    Smart Campus Notification
                  </div>
                </div>
              </div>
            ))}

          {filteredNotifications.length > 3 && (
            <div
              onClick={() => setShowAll(!showAll)}
              style={styles.showBtn}
            >
              {showAll
                ? "▲ Show Less"
                : "▼ Show More"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= MINI CALENDAR ================= */

function CalendarMini() {
  const [date, setDate] = useState(new Date());
  const [hovered, setHovered] = useState(null);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const days = new Date(year, month + 1, 0).getDate();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const format = (d) =>
    `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;

  const changeMonth = (dir) => {
    setDate(new Date(year, month + dir, 1));
  };

  const events = {
    "2026-05-12": {
      type: "exam",
      title: "Cloud Computing Exam",
    },
    "2026-05-7": {
      type: "Assignment",
      title: "project submission",
    },

    "2026-05-13": {
      type: "exam",
      title: "ML exam",
    },

    "2026-05-27": {
      type: "holiday",
      title: "bakriid",
    },

    "2026-05-14": {
      type: "exam",
      title: "DL exam",
    },
  };

  return (
    <div>
      <div style={mini.header}>
        <button
          style={mini.btn}
          onClick={() => changeMonth(-1)}
        >
          ⬅
        </button>

        <b>
          {date.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </b>

        <button
          style={mini.btn}
          onClick={() => changeMonth(1)}
        >
          ➡
        </button>
      </div>

      <div style={mini.grid}>
        {["S", "M", "T", "W", "T", "F", "S"].map(
          (d) => (
            <div key={d} style={mini.dayName}>
              {d}
            </div>
          )
        )}

        {Array.from({ length: firstDay }).map(
          (_, i) => (
            <div key={i}></div>
          )
        )}

        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1;

          const dateStr = format(d);

          const ev = events[dateStr];

          return (
            <div
              key={d}
              style={{
                ...mini.cell,

                border:
                  dateStr === today
                    ? "2px solid #6366f1"
                    : "1px solid #e2e8f0",

                background:
                  ev?.type === "exam"
                    ? "#fee2e2"
                    : ev?.type === "assignment"
                    ? "#dbeafe"
                    : ev?.type === "holiday"
                    ? "#fef9c3"
                    : "#fff",
              }}
              onMouseEnter={() =>
                setHovered({ dateStr, ev })
              }
              onMouseLeave={() => setHovered(null)}
            >
              {d}

              {ev && <div style={mini.dot} />}

              {hovered?.dateStr === dateStr &&
                ev && (
                  <div style={mini.tooltip}>
                    {ev.title}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  grad1:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",

  grad2:
    "linear-gradient(135deg,#ec4899,#f43f5e)",

  grad3:
    "linear-gradient(135deg,#06b6d4,#0ea5e9)",

  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    background:
      "linear-gradient(135deg,#eef2ff,#fdf2f8,#ecfeff)",
  },

  sidebar: {
    width: 260,
    padding: 20,
    color: "white",
    background:
      "linear-gradient(180deg,#1e1b4b,#312e81,#4338ca)",
  },

  main: {
    flex: 1,
    overflowX: "hidden",
  },

  content: {
    padding: 25,
  },

  navbar: {
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
  },

  navTitle: {
    margin: 0,
    color: "#312e81",
    fontSize: 26,
    fontWeight: "bold",
  },

  navSub: {
    color: "#64748b",
  },

  profileBtn: {
    padding: "10px 20px",
    borderRadius: 25,
    background:
      "linear-gradient(135deg,#6366f1,#ec4899)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  dropdown: {
    position: "absolute",
    top: 55,
    right: 0,
    width: 150,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 14,
    cursor: "pointer",
    fontWeight: "600",
  },

  header: {
    padding: 30,
    borderRadius: 24,
    marginBottom: 25,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)",
  },

  heroTitle: {
    fontSize: 34,
    margin: 0,
    fontWeight: "bold",
  },

  heroText: {
    marginTop: 10,
  },

  heroBadge: {
    padding: "14px 22px",
    borderRadius: 30,
    background: "rgba(255,255,255,0.2)",
    fontWeight: "bold",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
    marginBottom: 25,
  },

  statCard: {
    padding: 25,
    borderRadius: 24,
    color: "white",
    textAlign: "center",
  },

  chartCard: {
    background: "white",
    borderRadius: 24,
    padding: 15,
  },

  cardIcon: {
    fontSize: 34,
  },

  cardNumber: {
    fontSize: 38,
    margin: "10px 0",
  },

  cardText: {
    fontWeight: "600",
  },

  chartText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#312e81",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },

  box: {
    background: "white",
    padding: 22,
    borderRadius: 24,
  },

  boxTitle: {
    color: "#312e81",
    marginBottom: 18,
    fontWeight: "bold",
  },

  subject: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    background: "#eef2ff",
    cursor: "pointer",
    fontWeight: "600",
  },

  topic: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    background: "#f5f3ff",
    cursor: "pointer",
  },

  material: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    background: "#f8fafc",
  },

  assignmentCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    background: "#f8fafc",
  },

  assignmentTitle: {
    fontWeight: "bold",
    color: "#312e81",
  },

  assignmentSub: {
    fontSize: 13,
    marginTop: 4,
    color: "#64748b",
  },

  notificationCard: {
    display: "flex",
    gap: 12,
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    background: "#f8fafc",
  },

  notificationIcon: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#6366f1,#ec4899)",
    color: "white",
  },

  notificationText: {
    fontWeight: "600",
  },

  notificationSub: {
    fontSize: 12,
    color: "#64748b",
  },

  showBtn: {
    textAlign: "center",
    cursor: "pointer",
    color: "#4f46e5",
    fontWeight: "bold",
  },

  navItem: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    fontWeight: "600",
  },

  logoBox: {
    marginBottom: 25,
    textAlign: "center",
  },

  logoText: {
    fontSize: 28,
    margin: 0,
  },

  logoSub: {
    fontSize: 12,
    opacity: 0.8,
  },
};

const mini = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  btn: {
    border: "none",
    padding: 8,
    borderRadius: 10,
    cursor: "pointer",
    background: "#eef2ff",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7,1fr)",
    gap: 8,
  },

  dayName: {
    textAlign: "center",
    fontWeight: "800",
    color: "#312e81",
  },

  cell: {
    minHeight: 48,
    borderRadius: 12,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    cursor: "pointer",
  },

  dot: {
    position: "absolute",
    bottom: 5,
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#ef4444",
  },

  tooltip: {
    position: "absolute",
    top: -28,
    background: "#111827",
    color: "white",
    fontSize: 10,
    padding: "4px 8px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    zIndex: 10,
  },
};

export default StudentDashboard;