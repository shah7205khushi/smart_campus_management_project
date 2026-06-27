// import React, { useState, useEffect } from "react";

// function Course() {
//   const [courses, setCourses] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     duration: "",
//     semesters: "",
//     department: "",
//     description: ""
//   });

//   const [search, setSearch] = useState("");
//   const [filterDept, setFilterDept] = useState("");
//   const [filterDuration, setFilterDuration] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [mapModal, setMapModal] = useState(null);
//   const [viewStructure, setViewStructure] = useState(null);

//   const [subjectList, setSubjectList] = useState([]);

//   // =========================
//   // LOAD DATA
//   // =========================
//   useEffect(() => {
//     fetchCourses();

//     fetch("http://localhost:5000/subjects")
//       .then(res => res.json())
//       .then(data => setSubjectList(data));
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/admin/courses");
//       const data = await res.json();

//       setCourses(
//         data.map(c => ({
//           id: c.course_id,
//           name: c.course_name,
//           code: c.course_code,
//           duration: c.duration + " Years",
//           semesters: c.total_sem,
//           department: c.department || "IT",
//           description: c.description || "",
//           subjects: Object.values(c.subjects || {}).flat(),
//           subjectMap: c.subjects || {},
//           status: c.status || "Active"
//         }))
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =========================
//   // INPUT
//   // =========================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // =========================
//   // ADD COURSE
//   // =========================
//   const handleSubmit = async () => {
//     try {
//       await fetch("http://localhost:5000/add-course", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });

//       setShowModal(false);
//       setForm({
//         name: "",
//         code: "",
//         duration: "",
//         semesters: "",
//         department: "",
//         description: ""
//       });

//       fetchCourses();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =========================
//   // DELETE (STATUS = INACTIVE)
//   // =========================
//   const handleDelete = async (id) => {
//     if (window.confirm("Deactivate course?")) {
//       await fetch(`http://localhost:5000/toggle-course/${id}`, {
//         method: "PUT"
//       });
//       fetchCourses();
//     }
//   };

//   // =========================
//   // STATUS TOGGLE
//   // =========================
//   const toggleStatus = async (id) => {
//     await fetch(`http://localhost:5000/toggle-course/${id}`, {
//       method: "PUT"
//     });
//     fetchCourses();
//   };

//   // =========================
//   // MAP SUBJECT
//   // =========================
//   const toggleMapping = async (subjectId) => {
//     const semester = prompt("Enter Semester Number");

//     if (!semester) return;

//     await fetch("http://localhost:5000/map-subject", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         course_id: mapModal.id,
//         semester: semester,
//         subject_id: subjectId
//       })
//     });

//     fetchCourses();
//   };

//   // =========================
//   // FILTER
//   // =========================
//   const filtered = courses.filter(c =>
//     (c.name.toLowerCase().includes(search.toLowerCase()) ||
//      c.code.toLowerCase().includes(search.toLowerCase())) &&
//     (filterDept ? c.department === filterDept : true) &&
//     (filterDuration ? c.duration === filterDuration : true)
//   );

//   const activeCourses = courses.filter(c => c.status === "Active").length;

//   return (
//     <>
//       <style>{`
//         .box { background:white; padding:20px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.08); }
//         .top { display:flex; justify-content:space-between; margin-bottom:15px; }
//         input { padding:8px; margin:5px; border-radius:8px; border:1px solid #ccc; }

//         button {
//           padding:6px 10px;
//           border:none;
//           border-radius:8px;
//           cursor:pointer;
//           font-size:12px;
//         }

//         .btn-primary { background:#3b82f6; color:white; }
//         .btn-edit { background:#f59e0b; color:white; }
//         .btn-delete { background:#ef4444; color:white; }
//         .btn-map { background:#10b981; color:white; }

//         table { width:100%; border-collapse:collapse; }
//         th, td { padding:10px; border-bottom:1px solid #ddd; text-align:center; }

//         .badge {
//           padding:5px 8px;
//           border-radius:8px;
//           color:white;
//           font-size:11px;
//           margin:2px;
//           display:inline-block;
//         }

//         .active { color:green; cursor:pointer; }
//         .inactive { color:red; cursor:pointer; }

//         .actions { display:flex; gap:5px; justify-content:center; flex-wrap:wrap; }

