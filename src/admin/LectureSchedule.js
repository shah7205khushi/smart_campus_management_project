// import React, { useEffect, useState } from "react";

// function LectureSchedule() {

//   const API = "http://localhost:5000";

//   const [lectures, setLectures] = useState([]);
//   const [facultyList, setFacultyList] = useState([]);
//   const [courseList, setCourseList] = useState([]);
//   const [subjectList, setSubjectList] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     faculty_id: "",
//     course_id: "",
//     subject_id: "",
//     semester: "",
//     day: "Monday",
//     start_time: "",
//     end_time: "",
//     room: ""
//   });

//   // ================= LOAD =================
//   useEffect(() => {
//     fetchLectures();
//     fetchDropdowns();
//   }, []);

//   // ================= DROPDOWNS =================
//   function fetchDropdowns() {
//     fetch(`${API}/admin/faculty`)
//       .then(r => r.json())
//       .then(setFacultyList)
//       .catch(err => console.log("faculty error", err));

//     fetch(`${API}/admin/courses`)
//       .then(r => r.json())
//       .then(setCourseList)
//       .catch(err => console.log("course error", err));

//     fetch(`${API}/admin/subjects`)
//       .then(r => r.json())
//       .then(setSubjectList)
//       .catch(err => console.log("subject error", err));
//   }

//   // ================= LECTURES =================
//   function fetchLectures() {
//     fetch(`${API}/admin/lectures`)
//       .then(r => r.json())
//       .then(setLectures)
//       .catch(err => console.log("lecture error", err));
//   }

//   // ================= CHANGE =================
//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   // ================= SUBMIT =================
//   async function handleSubmit() {

//     if (loading) return;
//     setLoading(true);

//     const url = editId
//       ? `${API}/admin/update-lecture/${editId}`
//       : `${API}/admin/add-lecture`;

//     const method = editId ? "PUT" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });

//       const data = await res.json();

//       if (data.success) {
//         fetchLectures();
//         setShowModal(false);
//         setEditId(null);

//         setForm({
//           faculty_id: "",
//           course_id: "",
//           subject_id: "",
//           semester: "",
//           day: "Monday",
//           start_time: "",
//           end_time: "",
//           room: ""
//         });
//       }

//     } catch (err) {
//       console.log(err);
//     }

//     setLoading(false);
//   }

//   // ================= EDIT =================
//   function handleEdit(l) {
//     setForm({
//       faculty_id: l.faculty_id || "",
//       course_id: l.course_id || "",
//       subject_id: l.subject_id || "",
//       semester: l.semester || "",
//       day: l.day || "Monday",
//       start_time: l.start_time || "",
//       end_time: l.end_time || "",
//       room: l.room || ""
//     });

//     setEditId(l.lecture_id);
//     setShowModal(true);
//   }

//   // ================= DELETE =================
//   async function handleDelete(id) {

//     if (!window.confirm("Delete lecture?")) return;

//     await fetch(`${API}/admin/delete-lecture/${id}`, {
//       method: "DELETE"
//     });

//     fetchLectures();
//   }

//   return (
//     <>

//       <style>{`

//         .box{
//           background:white;
//           padding:20px;
//           border-radius:15px;
//           box-shadow:0 5px 15px rgba(0,0,0,0.08);
//         }

//         .top{
//           display:flex;
//           justify-content:space-between;
//           border-bottom:3px solid #6366f1;
//           padding-bottom:10px;
//           margin-bottom:20px;
//         }

//         .btn{
//           background:#3b82f6;
//           color:white;
//           border:none;
//           padding:10px 14px;
//           border-radius:8px;
//           cursor:pointer;
//         }

//         table{
//           width:100%;
//           border-collapse:collapse;
//         }

//         th,td{
//           padding:12px;
//           text-align:center;
//           border-bottom:1px solid #eee;
//           font-size:13px;
//         }

//         th{
//           background:#f3f4f6;
//         }

//         .edit{
//           background:#f59e0b;
//           color:white;
//           border:none;
//           padding:6px 10px;
//           border-radius:6px;
//           cursor:pointer;
//           margin-right:5px;
//         }

//         .delete{
//           background:#ef4444;
//           color:white;
//           border:none;
//           padding:6px 10px;
//           border-radius:6px;
//           cursor:pointer;
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

