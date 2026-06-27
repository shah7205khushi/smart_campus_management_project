// import React, { useState } from "react";

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [reminders, setReminders] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [note, setNote] = useState("");

//   // 🔥 Get days in month
//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();

//     const firstDay = new Date(year, month, 1).getDay();
//     const totalDays = new Date(year, month + 1, 0).getDate();

//     let days = [];

//     for (let i = 0; i < firstDay; i++) {
//       days.push("");
//     }

//     for (let i = 1; i <= totalDays; i++) {
//       days.push(i);
//     }

//     return days;
//   };

//   const days = getDaysInMonth(currentDate);

//   const monthName = currentDate.toLocaleString("default", {
//     month: "long",
//     year: "numeric"
//   });

//   // 🔥 Change month
//   const changeMonth = (dir) => {
//     const newDate = new Date(currentDate);
//     newDate.setMonth(currentDate.getMonth() + dir);
//     setCurrentDate(newDate);
//   };

//   // 🔥 Add Reminder
//   const addReminder = () => {
//     if (!selectedDate || !note) {
//       alert("Select date & enter reminder ⚠️");
//       return;
//     }

//     const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDate}`;

//     setReminders({
//       ...reminders,
//       [key]: note
//     });

//     setNote("");
//     setSelectedDate(null);
//   };

//   return (
//     <>
//       <h2>📆 Academic Calendar & Reminders</h2>

//       {/* 🔥 HEADER */}
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "15px"
//       }}>
//         <button onClick={() => changeMonth(-1)}>⬅</button>
//         <h3>{monthName}</h3>
//         <button onClick={() => changeMonth(1)}>➡</button>
//       </div>

//       {/* 🔥 CALENDAR GRID */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(7, 1fr)",
//         gap: "10px",
//         background: "white",
//         padding: "20px",
//         borderRadius: "10px"
//       }}>
//         {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
//           <div key={i} style={{ fontWeight: "bold", textAlign: "center" }}>
//             {d}
//           </div>
//         ))}

//         {days.map((day, index) => {
//           const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
//           const hasReminder = reminders[key];

//           return (
//             <div
//               key={index}
//               onClick={() => day && setSelectedDate(day)}
//               style={{
//                 height: "80px",
//                 borderRadius: "10px",
//                 background: day === selectedDate ? "#1e3a8a" : "#f1f5f9",
//                 color: day === selectedDate ? "white" : "black",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 padding: "5px",
//                 cursor: day ? "pointer" : "default",
//                 position: "relative"
//               }}
//             >
//               <span>{day}</span>

//               {/* 🔔 Reminder dot */}
//               {hasReminder && (
//                 <span style={{
//                   fontSize: "10px",
//                   color: "red"
//                 }}>
//                   🔔
//                 </span>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* 🔥 ADD REMINDER */}
//       {selectedDate && (
//         <div style={{
//           marginTop: "20px",
//           background: "white",
//           padding: "20px",
//           borderRadius: "10px"
//         }}>
//           <h3>Set Reminder for {selectedDate}</h3>

//           <input
//             placeholder="Enter reminder"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             style={{ padding: "10px", width: "250px" }}
//           />

//           <br /><br />

//           <button
//             onClick={addReminder}
//             style={{
//               padding: "10px 20px",
//               background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
//               color: "white",
//               border: "none",
//               borderRadius: "8px"
//             }}
//           >
//             Save Reminder
//           </button>
//         </div>
//       )}

//       {/* 🔥 SHOW ALL REMINDERS */}
//       <div style={{
//         marginTop: "20px",
//         background: "white",
//         padding: "20px",
//         borderRadius: "10px"
//       }}>
//         <h3>All Reminders</h3>

//         {Object.keys(reminders).length === 0 ? (
//           <p>No reminders added</p>
//         ) : (
//           <ul>
//             {Object.entries(reminders).map(([date, text], i) => (
//               <li key={i}>
//                 📌 {date} → {text}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </>
//   );
// }

// export default Calendar;

