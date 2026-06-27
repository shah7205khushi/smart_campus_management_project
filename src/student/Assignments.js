import React, { useState, useEffect } from "react";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments");
      const data = await res.json();

      console.log("DATA:", data); // DEBUG
      setAssignments(data);
    } catch (err) {
      console.log("❌ ERROR:", err);
    }
    setLoading(false);
  };

  if (loading) return <h2>⏳ Loading...</h2>;

  if (assignments.length === 0)
    return <h2>😴 No assignments found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Assignments</h1>

      <table border="1" width="1200px" cellPadding="10">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Classroom</th>
            <th>File</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a, i) => (
            <tr key={i}>
              <td>{a.subject}</td>
              <td>{a.title}</td>
              <td>{a.dueDate}</td>

              <td>
                {a.submitted ? "✅ Submitted" : "❌ Pending"}
              </td>

              <td>
                <a href={a.classroomLink} target="_blank" rel="noreferrer">
                  Open
                </a>
              </td>

              <td>{a.file ? a.file : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Assignments;