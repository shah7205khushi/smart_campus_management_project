// import React, { useState, useEffect } from "react";

// function Timetable() {

//   const [type, setType] = useState("exam");

//   const [exams, setExams] = useState([]);
//   const [lectures] = useState([
//     { subject: "Machine Learning", course: "BCA", sem: "Sem 6", day: "Monday", time: "10:00 AM - 12:00 PM", faculty: "Dr. Mehta" },
//     { subject: "Python", course: "BCA", sem: "Sem 6", day: "Tuesday", time: "12:00 PM - 1:00 PM", faculty: "Mr. Shah" },
//     { subject: "Cloud Computing", course: "BCA", sem: "Sem 6", day: "Wednesday", time: "09:00 AM - 10:00 AM", faculty: "Mrs. Patel" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const today = new Date().toISOString().split("T")[0];

//   // ================= FETCH EXAMS =================
//   useEffect(() => {
//     fetchExams();
//   }, []);

//   const fetchExams = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/exams");
//       const data = await res.json();
//       setExams(data);
//     } catch (err) {
//       console.log("❌ Error fetching exams:", err);
//     }
//     setLoading(false);
//   };

//   // ================= STATUS =================
//   const getStatus = (date) => {
//     if (date === today) return "Today";
//     if (date < today) return "Completed";
//     return "Upcoming";
//   };

//   const getColor = (status) => {
//     if (status === "Completed") return "#22c55e";
//     if (status === "Today") return "#f59e0b";
//     return "#3b82f6";
//   };

//   // ================= FILTER =================
//   const filteredExams = exams.filter((e) =>
//     e.subject.toLowerCase().includes(search.toLowerCase())
//   );

//   const filteredLectures = lectures.filter((l) =>
//     l.subject.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={styles.container}>

//       {/* TYPE SWITCH */}
//       <select
//         value={type}
//         onChange={(e) => setType(e.target.value)}
//         style={styles.dropdown}
//       >
//         <option value="exam">Exam Timetable</option>
//         <option value="lecture">Lecture Timetable</option>
//       </select>

//       {/* SEARCH */}
//       <input
//         placeholder="Search subject..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={styles.input}
//       />

//       {/* ================= EXAMS ================= */}
//       {type === "exam" && (
//         <>
//           {loading ? (
//             <p>⏳ Loading exams...</p>
//           ) : filteredExams.length === 0 ? (
//             <p style={{ color: "gray" }}>😴 No exams found</p>
//           ) : (
//             <table style={styles.table}>
//               <thead>
//                 <tr style={styles.headerRow}>
//                   <th>Subject</th>
//                   <th>Course</th>
//                   <th>Semester</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Duration</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredExams.map((exam, i) => {
//                   const status = getStatus(exam.date);
//                   return (
//                     <tr key={i} style={i % 2 ? styles.row1 : styles.row2}>
//                       <td>{exam.subject}</td>
//                       <td>{exam.course}</td>
//                       <td>{exam.sem}</td>
//                       <td>{exam.date}</td>
//                       <td>{exam.time}</td>
//                       <td>{exam.duration}</td>
//                       <td>
//                         <span style={{ ...styles.badge, background: getColor(status) }}>
//                           {status}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </>
//       )}

//       {/* ================= LECTURES ================= */}
//       {type === "lecture" && (
//         <>
//           {filteredLectures.length === 0 ? (
//             <p style={{ color: "gray" }}>😴 No lectures found</p>
//           ) : (
//             <table style={styles.table}>
//               <thead>
//                 <tr style={styles.headerRow}>
//                   <th>Subject</th>
//                   <th>Course</th>
//                   <th>Semester</th>
//                   <th>Day</th>
//                   <th>Time</th>
//                   <th>Faculty</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredLectures.map((lec, i) => (
//                   <tr key={i} style={i % 2 ? styles.row1 : styles.row2}>
//                     <td>{lec.subject}</td>
//                     <td>{lec.course}</td>
//                     <td>{lec.sem}</td>
//                     <td>{lec.day}</td>
//                     <td>{lec.time}</td>
//                     <td>{lec.faculty}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
//       )}

