import React, { useState, useEffect } from "react";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [holidays, setHolidays] = useState({});
  const [hovered, setHovered] = useState(null);
  const [adminEvents, setAdminEvents] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    event_type: "exam",
    start_date: "",
    end_date: "",
    description: "",
    semester: "",
    course_id: ""
  });

  const [events] = useState({
    "2026-04-02": { type: "exam", title: "Machine Learning Exam" },
    "2026-04-04": { type: "assignment", title: "Python Submission" },
    "2026-04-08": { type: "exam", title: "Cloud Computing Exam" },
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 🔥 HOLIDAYS
  useEffect(() => {
    const API_KEY = "KNs9ldvZAEuPCTc7QUupeQgtQhrbyJmF";

    fetch(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        const holidayData = {};

        if (data?.response?.holidays) {
          data.response.holidays.forEach((h) => {
            const date = h.date.iso.split("T")[0];
            holidayData[date] = {
              type: "holiday",
              title: h.name,
            };
          });
        }

        setHolidays(holidayData);
      });
  }, [year]);

  // 🔥 FETCH EVENTS (FIXED DATE FORMAT)
  const fetchEvents = () => {
    fetch("http://localhost:5000/api/calendar-events")
      .then((res) => res.json())
      .then((data) => {
        const formatted = {};

        if (Array.isArray(data)) {
          data.forEach((e) => {
            const dateObj = new Date(e.start_date);
            const formattedDate = dateObj.toISOString().split("T")[0];

            formatted[formattedDate] = {
              type: e.event_type,
              title: e.title,
              id: e.calendar_object_id
            };
          });
        }

        setAdminEvents(formatted);
      })
      .catch(err => console.error("FETCH ERROR:", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay();

  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
    setSelectedDay(null);
  };

  const formatDate = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const mergedEvents = { ...holidays, ...events, ...adminEvents };

  // ✅ OPEN ADD
  const openAdd = (dateStr) => {
    setForm({
      title: "",
      event_type: "exam",
      start_date: dateStr,
      end_date: "",
      description: "",
      semester: "",
      course_id: ""
    });
    setEditId(null);
    setShowModal(true);
  };

  const handleSubmit = () => {
  if (!form.title || !form.start_date) {
    alert("Title and Date required");
    return;
  }

  const url = editId
    ? `http://localhost:5000/api/update-event/${editId}`
    : `http://localhost:5000/api/add-event`;

  const method = editId ? "PUT" : "POST";

  // ✅ CLEAN DATA BEFORE SENDING
  const payload = {
    title: form.title,
    event_type: form.event_type || "exam",
    start_date: form.start_date,
    end_date: form.end_date || null,
    description: form.description || "",
    semester: form.semester ? parseInt(form.semester) : null,
    course_id: form.course_id ? parseInt(form.course_id) : null
  };

  console.log("SENDING DATA:", payload); // 🔥 DEBUG

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      console.log("RESPONSE:", data);

      if (data.success) {
        fetchEvents();
        setShowModal(false);
      } else {
        alert("Insert failed ❌");
      }
    })
    .catch(err => {
      console.error("SAVE ERROR:", err);
      alert("Server error ❌");
    });
};
  // ✅ DELETE
  const handleDelete = () => {
    fetch(`http://localhost:5000/api/delete-event/${editId}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchEvents();
        setShowModal(false);
      })
      .catch(err => console.error("DELETE ERROR:", err));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Academic Calendar</h1>

      <div style={styles.header}>
        <button style={styles.navBtn} onClick={() => changeMonth(-1)}>⬅</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button style={styles.navBtn} onClick={() => changeMonth(1)}>➡</button>
      </div>

      <div style={styles.calendarBox}>
        <div style={styles.grid}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} style={styles.dayName}>{d}</div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}

          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(day);
            const event = mergedEvents[dateStr];

            return (
              <div
                key={day}
                onClick={() => {
                  setSelectedDay({ dateStr, event });

                  if (event?.id) {
                    setEditId(event.id);
                    setForm({
                      title: event.title,
                      event_type: event.type,
                      start_date: dateStr
                    });
                    setShowModal(true);
                  }
                }}
                onMouseEnter={() => setHovered({ dateStr, event })}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...styles.day,
                  border: dateStr === today ? "2px solid #6366f1" : "",
                  background:
                    event?.type === "exam"
                      ? "#fee2e2"
                      : event?.type === "assignment"
                      ? "#dbeafe"
                      : event?.type === "holiday"
                      ? "#fef9c3"
                      : "#fff",
                }}
              >
                <div
                  style={styles.plus}
                  onClick={(e) => {
                    e.stopPropagation();
                    openAdd(dateStr);
                  }}
                >
                  +
                </div>

                {day}

                {event && (
                  <div
                    style={{
                      ...styles.dot,
                      background:
                        event.type === "exam"
                          ? "#ef4444"
                          : event.type === "assignment"
                          ? "#3b82f6"
                          : "#22c55e",
                    }}
                  />
                )}

                {hovered?.dateStr === dateStr && (
                  <div style={styles.tooltip}>
                    {event ? (
                      <>
                        <b>{event.type.toUpperCase()}</b><br />
                        {event.title}
                      </>
                    ) : "No Event"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>{editId ? "Edit" : "Add"} Event</h3>

            <input placeholder="Title"
              value={form.title}
              onChange={(e)=>setForm({...form,title:e.target.value})} />

            <select
              value={form.event_type}
              onChange={(e)=>setForm({...form,event_type:e.target.value})}>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="holiday">Holiday</option>
            </select>

            <button onClick={handleSubmit}>Save</button>

            {editId && <button onClick={handleDelete}>Delete</button>}
            <button onClick={()=>setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;

const styles = {
  container: { padding: "10px", fontFamily: "Poppins" },
  title: { fontSize: "24px", fontWeight: "bold" },
  header: { display: "flex", justifyContent: "space-between", background: "#172f6e", color: "white", padding: "8px", borderRadius: "10px" },
  navBtn: { background: "white", border: "none", padding: "5px 10px", cursor: "pointer" },
  calendarBox: { marginTop: "10px", background: "white", padding: "10px", borderRadius: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px" },
  dayName: { textAlign: "center", fontWeight: "bold", fontSize: "13px" },
  day: { height: "65px", borderRadius: "10px", textAlign: "center", padding: "5px", position: "relative", cursor: "pointer", fontSize: "14px" },
  plus: { position: "absolute", top: "4px", right: "6px", background: "#6366f1", color: "white", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)" },
  tooltip: { position: "absolute", top: "-5px", left: "50%", transform: "translate(-50%, -100%)", background: "#f3f4f6", padding: "6px", borderRadius: "8px", fontSize: "11px" },
  modal: { position: "fixed", top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center"},
  modalBox: { background:"white",padding:"20px",borderRadius:"10px",width:"300px"}
};