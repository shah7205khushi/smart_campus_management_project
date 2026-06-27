import React, { useState, useEffect } from "react";

function Exams() {

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [examRows, setExamRows] = useState([]);

  const [form, setForm] = useState({
    name: "",
    course: "",
    semester: "",
    type: "internal",

    subject: "",
    date: "",
    start_time: "",
    end_time: "",
    duration: ""
  });

  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // ================= LOAD EXAMS =================
  const loadExams = () => {

    fetch("http://localhost:5000/exams")
      .then(res => res.json())
      .then(data => setExams(data));
  };

  useEffect(() => {
    loadExams();
  }, []);

  // ================= LOAD COURSES =================
  useEffect(() => {

    fetch("http://localhost:5000/courses")
      .then(res => res.json())
      .then(data => setCourses(data));

  }, []);

  // ================= LOAD SUBJECTS =================
  useEffect(() => {

    fetch("http://localhost:5000/subjects-exam")
      .then(res => res.json())
      .then(data => setSubjects(data));

  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    if (e.target.name === "course") {

      setForm({
        ...form,
        course: e.target.value,
        subject: ""
      });

    } else {

      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }
  };

  // ================= ADD SUBJECT ROW =================
  const addSubjectRow = () => {

    if (
      !form.subject ||
      !form.date ||
      !form.start_time ||
      !form.end_time ||
      !form.duration
    ) {
      alert("Fill all subject fields");
      return;
    }

    setExamRows([
      ...examRows,
      {
        subject: form.subject,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        duration: form.duration
      }
    ]);

    setForm({
      ...form,
      subject: "",
      date: "",
      start_time: "",
      end_time: "",
      duration: ""
    });
  };

  // ================= EDIT =================
  const handleEdit = (e) => {

    setEditId(e.exam_id);

    setForm({
      name: e.exam_name,
      course: e.course_name,
      semester: e.semester,
      type: e.exam_type,

      subject: e.subject_name,
      date: e.exam_date,
      start_time: e.start_time?.slice(0, 5),
      end_time: e.end_time?.slice(0, 5),
      duration: e.duration
    });

    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {

    // ================= UPDATE =================
    if (editId) {

      fetch(`http://localhost:5000/update-exam/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          course: form.course,
          subject: form.subject,
          semester: form.semester,
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
          duration: form.duration,
          type: form.type
        })
      })
        .then(res => res.json())
        .then(data => {

          if (data.success) {

            alert("Exam Updated");

            loadExams();

            setShowModal(false);

            setEditId(null);

            setForm({
              name: "",
              course: "",
              semester: "",
              type: "internal",

              subject: "",
              date: "",
              start_time: "",
              end_time: "",
              duration: ""
            });
          }
        });

      return;
    }

    // ================= ADD =================
    if (!form.name || !form.course || !form.semester) {

      alert("Fill exam details");
      return;
    }

    if (examRows.length === 0) {

      alert("Add at least one subject");
      return;
    }

    fetch("http://localhost:5000/add-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name,
        course: form.course,
        semester: form.semester,
        type: form.type,
        exams: examRows
      })
    })
      .then(res => res.json())
      .then(data => {

        if (data.success) {

          alert("Exam timetable generated");

          loadExams();

          setForm({
            name: "",
            course: "",
            semester: "",
            type: "internal",

            subject: "",
            date: "",
            start_time: "",
            end_time: "",
            duration: ""
          });

          setExamRows([]);

          setShowModal(false);

        } else {

          alert(data.message);
        }
      });
  };

  // ================= DELETE =================
  const handleDelete = (id) => {

    if (window.confirm("Delete this exam?")) {

      fetch(`http://localhost:5000/delete-exam/${id}`, {
        method: "DELETE"
      })
        .then(() => loadExams());
    }
  };

  // ================= STATUS =================
  const toggleStatus = (id) => {

    fetch(`http://localhost:5000/update-exam-status/${id}`, {
      method: "PUT"
    })
      .then(() => loadExams());
  };

  // ================= FILTER =================
  const filtered = exams.filter(e =>

    (
      e.exam_name.toLowerCase().includes(search.toLowerCase()) ||
      e.subject_name.toLowerCase().includes(search.toLowerCase())
    ) &&

    (
      filterCourse
        ? e.course_name.toLowerCase().includes(filterCourse.toLowerCase())
        : true
    ) &&

    (
      filterSemester
        ? String(e.semester).includes(String(filterSemester))
        : true
    )
  );

  const scheduled = exams.filter(
    e => e.status.toLowerCase() === "scheduled"
  ).length;

  const completed = exams.filter(
    e => e.status.toLowerCase() === "completed"
  ).length;

  return (
    <>

      <style>{`

        .box{
          background:white;
          padding:20px;
          border-radius:15px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08);
        }

        .top{
          display:flex;
          justify-content:space-between;
          margin-bottom:15px;
        }

        input,select{
          padding:8px;
          margin:5px;
          border-radius:8px;
          border:1px solid #ccc;
        }

        button{
          padding:8px 12px;
          border-radius:8px;
          border:none;
          background:#3b82f6;
          color:white;
          cursor:pointer;
        }

        .edit{
          background:#10b981;
        }

        .delete{
          background:#ef4444;
        }

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:10px;
        }

        th,td{
          padding:10px;
          border-bottom:1px solid #ddd;
          text-align:center;
        }

        th{
          background:#3b82f6;
          color:white;
        }

        .status{
          padding:5px 10px;
          border-radius:10px;
          cursor:pointer;
          color:white;
        }

        .scheduled{
          background:orange;
        }

        .completed{
          background:green;
        }

        .analytics{
          display:flex;
          gap:20px;
          margin-top:20px;
        }

        .card{
          flex:1;
          padding:15px;
          border-radius:12px;
          color:white;
          text-align:center;
        }

        .c1{
          background:#6366f1;
        }

        .c2{
          background:orange;
        }

        .c3{
          background:green;
        }

        .modal{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .modal-content{
          background:white;
          padding:20px;
          border-radius:10px;
          width:500px;
          max-height:90vh;
          overflow:auto;
        }

      `}</style>

      <div className="box">

        <div className="top">

          <h2>📝 Exam Management</h2>

          <button onClick={() => {

            setForm({
              name: "",
              course: "",
              semester: "",
              type: "internal",

              subject: "",
              date: "",
              start_time: "",
              end_time: "",
              duration: ""
            });

            setExamRows([]);

            setEditId(null);

            setShowModal(true);

          }}>
            + Add Exam
          </button>

        </div>

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Filter by Course"
          onChange={(e) => setFilterCourse(e.target.value)}
        />

        <input
          placeholder="Filter by Semester"
          onChange={(e) => setFilterSemester(e.target.value)}
        />

        {/* TABLE */}
        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
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

                <td>
                  <span
                    className={`status ${e.status.toLowerCase()}`}
                    onClick={() => toggleStatus(e.exam_id)}
                  >
                    {e.status}
                  </span>
                </td>

                <td>

                  <div style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center"
                  }}>

                    <button
                      className="edit"
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(e.exam_id)}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* ANALYTICS */}
        <div className="analytics">

          <div className="card c1">
            Total: {exams.length}
          </div>

          <div className="card c2">
            Scheduled: {scheduled}
          </div>

          <div className="card c3">
            Completed: {completed}
          </div>

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div
          className="modal"
          onClick={() => setShowModal(false)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>
              {editId ? "Edit Exam" : "Generate Exam Timetable"}
            </h3>

            {/* COMMON */}
            <input
              name="name"
              placeholder="Exam Name"
              value={form.name}
              onChange={handleChange}
            />

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >

              <option value="">Select Course</option>

              {courses.map(c => (
                <option
                  key={c.course_id}
                >
                  {c.course_name}
                </option>
              ))}

            </select>

            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
            >

              <option value="">Select Semester</option>

              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>

            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >

              <option value="internal">Internal</option>
              <option value="external">External</option>

            </select>

            {/* ================= EDIT MODE ================= */}
            {editId ? (

              <>

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                />

                <input
                  name="duration"
                  placeholder="Duration"
                  value={form.duration}
                  onChange={handleChange}
                />

                <br />

                <button onClick={handleSubmit}>
                  Update Exam
                </button>

              </>

            ) : (

              <>

                <hr />

                {/* ADD MULTIPLE SUBJECTS */}

                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >

                  <option value="">Select Subject</option>

                  {subjects
                    .filter(s =>
                      !form.course ||
                      s.course_name === form.course
                    )
                    .map(s => (

                      <option
                        key={s.subject_id}
                      >
                        {s.subject_name}
                      </option>

                    ))}

                </select>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                />

                <input
                  name="duration"
                  placeholder="Duration"
                  value={form.duration}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={addSubjectRow}
                >
                  + Add Subject
                </button>

                {/* SUBJECT TABLE */}
                <table>

                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>

                    {examRows.map((e, index) => (

                      <tr key={index}>

                        <td>{e.subject}</td>

                        <td>{e.date}</td>

                        <td>
                          {e.start_time} - {e.end_time}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

                <br />

                <button onClick={handleSubmit}>
                  Generate Timetable
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </>
  );
}

export default Exams;

// import React, { useState, useEffect } from "react";

// function Exams() {

//   const [exams, setExams] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   // ✅ MULTIPLE SUBJECT ROWS
//   const [examRows, setExamRows] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     course: "",
//     semester: "",
//     type: "internal",

//     subject: "",
//     date: "",
//     start_time: "",
//     end_time: "",
//     duration: ""
//   });

//   const [search, setSearch] = useState("");
//   const [filterCourse, setFilterCourse] = useState("");
//   const [filterSemester, setFilterSemester] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // ================= LOAD EXAMS =================
//   const loadExams = () => {
//     fetch("http://localhost:5000/exams")
//       .then(res => res.json())
//       .then(data => setExams(data));
//   };

//   useEffect(() => {
//     loadExams();
//   }, []);

//   // ================= LOAD COURSES =================
//   useEffect(() => {
//     fetch("http://localhost:5000/courses")
//       .then(res => res.json())
//       .then(data => setCourses(data));
//   }, []);

//   // ================= LOAD SUBJECTS =================
//   useEffect(() => {
//     fetch("http://localhost:5000/subjects-exam")
//       .then(res => res.json())
//       .then(data => setSubjects(data));
//   }, []);

//   // ================= HANDLE INPUT =================
//   const handleChange = (e) => {

//     if (e.target.name === "course") {

//       setForm({
//         ...form,
//         course: e.target.value,
//         subject: ""
//       });

//     } else {

//       setForm({
//         ...form,
//         [e.target.name]: e.target.value
//       });
//     }
//   };

//   // ================= ADD SUBJECT ROW =================
//   const addSubjectRow = () => {

//     if (
//       !form.subject ||
//       !form.date ||
//       !form.start_time ||
//       !form.end_time ||
//       !form.duration
//     ) {
//       alert("Fill all subject fields");
//       return;
//     }

//     setExamRows([
//       ...examRows,
//       {
//         subject: form.subject,
//         date: form.date,
//         start_time: form.start_time,
//         end_time: form.end_time,
//         duration: form.duration
//       }
//     ]);

//     setForm({
//       ...form,
//       subject: "",
//       date: "",
//       start_time: "",
//       end_time: "",
//       duration: ""
//     });
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = () => {

//     if (!form.name || !form.course || !form.semester) {
//       alert("Fill exam details");
//       return;
//     }

//     if (examRows.length === 0) {
//       alert("Add at least one subject");
//       return;
//     }

//     fetch("http://localhost:5000/add-exam", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         name: form.name,
//         course: form.course,
//         semester: form.semester,
//         type: form.type,
//         exams: examRows
//       })
//     })
//       .then(res => res.json())
//       .then(data => {

//         if (data.success) {

//           alert("Exam timetable generated");

//           loadExams();

//           setForm({
//             name: "",
//             course: "",
//             semester: "",
//             type: "internal",

//             subject: "",
//             date: "",
//             start_time: "",
//             end_time: "",
//             duration: ""
//           });

//           setExamRows([]);
//           setShowModal(false);

//         } else {

//           alert(data.message);
//         }
//       });
//   };

//   // ================= DELETE =================
//   const handleDelete = (id) => {

//     if (window.confirm("Delete this exam?")) {

//       fetch(`http://localhost:5000/delete-exam/${id}`, {
//         method: "DELETE"
//       })
//         .then(() => loadExams());
//     }
//   };

//   // ================= STATUS =================
//   const toggleStatus = (id) => {

//     fetch(`http://localhost:5000/update-exam-status/${id}`, {
//       method: "PUT"
//     })
//       .then(() => loadExams());
//   };

//   // ================= FILTER =================
//   const filtered = exams.filter(e =>

//     (
//       e.exam_name.toLowerCase().includes(search.toLowerCase()) ||
//       e.subject_name.toLowerCase().includes(search.toLowerCase())
//     ) &&

//     (
//       filterCourse
//         ? e.course_name.toLowerCase().includes(filterCourse.toLowerCase())
//         : true
//     ) &&

//     (
//       filterSemester
//         ? String(e.semester).includes(String(filterSemester))
//         : true
//     )
//   );

//   const scheduled = exams.filter(
//     e => e.status.toLowerCase() === "scheduled"
//   ).length;

//   const completed = exams.filter(
//     e => e.status.toLowerCase() === "completed"
//   ).length;

//   return (
//     <>

//       <style>{`

//         .box{
//           background:white;
//           padding:20px;
//           border-radius:15px;
//           box-shadow:0 10px 25px rgba(0,0,0,0.08);
//         }

//         .top{
//           display:flex;
//           justify-content:space-between;
//           margin-bottom:15px;
//         }

//         input,select{
//           padding:8px;
//           margin:5px;
//           border-radius:8px;
//           border:1px solid #ccc;
//         }

//         button{
//           padding:8px 12px;
//           border-radius:8px;
//           border:none;
//           background:#3b82f6;
//           color:white;
//           cursor:pointer;
//         }

//         .edit{
//           background:#10b981;
//         }

//         .delete{
//           background:#ef4444;
//         }

//         table{
//           width:100%;
//           border-collapse:collapse;
//           margin-top:10px;
//         }

//         th,td{
//           padding:10px;
//           border-bottom:1px solid #ddd;
//           text-align:center;
//         }

//         th{
//           background:#3b82f6;
//           color:white;
//         }

//         .status{
//           padding:5px 10px;
//           border-radius:10px;
//           cursor:pointer;
//           color:white;
//         }

//         .scheduled{
//           background:orange;
//         }

//         .completed{
//           background:green;
//         }

//         .analytics{
//           display:flex;
//           gap:20px;
//           margin-top:20px;
//         }

//         .card{
//           flex:1;
//           padding:15px;
//           border-radius:12px;
//           color:white;
//           text-align:center;
//         }

//         .c1{
//           background:#6366f1;
//         }

//         .c2{
//           background:orange;
//         }

//         .c3{
//           background:green;
//         }

//         .modal{
//           position:fixed;
//           top:0;
//           left:0;
//           width:100%;
//           height:100%;
//           background:rgba(0,0,0,0.5);
//           display:flex;
//           justify-content:center;
//           align-items:center;
//         }

//         .modal-content{
//           background:white;
//           padding:20px;
//           border-radius:10px;
//           width:500px;
//           max-height:90vh;
//           overflow:auto;
//         }

//       `}</style>

//       <div className="box">

//         <div className="top">

//           <h2>📝 Exam Management</h2>

//           <button onClick={() => {

//             setForm({
//               name: "",
//               course: "",
//               semester: "",
//               type: "internal",

//               subject: "",
//               date: "",
//               start_time: "",
//               end_time: "",
//               duration: ""
//             });

//             setExamRows([]);
//             setEditId(null);
//             setShowModal(true);

//           }}>
//             + Add Exam
//           </button>

//         </div>

//         {/* SEARCH */}
//         <input
//           placeholder="Search..."
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <input
//           placeholder="Filter by Course"
//           onChange={(e) => setFilterCourse(e.target.value)}
//         />

//         <input
//           placeholder="Filter by Semester"
//           onChange={(e) => setFilterSemester(e.target.value)}
//         />

//         {/* TABLE */}
//         <table>

//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Course</th>
//               <th>Semester</th>
//               <th>Subject</th>
//               <th>Date</th>
//               <th>Start</th>
//               <th>End</th>
//               <th>Duration</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>

//             {filtered.map((e) => (

//               <tr key={e.exam_id}>

//                 <td>{e.exam_name}</td>
//                 <td>{e.course_name}</td>
//                 <td>{e.semester}</td>
//                 <td>{e.subject_name}</td>
//                 <td>{e.exam_date}</td>
//                 <td>{e.start_time}</td>
//                 <td>{e.end_time}</td>
//                 <td>{e.duration} hrs</td>

//                 <td>
//                   <span
//                     className={`status ${e.status}`}
//                     onClick={() => toggleStatus(e.exam_id)}
//                   >
//                     {e.status}
//                   </span>
//                 </td>

//                 <td>

//                   <div style={{
//                     display: "flex",
//                     gap: "8px",
//                     justifyContent: "center"
//                   }}>

//                     <button
//                       className="delete"
//                       onClick={() => handleDelete(e.exam_id)}
//                     >
//                       Delete
//                     </button>

//                   </div>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//         {/* ANALYTICS */}
//         <div className="analytics">

//           <div className="card c1">
//             Total: {exams.length}
//           </div>

//           <div className="card c2">
//             Scheduled: {scheduled}
//           </div>

//           <div className="card c3">
//             Completed: {completed}
//           </div>

//         </div>

//       </div>

//       {/* MODAL */}
//       {showModal && (

//         <div
//           className="modal"
//           onClick={() => setShowModal(false)}
//         >

//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >

//             <h3>Generate Exam Timetable</h3>

//             {/* FIRST ROW */}

//             <input
//               name="name"
//               placeholder="Exam Name"
//               value={form.name}
//               onChange={handleChange}
//             />

//             <select
//               name="course"
//               value={form.course}
//               onChange={handleChange}
//             >

//               <option value="">Select Course</option>

//               {courses.map(c => (
//                 <option
//                   key={c.course_id}
//                 >
//                   {c.course_name}
//                 </option>
//               ))}

//             </select>

//             <select
//               name="semester"
//               value={form.semester}
//               onChange={handleChange}
//             >

//               <option value="">Select Semester</option>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//               <option value="5">5</option>
//               <option value="6">6</option>

//             </select>

//             <select
//               name="type"
//               value={form.type}
//               onChange={handleChange}
//             >

//               <option value="internal">Internal</option>
//               <option value="external">External</option>

//             </select>

//             <hr />

//             {/* SECOND ROW */}

//             <select
//               name="subject"
//               value={form.subject}
//               onChange={handleChange}
//             >

//               <option value="">Select Subject</option>

//               {subjects
//                 .filter(s =>
//                   !form.course ||
//                   s.course_name === form.course
//                 )
//                 .map(s => (

//                   <option
//                     key={s.subject_id}
//                   >
//                     {s.subject_name}
//                   </option>

//                 ))}

//             </select>

//             <input
//               type="date"
//               name="date"
//               value={form.date}
//               onChange={handleChange}
//             />

//             <input
//               type="time"
//               name="start_time"
//               value={form.start_time}
//               onChange={handleChange}
//             />

//             <input
//               type="time"
//               name="end_time"
//               value={form.end_time}
//               onChange={handleChange}
//             />

//             <input
//               name="duration"
//               placeholder="Duration"
//               value={form.duration}
//               onChange={handleChange}
//             />

//             {/* ADD BUTTON */}

//             <button
//               type="button"
//               onClick={addSubjectRow}
//             >
//               + Add Subject
//             </button>

//             {/* SUBJECT TABLE */}

//             <table>

//               <thead>
//                 <tr>
//                   <th>Subject</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {examRows.map((e, index) => (

//                   <tr key={index}>

//                     <td>{e.subject}</td>

//                     <td>{e.date}</td>

//                     <td>
//                       {e.start_time} - {e.end_time}
//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//             <br />

//             {/* SAVE */}

//             <button onClick={handleSubmit}>
//               Generate Timetable
//             </button>

//           </div>

//         </div>

//       )}

//     </>
//   );
// }

// export default Exams;