//         .modal-box{
//           width:450px;
//           background:white;
//           border-radius:12px;
//           padding:20px;
//           position:relative;
//         }

//         .close{
//           position:absolute;
//           right:10px;
//           top:10px;
//           font-size:18px;
//           cursor:pointer;
//         }

//         label{
//           font-size:12px;
//           font-weight:600;
//         }

//         select,input{
//           width:100%;
//           padding:8px;
//           margin-top:5px;
//           margin-bottom:10px;
//           border:1px solid #ddd;
//           border-radius:6px;
//         }

//         .save{
//           width:100%;
//           padding:10px;
//           background:#22c55e;
//           color:white;
//           border:none;
//           border-radius:8px;
//           cursor:pointer;
//         }

//       `}</style>

//       {/* ================= TABLE ================= */}
//       <div className="box">

//         <div className="top">
//           <h2>📅 Lecture Schedule</h2>

//           <button className="btn" onClick={() => setShowModal(true)}>
//             + Add Lecture
//           </button>
//         </div>

//         <table>

//           <thead>
//             <tr>
//               <th>Faculty</th>
//               <th>Course</th>
//               <th>Subject</th>
//               <th>Day</th>
//               <th>Time</th>
//               <th>Room</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {lectures.map(l => (
//               <tr key={l.lecture_id}>

//                 <td>{l.faculty_name}</td>
//                 <td>{l.course_name}</td>
//                 <td>{l.subject_name}</td>
//                 <td>{l.day}</td>
//                 <td>{l.start_time} - {l.end_time}</td>
//                 <td>{l.room}</td>

//                 <td>
//                   <button className="edit" onClick={() => handleEdit(l)}>Edit</button>
//                   <button className="delete" onClick={() => handleDelete(l.lecture_id)}>Delete</button>
//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>

//       </div>

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="modal">

//           <div className="modal-box">

//             <span className="close" onClick={() => {
//               setShowModal(false);
//               setEditId(null);
//             }}>✖</span>

//             <h3>{editId ? "Edit Lecture" : "Add Lecture"}</h3>

//             <label>Faculty</label>
//             <select name="faculty_id" value={form.faculty_id} onChange={handleChange}>
//               <option value="">Select</option>
//               {facultyList.map(f => (
//                 <option key={f.faculty_id} value={f.faculty_id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>

//             <label>Course</label>
//             <select name="course_id" value={form.course_id} onChange={handleChange}>
//               <option value="">Select</option>
//               {courseList.map(c => (
//                 <option key={c.course_id} value={c.course_id}>
//                   {c.course_name}
//                 </option>
//               ))}
//             </select>

//             <label>Subject</label>
//             <select name="subject_id" value={form.subject_id} onChange={handleChange}>
//               <option value="">Select</option>
//               {subjectList.map(s => (
//                 <option key={s.subject_id} value={s.subject_id}>
//                   {s.subject_name}
//                 </option>
//               ))}
//             </select>

//             <label>Semester</label>
//             <input name="semester" value={form.semester} onChange={handleChange} />

//             <label>Day</label>
//             <select name="day" value={form.day} onChange={handleChange}>
//               <option>Monday</option>
//               <option>Tuesday</option>
//               <option>Wednesday</option>
//               <option>Thursday</option>
//               <option>Friday</option>
//               <option>Saturday</option>
//             </select>

//             <label>Start Time</label>
//             <input type="time" name="start_time" value={form.start_time} onChange={handleChange} />

//             <label>End Time</label>
//             <input type="time" name="end_time" value={form.end_time} onChange={handleChange} />

//             <label>Room</label>
//             <input name="room" value={form.room} onChange={handleChange} />

//             <button className="save" onClick={handleSubmit}>
//               {loading ? "Saving..." : editId ? "Update" : "Save"}
//             </button>

//           </div>

//         </div>
//       )}

//     </>
//   );
// }

// export default LectureSchedule;

import React, { useEffect, useState } from "react";