//         .analytics { display:flex; gap:15px; margin-top:20px; }
//         .card {
//           flex:1;
//           padding:15px;
//           border-radius:12px;
//           color:white;
//           text-align:center;
//         }

//         .c1 { background:#6366f1; }
//         .c2 { background:#10b981; }
//         .c3 { background:#f59e0b; }

//         .modal {
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

//         .modal-content {
//           background:white;
//           padding:20px;
//           border-radius:10px;
//           width:450px;
//         }

//         .grid {
//           display:grid;
//           grid-template-columns:repeat(2,1fr);
//           gap:10px;
//         }

//         .structure {
//           margin-top:10px;
//           background:#eef2ff;
//           padding:10px;
//           border-radius:10px;
//         }
//       `}</style>

//       <div className="box">

//         <div className="top">
//           <h2>🎓 Course Management</h2>
//           <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Course</button>
//         </div>

//         <div>
//           <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
//           <input placeholder="Department" onChange={e => setFilterDept(e.target.value)} />
//           <input placeholder="Duration" onChange={e => setFilterDuration(e.target.value)} />
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Dept</th>
//               <th>Duration</th>
//               <th>Subjects</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map(c => (
//               <tr key={c.id}>
//                 <td>{c.id}</td>
//                 <td>{c.name}</td>
//                 <td>{c.department}</td>
//                 <td>{c.duration}</td>

//                 <td>
//                   {c.subjects.map(s => (
//                     <span className="badge" style={{background:"#6366f1"}} key={s}>{s}</span>
//                   ))}
//                 </td>

//                 <td className={c.status === "Active" ? "active" : "inactive"}
//                     onClick={() => toggleStatus(c.id)}>
//                   {c.status}
//                 </td>

//                 <td>
//                   <div className="actions">
//                     <button className="btn-map" onClick={() => setMapModal(c)}>Map</button>
//                     <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
//                     <button className="btn-primary" onClick={() => setViewStructure(c)}>View</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="analytics">
//           <div className="card c1">Total: {courses.length}</div>
//           <div className="card c2">Active: {activeCourses}</div>
//           <div className="card c3">
//             Subjects: {courses.reduce((a,c)=>a+c.subjects.length,0)}
//           </div>
//         </div>

//       </div>

//       {/* ADD MODAL */}
//       {showModal && (
//         <div className="modal" onClick={()=>setShowModal(false)}>
//           <div className="modal-content" onClick={e=>e.stopPropagation()}>
//             <h3>Add Course</h3>
//             <input name="name" placeholder="Name" onChange={handleChange}/>
//             <input name="code" placeholder="Code" onChange={handleChange}/>
//             <input name="duration" placeholder="Duration" onChange={handleChange}/>
//             <input name="semesters" placeholder="Semesters" onChange={handleChange}/>
//             <input name="department" placeholder="Department" onChange={handleChange}/>
//             <input name="description" placeholder="Description" onChange={handleChange}/>
//             <button className="btn-primary" onClick={handleSubmit}>Save</button>
//           </div>
//         </div>
//       )}

//       {/* MAP MODAL */}
//       {mapModal && (
//         <div className="modal" onClick={()=>setMapModal(null)}>
//           <div className="modal-content" onClick={e=>e.stopPropagation()}>
//             <h3>Assign Subjects</h3>

//             <div className="grid">
//               {subjectList.map(s => (
//                 <button key={s.subject_id} onClick={() => toggleMapping(s.subject_id)}>
//                   {s.subject_name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VIEW STRUCTURE */}
//       {viewStructure && (
//         <div className="modal" onClick={()=>setViewStructure(null)}>
//           <div className="modal-content" onClick={e=>e.stopPropagation()}>
//             <h3>{viewStructure.name} Structure</h3>

//             <div className="structure">
//               {Object.keys(viewStructure.subjectMap || {}).map(sem => (
//                 <p key={sem}>
//                   Sem {sem} → {viewStructure.subjectMap[sem].join(", ")}
//                 </p>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Course;
import React, { useState, useEffect } from "react";