import React, { useState, useEffect } from "react";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState({});
  const [adminEvents, setAdminEvents] = useState({});
  const [hovered, setHovered] = useState(null);

  // ✅ FIXED: YEAR WAS MISSING
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date().toISOString().split("T")[0];

  // ================= HOLIDAYS =================
  useEffect(() => {
    const API_KEY = "YOUR_API_KEY";

    fetch(
      `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`
    )
      .then((res) => res.json())
      .then((data) => {
        const h = {};

        data?.response?.holidays?.forEach((d) => {
          const dt = d.date.iso.split("T")[0];
          h[dt] = { type: "holiday", title: d.name };
        });

        setHolidays(h);
      })
      .catch(() => setHolidays({}));
  }, [year]);

  // ================= EVENTS =================
  const fetchEvents = () => {
    fetch("http://localhost:5000/api/calendar-events")
      .then((res) => res.json())
      .then((data) => {
        const e = {};

        data.forEach((ev) => {
          const d = new Date(ev.start_date)
            .toISOString()
            .split("T")[0];

          e[d] = {
            type: ev.event_type,
            title: ev.title,
          };
        });

        setAdminEvents(e);
      })
      .catch(() => setAdminEvents({}));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const mergedEvents = { ...holidays, ...adminEvents };

  // ================= DATE HELPERS =================
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay();

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // ================= CALENDAR BUILDER =================
  const buildCalendar = () => {
    const days = [];

    const firstDay = getFirstDay(year, month);
    const currentDays = getDaysInMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    // PREV MONTH
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({
        day: d,
        type: "prev",
        date: formatDate(year, month - 1, d),
      });
    }

    // CURRENT MONTH
    for (let i = 1; i <= currentDays; i++) {
      days.push({
        day: i,
        type: "current",
        date: formatDate(year, month, i),
      });
    }

    // NEXT MONTH
    let nextDays = 42 - days.length;

    for (let i = 1; i <= nextDays; i++) {
      days.push({
        day: i,
        type: "next",
        date: formatDate(year, month + 1, i),
      });
    }

    return days;
  };

  const calendarDays = buildCalendar();

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  // ================= COLORS =================
  const getBg = (type, event) => {
    if (type === "prev") return "#b2e7bd";
    if (type === "next") return "#ede9fe";

    if (event?.type === "exam") return "#fee2e2";
    if (event?.type === "assignment") return "#dbeafe";
    if (event?.type === "holiday") return "#fef9c3";

    return "#fff";
  };

  // ================= ADD TASK =================
  const handleAddTask = (date) => {
    alert(`Add task for: ${date}`);
  };

  // ================= UI =================
  return (
    <div style={styles.container}>
      <h2>📅 Academic Calendar</h2>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => changeMonth(-1)}>⬅</button>

        <h3>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h3>

        <button onClick={() => changeMonth(1)}>➡</button>
      </div>

      {/* LEGEND */}
      <div style={styles.legend}>
        <span style={{ background: "#fee2e2" }}>Exam</span>
        <span style={{ background: "#dbeafe" }}>Assignment</span>
        <span style={{ background: "#fef9c3" }}>Holiday</span>
        <span style={{ background: "#b2e7bd" }}>Prev</span>
        <span style={{ background: "#ede9fe" }}>Next</span>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={styles.dayName}>
            {d}
          </div>
        ))}

        {calendarDays.map((d, i) => {
          const event = mergedEvents[d.date];

          return (
            <div
              key={i}
              style={{
                ...styles.day,
                background: getBg(d.type, event),
                border: d.date === today ? "2px solid blue" : "",
              }}
              onMouseEnter={() => setHovered({ d, event })}
              onMouseLeave={() => setHovered(null)}
            >
              {/* TASK BUTTON */}
              <div
                style={styles.taskBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTask(d.date);
                }}
              >
                +
              </div>

              {d.day}

              {event && <div style={styles.dot}></div>}

              {hovered?.d?.date === d.date && (
                <div style={styles.tooltip}>
                  {event ? event.title : "No Event"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;

/* ================= STYLES ================= */
const styles = {
  container: { padding: "20px", fontFamily: "Poppins" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  legend: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7,1fr)",
    gap: "5px",
  },

  dayName: {
    textAlign: "center",
    fontWeight: "bold",
  },

  day: {
    height: "75px",
    borderRadius: "8px",
    padding: "5px",
    position: "relative",
    fontSize: "14px",
  },

  taskBtn: {
    position: "absolute",
    top: "4px",
    right: "6px",
    background: "#6366f1",
    color: "white",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "black",
    position: "absolute",
    bottom: "5px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  tooltip: {
    position: "absolute",
    top: "-5px",
    left: "50%",
    transform: "translate(-50%, -100%)",
    background: "#4f4a4a",
    color: "white",
    padding: "5px",
    borderRadius: "5px",
    fontSize: "11px",
  },
};