function LectureSchedule() {

  const API = "http://localhost:5000";

  const [lectures, setLectures] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    faculty_id: "",
    course_id: "",
    subject_id: "",
    semester: "",
    day: "Monday",
    start_time: "",
    end_time: "",
    room: ""
  });

  // ================= LOAD =================
  useEffect(() => {
    fetchLectures();
    fetchDropdowns();
  }, []);

  // ================= DROPDOWNS =================
  function fetchDropdowns() {

    fetch(`${API}/admin/faculty`)
      .then(res => res.json())
      .then(data => setFacultyList(data))
      .catch(err => console.log("faculty error", err));

    fetch(`${API}/admin/courses`)
      .then(res => res.json())
      .then(data => setCourseList(data))
      .catch(err => console.log("course error", err));

    fetch(`${API}/admin/subjects`)
      .then(res => res.json())
      .then(data => setSubjectList(data))
      .catch(err => console.log("subject error", err));
  }

  // ================= LECTURES =================
  function fetchLectures() {
    fetch(`${API}/admin/lectures`)
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.log("lecture error", err));
  }

  // ================= CHANGE =================
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ================= RESET FORM =================
  function resetForm() {
    setForm({
      faculty_id: "",
      course_id: "",
      subject_id: "",
      semester: "",
      day: "Monday",
      start_time: "",
      end_time: "",
      room: ""
    });

    setEditId(null);
  }

  // ================= SUBMIT =================
  async function handleSubmit() {

    if (loading) return;

    setLoading(true);

    const url = editId
      ? `${API}/admin/update-lecture/${editId}`
      : `${API}/admin/add-lecture`;

    const method = editId ? "PUT" : "POST";

    try {

      const payload = {
        ...form,

        // ✅ FIX TIME FORMAT
        start_time: form.start_time
          ? form.start_time.substring(0, 5)
          : "",

        end_time: form.end_time
          ? form.end_time.substring(0, 5)
          : ""
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {

        fetchLectures();

        setShowModal(false);

        resetForm();

      } else {

        alert("Error saving lecture");

      }

    } catch (err) {

      console.log(err);

    }

    setLoading(false);
  }

  // ================= EDIT =================
  function handleEdit(l) {

    // ✅ FIX TIME FORMAT FOR INPUT
    const start =
      l.start_time
        ? l.start_time.toString().substring(0, 5)
        : "";

    const end =
      l.end_time
        ? l.end_time.toString().substring(0, 5)
        : "";

    setForm({
      faculty_id: l.faculty_id || "",
      course_id: l.course_id || "",
      subject_id: l.subject_id || "",
      semester: l.semester || "",
      day: l.day || "Monday",
      start_time: start,
      end_time: end,
      room: l.room || ""
    });

    setEditId(l.lecture_id);

    setShowModal(true);
  }

  // ================= DELETE =================
  async function handleDelete(id) {

    if (!window.confirm("Delete lecture?")) return;

    await fetch(`${API}/admin/delete-lecture/${id}`, {
      method: "DELETE"
    });

    fetchLectures();
  }

  return (
    <>

      <style>{`

      body{
        background:#f4f6f9;
      }

      .box{
        background:white;
        padding:5px;
        border-radius:16px;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
        margin:20px;
      }

      .top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom:2px solid #e5e7eb;
        padding-bottom:15px;
        margin-bottom:20px;
      }

      .top h2{
        font-size:20px;
        font-weight:600;
        color:#111827;
      }

      .btn{
        background:linear-gradient(135deg,#6366f1,#3b82f6);
        color:white;
        border:none;
        padding:10px 16px;
        border-radius:10px;
        cursor:pointer;
        font-weight:500;
        transition:0.3s;
      }

      .btn:hover{
        transform:scale(1.05);
      }

      table{
        width:100%;
        border-collapse:separate;
        border-spacing:0 10px;
      }

      th{
        text-align:left;
        font-size:13px;
        color:#6b7280;
        padding:10px;
      }

      td{
        background:#fff;
        padding:12px;
        font-size:13px;
        color:#111827;
      }

      tr{
        box-shadow:0 3px 10px rgba(0,0,0,0.05);
      }

      tr:hover td{
        background:#f9fafb;
      }

      .edit{
        background:#f59e0b;
        color:white;
        border:none;
        padding:6px 10px;
        border-radius:6px;
        cursor:pointer;
        margin-right:5px;
      }

      .delete{
        background:#ef4444;
        color:white;
        border:none;
        padding:6px 10px;
        border-radius:6px;
        cursor:pointer;
      }

      /* MODAL */
      .modal{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.6);
        display:flex;
        justify-content:center;
        align-items:center;
        backdrop-filter:blur(5px);
      }

      .modal-box{
        width:450px;
        background:white;
        border-radius:16px;
        padding:25px;
        position:relative;
        box-shadow:0 10px 30px rgba(0,0,0,0.2);
        animation:pop 0.3s ease;
      }

      @keyframes pop{
        from{transform:scale(0.8);opacity:0;}
        to{transform:scale(1);opacity:1;}
      }

      .close{
        position:absolute;
        right:15px;
        top:10px;
        font-size:18px;
        cursor:pointer;
        color:#6b7280;
      }

      .close:hover{
        color:red;
      }

      label{
        font-size:12px;
        font-weight:600;
        color:#374151;
      }

      input,select{
        width:100%;
        padding:10px;
        margin-top:5px;
        margin-bottom:12px;
        border:1px solid #e5e7eb;
        border-radius:8px;
        outline:none;
        transition:0.2s;
      }

      input:focus,select:focus{
        border-color:#6366f1;
        box-shadow:0 0 5px rgba(99,102,241,0.3);
      }

      .save{
        width:100%;
        padding:12px;
        background:linear-gradient(135deg,#22c55e,#16a34a);
        color:white;
        border:none;
        border-radius:10px;
        cursor:pointer;
        font-weight:600;
        transition:0.3s;
      }

      .save:hover{
        transform:scale(1.02);
      }

    `}</style>

      {/* ================= TABLE ================= */}
      <div className="box">

        <div className="top">
          <h2>📅 Lecture Schedule</h2>

          <button
            className="btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Lecture
          </button>
        </div>

        <table>

          <thead>
            <tr>
              <th>Faculty</th>
              <th>Course</th>
              <th>Subject</th>
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {lectures.map(l => (

              <tr key={l.lecture_id}>

                <td>{l.faculty_name}</td>

                <td>{l.course_name}</td>

                <td>{l.subject_name}</td>

                <td>{l.day}</td>

                <td>
                  {l.start_time?.substring(0, 5)} -
                  {l.end_time?.substring(0, 5)}
                </td>

                <td>{l.room}</td>

                <td>

                  <button
                    className="edit"
                    onClick={() => handleEdit(l)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(l.lecture_id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (

        <div className="modal">

          <div className="modal-box">

            <span
              className="close"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              ✖
            </span>

            <h3>
              {editId ? "Edit Lecture" : "Add Lecture"}
            </h3>

            {/* FACULTY */}
            <label>Faculty</label>

            <select
              name="faculty_id"
              value={form.faculty_id}
              onChange={handleChange}
            >

              <option value="">Select Faculty</option>

              {/* ✅ FIXED faculty_id */}
              {facultyList.map(f => (

                <option
                  key={f.faculty_id}
                  value={f.faculty_id}
                >
                  {f.faculty_name}
                </option>

              ))}

            </select>

            {/* COURSE */}
            <label>Course</label>

            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
            >

              <option value="">Select Course</option>

              {courseList.map(c => (

                <option
                  key={c.course_id}
                  value={c.course_id}
                >
                  {c.course_name}
                </option>

              ))}

            </select>

            {/* SUBJECT */}
            <label>Subject</label>

            <select
              name="subject_id"
              value={form.subject_id}
              onChange={handleChange}
            >

              <option value="">Select Subject</option>

              {subjectList.map(s => (

                <option
                  key={s.subject_id}
                  value={s.subject_id}
                >
                  {s.subject_name}
                </option>

              ))}

            </select>

            {/* SEMESTER */}
            <label>Semester</label>

            <input
              name="semester"
              value={form.semester}
              onChange={handleChange}
            />

            {/* DAY */}
            <label>Day</label>

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>

            {/* TIME */}
            <label>Start Time</label>

            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
            />

            <label>End Time</label>

            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
            />

            {/* ROOM */}
            <label>Room</label>

            <input
              name="room"
              value={form.room}
              onChange={handleChange}
            />

            <button
              className="save"
              onClick={handleSubmit}
            >
              {loading
                ? "Saving..."
                : editId
                ? "Update"
                : "Save"}
            </button>

          </div>

        </div>

      )}

    </>
  );
}

export default LectureSchedule;