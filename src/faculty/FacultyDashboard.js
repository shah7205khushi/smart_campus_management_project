
// import React from "react";

// import Students from "./Students";
// import Assignments from "./Assignments";
// import Calendar from "./Calendar";
// import Exams from "./Exams";
// import Schedule from "./Schedule";
// import Notification from "./Notification";
// import SubjectPlan from "./SubjectPlan";
// // import Tasks from "./Tasks";

// function Facultydashboard({ user }) {
//   const [activePage, setActivePage] = React.useState("dashboard");
//   const [showMenu, setShowMenu] = React.useState(false);

//   const menu = [
//     { key: "dashboard", label: "Dashboard", icon: "🏠", color: "#60a5fa" },
//     { key: "students", label: "Students", icon: "👨‍🎓", color: "#34d399" },
//     { key: "assignments", label: "Assignments", icon: "📝", color: "#f472b6" },
//     { key: "calendar", label: "Calendar", icon: "📅", color: "#fbbf24" },
//     { key: "exams", label: "Exams", icon: "📊", color: "#a78bfa" },
//     { key: "schedule", label: "Schedule", icon: "🕒", color: "#38bdf8" },
//     { key: "notifications", label: "Notifications", icon: "🔔", color: "#fb7185" },
//     { key: "subjectplan", label: "Subject Plan", icon: "📘", color: "#22c55e" },
//     // { key: "tasks", label: "Tasks", icon: "⏳", color: "#f97316" },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   const handleEditProfile = () => {
//     alert("Open edit profile modal here");
//   };

//   const renderPage = () => {
//     switch (activePage) {
//       case "students":
//         return <Students />;
//       case "assignments":
//         return <Assignments facultyId={user?.id} />;
//       case "calendar":
//         return <Calendar />;
//       case "exams":
//         return <Exams />;
//       case "schedule":
//         return <Schedule facultyId={user?.id} />;
//       case "notifications":
//         return <Notification />;
//       case "subjectplan":
//         return <SubjectPlan facultyId={user?.id} />;
//       // case "tasks":
//       //   return <Tasks facultyId={user?.id} />;
//       default:
//         return <DashboardHome user={user} setActivePage={setActivePage} />;
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* SIDEBAR */}
//       <div style={styles.sidebar}>
//         <h2 style={styles.logo}>🎓 Faculty Hub</h2>

//         <div style={styles.nav}>
//           {menu.map((item) => (
//             <div
//               key={item.key}
//               onClick={() => setActivePage(item.key)}
//               style={{
//                 ...styles.navItem,
//                 background:
//                   activePage === item.key
//                     ? "rgba(255,255,255,0.12)"
//                     : "transparent",
//                 borderLeft:
//                   activePage === item.key
//                     ? `4px solid ${item.color}`
//                     : "4px solid transparent",
//               }}
//             >
//               <span style={{ color: item.color }}>{item.icon}</span>
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MAIN */}
//       <div style={styles.main}>
//         <div style={styles.topbar}>
//           <h2>🎓 Smart Faculty Dashboard</h2>

//           {/* PROFILE DROPDOWN */}
//           <div style={styles.profileWrapper}>
//             <div
//               style={styles.profile}
//               onClick={() => setShowMenu(!showMenu)}
//             >
//               👋 {user?.name || "Faculty"}
//             </div>

//             {showMenu && (
//               <div style={styles.dropdown}>
//                 <div style={styles.dropItem} onClick={handleEditProfile}>
//                   ✏️ Edit Profile
//                 </div>
//                 <div style={styles.dropItem} onClick={handleLogout}>
//                   🚪 Logout
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={styles.content}>{renderPage()}</div>
//       </div>
//     </div>
//   );
// }

// /* ================= DASHBOARD HOME ================= */
// function DashboardHome({ user, setActivePage }) {
//   const [schedule, setSchedule] = React.useState([]);
//   const [plans, setPlans] = React.useState([]);

//   React.useEffect(() => {
//     if (user?.id) {
//       fetchSchedule();
//       fetchPlans();
//     }
//   }, [user]);

//   const fetchSchedule = async () => {
//     const res = await fetch(
//       `http://localhost:5000/api/schedule/faculty/${user.id}`
//     );
//     const data = await res.json();
//     setSchedule(data);
//   };

//   const fetchPlans = async () => {
//     const res = await fetch(
//       `http://localhost:5000/api/subject-plan/faculty/${user.id}`
//     );
//     const data = await res.json();
//     setPlans(data);
//   };

//   const today = new Date();
//   const todayName = today.toLocaleDateString("en-US", { weekday: "long" });

//   const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//   const tomorrowName = days[(today.getDay() + 1) % 7];

