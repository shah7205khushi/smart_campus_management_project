
import React, { useState, useEffect } from "react";

function Student() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    enroll: "",
    course: "",
    semester: "",
    year: "",
    batch: "",
    contact_no: "",
    address: "",
    parent_name: "",
    parent_contact: "",
    status: "Active"
  });

  // ✅ FETCH DATA
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(s => ({
          id: s.user_id,
          name: s.name,
          email: s.email,
          role: s.role,
          enroll: s.enrollment_no,
          course: s.course_name || "",
          semester: s.semester,
          year: s.year,
          batch: s.batch,

          // ✅ NEW FIELDS (from backend)
  joining_year: s.joining_year,
  joining_month: s.joining_month,

  fees_paid: s.fees_paid,              // "Paid" / "Pending"
  exam_form: s.exam_form,             // "Filled" / "Not Filled"
  attendance: s.attendance,

          contact_no: s.contact_no,
          address: s.address,
          parent_name: s.parent_name,
          parent_contact: s.parent_contact,
          status: s.status === "active" ? "Active" : "Inactive"
        }));
        setStudents(formatted);
      });
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FIX 1: REMOVE RELOAD (NO LOGOUT NOW)
  const handleSubmit = () => {
    fetch(`http://localhost:5000/update-student/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    }).then(() => {
      // update UI without reload
      setStudents(students.map(s =>
        s.id === editId ? { ...s, ...form } : s
      ));
      setShowModal(false);
    });
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    if (window.confirm("Deactivate this student?")) {
      fetch(`http://localhost:5000/delete-student/${id}`, {
        method: "PUT"
      }).then(() => {
        setStudents(students.map(s =>
          s.id === id ? { ...s, status: "Inactive" } : s
        ));
      });
    }
  };

  // ✅ EDIT
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      enroll: student.enroll,
      course: student.course,
      semester: student.semester,
      year: student.year,
      batch: student.batch,
      contact_no: student.contact_no,
      address: student.address,
      parent_name: student.parent_name,
      parent_contact: student.parent_contact,
      status: student.status
    });
    setEditId(student.id);
    setShowModal(true);
  };

  // ✅ STATUS TOGGLE
  const toggleStatus = (id) => {
    fetch(`http://localhost:5000/toggle-status/${id}`, {
      method: "PUT"
    }).then(() => {
      setStudents(students.map(s =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      ));
    });
  };

  // ✅ FILTER
  const filteredStudents = students.filter(s => {
  const searchText = search.toLowerCase();
  const courseText = filterCourse.toLowerCase();

  return (
    (
      s.name.toLowerCase().includes(searchText) ||
      s.email.toLowerCase().includes(searchText) ||
      s.course.toLowerCase().includes(searchText)
    ) &&
    (filterCourse
      ? s.course.toLowerCase().includes(courseText)
      : true) &&
    (filterYear ? s.semester == filterYear : true)
  );
});

  return (
    <>
      <style>{`
        body { background: #f1f5f9; font-family: Arial; }
        .box { background:white; padding:25px; border-radius:15px; box-shadow:0 8px 20px rgba(0,0,0,0.08); }
        h2 { margin-bottom:15px; color:#1e293b; }
        .filters { display:flex; flex-wrap:wrap; margin-top:10px; }
        input, select { padding:10px; margin:5px; border-radius:8px; border:1px solid #ccc; }

        table { width:100%; margin-top:15px; border-collapse:collapse; }

        th { background:#3b82f6; color:white; padding:12px; }

        td { padding:10px; border-bottom:1px solid #ddd; text-align:center; }

        tr.inactive-row {
          background-color: #ffe4e6;  /* 🔥 light pink */
        }

        .btn { padding:6px 12px; border:none; border-radius:6px; color:white; cursor:pointer; margin:2px; }
        .edit { background:#10b981; }
        .delete { background:#ef4444; }
        .view { background:#3b82f6; }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 5px;   /* 🔥 FIX overlap */
        }

        .status-active { color:#16a34a; cursor:pointer; font-weight:bold; }
        .status-inactive { color:#dc2626; cursor:pointer; font-weight:bold; }

        .modal {
          position:fixed; top:0; left:0;
          width:100%; height:100%;
          background:rgba(0,0,0,0.5);
          display:flex; justify-content:center; align-items:center;
        }

        .modal-content {
          background:white; padding:20px; border-radius:12px;
          width:400px; max-height:90vh; overflow:auto;
        }

        .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  text-align: left;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
  color: #374151;
}

.modal-content p {
  margin: 6px 0;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
      `}</style>

      <div className="box">
        <h2>🎓 Student Management</h2>

        <div className="filters">
          <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
          <input placeholder="Course" onChange={e => setFilterCourse(e.target.value)} />
          <input placeholder="Semester" onChange={e => setFilterYear(e.target.value)} />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Enroll</th>
              <th>Course</th><th>Sem</th><th>Status</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id} className={s.status === "Inactive" ? "inactive-row" : ""}>
                <td>{s.id}</td>

                {/* 👉 CLICK NAME STILL WORKS */}
                <td style={{cursor:"pointer"}} onClick={() => setViewStudent(s)}>
                  {s.name}
                </td>

                <td>{s.email}</td>
                <td>{s.enroll}</td>
                <td>{s.course}</td>
                <td>{s.semester}</td>

                <td
                  className={s.status === "Active" ? "status-active" : "status-inactive"}
                  onClick={() => toggleStatus(s.id)}
                >
                  {s.status}
                </td>

                {/* ✅ FIX BUTTON OVERLAP */}
                <td>
                  <div className="action-buttons">
                    <button className="btn view" onClick={() => setViewStudent(s)}>View</button>
                    <button className="btn edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT MODAL */}
{showModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Edit Student</h3>

      <div className="form-group">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Enrollment No</label>
        <input name="enroll" value={form.enroll} readOnly />
      </div>

      <div className="form-group">
        <label>Course</label>
        <select name="course" value={form.course} onChange={handleChange}>
          <option>BCA</option>
          <option>BBA</option>
        </select>
      </div>

      <div className="form-group">
        <label>Semester</label>
        <input name="semester" value={form.semester} readOnly />
      </div>

      <div className="form-group">
        <label>Year</label>
        <input name="year" value={form.year} readOnly />
      </div>

      <div className="form-group">
        <label>Batch</label>
        <input name="batch" value={form.batch} readOnly />
      </div>

      <div className="form-group">
        <label>Contact No</label>
        <input name="contact_no" value={form.contact_no} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Parent Name</label>
        <input name="parent_name" value={form.parent_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Parent Contact</label>
        <input name="parent_contact" value={form.parent_contact} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="modal-buttons">
        <button className="btn edit" onClick={handleSubmit}>Save</button>
        <button className="btn delete" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

        {/* VIEW MODAL */}
        {viewStudent && (
          <div className="modal">
            <div className="modal-content">
              <h3>Student Details</h3>

              <p>Name: {viewStudent.name}</p>
              <p>Email: {viewStudent.email}</p>
              <p>Course: {viewStudent.course}</p>
              <p>Semester: {viewStudent.semester}</p>
              <p>Batch: {viewStudent.batch}</p>

              {/* ✅ NEW ADDITIONS */}
<p>Joining: {viewStudent.joining_month} {viewStudent.joining_year}</p>

<p>
  Fees Status:{" "}
  <span style={{ color: viewStudent.fees_paid === "Paid" ? "green" : "red" }}>
    {viewStudent.fees_paid}
  </span>
</p>

<p>
  Exam Form:{" "}
  <span style={{ color: viewStudent.exam_form === "Filled" ? "green" : "orange" }}>
    {viewStudent.exam_form}
  </span>
</p>

<p>
  Attendance:{" "}
  <span style={{
    color: viewStudent.attendance >= 75 ? "green" : "red",
    fontWeight: "bold"
  }}>
    {viewStudent.attendance}% {" "}
    {viewStudent.attendance >= 75 ? "(Regular)" : "(Below 75%)"}
  </span>
</p>
              <p>Contact: {viewStudent.contact_no}</p>
              <p>Parent: {viewStudent.parent_name} ({viewStudent.parent_contact})</p>

              <button className="btn edit" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Student;