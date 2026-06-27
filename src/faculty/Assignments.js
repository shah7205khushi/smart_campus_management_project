import React, { useEffect, useState } from "react";

export default function AdminAssignments({ user }) {

  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    subject_id: "",
    title: "",
    description: "",
    deadline: "",
    max_marks: "",
    file_url: "",
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchSubjects();
    fetchAssignments();
  }, []);

  function fetchSubjects() {
    fetch("http://localhost:5000/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.log("Subject API Error:", err));
  }

  function fetchAssignments() {
    fetch("http://localhost:5000/assignments")
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.log("Assignment API Error:", err));
  }

  // ================= HANDLE INPUT =================
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    if (!user?.faculty_id) {
      alert("Faculty not logged in!");
      return;
    }

    // basic validation
    if (!form.subject_id || !form.title || !form.deadline) {
      alert("Please fill required fields");
      return;
    }

    fetch("http://localhost:5000/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        faculty_id: user.faculty_id
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Assignment added successfully!");

        setForm({
          subject_id: "",
          title: "",
          description: "",
          deadline: "",
          max_marks: "",
          file_url: "",
        });

        fetchAssignments();
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.container}>

      <h2 style={styles.heading}>📚 Assignments</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={submit} style={styles.form}>

        <select
          name="subject_id"
          value={form.subject_id}
          onChange={handle}
          style={styles.input}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handle}
          style={styles.input}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handle}
          style={styles.input}
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handle}
          style={styles.input}
        />

        <input
          name="max_marks"
          placeholder="Max Marks"
          value={form.max_marks}
          onChange={handle}
          style={styles.input}
        />

        <input
          name="file_url"
          placeholder="File URL"
          value={form.file_url}
          onChange={handle}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          ➕ Upload Assignment
        </button>

      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.trHead}>
            <th>Subject</th>
            <th>Title</th>
            <th>Deadline</th>
            <th>Marks</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignment_id} style={styles.tr}>
              <td>{a.subject_name}</td>
              <td>{a.title}</td>
              <td>{a.deadline}</td>
              <td>{a.max_marks}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ================= SIMPLE STYLES ================= */

const styles = {

  container: {
    padding: "20px",
    background: "#f1f5f9",
    minHeight: "100vh"
  },

  heading: {
    marginBottom: "15px"
  },

  form: {
    display: "grid",
    gap: "10px",
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  table: {
    width: "100%",
    background: "white",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden"
  },

  trHead: {
    background: "#6366f1",
    color: "white"
  },

  tr: {
    textAlign: "center"
  }
};