function Course() {
  const [courses, setCourses] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    duration: "",
    semesters: "",
    // department: "",
    description: ""
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mapModal, setMapModal] = useState(null);
  const [viewStructure, setViewStructure] = useState(null);
  const [editId, setEditId] = useState(null);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [showSubjectsPopup, setShowSubjectsPopup] = useState(null);

  // =========================
  useEffect(() => {
    fetchCourses();

    fetch("http://localhost:5000/subjects")
      .then(res => res.json())
      .then(data => setSubjectList(data));
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5000/admin/courses");
    const data = await res.json();

    setCourses(
      data.map(c => ({
        id: c.course_id,
        name: c.course_name,
        code: c.course_code,
        duration: c.duration + " Years",
        semesters: c.total_sem,
        // department: c.department || "IT",
        description: c.description || "",
        subjects: Object.values(c.subjects || {}).flat(),
        subjectMap: c.subjects || {},
        status: (c.status || "Active").toLowerCase().trim()
      }))
    );
  };

  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  const handleSubmit = async () => {
  try {
    if (editId) {
      // ✅ UPDATE COURSE
      await fetch(`http://localhost:5000/update-course/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    } else {
      // ✅ ADD COURSE
      await fetch("http://localhost:5000/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    // RESET
    setShowModal(false);
    setEditId(null);
    fetchCourses();

    setForm({
      name: "",
      code: "",
      duration: "",
      semesters: "",
      // department: "",
      description: ""
    });

  } catch (err) {
    console.log(err);
  }
};
  // =========================
  const handleEdit = (c) => {
    setForm({
      name: c.name,
      code: c.code,
      duration: c.duration.replace(" Years",""),
      semesters: c.semesters,
      // department: c.department,
      description: c.description
    });
    setEditId(c.id);
    setShowModal(true);
  };

  // =========================
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/toggle-course/${id}`, {
      method: "PUT"
    });
    fetchCourses();
  };

  // =========================
  const toggleMapping = async (subjectId) => {
    if (!selectedSemester) {
      alert("Select Semester first!");
      return;
    }

    await fetch("http://localhost:5000/map-subject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: mapModal.id,
        semester: selectedSemester,
        subject_id: subjectId
      })
    });

    setSelectedSubjects([...selectedSubjects, subjectId]);
    fetchCourses();
  };

  // =========================
  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCourses = courses.filter(c => c.status === "active").length;

  return (
    <>
      <style>{`
        .box { background:white; padding:20px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.08); }

        .top {
          display:flex;
          justify-content:space-between;
          margin-bottom:15px;
          border-bottom:3px solid #6366f1;
          padding-bottom:10px;
        }

        input, select {
          padding:8px;
          margin:5px;
          border-radius:8px;
          border:1px solid #ccc;
        }

        button {
          padding:6px 10px;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-size:12px;
        }

        .btn-primary { background:#3b82f6; color:white; }
        .btn-edit { background:#f59e0b; color:white; }
        .btn-delete { background:#ef4444; color:white; }
        .btn-map { background:#10b981; color:white; }

        table { width:100%; border-collapse:collapse; }
        th, td { padding:10px; border-bottom:1px solid #ddd; text-align:center; }

        .badge {
          padding:5px 8px;
          border-radius:8px;
          color:white;
          font-size:11px;
          margin:2px;
          display:inline-block;
        }

        .active { color:green; font-weight:bold; }
        .inactive { color:red; font-weight:bold; }

        .actions {
          display:flex;
          gap:8px;
          justify-content:center;
          flex-wrap:wrap;
        }

        .analytics {
          display:flex;
          gap:15px;
          margin-top:20px;
        }

        .card {
          flex:1;
          padding:15px;
          border-radius:12px;
          color:white;
          text-align:center;
        }

        .c1 { background:#6366f1; }
        .c2 { background:#10b981; }
        .c3 { background:#f59e0b; }

        .modal {
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
        }

        .modal-content {
          background:white;
          padding:20px;
          border-radius:10px;
          width:500px;
          position:relative;
        }

        .close {
          position:absolute;
          top:10px;
          right:15px;
          cursor:pointer;
          color:red;
          font-size:18px;
        }

        .subject-btn {
          margin:5px;
          background:#e5e7eb;
        }

        .subject-btn.active {
          background:#10b981 !important;
          color:white;
        }

        .structure-box {
          background:#eef2ff;
          padding:10px;
          border-radius:10px;
          margin-top:10px;
        }

        .sem-block {
          margin-bottom:10px;
          padding:10px;
          border-radius:8px;
          background:white;
          box-shadow:0 2px 5px rgba(0,0,0,0.05);
        }

        .more {
          color:#3b82f6;
          cursor:pointer;
          font-size:12px;
          margin-left:5px;
        }
      `}</style>

      <div className="box">

        <div className="top">
          <h2>🎓 Course Management</h2>
          <button className="btn-primary" onClick={() => {
  setEditId(null);

  // ✅ RESET FORM HERE
  setForm({
    name: "",
    code: "",
    duration: "",
    semesters: "",
    // department: "",
    description: ""
  });

  setShowModal(true);
}}>
  + Add Course
</button>
        </div>

        <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {/* <th>Dept</th> */}
              <th>Duration</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                {/* <td>{c.department}</td> */}
                <td>{c.duration}</td>

                <td>
                  {c.subjects.slice(0,3).map(s => (
                    <span className="badge" style={{background:"#6366f1"}} key={s}>{s}</span>
                  ))}

                  {c.subjects.length > 3 && (
                    <span className="more" onClick={() => setShowSubjectsPopup(c)}>
                      +{c.subjects.length - 3} more
                    </span>
                  )}
                </td>

                <td className={c.status === "active" ? "active" : "inactive"}>
                  {c.status}
                </td>

                <td>
                  <div className="actions">
                    <button className="btn-map" onClick={() => {
                      setMapModal(c);
                      setSelectedSubjects([]);
                      setSelectedSemester("");
                    }}>Map</button>

                    <button className="btn-edit" onClick={() => handleEdit(c)}>Edit</button>

                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>

                    <button className="btn-primary" onClick={() => setViewStructure(c)}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="analytics">
          <div className="card c1">Total: {courses.length}</div>
          <div className="card c2">Active: {activeCourses}</div>
          <div className="card c3">
            Subjects: {courses.reduce((a,c)=>a+c.subjects.length,0)}
          </div>
        </div>

      </div>

      {/* SUBJECT POPUP */}
      {showSubjectsPopup && (
        <div className="modal" onClick={()=>setShowSubjectsPopup(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <span className="close" onClick={()=>setShowSubjectsPopup(null)}>✖</span>
            <h3>All Subjects</h3>

            {showSubjectsPopup.subjects.map(s => (
              <span className="badge" style={{background:"#6366f1"}} key={s}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* MAP MODAL */}
      {mapModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={()=>setMapModal(null)}>✖</span>
            <h3>Assign Subjects</h3>

            <select onChange={e=>setSelectedSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {[...Array(mapModal.semesters)].map((_,i)=>(
                <option key={i} value={i+1}>Sem {i+1}</option>
              ))}
            </select>

            <div>
              {subjectList.map(s => (
                <button
                  key={s.subject_id}
                  className={`subject-btn ${selectedSubjects.includes(s.subject_id) ? "active" : ""}`}
                  onClick={() => toggleMapping(s.subject_id)}
                >
                  {s.subject_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewStructure && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={()=>setViewStructure(null)}>✖</span>
            <h3>{viewStructure.name} Structure</h3>

            <div className="structure-box">
              {Object.keys(viewStructure.subjectMap || {}).map(sem => (
                <div className="sem-block" key={sem}>
                  <strong>Sem {sem}</strong>
                  <div>
                    {viewStructure.subjectMap[sem].map(s => (
                      <span className="badge" style={{background:"#6366f1"}} key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
<span className="close" onClick={()=>{
  setShowModal(false);
  setEditId(null);

  // reset form when closing
  setForm({
    name: "",
    code: "",
    duration: "",
    semesters: "",
    // department: "",
    description: ""
  });
}}>✖</span>
            <h3>{editId ? "Edit Course" : "Add Course"}</h3>

            <input name="name" value={form.name} placeholder="Name" onChange={handleChange}/>
            <input name="code" value={form.code} placeholder="Code" onChange={handleChange}/>
            <input name="duration" value={form.duration} placeholder="Duration" onChange={handleChange}/>
            <input name="semesters" value={form.semesters} placeholder="Semesters" onChange={handleChange}/>
            {/* <input name="department" value={form.department} placeholder="Department" onChange={handleChange}/> */}
            <input name="description" value={form.description} placeholder="Description" onChange={handleChange}/>

            <button className="btn-primary" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Course;