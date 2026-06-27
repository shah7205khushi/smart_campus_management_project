// import React, { useState } from "react";

// function Exams() {

//   // 🔥 Exam Schedule (dummy data)
//   const [exams] = useState([
//     { id: 1, subject: "Machine Learning", date: "2026-05-10" },
//     { id: 2, subject: "DBMS", date: "2026-05-15" }
//   ]);

//   // 🔥 Student Marks
//   const [marks, setMarks] = useState([
//     { id: 1, name: "Rahul Shah", subject: "Machine Learning", marks: 80 },
//     { id: 2, name: "Priya Patel", subject: "Machine Learning", marks: 70 }
//   ]);

//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [studentName, setStudentName] = useState("");
//   const [studentMarks, setStudentMarks] = useState("");

//   // ✅ ADD / UPDATE MARKS
//   const saveMarks = () => {
//     if (!selectedSubject || !studentName || !studentMarks) {
//       alert("Fill all fields ⚠️");
//       return;
//     }

//     // 🔍 check if already exists
//     const existing = marks.find(
//       (m) =>
//         m.name === studentName &&
//         m.subject === selectedSubject
//     );

//     if (existing) {
//       // 🔄 UPDATE
//       const updated = marks.map((m) =>
//         m.id === existing.id
//           ? { ...m, marks: studentMarks }
//           : m
//       );
//       setMarks(updated);
//     } else {
//       // ➕ ADD
//       const newMark = {
//         id: Date.now(),
//         name: studentName,
//         subject: selectedSubject,
//         marks: studentMarks
//       };
//       setMarks([...marks, newMark]);
//     }

//     setStudentName("");
//     setStudentMarks("");
//   };

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

//         input, select {
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

//         table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         th, td {
//           padding: 10px;
//           border-bottom: 1px solid #ddd;
//           text-align: left;
//         }
//       `}</style>

//       <div className="container">

//         <h2>🧪 Exam Section</h2>

//         {/* 🔥 EXAM SCHEDULE */}
//         <div className="card">
//           <h3>📅 Exam Schedule</h3>

//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {exams.map((e) => (
//                 <tr key={e.id}>
//                   <td>{e.subject}</td>
//                   <td>{e.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 🔥 ADD / UPDATE MARKS */}
//         <div className="card">
//           <h3>📝 Upload / Modify Marks</h3>

//           <select onChange={(e) => setSelectedSubject(e.target.value)}>
//             <option value="">Select Subject</option>
//             {exams.map((e) => (
//               <option key={e.id}>{e.subject}</option>
//             ))}
//           </select>

//           <input
//             placeholder="Student Name"
//             value={studentName}
//             onChange={(e) => setStudentName(e.target.value)}
//           />

//           <input
//             type="number"
//             placeholder="Marks"
//             value={studentMarks}
//             onChange={(e) => setStudentMarks(e.target.value)}
//           />

//           <button onClick={saveMarks}>Save</button>
//         </div>

//         {/* 🔥 MARKS TABLE */}
//         <div className="card">
//           <h3>📊 Student Marks</h3>

//           <table>
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Subject</th>
//                 <th>Marks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {marks.map((m) => (
//                 <tr key={m.id}>
//                   <td>{m.name}</td>
//                   <td>{m.subject}</td>
//                   <td>{m.marks}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </>
//   );
// }

// export default Exams;

import React, { useEffect, useState } from "react";

function FacultyExams() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  // ================= LOAD EXAMS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/faculty/exams")
      .then(res => res.json())
      .then(data => setExams(data))
      .catch(err => console.log(err));
  }, []);

  // ================= FILTER =================
  const filtered = exams.filter(e =>
    (e.exam_name.toLowerCase().includes(search.toLowerCase()) ||
     e.subject_name.toLowerCase().includes(search.toLowerCase())) &&
    (filterCourse ? e.course_name === filterCourse : true) &&
    (filterSemester ? String(e.semester) === filterSemester : true)
  );

  const scheduled = exams.filter(e => e.status === "scheduled").length;
  const completed = exams.filter(e => e.status === "completed").length;

  return (
    <>
      <style>{`
        .box { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
        input { padding: 8px; margin: 5px; border-radius: 8px; border: 1px solid #ccc; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: center; }
        th { background: #3b82f6; color: white; }
        .analytics { display: flex; gap: 20px; margin-top: 20px; }
        .card { flex: 1; padding: 15px; border-radius: 12px; color: white; text-align: center; }
        .c1 { background: #6366f1; }
        .c2 { background: orange; }
        .c3 { background: green; }
      `}</style>

      <div className="box">
        <h2>📘 Exam Timetable</h2>

        {/* SEARCH + FILTER */}
        <input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Filter by Course" onChange={(e) => setFilterCourse(e.target.value)} />
        <input placeholder="Filter by Semester" onChange={(e) => setFilterSemester(e.target.value)} />

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Exam</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr key={e.exam_id}>
                <td>{e.exam_name}</td>
                <td>{e.course_name}</td>
                <td>{e.semester}</td>
                <td>{e.subject_name}</td>
                <td>{e.exam_date}</td>
                <td>{e.start_time}</td>
                <td>{e.end_time}</td>
                <td>{e.duration} hrs</td>
                <td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ANALYTICS */}
        <div className="analytics">
          <div className="card c1">Total: {exams.length}</div>
          <div className="card c2">Scheduled: {scheduled}</div>
          <div className="card c3">Completed: {completed}</div>
        </div>
      </div>
    </>
  );
}

export default FacultyExams;