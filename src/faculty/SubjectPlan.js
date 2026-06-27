// import React, { useState } from "react";

// function SubjectPlan() {
//   // 🔥 Dummy data (later connect Flask API)
//   const [subjects, setSubjects] = useState([
//     {
//       id: 1,
//       name: "Machine Learning",
//       code: "ML101",
//       plan: [
//         { topic: "Introduction to ML", date: "2026-04-10" },
//         { topic: "Supervised Learning", date: "2026-04-15" }
//       ]
//     },
//     {
//       id: 2,
//       name: "Database Management",
//       code: "DB202",
//       plan: [
//         { topic: "ER Model", date: "2026-04-12" }
//       ]
//     }
//   ]);

//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [newTopic, setNewTopic] = useState("");
//   const [newDate, setNewDate] = useState("");

//   // 🔥 ADD PLAN
//   const addPlan = () => {
//     if (!newTopic || !newDate) {
//       alert("Fill all fields ⚠️");
//       return;
//     }

//     const updated = subjects.map((sub) => {
//       if (sub.id === selectedSubject.id) {
//         return {
//           ...sub,
//           plan: [...sub.plan, { topic: newTopic, date: newDate }]
//         };
//       }
//       return sub;
//     });

//     setSubjects(updated);
//     setNewTopic("");
//     setNewDate("");
//   };

//   return (
//     <>
//       <style>{`
//         body {
//           margin: 0;
//           font-family: "Poppins", sans-serif;
//         }

//         .container {
//           padding: 20px;
//         }

//         .title {
//           font-size: 28px;
//           color: #1e3a8a;
//           margin-bottom: 20px;
//         }

//         .subjects {
//           display: flex;
//           gap: 20px;
//           flex-wrap: wrap;
//         }

//         .card {
//           width: 220px;
//           padding: 20px;
//           border-radius: 15px;
//           background: linear-gradient(135deg, #0f172a, #1e3a8a);
//           color: white;
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .card:hover {
//           transform: scale(1.05);
//         }

//         .plan-box {
//           margin-top: 30px;
//           background: white;
//           padding: 20px;
//           border-radius: 15px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//         }

//         .plan-item {
//           padding: 10px;
//           border-bottom: 1px solid #ddd;
//         }

//         input {
//           padding: 10px;
//           margin: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//         }

//         button {
//           padding: 10px 15px;
//           border: none;
//           border-radius: 8px;
//           background: #1e3a8a;
//           color: white;
//           cursor: pointer;
//         }

//         button:hover {
//           background: #0f172a;
//         }
//       `}</style>

//       <div className="container">

//         <h2 className="title">📘 Subject Plan</h2>

//         {/* 🔥 SUBJECT LIST */}
//         <div className="subjects">
//           {subjects.map((sub) => (
//             <div
//               key={sub.id}
//               className="card"
//               onClick={() => setSelectedSubject(sub)}
//             >
//               <h3>{sub.name}</h3>
//               <p>{sub.code}</p>
//             </div>
//           ))}
//         </div>

//         {/* 🔥 SUBJECT PLAN VIEW */}
//         {selectedSubject && (
//           <div className="plan-box">
//             <h3>{selectedSubject.name} - Plan</h3>

//             {/* Existing Plans */}
//             {selectedSubject.plan.map((p, index) => (
//               <div key={index} className="plan-item">
//                 📌 {p.topic} - <b>{p.date}</b>
//               </div>
//             ))}

//             {/* Add New Plan */}
//             <div style={{ marginTop: "20px" }}>
//               <h4>Add New Topic</h4>

//               <input
//                 placeholder="Enter Topic"
//                 value={newTopic}
//                 onChange={(e) => setNewTopic(e.target.value)}
//               />

//               <input
//                 type="date"
//                 value={newDate}
//                 onChange={(e) => setNewDate(e.target.value)}
//               />

//               <button onClick={addPlan}>Add</button>
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }

// export default SubjectPlan;

import React, { useEffect, useState } from "react";

function SubjectPlan({ facultyId = 1 }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/faculty/subjects/${facultyId}`
      );
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (subjectId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/subject-plan/${subjectId}`
      );
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (sub) => {
    if (selectedSubject?.subject_id === sub.subject_id) {
      setSelectedSubject(null);
      setPlans([]);
    } else {
      setSelectedSubject(sub);
      fetchPlans(sub.subject_id);
    }
  };

  const addPlan = async () => {
    if (!topic || !date) {
      alert("Fill all fields ⚠️");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/subject-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_id: selectedSubject.subject_id,
          topic,
          plan_date: date,
        }),
      });

      setTopic("");
      setDate("");
      fetchPlans(selectedSubject.subject_id);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePlan = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/subject-plan/${id}`, {
        method: "DELETE",
      });

      fetchPlans(selectedSubject.subject_id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.pageWrapper}>

      {/* ================= SIDEBAR ================= */}
      {/* <div style={styles.sidebar}>
        <h3>📘 Faculty Panel</h3>
        <p>Subjects</p>
        <p>Plans</p>
        <p>Dashboard</p>
      </div> */}

      {/* ================= MAIN CONTENT ================= */}
      <div style={styles.container}>
        <h2 style={styles.title}>📘 Subject Plan</h2>

        {loading ? (
          <p style={styles.loading}>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <div style={styles.noData}>
            😴 No Subjects Found
            <br />
            <small>Ask admin to assign subjects</small>
          </div>
        ) : (
          <div style={styles.grid}>
            {subjects.map((sub) => (
              <div
                key={sub.subject_id}
                style={{
                  ...styles.card,
                  border:
                    selectedSubject?.subject_id === sub.subject_id
                      ? "2px solid #fff"
                      : "none",
                }}
                onClick={() => handleSelect(sub)}
              >
                <h3>{sub.subject_name}</h3>
                <p>{sub.subject_code}</p>
              </div>
            ))}
          </div>
        )}

        {selectedSubject && (
          <div style={styles.planBox}>
            <h3>📚 {selectedSubject.subject_name} Plan</h3>

            {plans.length === 0 ? (
              <p style={{ color: "#777" }}>No topics added 😴</p>
            ) : (
              plans.map((p) => (
                <div key={p.id} style={styles.planItem}>
                  <span>📌 {p.topic}</span>
                  <span>{p.plan_date}</span>

                  <button
                    onClick={() => deletePlan(p.id)}
                    style={styles.deleteBtn}
                  >
                    ❌
                  </button>
                </div>
              ))
            )}

            <div style={styles.form}>
              <input
                placeholder="Enter Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={styles.input}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
              />

              <button onClick={addPlan} style={styles.button}>
                ➕ Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectPlan;

const styles = {

  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
  },

  sidebar: {
    width: "280px",
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0f172a,#1e293b)",
    color: "white",
    padding: "20px",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    background: "#172f6e",
    color: "white",
    padding: 12,
    borderRadius: 8,
  },

  loading: {
    marginTop: 20,
    fontSize: 16,
  },

  noData: {
    marginTop: 20,
    padding: 30,
    background: "white",
    borderRadius: 10,
    textAlign: "center",
    color: "#555",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  grid: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },

  card: {
    width: 220,
    padding: 20,
    borderRadius: 12,
    background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    color: "white",
    cursor: "pointer",
  },

  planBox: {
    marginTop: 30,
    background: "white",
    padding: 20,
    borderRadius: 12,
  },

  planItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #ddd",
  },

  form: {
    marginTop: 20,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  button: {
    background: "#172f6e",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: 6,
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: 5,
    padding: "4px 8px",
    cursor: "pointer",
  },
};