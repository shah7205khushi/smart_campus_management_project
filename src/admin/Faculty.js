import React, { useState, useEffect } from "react";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewFaculty, setViewFaculty] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    department: "",
    designation: "",
    qualification: "",
    experience: "",
    joining_date: "",
    skill: "",
    status: "Active"
  });

  // ✅ FETCH
  useEffect(() => {
    fetch("http://localhost:5000/faculty")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(f => ({
          id: f.user_id,
          name: f.name,
          email: f.email,
          department: f.department,
          designation: f.designation,
          phone: f.phone,
          qualification: f.qualification,
          experience: f.experience,
          // joining_date: f.joining_date ? f.joining_date.split("T")[0].split(" ")[0] : "",          
          skill: f.skill,
          status: f.status === "active" ? "Active" : "Inactive"
        }));
        setFaculty(formatted);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE
  const handleSubmit = () => {
    fetch(`http://localhost:5000/update-faculty/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      setFaculty(faculty.map(f =>
        f.id === editId ? { ...f, ...form } : f
      ));
      setShowModal(false);
    });
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    if (window.confirm("Deactivate faculty?")) {
      fetch(`http://localhost:5000/delete-faculty/${id}`, {
        method: "PUT"
      }).then(() => {
        setFaculty(faculty.map(f =>
          f.id === id ? { ...f, status: "Inactive" } : f
        ));
      });
    }
  };

  // ✅ EDIT
  const handleEdit = (f) => {
    setForm({ ...f });
    setEditId(f.id);
    setShowModal(true);
  };

  const filtered = faculty.filter(f =>
  f.name.toLowerCase().includes(search.toLowerCase()) &&
  (filterDept
    ? f.department.toLowerCase().includes(filterDept.toLowerCase())
    : true)
);

  return (
    <>
      <style>{`
        .box { background:white; padding:25px; border-radius:15px; }

        /* ✅ FIX FILTER OVERLAP */
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
        }

        .filters input {
          flex: 1;
          min-width: 180px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        table { width:100%; margin-top:15px; border-collapse:collapse; }
        th { background:#3b82f6; color:white; padding:10px; }
        td { padding:10px; text-align:center; border-bottom:1px solid #ddd; }

        .btn { padding:6px 12px; border:none; border-radius:6px; color:white; margin:2px; cursor:pointer; }
        .edit { background:#10b981; }
        .delete { background:#ef4444; }
        .view { background:#3b82f6; }

        .inactive-row { background:#ffe4e6; }

        /* ✅ FIX BUTTON OVERLAP */
        .action-buttons {
          display:flex;
          justify-content:center;
          gap:6px;
        }

        /* MODAL */
        .modal {
          position:fixed; top:0; left:0;
          width:100%; height:100%;
          background:rgba(0,0,0,0.5);
          display:flex; justify-content:center; align-items:center;
        }

        /* ✅ FIX MODAL CONGESTION */
        .modal-content {
          background:white;
          padding:20px;
          border-radius:12px;
          width:420px;
          max-height:90vh;
          overflow-y:auto;
        }

        .form-group {
          margin-bottom:12px;
          text-align:left;
        }

        .form-group label {
          font-size:14px;
          font-weight:600;
        }

        .form-group input,
        .form-group select {
          width:100%;
          padding:8px;
          margin-top:5px;
          border-radius:6px;
          border:1px solid #ccc;
        }

        .modal-buttons {
          display:flex;
          justify-content:space-between;
          margin-top:15px;
        }
      `}</style>

      <div className="box">
        <h2>👨‍🏫 Faculty Management</h2>

        {/* ✅ FIXED FILTER UI */}
        <div className="filters">
          <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
          <input placeholder="Department" onChange={e => setFilterDept(e.target.value)} />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th>
              <th>Department</th><th>Status</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className={f.status === "Inactive" ? "inactive-row" : ""}>
                <td>{f.id}</td>

                <td style={{cursor:"pointer"}} onClick={() => setViewFaculty(f)}>
                  {f.name}
                </td>

                <td>{f.email}</td>
                <td>{f.department}</td>
                <td>{f.status}</td>

                <td>
                  <div className="action-buttons">
                    <button className="btn view" onClick={() => setViewFaculty(f)}>View</button>
                    <button className="btn edit" onClick={() => handleEdit(f)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(f.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Faculty</h3>

              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Qualification</label>
                <input name="qualification" value={form.qualification} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange}/>
              </div>

              {/* <div className="form-group">
                <label>Joining Date</label>
                <input type="date" name="joining_date" value={form.joining_date} onChange={handleChange}/>
              </div> */}

              <div className="form-group">
                <label>Skills</label>
                <input name="skill" value={form.skill} onChange={handleChange}/>
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

        {/* VIEW */}
        {viewFaculty && (
          <div className="modal">
            <div className="modal-content">
              <h3>Faculty Details</h3>

              <p>Name: {viewFaculty.name}</p>
              <p>Email: {viewFaculty.email}</p>
              <p>Phone: {viewFaculty.phone}</p>
              <p>Department: {viewFaculty.department}</p>
              <p>Designation: {viewFaculty.designation}</p>
              <p>Qualification: {viewFaculty.qualification}</p>
              <p>Experience: {viewFaculty.experience}</p>
              <p>Skills: {viewFaculty.skill}</p>

              <button className="btn edit" onClick={() => setViewFaculty(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Faculty;