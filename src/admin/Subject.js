

import React, { useState, useEffect } from "react";

function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    course: "",
    semester: "",
    credits: "",
    type: "",
    status: "Active"
  });

  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);

  // ✅ FETCH SUBJECTS
  useEffect(() => {
    fetch("http://localhost:5000/subjects")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(s => ({
          id: s.subject_id,
          name: s.subject_name,
          code: s.subject_code,
          course: s.course_name,
          semester: s.semester,
          credits: s.credits,
          type: s.type,
          faculty: s.faculty_name || "Unassigned",
          status: s.status === "inactive" ? "Inactive" : "Active"
        }));
        setSubjects(formatted);
      });
  }, []);

  // ✅ FETCH FACULTY
  useEffect(() => {
    fetch("http://localhost:5000/faculty-list")
      .then(res => res.json())
      .then(data => setFacultyList(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD / UPDATE (NO RELOAD)
  const handleSubmit = () => {
    const url = editId
      ? `http://localhost:5000/update-subject/${editId}`
      : `http://localhost:5000/add-subject`;

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {

      if (editId) {
        setSubjects(subjects.map(s =>
          s.id === editId ? { ...s, ...form } : s
        ));
      } else {
        setSubjects([...subjects, {
          ...form,
          id: Date.now(),
          faculty: "Unassigned"
        }]);
      }

      setShowModal(false);
      setEditId(null);

      setForm({
        name: "",
        code: "",
        course: "",
        semester: "",
        credits: "",
        type: "",
        status: "Active"
      });
    });
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    if (window.confirm("Deactivate this subject?")) {
      fetch(`http://localhost:5000/delete-subject/${id}`, {
        method: "PUT"
      }).then(() => {
        setSubjects(subjects.map(s =>
          s.id === id ? { ...s, status: "Inactive" } : s
        ));
      });
    }
  };

  // ✅ EDIT
  const handleEdit = (s) => {
    setForm({
      name: s.name,
      code: s.code,
      course: s.course,
      semester: s.semester,
      credits: s.credits,
      type: s.type,
      status: s.status
    });
    setEditId(s.id);
    setShowModal(true);
  };

  // ✅ STATUS TOGGLE
  const toggleStatus = (id) => {
    fetch(`http://localhost:5000/delete-subject/${id}`, {
      method: "PUT"
    }).then(() => {
      setSubjects(subjects.map(s =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      ));
    });
  };

  // ✅ ASSIGN FACULTY
  const handleAssign = (subjectId, facultyId) => {
    fetch("http://localhost:5000/assign-faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subjectId,
        faculty_id: facultyId
      })
    }).then(() => {
      const faculty = facultyList.find(f => f.faculty_id === facultyId);

      setSubjects(subjects.map(s =>
        s.id === subjectId ? { ...s, faculty: faculty.name } : s
      ));

      setAssignModal(null);
    });
  };

 const filtered = subjects.filter(s =>
  (
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  ) &&
  (filterCourse
    ? s.course.toLowerCase().includes(filterCourse.toLowerCase())
    : true) &&
  (filterSem
    ? String(s.semester).includes(String(filterSem))
    : true)
);

  const assigned = subjects.filter(s => s.faculty !== "Unassigned").length;

  return (
    <>
      <style>{`
        .box { background:white; padding:25px; border-radius:15px; box-shadow:0 8px 20px rgba(0,0,0,0.08); }
        .top { display:flex; justify-content:space-between; margin-bottom:15px; }

        input, select { padding:10px; margin:5px; border-radius:8px; border:1px solid #ccc; }

        table { width:100%; margin-top:15px; border-collapse:collapse; }
        th { background:#3b82f6; color:white; padding:12px; }
        td { padding:10px; border-bottom:1px solid #ddd; text-align:center; }

        .btn { padding:6px 12px; border:none; border-radius:6px; color:white; margin:2px; cursor:pointer; }
        .btn-primary { background:#3b82f6; }
        .btn-edit { background:#10b981; }
        .btn-delete { background:#ef4444; }
        .btn-assign { background:#6366f1; }

        .actions { display:flex; justify-content:center; gap:5px; }

        .badge { padding:5px 10px; border-radius:10px; color:white; font-size:12px; }
        .assigned { background:#10b981; }
        .unassigned { background:#ef4444; }

        .inactive-row { background:#ffe4e6; }

        .modal {
          position:fixed; top:0; left:0;
          width:100%; height:100%;
          background:rgba(0,0,0,0.5);
          display:flex; justify-content:center; align-items:center;
        }

        .modal-content {
          background:white; padding:25px; border-radius:12px;
          width:400px; max-height:90vh; overflow:auto;
        }

        .form-group { margin-bottom:12px; display:flex; flex-direction:column; }

        .modal-buttons {
          display:flex;
          justify-content:space-between;
          margin-top:15px;
        }

        .analytics { display:flex; gap:15px; margin-top:20px; }
        .card { flex:1; padding:15px; border-radius:10px; color:white; text-align:center; }
        .c1 { background:#6366f1; }
        .c2 { background:#10b981; }
        .c3 { background:#ef4444; }
      `}</style>

      <div className="box">
        <div className="top">
          <h2>📚 Subject Management</h2>

          {/* ✅ FIXED ADD BUTTON */}
          <button className="btn btn-primary" onClick={() => {
            setForm({
              name: "",
              code: "",
              course: "",
              semester: "",
              credits: "",
              type: "",
              status: "Active"
            });
            setEditId(null);
            setShowModal(true);
          }}>
            + Add subject
          </button>
        </div>

        <div>
          <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
          <input placeholder="Course" onChange={e => setFilterCourse(e.target.value)} />
          <input placeholder="Semester" onChange={e => setFilterSem(e.target.value)} />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Code</th>
              <th>Course</th><th>Sem</th><th>Faculty</th>
              <th>Status</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className={s.status === "Inactive" ? "inactive-row" : ""}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.code}</td>
                <td>{s.course}</td>
                <td>{s.semester}</td>

                <td>
                  <span className={`badge ${s.faculty === "Unassigned" ? "unassigned" : "assigned"}`}>
                    {s.faculty}
                  </span>
                </td>

                <td onClick={() => toggleStatus(s.id)}>{s.status}</td>

                <td>
                  <div className="actions">
                    <button className="btn btn-assign" onClick={() => setAssignModal(s)}>Assign</button>
                    <button className="btn btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="analytics">
          <div className="card c1">Total: {subjects.length}</div>
          <div className="card c2">Assigned: {assigned}</div>
          <div className="card c3">Unassigned: {subjects.length - assigned}</div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editId ? "Edit" : "Add"} Subject</h3>

            <div className="form-group"><input name="name" value={form.name} onChange={handleChange} placeholder="Name"/></div>
            <div className="form-group"><input name="code" value={form.code} onChange={handleChange} placeholder="Code"/></div>
            <div className="form-group"><input name="course" value={form.course} onChange={handleChange} placeholder="Course"/></div>
            <div className="form-group"><input name="semester" value={form.semester} onChange={handleChange} placeholder="Semester"/></div>
            <div className="form-group"><input name="credits" value={form.credits} onChange={handleChange} placeholder="Credits"/></div>
            <div className="form-group"><input name="type" value={form.type} onChange={handleChange} placeholder="Type"/></div>

            {/* ✅ STATUS ADDED */}
            {editId && (
  <div className="form-group">
    <label>Status</label>
    <select name="status" value={form.status} onChange={handleChange}>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>
)}

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editId ? "Update" : "Add"}
              </button>

              <button className="btn btn-delete" onClick={() => {
                setShowModal(false);
                setEditId(null);
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Faculty</h3>

            {facultyList.length === 0 ? (
              <p>No faculty available</p>
            ) : (
              facultyList.map(f => (
                <button key={f.faculty_id}
                  className="btn btn-assign"
                  onClick={() => handleAssign(assignModal.id, f.faculty_id)}>
                  {f.name}
                </button>
              ))
            )}

            <br/><br/>
            <button className="btn btn-delete" onClick={() => setAssignModal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Subject;