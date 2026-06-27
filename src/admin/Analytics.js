import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Analytics() {

  // 🔥 MAIN COUNTS
  const [cards, setCards] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    subjects: 0,
    exams: 0
  });

  // 🔥 MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  // 🔥 SYSTEM DISTRIBUTION
  const [systemData, setSystemData] = useState([]);

  // 🔥 ASSIGNED GRAPH
  const [assignedData, setAssignedData] = useState([]);

  // 🔥 FACULTY WORKLOAD
  const [workloadData, setWorkloadData] = useState([]);

  // 🔥 EVENTS
  const [events, setEvents] = useState([]);

  // 🔥 COLORS
  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ec4899"
  ];

  // ======================================================
  // 🔥 FETCH DASHBOARD COUNTS
  // ======================================================
  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/dashboard")
      .then(res => res.json())
      .then(data => {

        setCards({
          students: data.students || 0,
          faculty: data.faculty || 0,
          courses: data.courses || 0,
          subjects: data.subjects || 0,
          exams: data.exams || 0
        });

        // 🍩 DONUT GRAPH
        setSystemData([
          { name: "Students", value: data.students || 0 },
          { name: "Faculty", value: data.faculty || 0 },
          { name: "Courses", value: data.courses || 0 },
          { name: "Subjects", value: data.subjects || 0 }
        ]);

        // 📊 ASSIGNED GRAPH
        setAssignedData([
          {
            name: "Assigned",
            value: data.assignedSubjects || 0
          },
          {
            name: "Unassigned",
            value: data.unassignedSubjects || 0
          }
        ]);

      })
      .catch(err => console.log(err));

  }, []);

  // ======================================================
  // 🔥 FETCH UPCOMING EVENTS
  // ======================================================
  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/upcoming-events")
      .then(res => res.json())
      .then(data => {
        console.log("EVENTS:", data);
        setEvents(data);
      })
      .catch(err => console.log(err));

  }, []);

  // ======================================================
  // 🔥 FETCH FACULTY WORKLOAD
  // ======================================================
  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/faculty-workload")
      .then(res => res.json())
      .then(data => {
        console.log("WORKLOAD:", data);
        setWorkloadData(data);
      })
      .catch(err => console.log(err));

  }, []);

  // ======================================================
  // 🔥 OPEN MODAL
  // ======================================================
  const openModal = async (title, api) => {

    try {

      const response = await fetch(api);
      const data = await response.json();

      console.log("MODAL DATA:", data);

      setModalTitle(title);

      if (Array.isArray(data)) {
        setModalData(data);
      } else {
        setModalData([]);
      }

      setShowModal(true);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <>
      <style>{`

        .analytics-container{
          padding:20px;
        }

        .main-box{
          background:white;
          padding:25px;
          border-radius:20px;
          box-shadow:0 5px 15px rgba(0,0,0,0.08);
        }

        h2{
          margin-bottom:20px;
          color:#1e293b;
        }

        /* 🔥 CARDS */
        .cards{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:18px;
        }

        .card{
          padding:20px;
          border-radius:15px;
          color:white;
          cursor:pointer;
          transition:0.3s;
          text-align:center;
        }

        .card:hover{
          transform:translateY(-5px);
        }

        .card h3{
          margin:0;
          font-size:18px;
        }

        .card p{
          margin-top:10px;
          font-size:28px;
          font-weight:bold;
        }

        .c1{ background:#6366f1; }
        .c2{ background:#10b981; }
        .c3{ background:#f59e0b; }
        .c4{ background:#ec4899; }
        .c5{ background:#ef4444; }

        /* 🔥 GRAPH GRID */
        .graph-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
          margin-top:25px;
        }

        .graph-box{
          background:white;
          border-radius:18px;
          padding:20px;
          box-shadow:0 5px 15px rgba(0,0,0,0.08);
        }

        .graph-title{
          margin-bottom:15px;
          font-size:18px;
          font-weight:bold;
          color:#1e293b;
        }

        /* 🔥 EVENT TIMELINE */
        .timeline{
          position:relative;
          margin-left:15px;
        }

        .timeline::before{
          content:'';
          position:absolute;
          left:8px;
          top:0;
          width:3px;
          height:100%;
          background:#6366f1;
        }

        .event{
          position:relative;
          margin-bottom:25px;
          padding-left:30px;
        }

        .event::before{
          content:'';
          position:absolute;
          left:0;
          top:5px;
          width:18px;
          height:18px;
          border-radius:50%;
          background:#6366f1;
        }

        .event-title{
          font-weight:bold;
          color:#111827;
        }

        .event-date{
          color:#64748b;
          font-size:14px;
          margin-top:3px;
        }

        /* 🔥 MODAL */
        .modal-overlay{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:999;
        }

        .modal{
          background:white;
          width:400px;
          padding:25px;
          border-radius:18px;
          max-height:500px;
          overflow:auto;
        }

        .modal h3{
          margin-top:0;
        }

        .modal ul{
          padding-left:20px;
        }

        .modal li{
          margin-bottom:10px;
        }

        .close-btn{
          background:#ef4444;
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
          margin-top:15px;
        }

      `}</style>

      <div className="analytics-container">

        <div className="main-box">

          <h2>📊 Analytics Dashboard</h2>

          {/* 🔥 CARDS */}
          <div className="cards">

            <div
              className="card c1"
              onClick={() =>
                openModal(
                  "Students List",
                  "http://127.0.0.1:5000/api/students-list"
                )
              }
            >
              <h3>Students</h3>
              <p>{cards.students}</p>
            </div>

            <div
              className="card c2"
              onClick={() =>
                openModal(
                  "Faculty List",
                  "http://127.0.0.1:5000/api/faculty-list"
                )
              }
            >
              <h3>Faculty</h3>
              <p>{cards.faculty}</p>
            </div>

            <div
              className="card c3"
              onClick={() =>
                openModal(
                  "Courses List",
                  "http://127.0.0.1:5000/api/courses-list"
                )
              }
            >
              <h3>Courses</h3>
              <p>{cards.courses}</p>
            </div>

            <div
              className="card c4"
              onClick={() =>
                openModal(
                  "Subjects List",
                  "http://127.0.0.1:5000/api/subjects-list"
                )
              }
            >
              <h3>Subjects</h3>
              <p>{cards.subjects}</p>
            </div>

            <div
              className="card c5"
              onClick={() =>
                openModal(
                  "Exams List",
                  "http://127.0.0.1:5000/api/exams-list"
                )
              }
            >
              <h3>Exams</h3>
              <p>{cards.exams}</p>
            </div>

          </div>

          {/* 🔥 GRAPHS */}
          <div className="graph-grid">

            {/* 🍩 DONUT GRAPH */}
            <div className="graph-box">

              <div className="graph-title">
                🍩 System Distribution
              </div>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={systemData}
                    dataKey="value"
                    outerRadius={100}
                    innerRadius={60}
                    label
                  >

                    {systemData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            {/* 📊 ASSIGNED GRAPH */}
            <div className="graph-box">

              <div className="graph-title">
                📚 Assigned vs Unassigned Subjects
              </div>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart data={assignedData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[8,8,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* 📅 EVENTS */}
            <div className="graph-box">

              <div className="graph-title">
                📅 Upcoming Events Timeline
              </div>

              <div className="timeline">

                {events.map((e, i) => (

                  <div className="event" key={i}>

                    <div className="event-title">
                      {e.title}
                    </div>

                    <div className="event-date">
                      {new Date(e.start_date).toLocaleDateString()}
                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* 👨‍🏫 FACULTY WORKLOAD */}
            <div className="graph-box">

              <div className="graph-title">
                👨‍🏫 Faculty Workload
              </div>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart
                  data={workloadData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="subjects"
                    fill="#10b981"
                    radius={[8,8,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

      {/* 🔥 MODAL */}
      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>{modalTitle}</h3>

            <ul>

              {modalData.map((item, i) => (

                <li key={i}>

                  {item.name ||
                   item.course_name ||
                   item.subject_name ||
                   item.exam_name ||
                   item.title ||
                   "No Data"}

                </li>

              ))}

            </ul>

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </>
  );
}

export default Analytics;