//   const todaySchedule = schedule.filter(s => s.day === todayName);
//   const tomorrowSchedule = schedule.filter(s => s.day === tomorrowName);

//   return (
//     <div>

//       {/* HEADER */}
//       <div style={styles.headerCard}>
//         <div>
//           <h3 style={{ margin: 0 }}>
//             Welcome, {user?.name || "Faculty"} 👨‍🏫
//           </h3>
//           <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
//             Live academic overview
//           </p>
//         </div>

//         <div style={styles.quickBtns}>
//           <button onClick={() => setActivePage("assignments")}>+ Assignment</button>
//           <button onClick={() => setActivePage("schedule")}>📅 Schedule</button>
//           {/* <button onClick={() => setActivePage("tasks")}>⏳ Tasks</button> */}
//         </div>
//       </div>

//       {/* STATS */}
//       <div style={styles.statsGrid}>
//         <div style={{ ...styles.card, background: "#dbeafe" }}>
//           <h3>👨‍🎓 Students</h3>
//           <p>Active learners</p>
//         </div>

//         <div style={{ ...styles.card, background: "#fce7f3" }}>
//           <h3>📝 Assignments</h3>
//           <p>Manage work</p>
//         </div>

//         <div style={{ ...styles.card, background: "#dcfce7" }}>
//           <h3>📅 Today</h3>
//           <p>{todaySchedule.length} lectures</p>
//         </div>

//         {/* <div style={{ ...styles.card, background: "#fff7ed" }}>
//           <h3>⏳ Tasks</h3>
//           <p>Pending work</p>
//         </div> */}
//       </div>

//       {/* MINI WIDGETS */}
//       <div style={styles.extraGrid}>

//         <div style={styles.smallCard}>
//           <h4>📅 Calendar</h4>
//           <h2 style={{ margin: 0 }}>{today.getDate()}</h2>
//           <p>{today.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
//         </div>

//         <div style={styles.smallCard}>
//           <h4>🕒 Today</h4>
//           {todaySchedule.length === 0
//             ? <p>No lectures</p>
//             : todaySchedule.slice(0,2).map((s,i)=>(
//                 <p key={i}>{s.subject_name} ({s.start_time})</p>
//               ))
//           }
//         </div>

//         <div style={styles.smallCard}>
//           <h4>🕓 Tomorrow</h4>
//           {tomorrowSchedule.length === 0
//             ? <p>No classes</p>
//             : tomorrowSchedule.slice(0,2).map((s,i)=>(
//                 <p key={i}>{s.subject_name} ({s.start_time})</p>
//               ))
//           }
//         </div>

//         <div style={styles.smallCard}>
//           <h4>📘 Study Plan</h4>
//           {plans.length === 0
//             ? <p>No plan</p>
//             : plans.slice(0,2).map((p,i)=>(
//                 <p key={i}>📌 {p.topic}</p>
//               ))
//           }
//         </div>

//       </div>

//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   container: { display: "flex", height: "100vh", fontFamily: "Arial",width:"1690px" },

//   sidebar: {
//     width: "260px",
//     background: "linear-gradient(180deg,#0f172a,#1e293b)",
//     color: "white",
//     padding: "20px",
//     height: "100vh",        // ⭐ KEY FIX
//     position: "sticky",
//   },

//   logo: { color: "#38bdf8", marginBottom: "20px" },

//   nav: { display: "flex", flexDirection: "column", gap: "10px" },

//   navItem: {
//     display: "flex",
//     gap: "10px",
//     padding: "10px",
//     borderRadius: "10px",
//     cursor: "pointer",
//   },

//   main: { flex: 1, background: "#f1f5f9" },

//   topbar: {
//     background: "white",
//     padding: "15px 20px",
//     display: "flex",
//     justifyContent: "space-between",
//   },

//   profileWrapper: { position: "relative" },

//   profile: {
//     background: "#e0f2fe",
//     padding: "6px 12px",
//     borderRadius: "20px",
//     cursor: "pointer",
//   },

//   dropdown: {
//     position: "absolute",
//     right: 0,
//     top: "45px",
//     background: "white",
//     borderRadius: "10px",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//     minWidth: "150px",
//     zIndex: 10,
//   },

//   dropItem: {
//     padding: "10px",
//     cursor: "pointer",
//     borderBottom: "1px solid #eee",
//   },

//   content: { padding: "15px" },

//   headerCard: {
//     background: "linear-gradient(135deg,#60a5fa,#a78bfa)",
//     color: "white",
//     padding: "15px",
//     borderRadius: "12px",
//     display: "flex",
//     justifyContent: "space-between",
//   },

//   quickBtns: { display: "flex", gap: "8px" },

