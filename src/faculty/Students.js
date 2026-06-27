// import React, { useState } from "react";

// function Students() {

//   // 🔥 Dummy data (later connect Flask API)
//   const [students] = useState([
//     {
//       id: 1,
//       name: "Rahul Shah",
//       email: "rahul@gmail.com",
//       progress: 80,
//       assignments: { completed: 8, pending: 2 }
//     },
//     {
//       id: 2,
//       name: "Priya Patel",
//       email: "priya@gmail.com",
//       progress: 60,
//       assignments: { completed: 6, pending: 4 }
//     },
//     {
//       id: 3,
//       name: "Amit Kumar",
//       email: "amit@gmail.com",
//       progress: 90,
//       assignments: { completed: 9, pending: 1 }
//     }
//   ]);

//   const [selectedStudent, setSelectedStudent] = useState(null);

//   return (
//     <>
//       <style>{`
//         .container {
//           padding: 20px;
//         }

//         .grid {
//           display: flex;
//           gap: 20px;
//           flex-wrap: wrap;
//         }

//         .card {
//           width: 250px;
//           padding: 20px;
//           border-radius: 15px;
//           background: white;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .card:hover {
//           transform: scale(1.05);
//         }

//         .progress-bar {
//           height: 10px;
//           background: #ddd;
//           border-radius: 10px;
//           overflow: hidden;
//           margin-top: 10px;
//         }

//         .progress {
//           height: 100%;
//           background: linear-gradient(90deg, #1e3a8a, #0f172a);
//         }

//         .details {
//           margin-top: 30px;
//           padding: 20px;
//           background: white;
//           border-radius: 15px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//         }
//       `}</style>

//       <div className="container">

//         <h2>👨‍🎓 Student List</h2>

//         {/* 🔥 STUDENT CARDS */}
//         <div className="grid">
//           {students.map((stu) => (
//             <div
//               key={stu.id}
//               className="card"
//               onClick={() => setSelectedStudent(stu)}
//             >
//               <h3>{stu.name}</h3>
//               <p>{stu.email}</p>

//               <p>Progress: {stu.progress}%</p>

//               <div className="progress-bar">
//                 <div
//                   className="progress"
//                   style={{ width: `${stu.progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 🔥 STUDENT DETAILS */}
//         {selectedStudent && (
//           <div className="details">
//             <h3>{selectedStudent.name} - Details</h3>

//             <p><b>Email:</b> {selectedStudent.email}</p>
//             <p><b>Overall Progress:</b> {selectedStudent.progress}%</p>

//             <h4>Assignment Status</h4>
//             <p>✅ Completed: {selectedStudent.assignments.completed}</p>
//             <p>⏳ Pending: {selectedStudent.assignments.pending}</p>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }

// export default Students;

// import React, { useEffect, useState } from "react";

// function Students() {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // ================= FETCH STUDENTS =================
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/students");
//       const data = await res.json();
//       setStudents(data);
//       setLoading(false);
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   };

//   // ================= TOGGLE SELECT =================
//   const handleSelect = (stu) => {
//     if (selectedStudent?.id === stu.id) {
//       setSelectedStudent(null);
//     } else {
//       setSelectedStudent(stu);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>👨‍🎓 Students Dashboard</h2>

//       {loading ? (
//         <p>Loading students...</p>
//       ) : students.length === 0 ? (
//         <p>No students found 😴</p>
//       ) : (
//         <div style={styles.grid}>
//           {students.map((stu) => (
//             <div
//               key={stu.id}
//               style={{
//                 ...styles.card,
//                 border:
//                   selectedStudent?.id === stu.id
//                     ? "2px solid #172f6e"
//                     : "none",
//               }}
//               onClick={() => handleSelect(stu)}
//             >
//               <h3>{stu.name}</h3>
//               <p style={styles.email}>{stu.email}</p>

//               <p style={styles.progressText}>
//                 Progress: {stu.progress}%
//               </p>

//               <div style={styles.progressBar}>
//                 <div
//                   style={{
//                     ...styles.progress,
//                     width: `${stu.progress}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* DETAILS PANEL */}
//       {selectedStudent && (
//         <div style={styles.details}>
//           <h3>📊 {selectedStudent.name}</h3>

//           <div style={styles.detailRow}>
//             <span>Email:</span>
//             <span>{selectedStudent.email}</span>
//           </div>

//           <div style={styles.detailRow}>
//             <span>Progress:</span>
//             <span>{selectedStudent.progress}%</span>
//           </div>

//           <div style={styles.assignmentBox}>
//             <h4>Assignments</h4>
//             <p>✅ Completed: {selectedStudent.completed}</p>
//             <p>⏳ Pending: {selectedStudent.pending}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Students;

// /* ================= STYLES ================= */

