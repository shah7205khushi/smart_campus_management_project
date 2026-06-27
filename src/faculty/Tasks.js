// import React, { useState } from "react";

// function Tasks() {
//   const [tasks, setTasks] = useState([
//     {
//       title: "Check Assignment 1",
//       deadline: "2026-04-15",
//       status: "Pending"
//     },
//     {
//       title: "Upload Exam Marks",
//       deadline: "2026-04-18",
//       status: "Urgent"
//     }
//   ]);

//   const [newTask, setNewTask] = useState({
//     title: "",
//     deadline: ""
//   });

//   // 🔥 Add Task
//   const addTask = () => {
//     if (!newTask.title || !newTask.deadline) {
//       alert("Fill all fields ⚠️");
//       return;
//     }

//     setTasks([...tasks, { ...newTask, status: "Pending" }]);

//     setNewTask({ title: "", deadline: "" });
//   };

//   // 🔥 Mark Complete
//   const markComplete = (index) => {
//     const updated = [...tasks];
//     updated[index].status = "Completed";
//     setTasks(updated);
//   };

//   return (
//     <>
//       <h2>⏳ Pending Tasks & Reminders</h2>

//       {/* ADD TASK */}
//       <div style={{
//         background: "white",
//         padding: "20px",
//         borderRadius: "10px",
//         marginBottom: "20px"
//       }}>
//         <h3>Add New Task</h3>

//         <input
//           placeholder="Task Title"
//           value={newTask.title}
//           onChange={(e) =>
//             setNewTask({ ...newTask, title: e.target.value })
//           }
//           style={{ padding: "10px", margin: "10px" }}
//         />

//         <input
//           type="date"
//           value={newTask.deadline}
//           onChange={(e) =>
//             setNewTask({ ...newTask, deadline: e.target.value })
//           }
//           style={{ padding: "10px", margin: "10px" }}
//         />

//         <button onClick={addTask} style={{ padding: "10px 20px" }}>
//           Add Task
//         </button>
//       </div>

//       {/* TASK LIST */}
//       <div style={{
//         background: "white",
//         padding: "20px",
//         borderRadius: "10px"
//       }}>
//         <h3>Task List</h3>

//         <table style={{ width: "100%" }}>
//           <thead>
//             <tr style={{ background: "#1e3a8a", color: "white" }}>
//               <th>Task</th>
//               <th>Deadline</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {tasks.map((task, index) => (
//               <tr key={index}>
//                 <td>{task.title}</td>
//                 <td>{task.deadline}</td>
//                 <td
//                   style={{
//                     color:
//                       task.status === "Completed"
//                         ? "green"
//                         : task.status === "Urgent"
//                         ? "red"
//                         : "orange"
//                   }}
//                 >
//                   {task.status}
//                 </td>
//                 <td>
//                   <button onClick={() => markComplete(index)}>
//                     Complete
//                   </button>

//                   <button style={{ marginLeft: "10px" }}>
//                     🔔 Reminder
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// export default Tasks;
import React, { useState, useEffect } from "react";

function Tasks({ facultyId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
  });

  useEffect(() => {
    if (facultyId) fetchTasks();
  }, [facultyId]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${facultyId}`);
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.deadline) {
      alert("Fill all fields");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: facultyId,
          title: newTask.title,
          deadline: newTask.deadline,
        }),
      });

      setTasks((prev) => [
        {
          task_id: Date.now(),
          title: newTask.title,
          deadline: newTask.deadline,
          status: "pending",
        },
        ...prev,
      ]);

      setNewTask({ title: "", deadline: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const markComplete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.task_id === id ? { ...t, status: "completed" } : t
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((prev) => prev.filter((t) => t.task_id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Pending Tasks</h2>

      {/* INPUT BOX */}
      <div style={styles.form}>
        <input
          placeholder="Enter task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) =>
            setNewTask({ ...newTask, deadline: e.target.value })
          }
          style={styles.input}
        />

        <button onClick={addTask} style={styles.addBtn}>
          Add Task
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHead}>
              <th style={styles.th}>Task</th>
              <th style={styles.th}>Deadline</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No tasks available
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.task_id} style={styles.tr}>
                  <td style={styles.td}>{t.title}</td>
                  <td style={styles.td}>{t.deadline}</td>

                  <td
                    style={{
                      ...styles.td,
                      color:
                        t.status === "completed" ? "green" : "#f59e0b",
                      fontWeight: "bold",
                    }}
                  >
                    {t.status}
                  </td>

                  <td style={styles.td}>
                    {t.status !== "completed" && (
                      <button
                        onClick={() => markComplete(t.task_id)}
                        style={styles.doneBtn}
                      >
                        Done
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(t.task_id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tasks;

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: 20,
    background: "#f4f6fb",
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    color: "#172f6e",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },

  form: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 200,
  },

  addBtn: {
    background: "#172f6e",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: 6,
    cursor: "pointer",
  },

  tableBox: {
    display: "flex",
    justifyContent: "center",
  },

  table: {
    width: "80%",
    background: "white",
    borderCollapse: "collapse",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflow: "hidden",
  },

  trHead: {
    background: "#172f6e",
    color: "white",
  },

  th: {
    padding: 12,
    textAlign: "center",
  },

  tr: {
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },

  td: {
    padding: 12,
  },

  doneBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 5,
    marginRight: 5,
    cursor: "pointer",
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 5,
    cursor: "pointer",
  },

  noData: {
    padding: 20,
    textAlign: "center",
    color: "gray",
  },
};