//   statsGrid: {
//     marginTop: "15px",
//     display: "grid",
//     gridTemplateColumns: "repeat(4,1fr)",
//     gap: "12px",
//   },

//   card: {
//     padding: "15px",
//     borderRadius: "12px",
//     boxShadow: "0 5px 12px rgba(0,0,0,0.06)",
//   },

//   extraGrid: {
//     marginTop: "15px",
//     display: "grid",
//     gridTemplateColumns: "repeat(4,1fr)",
//     gap: "12px",
//   },

//   smallCard: {
//     background: "white",
//     padding: "12px",
//     borderRadius: "12px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//   },
// };

// export default Facultydashboard;

import React, { useEffect, useState } from "react";
import Students from "./Students";
import Assignments from "./Assignments";
import Calendar from "./Calendar";
import Exams from "./Exams";
import Schedule from "./Schedule";
import Notifications from "./Notification";
import SubjectPlan from "./SubjectPlan";
import Tasks from "./Tasks";

function Facultydashboard({ user }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [showMenu, setShowMenu] = useState(false);

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🎓 Faculty Hub</h2>

        <div onClick={() => setActivePage("dashboard")} style={styles.menuItem}>🏠 Dashboard</div>
        <div onClick={() => setActivePage("students")} style={styles.menuItem}>👨‍🎓 Students</div>
        <div onClick={() => setActivePage("assignments")} style={styles.menuItem}>📝 Assignments</div>
        <div onClick={() => setActivePage("calendar")} style={styles.menuItem}>📅 Calendar</div>
        <div onClick={() => setActivePage("exams")} style={styles.menuItem}>📊 Exams</div>
        <div onClick={() => setActivePage("schedule")} style={styles.menuItem}>⏰ Schedule</div>
        <div onClick={() => setActivePage("notifications")} style={styles.menuItem}>🔔 Notifications</div>
        <div onClick={() => setActivePage("subjectplan")} style={styles.menuItem}>📚 Subject Plan</div>
        <div onClick={() => setActivePage("tasks")} style={styles.menuItem}>✅ Tasks</div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2>🎓 Faculty Dashboard</h2>

          {/* PROFILE */}
          <div style={{ position: "relative" }}>
            <div
              style={styles.profile}
              onClick={() => setShowMenu(!showMenu)}
            >
              👋 {user?.name || "Faculty"}
            </div>

            {showMenu && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem}>👤 Profile</div>

                <div
                  style={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {activePage === "dashboard" && <DashboardHome user={user} />}
        {activePage === "students" && <Students />}
        {activePage === "assignments" && <Assignments />}
        {activePage === "calendar" && <Calendar />}
        {activePage === "exams" && <Exams />}
        {activePage === "schedule" && <Schedule />}
        {activePage === "notifications" && <Notifications />}
        {activePage === "subjectplan" && <SubjectPlan />}
        {activePage === "tasks" && <Tasks />}
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function DashboardHome({ user }) {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const facultyId = localStorage.getItem("facultyId");

  useEffect(() => {
    fetch("http://localhost:5000/faculty/dashboard/${facultyId}")
      .then(res => res.json())
      .then(data => {
        setStudents(data.students || []);
        setExams(data.exams || []);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/facultydashboard/notifications")
      .then(res => res.json())
      .then(data => setNotifications(data || []));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/schedule/faculty/${facultyId}`)
      .then(res => res.json())
      .then(data => setSchedule(data || []));
  }, [facultyId]);

  return (
    <div>
      <div style={styles.headerCard}>
        <h1>Welcome, {user?.name}</h1>
        <p>Smart Campus Dashboard</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>👨‍🎓 {students.length} Students</div>
        <div style={styles.statCard}>📝 {exams.length} Exams</div>
        <div style={styles.statCard}>⏰ {schedule.length} Lectures</div>
        <div style={styles.statCard}>🔔 {notifications.length} Alerts</div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    display: "flex",
    height: "100vh"
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "15px"
  },

  logo: {
    marginBottom: "20px"
  },

  menuItem: {
    padding: "10px",
    cursor: "pointer"
  },

  main: {
    flex: 1,
    background: "#f3f4f6",
    padding: "10px"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    background: "white",
    padding: "10px"
  },

  profile: {
    background: "#2563eb",
    color: "white",
    padding: "8px 15px",
    borderRadius: "20px",
    cursor: "pointer"
  },

  dropdown: {
    position: "absolute",
    right: 0,
    background: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
  },

  dropdownItem: {
    padding: "10px",
    cursor: "pointer"
  },

  headerCard: {
    background: "#4f46e5",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "10px"
  },

  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "10px"
  }
};

export default Facultydashboard;