// const styles = {
//   container: {
//     padding: "20px",
//     background: "#f5f7fb",
//     minHeight: "100vh",
//     width: "1637px",
//   },

//     sidebar: {
//     width: "260px",
//     background: "linear-gradient(180deg,#0f172a,#1e293b)",
//     color: "white",
//     padding: "20px",
//   },

//   title: {
//     background: "#172f6e",
//     color: "white",
//     padding: "12px",
//     borderRadius: "8px",
//   },
//   grid: {
//     display: "flex",
//     gap: "20px",
//     flexWrap: "wrap",
//     marginTop: "20px",
//   },
//   card: {
//     width: "460px",
//     height: "250px",
//     padding: "20px",
//     borderRadius: "12px",
//     background: "white",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     cursor: "pointer",
//   },
//   email: {
//     fontSize: "14px",
//     color: "#555",
//   },
//   progressText: {
//     marginTop: "10px",
//     fontWeight: "bold",
//   },
//   progressBar: {
//     height: "10px",
//     background: "#ddd",
//     borderRadius: "10px",
//     overflow: "hidden",
//     marginTop: "8px",
//   },
//   progress: {
//     height: "100%",
//     background: "linear-gradient(90deg, #172f6e, #0f172a)",
//   },
//   details: {
//     marginTop: "30px",
//     padding: "20px",
//     background: "white",
//     borderRadius: "12px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     maxWidth: "500px",
//   },
//   detailRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     margin: "8px 0",
//   },
//   assignmentBox: {
//     marginTop: "15px",
//     padding: "10px",
//     background: "#f1f5f9",
//     borderRadius: "8px",
//   },
// };

import React, { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");

  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();

      // 🔥 Normalize backend fields → frontend-friendly fields
      const formatted = data.map((s) => ({
        ...s,
        completed: s.completed_assignments,
        pending: s.pending_assignments,
      }));

      setStudents(formatted);

      // dropdown filters
      setCourses([...new Set(formatted.map(s => s.course))]);
      setSemesters([...new Set(formatted.map(s => s.semester))]);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSelect = (stu) => {
    setSelectedStudent(selectedStudent?.id === stu.id ? null : stu);
  };

  const filteredStudents = students.filter((stu) => {
    return (
      (course === "" || stu.course === course) &&
      (semester === "" || String(stu.semester) === semester)
    );
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>

        <h2 style={styles.title}>👨‍🎓 Students Progress</h2>

        {/* FILTER */}
        <div style={styles.filterBox}>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={styles.dropdown}
          >
            <option value="">All Courses</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={styles.dropdown}
          >
            <option value="">All Semesters</option>
            {semesters.map((s, i) => (
              <option key={i} value={s}>Sem {s}</option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredStudents.length === 0 ? (
          <p>No students found 😴</p>
        ) : (
          <div style={styles.grid}>
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                style={{
                  ...styles.card,
                  border:
                    selectedStudent?.id === stu.id
                      ? "2px solid #172f6e"
                      : "none",
                }}
                onClick={() => handleSelect(stu)}
              >
                <h3>{stu.name}</h3>
                <p style={styles.email}>{stu.email}</p>

                <p>📚 {stu.course}</p>
                <p>🎯 Sem {stu.semester}</p>

                <p style={styles.progressText}>
                  Progress: {stu.progress}%
                </p>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progress,
                      width: `${stu.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETAILS PANEL */}
        {selectedStudent && (
          <div style={styles.details}>
            <h3>📊 {selectedStudent.name}</h3>

            <div style={styles.detailRow}>
              <span>Email:</span>
              <span>{selectedStudent.email}</span>
            </div>

            <div style={styles.detailRow}>
              <span>Course:</span>
              <span>{selectedStudent.course}</span>
            </div>

            <div style={styles.detailRow}>
              <span>Semester:</span>
              <span>{selectedStudent.semester}</span>
            </div>

            <div style={styles.detailRow}>
              <span>Progress:</span>
              <span>{selectedStudent.progress}%</span>
            </div>

            <div style={styles.assignmentBox}>
              <h4>Assignments</h4>
              <p>✅ Completed: {selectedStudent.completed}</p>
              <p>⏳ Pending: {selectedStudent.pending}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Students;

const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
  },

  container: {
    flex: 1,
    padding: "20px",
  },

  title: {
    background: "#172f6e",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
  },

  filterBox: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },

  dropdown: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  card: {
    width: "300px",
    padding: "20px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },

  email: {
    fontSize: "14px",
    color: "#555",
  },

  progressText: {
    marginTop: "10px",
    fontWeight: "bold",
  },

  progressBar: {
    height: "10px",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "8px",
  },

  progress: {
    height: "100%",
    background: "linear-gradient(90deg, #172f6e, #0f172a)",
  },

  details: {
    marginTop: "30px",
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "500px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
  },

  assignmentBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "8px",
  },
};