// import React, { useState } from "react";

// function Schedule() {

//   // 🔥 Dummy Lecture Schedule
//   const [schedule] = useState([
//     { id: 1, subject: "Machine Learning", day: "Monday", time: "10:00 AM - 11:00 AM" },
//     { id: 2, subject: "DBMS", day: "Tuesday", time: "11:00 AM - 12:00 PM" },
//     { id: 3, subject: "AI", day: "Wednesday", time: "1:00 PM - 2:00 PM" },
//     { id: 4, subject: "Machine Learning", day: "Thursday", time: "10:00 AM - 11:00 AM" }
//   ]);

//   const [filterDay, setFilterDay] = useState("");

//   // 🔍 Filtered schedule
//   const filteredSchedule = filterDay
//     ? schedule.filter((s) => s.day === filterDay)
//     : schedule;

//   return (
//     <>
//       <style>{`
//         .container {
//           padding: 20px;
//         }

//         .card {
//           background: white;
//           padding: 20px;
//           border-radius: 15px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//           margin-bottom: 20px;
//         }

//         select {
//           padding: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           margin-bottom: 15px;
//         }

//         table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         th, td {
//           padding: 12px;
//           border-bottom: 1px solid #ddd;
//           text-align: left;
//         }

//         th {
//           background: #1e3a8a;
//           color: white;
//         }
//       `}</style>

//       <div className="container">

//         <h2>📅 Lecture Schedule</h2>

//         {/* 🔥 FILTER */}
//         <div className="card">
//           <h3>Filter by Day</h3>

//           <select onChange={(e) => setFilterDay(e.target.value)}>
//             <option value="">All Days</option>
//             <option>Monday</option>
//             <option>Tuesday</option>
//             <option>Wednesday</option>
//             <option>Thursday</option>
//             <option>Friday</option>
//           </select>
//         </div>

//         {/* 🔥 SCHEDULE TABLE */}
//         <div className="card">
//           <h3>Weekly Schedule</h3>

//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Day</th>
//                 <th>Time</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredSchedule.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.subject}</td>
//                   <td>{item.day}</td>
//                   <td>{item.time}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </div>

//       </div>
//     </>
//   );
// }

// export default Schedule;

import React, { useEffect, useState } from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Schedule() {
const facultyId = localStorage.getItem("facultyId") || 1;
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!facultyId) {
        console.log("❌ No facultyId found");
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/schedule/faculty/${facultyId}`
        );

        const data = await res.json();

        console.log("🔥 FULL DATA:", data);

        setSchedule(data);
      } catch (err) {
        console.log("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [facultyId]);

  // ================= FILTER =================
  const filtered = schedule.filter(
    (s) => s.day && s.day.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Faculty Timetable</h2>

      {/* DAY BUTTONS */}
      <div style={styles.dayRow}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              ...styles.dayBtn,
              background: selectedDay === day ? "#172f6e" : "#e5e7eb",
              color: selectedDay === day ? "white" : "#111",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Loading... ⏳</p>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          😴 No lectures for <b>{selectedDay}</b>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((item) => {
            console.log("ITEM:", item);

            // ✅ SAFE TIME HANDLING (MAIN FIX)
            const startTime =
              item.start_time || item.startTime || item.time || "N/A";

            const endTime =
              item.end_time || item.endTime || "";

            return (
              <div key={item.lecture_id} style={styles.card}>
                {/* LEFT SIDE */}
                <div>
                  <h3 style={styles.subject}>{item.subject_name}</h3>

                  <p style={styles.course}>{item.course_name}</p>

                  <p style={styles.room}>📍 Room: {item.room}</p>
                </div>

                {/* RIGHT SIDE - TIME */}
                <div style={styles.timeBox}>
                  ⏰ {startTime}
                  {endTime ? ` - ${endTime}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Schedule;

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: 20,
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  title: {
    background: "#172f6e",
    color: "white",
    padding: 12,
    borderRadius: 8,
  },

  dayRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 15,
  },

  dayBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
  },

  grid: {
    marginTop: 20,
    display: "grid",
    gap: 12,
  },

  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  subject: {
    margin: 0,
    color: "#172f6e",
  },

  course: {
    margin: "5px 0",
    background: "#e0e7ff",
    padding: "3px 8px",
    borderRadius: 8,
    fontSize: 12,
  },

  room: {
    fontSize: 13,
    color: "#555",
  },

  timeBox: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },

  empty: {
    marginTop: 20,
    background: "white",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
  },
};