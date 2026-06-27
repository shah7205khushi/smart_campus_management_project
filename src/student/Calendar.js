import React, { useState, useEffect } from "react";

function Calendar() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState({});
  const [adminEvents, setAdminEvents] = useState({});

  // TOP BAR
  const [topEvent, setTopEvent] = useState("Hover on any date");

  // HOVER POPUP
  const [hoverPopup, setHoverPopup] = useState({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    event_type: "exam",
    start_date: "",
  });

  // STATIC EVENTS
  const [events] = useState({
    "2026-04-02": {
      type: "exam",
      title: "Machine Learning Exam",
    },

    "2026-04-04": {
      type: "assignment",
      title: "Python Submission",
    },

    "2026-04-08": {
      type: "exam",
      title: "Cloud Computing Exam",
    },
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ===================================================
  // HOLIDAYS API
  // ===================================================

  useEffect(() => {

    const API_KEY = "KNs9ldvZAEuPCTc7QUupeQgtQhrbyJmF";

    fetch(
      `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`
    )
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

  // ===================================================
  // FETCH ADMIN EVENTS
  // ===================================================

  const fetchEvents = () => {

    fetch("http://localhost:5000/api/calendar-events")
      .then((res) => res.json())
      .then((data) => {

        const formatted = {};

        if (Array.isArray(data)) {

          data.forEach((e) => {

            const dateObj = new Date(e.start_date);

            const formattedDate = dateObj
              .toISOString()
              .split("T")[0];

            formatted[formattedDate] = {
              type: e.event_type,
              title: e.title,
              id: e.calendar_object_id,
            };

          });
        }

        setAdminEvents(formatted);

      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ===================================================
  // MERGE EVENTS
  // ===================================================

  const mergedEvents = {
    ...holidays,
    ...events,
    ...adminEvents,
  };

  const today = new Date().toISOString().split("T")[0];

  // ===================================================
  // DATE FUNCTIONS
  // ===================================================

  const getDaysInMonth = (y, m) =>
    new Date(y, m + 1, 0).getDate();

  const getFirstDay = (y, m) =>
    new Date(y, m, 1).getDay();

  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
  };

  // ===================================================
  // BUILD CALENDAR
  // ===================================================

  const buildCalendar = () => {

    const days = [];

    const firstDay = getFirstDay(year, month);

    const currentMonthDays = getDaysInMonth(year, month);

    const prevMonthDays = getDaysInMonth(year, month - 1);

    // PREVIOUS MONTH
    for (let i = firstDay - 1; i >= 0; i--) {

      const d = prevMonthDays - i;

      days.push({
        day: d,
        type: "prev",
        date: formatDate(year, month - 1, d),
      });
    }

    // CURRENT MONTH
    for (let i = 1; i <= currentMonthDays; i++) {

      days.push({
        day: i,
        type: "current",
        date: formatDate(year, month, i),
      });
    }

    // NEXT MONTH
    const remaining = 42 - days.length;

    for (let i = 1; i <= remaining; i++) {

      days.push({
        day: i,
        type: "next",
        date: formatDate(year, month + 1, i),
      });
    }

    return days;
  };

  const calendarDays = buildCalendar();

  // ===================================================
  // CHANGE MONTH
  // ===================================================

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  // ===================================================
  // OPEN ADD MODAL
  // ===================================================

  const openAdd = (dateStr) => {

    setForm({
      title: "",
      event_type: "exam",
      start_date: dateStr,
    });

    setEditId(null);

    setShowModal(true);
  };

  // ===================================================
  // SAVE EVENT
  // ===================================================

  const handleSubmit = () => {

    if (!form.title || !form.start_date) {
      alert("Title and Date required");
      return;
    }

    const url = editId
      ? `http://localhost:5000/api/update-event/${editId}`
      : `http://localhost:5000/api/add-event`;

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          fetchEvents();

          setShowModal(false);
        }

      })
      .catch((err) => console.log(err));
  };

  // ===================================================
  // DELETE EVENT
  // ===================================================

  const handleDelete = () => {

    fetch(
      `http://localhost:5000/api/delete-event/${editId}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {

        fetchEvents();

        setShowModal(false);

      })
      .catch((err) => console.log(err));
  };

  // ===================================================
  // COLORS
  // ===================================================

  const getBackground = (type, eventType) => {

    if (type === "prev") return "#f1f5f9";

    if (type === "next") return "#f1f5f9";

    if (eventType === "exam") return "#fee2e2";

    if (eventType === "assignment") return "#dbeafe";

    if (eventType === "holiday") return "#fef9c3";

    return "#ffffff";
  };

  // ===================================================
  // UI
  // ===================================================

  return (

    <div style={styles.container}>

      <h1 style={styles.title}>
        📅 Academic Calendar
      </h1>

      {/* HEADER */}

      <div style={styles.header}>

        <button
          style={styles.navBtn}
          onClick={() => changeMonth(-1)}
        >
          ⬅
        </button>

        <h2 style={{ margin: 0 }}>
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </h2>

        <button
          style={styles.navBtn}
          onClick={() => changeMonth(1)}
        >
          ➡
        </button>

      </div>

      {/* TOP BAR */}

      <div style={styles.topEventBar}>
        {topEvent}
      </div>

      {/* LEGEND */}

      <div style={styles.legendContainer}>

        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendColor,
              background: "#fee2e2",
            }}
          />
          Exam
        </div>

        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendColor,
              background: "#dbeafe",
            }}
          />
          Assignment
        </div>

        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendColor,
              background: "#fef9c3",
            }}
          />
          Holiday
        </div>

      </div>

      {/* CALENDAR */}

      <div style={styles.calendarBox}>

        <div style={styles.grid}>

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((d) => (
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

                  background: getBackground(
                    d.type,
                    event?.type
                  ),

                  border:
                    d.date === today
                      ? "2px solid #6366f1"
                      : "1px solid #e2e8f0",

                  opacity:
                    d.type === "current" ? 1 : 0.6,
                }}

                onMouseEnter={(e) => {

                  let text = "";

                  if (event) {
                    text = `${event.type.toUpperCase()} : ${event.title}`;
                  }

                  else if (d.type === "prev") {
                    text = "Previous Month Date";
                  }

                  else if (d.type === "next") {
                    text = "Next Month Date";
                  }

                  else {
                    text = "No Event";
                  }

                  setTopEvent(text);

                  setHoverPopup({
                    show: true,
                    x: e.clientX + 10,
                    y: e.clientY - 50,
                    text,
                  });
                }}

                onMouseLeave={() => {

                  setTopEvent("Hover on any date");

                  setHoverPopup({
                    show: false,
                    x: 0,
                    y: 0,
                    text: "",
                  });
                }}

                onClick={() => {

                  if (event?.id) {

                    setEditId(event.id);

                    setForm({
                      title: event.title,
                      event_type: event.type,
                      start_date: d.date,
                    });

                    setShowModal(true);
                  }
                }}
              >

                {/* DAY */}

                <div style={styles.dayText}>
                  {d.day}
                </div>

                {/* EVENT DOT */}

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

              </div>
            );
          })}

        </div>

      </div>

      {/* HOVER POPUP */}

      {hoverPopup.show && (

        <div
          style={{
            ...styles.hoverPopup,
            left: hoverPopup.x,
            top: hoverPopup.y,
          }}
        >
          {hoverPopup.text}
        </div>
      )}

      {/* MODAL */}

      {showModal && (

        <div style={styles.modal}>

          <div style={styles.modalBox}>

            <h3>
              {editId ? "Edit Event" : "Add Event"}
            </h3>

            <input
              style={styles.input}
              placeholder="Title"
              value={form.title}

              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <select
              style={styles.input}
              value={form.event_type}

              onChange={(e) =>
                setForm({
                  ...form,
                  event_type: e.target.value,
                })
              }
            >
              <option value="exam">
                Exam
              </option>

              <option value="assignment">
                Assignment
              </option>

              <option value="holiday">
                Holiday
              </option>

            </select>

            <button
              style={styles.saveBtn}
              onClick={handleSubmit}
            >
              Save
            </button>

            {editId && (
              <button
                style={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            <button
              style={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Calendar;

// ===================================================
// STYLES
// ===================================================

const styles = {

  container: {
    padding: "12px",
    fontFamily: "Poppins",
    background: "#f8fafc",
    minHeight: "100vh",
    maxWidth: "1200px",
    margin: "auto",
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#172554",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  navBtn: {
    background: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  topEventBar: {
    background: "#7c3aed",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
  },

  legendContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    background: "white",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#334155",
  },

  legendColor: {
    width: "14px",
    height: "14px",
    borderRadius: "4px",
  },

  calendarBox: {
    background: "white",
    padding: "10px",
    borderRadius: "14px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7,1fr)",
    gap: "6px",
  },

  dayName: {
    textAlign: "center",
    padding: "8px",
    fontWeight: "bold",
    background: "#e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
  },

  day: {
    minHeight: "75px",
    borderRadius: "10px",
    padding: "6px",
    position: "relative",
    transition: "0.3s",
    cursor: "pointer",
  },

  dayText: {
    fontWeight: "700",
    fontSize: "14px",
  },

  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    position: "absolute",
    bottom: "6px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  hoverPopup: {
    position: "fixed",
    background: "#111827",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    zIndex: 9999,
    pointerEvents: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    maxWidth: "220px",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    background: "white",
    padding: "18px",
    borderRadius: "12px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  saveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  closeBtn: {
    background: "#64748b",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};