//       {/* INFO */}
//       <div style={styles.instructions}>
//         <h3>📌 Instructions</h3>
//         <ul>
//           <li>Check timetable regularly</li>
//           <li>Be on time for lectures & exams</li>
//           <li>Follow academic rules</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Timetable;

// // 🎨 STYLES
// const styles = {
//   container: { width: "100%", padding: "20px", fontFamily: "Poppins" },

//   dropdown: { padding: "8px", borderRadius: "6px", marginBottom: "10px" },

//   input: {
//     padding: "8px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     marginBottom: "15px",
//     width: "100%",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     background: "white",
//     borderRadius: "10px",
//     overflow: "hidden",
//   },

//   headerRow: { background: "#172f6e", color: "white" },

//   row1: { background: "#f9fafb" },
//   row2: { background: "#ffffff" },

//   badge: {
//     padding: "5px 10px",
//     borderRadius: "20px",
//     color: "white",
//     fontSize: "12px",
//   },

//   instructions: {
//     marginTop: "20px",
//     background: "white",
//     padding: "15px",
//     borderRadius: "10px",
//   },
// };

import React, { useState, useEffect } from "react";

function Timetable() {

  const API = "http://localhost:5000";

  const [type, setType] = useState("exam");
  const [exams, setExams] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const courseId = user?.course_id;
  const semester = user?.semester;

  useEffect(() => {
    if (courseId && semester) {
      fetchAll();
    }
  }, [courseId, semester]);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const examRes = await fetch(
        `${API}/api/exams?course_id=${courseId}&semester=${semester}`
      );
      const examData = await examRes.json();

      const lectureRes = await fetch(
        `${API}/api/lectures?course_id=${courseId}&semester=${semester}`
      );
      const lectureData = await lectureRes.json();

      setExams(examData || []);
      setLectures(lectureData || []);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const getStatus = (date) => {
    if (!date) return "Unknown";
    if (date === today) return "Today";
    if (date < today) return "Completed";
    return "Upcoming";
  };

  const getColor = (status) => {
    if (status === "Completed") return "#22c55e";
    if (status === "Today") return "#f59e0b";
    return "#3b82f6";
  };

  const filteredExams = exams.filter((e) =>
    (e.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredLectures = lectures.filter((l) =>
    (l.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1>📅 Timetable Dashboard</h1>
        <p>
          Course: {courseId || "Not Assigned"} | Semester: {semester || "Not Assigned"}
        </p>
      </div>

      <div style={styles.topBar}>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.dropdown}
        >
          <option value="exam">Exam Timetable</option>
          <option value="lecture">Lecture Timetable</option>
        </select>

        <input
          placeholder="🔍 Search subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

      </div>

      {loading && <p>Loading...</p>}

      {type === "exam" && !loading && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Subject</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredExams.map((exam, i) => {
              const status = getStatus(exam.date);

              return (
                <tr key={i}>
                  <td>{exam.subject}</td>
                  <td>{exam.course}</td>
                  <td>{exam.sem}</td>
                  <td>{exam.date}</td>
                  <td>{exam.time}</td>
                  <td>{exam.duration}</td>
                  <td>
                    <span style={{ background: getColor(status), color: "white", padding: "5px 10px", borderRadius: "10px" }}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {type === "lecture" && !loading && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Subject</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Day</th>
              <th>Time</th>
              <th>Faculty</th>
            </tr>
          </thead>

          <tbody>
            {filteredLectures.map((lec, i) => (
              <tr key={i}>
                <td>{lec.subject}</td>
                <td>{lec.course}</td>
                <td>{lec.sem}</td>
                <td>{lec.day}</td>
                <td>{lec.time}</td>
                <td>{lec.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default Timetable;
// 🎨 CLEAN MODERN STYLES
const styles = {

  container: {
    width: "1300px",
    padding: "20px",
    fontFamily: "Poppins",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    background: "linear-gradient(135deg, #172f6e, #3b82f6)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  dropdown: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    flex: 1,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
  },

  headerRow: {
    background: "#172f6e",
    color: "white",
  },

  row1: { background: "#f9fafb" },
  row2: { background: "#ffffff" },

  badge: {
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
  },

  empty: {
    color: "gray",
    marginTop: "10px",
  },

  instructions: {
    marginTop: "20px",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
  }
};