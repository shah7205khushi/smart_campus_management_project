import React, { useState, useEffect } from "react";
import Student from "./Student";
import Faculty from "./Faculty";
import Subject from "./Subject";
import Course from "./Course";
import Calender from "./Calender";
import Exam from "./Exam";
// import Analytics from "./Analytics";
import LectureSchedule from "./LectureSchedule";
import Notification from "./Notification";
import Logout from "./Logout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const [data, setData] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    subjects: 0,
    exams: 0,
    assignedSubjects: 0,
    unassignedSubjects: 0
  });

  const [subjectPieData, setSubjectPieData] = useState({
    labels: [],
    datasets: []
  });

  // ✅ NEW STATE FOR EVENTS
  const [events, setEvents] = useState([]);

  // ================= DASHBOARD =================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/dashboard")
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.log("Error:", err));
  }, []);

  // ================= SUBJECT PIE =================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/subject-status")
      .then(res => res.json())
      .then(res => {
        setSubjectPieData({
          labels: res.labels,
          datasets: [
            {
              label: "Subject Status",
              data: res.data,
              backgroundColor: ["#10b981", "#ef4444"],
              borderWidth: 1
            }
          ]
        });
      })
      .catch(err => console.log(err));
  }, []);

  // ================= FETCH EVENTS =================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/upcoming-events")
      .then(res => res.json())
      .then(res => setEvents(res))
      .catch(err => console.log(err));
  }, []);

  const menuItems = ["dashboard","students","faculty","subjects","courses","calendar","exams","lecture schedule",
  "notification","logout"];

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Poppins", sans-serif;
          background: #eef2ff;
        }

        .container { display: flex; }

        .sidebar {
          width: 240px;
          height: 100vh;
          background: linear-gradient(180deg, #0f172a, #1e3a8a);
          color: white;
          padding: 20px;
        }

        .logo { font-size: 20px; margin-bottom: 20px; }

        .menu {
          padding: 10px;
          margin: 6px 0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .menu:hover { background: rgba(255,255,255,0.15); }
        .activeMenu { background: #3b82f6; }

        .main { flex: 1; padding: 15px; }

        .topbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .card {
          padding: 12px;
          border-radius: 12px;
          color: white;
          text-align: center;
        }

        .c1 { background: #6366f1; }
        .c2 { background: #10b981; }
        .c3 { background: #f59e0b; }
        .c4 { background: #ec4899; }
        .c5 { background: #ef4444; }

        .section {
          margin-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .box {
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        .progress-bar {
          height: 10px;
          background: #e2e8f0;
          border-radius: 10px;
          margin-top: 8px;
        }

        .progress {
          height: 100%;
          background: #3b82f6;
        }

        .graph-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }

        canvas { max-height: 250px; }

        .alert {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
        }

      `}</style>

      <div className="container">

        <div className="sidebar">
          <div className="logo">Smart Campus 🎓</div>

          {menuItems.map((item) => (
            <div
              key={item}
              className={`menu ${active === item ? "activeMenu" : ""}`}
              onClick={() => setActive(item)}
            >
              {item.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="main">

          <div className="topbar">
            <h3>{active.toUpperCase()}</h3>

            <select>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>

          {active === "dashboard" ? (
            <>
              <div className="cards">
                <div className="card c1">Students<br/><b>{data.students}</b></div>
                <div className="card c2">Faculty<br/><b>{data.faculty}</b></div>
                <div className="card c3">Courses<br/><b>{data.courses}</b></div>
                <div className="card c4">Subjects<br/><b>{data.subjects}</b></div>
                <div className="card c5">Exams<br/><b>{data.exams}</b></div>
              </div>

              <div className="section">
                <div className="box">
                  <h4>📚 Subject Allocation</h4>
                  <p>Total Subjects: {data.subjects}</p>
                  <p>Assigned: {data.assignedSubjects}</p>
                  <p>Unassigned: {data.unassignedSubjects}</p>

                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: data.subjects > 0
                          ? (data.assignedSubjects / data.subjects) * 100 + "%"
                          : "0%"
                      }}
                    ></div>
                  </div>
                </div>

                {/* 🔥 UPDATED INSIGHTS → UPCOMING EVENTS */}
                <div className="box">
                  <h4>📅 Upcoming Events</h4>

                  {events.length === 0 ? (
                    <p>No upcoming events</p>
                  ) : (
                    events.map((ev, i) => {
  const formattedDate = new Date(ev.start_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div key={i} style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "6px 0",
      borderBottom: "1px solid #eee"
    }}>
      <span style={{ fontWeight: "500" }}>
        {ev.title}
      </span>

      <span style={{
        fontSize: "12px",
        color: "#64748b"
      }}>
        {formattedDate}
      </span>
    </div>
  );
})
                  )}
                </div>
              </div>

              {/* GRAPH ROW SAME */}
              <div className="graph-row">

                <div className="box">
                  <h4>📊 Overall System Data</h4>

                  <Pie
                    data={{
                      labels: ["Students", "Faculty", "Courses", "Subjects"],
                      datasets: [
                        {
                          data: [
                            data.students,
                            data.faculty,
                            data.courses,
                            data.subjects
                          ],
                          backgroundColor: [
                            "#6366f1",
                            "#10b981",
                            "#f59e0b",
                            "#ec4899"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{ cutout: "60%" }}
                  />
                </div>

                <div className="box">
                  <h4>🥧 Subject Assignment Status</h4>
                  <Pie data={subjectPieData} />
                </div>

              </div>

              <div className="alert">
                ⚠️ Some subjects are still unassigned to faculty.
              </div>

            </>
          ) :

          active === "students" ? <Student /> :
          active === "faculty" ? <Faculty /> :
          active === "subjects" ? <Subject /> :
          active === "courses" ? <Course /> :
          active === "calendar" ? <Calender /> :
          active === "exams" ? <Exam /> :
          active === "lecture schedule" ? <LectureSchedule /> :
          active === "notification" ? <Notification /> :
          // active === "analytics" ? <Analytics /> :
          active === "logout" ? <Logout /> : null}

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
// import React, { useState, useEffect } from "react";
// import Student from "./Student";
// import Faculty from "./Faculty";
// import Subject from "./Subject";
// import Course from "./Course";
// import Calender from "./Calender";
// import Exam from "./Exam";
// import Analytics from "./Analytics";
// import LectureSchedule from "./LectureSchedule";
// import Notification from "./Notification";
// import Logout from "./Logout";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function AdminDashboard() {
//   const [active, setActive] = useState("dashboard");

//   // ✅ STATE (REPLACED STATIC DATA)
//   const [data, setData] = useState({
//     students: 0,
//     faculty: 0,
//     courses: 0,
//     subjects: 0,
//     exams: 0,
//     assignedSubjects: 0,
//     unassignedSubjects: 0
//   });

//   // ✅ FETCH FROM FLASK BACKEND
//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/api/dashboard")
//       .then(res => res.json())
//       .then(result => {
//         console.log("Dashboard Data:", result);
//         setData(result);
//       })
//       .catch(err => console.log("Error:", err));
//   }, []);

//   const menuItems = ["dashboard","students","faculty","subjects","courses","calendar","exams","lecture schedule",
//   "notification","analytics","logout"];

//   // 📊 STUDENT GRAPH (STATIC - NO CHANGE)
//   const studentData = {
//     labels: ["DBMS", "AI", "Java", "Python"],
//     datasets: [
//       {
//         label: "Marks (%)",
//         data: [90, 75, 80, 70],
//         backgroundColor: "#6366f1",
//         borderRadius: 8,
//         barThickness: 40,
//       },
//     ],
//   };

//   // 👩‍🏫 FACULTY GRAPH (STATIC - NO CHANGE)
//   const facultyData = {
//     labels: ["DBMS", "AI", "Java", "Python"],
//     datasets: [
//       {
//         label: "Teaching Hours",
//         data: [85, 70, 90, 60],
//         backgroundColor: "#10b981",
//         borderRadius: 8,
//         barThickness: 40,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       tooltip: {
//         callbacks: {
//           label: (context) => `${context.raw}`,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: { display: true, text: "Value" },
//       },
//       x: {
//         title: { display: true, text: "Subjects" },
//       },
//     },
//   };

//   return (
//     <>
//       <style>{`
//         body {
//           margin: 0;
//           font-family: "Poppins", sans-serif;
//           background: #eef2ff;
//         }

//         .container { display: flex; }

//         .sidebar {
//           width: 240px;
//           height: 100vh;
//           background: linear-gradient(180deg, #0f172a, #1e3a8a);
//           color: white;
//           padding: 20px;
//         }

//         .logo { font-size: 20px; margin-bottom: 20px; }

//         .menu {
//           padding: 10px;
//           margin: 6px 0;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 14px;
//         }

//         .menu:hover { background: rgba(255,255,255,0.15); }
//         .activeMenu { background: #3b82f6; }

//         .main { flex: 1; padding: 15px; }

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 10px;
//         }

//         .profile {
//           background: white;
//           padding: 6px 12px;
//           border-radius: 20px;
//         }

//         .cards {
//           display: grid;
//           grid-template-columns: repeat(5, 1fr);
//           gap: 10px;
//         }

//         .card {
//           padding: 12px;
//           border-radius: 12px;
//           color: white;
//           text-align: center;
//         }

//         .c1 { background: #6366f1; }
//         .c2 { background: #10b981; }
//         .c3 { background: #f59e0b; }
//         .c4 { background: #ec4899; }
//         .c5 { background: #ef4444; }

//         .kpi-row {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 10px;
//           margin-top: 10px;
//         }

//         .kpi {
//           background: white;
//           padding: 10px;
//           border-radius: 10px;
//           text-align: center;
//         }

//         .section {
//           margin-top: 15px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 15px;
//         }

//         .box {
//           background: white;
//           padding: 15px;
//           border-radius: 12px;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.08);
//         }

//         .progress-bar {
//           height: 10px;
//           background: #e2e8f0;
//           border-radius: 10px;
//           margin-top: 8px;
//         }

//         .progress {
//           height: 100%;
//           background: #3b82f6;
//         }

//         .graph-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 15px;
//           margin-top: 15px;
//         }

//         canvas { max-height: 250px; }

//         .insight {
//           margin-top: 15px;
//           background: #fff;
//           padding: 15px;
//           border-radius: 12px;
//         }

//         .alert {
//           background: #fee2e2;
//           color: #b91c1c;
//           padding: 10px;
//           border-radius: 8px;
//           margin-top: 10px;
//         }

//       `}</style>

//       <div className="container">

//         {/* SIDEBAR */}
//         <div className="sidebar">
//           <div className="logo">Smart Campus 🎓</div>

//           {menuItems.map((item) => (
//             <div
//               key={item}
//               className={`menu ${active === item ? "activeMenu" : ""}`}
//               onClick={() => setActive(item)}
//             >
//               {item.toUpperCase()}
//             </div>
//           ))}
//         </div>

//         {/* MAIN */}
//         <div className="main">

//           <div className="topbar">
//             <h3>{active.toUpperCase()}</h3>

//             <select>
//               <option>2026</option>
//               <option>2025</option>
//               <option>2024</option>
//             </select>
//           </div>

//           {active === "dashboard" ? (
//             <>
//               {/* CARDS */}
//               <div className="cards">
//                 <div className="card c1">Students<br/><b>{data.students}</b></div>
//                 <div className="card c2">Faculty<br/><b>{data.faculty}</b></div>
//                 <div className="card c3">Courses<br/><b>{data.courses}</b></div>
//                 <div className="card c4">Subjects<br/><b>{data.subjects}</b></div>
//                 <div className="card c5">Exams<br/><b>{data.exams}</b></div>
//               </div>

//               {/* SUBJECT */}
//               <div className="section">
//                 <div className="box">
//                   <h4>📚 Subject Allocation</h4>
//                   <p>Total Subjects: {data.subjects}</p>
//                   <p>Assigned to Faculty: {data.assignedSubjects}</p>
//                   <p>Unassigned to Faculty: {data.unassignedSubjects}</p>

//                   <div className="progress-bar">
//                     <div
//                       className="progress"
//                       style={{
//                         width: data.subjects > 0
//                           ? (data.assignedSubjects / data.subjects) * 100 + "%"
//                           : "0%"
//                       }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="box">
//                   <h4>🏆 Insights</h4>
//                   <p>Top Subject: DBMS (90%)</p>
//                   <p>Lowest Subject: Python (70%)</p>
//                   <p>Most Taught: Java</p>
//                 </div>
//               </div>

//               {/* GRAPHS */}
//               <div className="graph-row">
//                 <div className="box">
//                   <h4>📊 Student Subject Performance (%)</h4>
//                   <Bar data={studentData} options={options} />
//                 </div>

//                 <div className="box">
//                   <h4>👩‍🏫 Faculty Teaching Hours</h4>
//                   <Bar data={facultyData} options={options} />
//                 </div>
//               </div>

//               {/* ALERT */}
//               <div className="alert">
//                 ⚠️ Python performance is low. Consider increasing teaching hours.
//               </div>

//             </>
//           ) :

//           active === "students" ? <Student /> :
//           active === "faculty" ? <Faculty /> :
//           active === "subjects" ? <Subject /> :
//           active === "courses" ? <Course /> :
//           active === "calendar" ? <Calender /> :
//           active === "exams" ? <Exam /> :
//           active === "lecture schedule" ? <LectureSchedule /> :
//           active === "notification" ? <Notification /> :
//           active === "analytics" ? <Analytics /> :
//           active === "logout" ? <Logout /> : null}

//         </div>
//       </div>
//     </>
//   );
// }

// export default AdminDashboard;