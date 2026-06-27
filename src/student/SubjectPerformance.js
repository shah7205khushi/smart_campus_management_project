import React, { useState, useEffect } from "react";

function SubjectPerformance() {

  const studentId = 1;
  const courseName = "AI & Data Science Course";

  const [data, setData] = useState([]);
  const [openSubject, setOpenSubject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH DATA
  // ===================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/performance/${studentId}`
      );

      const result = await res.json();

      setData(result);

      setLoading(false);

    } catch (err) {

      console.log(err);
      setLoading(false);
    }
  };

  // ===================================================
  // ICONS
  // ===================================================

  const getIcon = (type) => ({
    pdf: "📄",
    video: "🎥",
    doc: "📝",
    link: "🔗",
  }[type] || "📁");

  // ===================================================
  // TOGGLE SUBJECT
  // ===================================================

  const toggleSubject = (index) => {

    setOpenSubject(
      openSubject === index ? null : index
    );
  };

  // ===================================================
  // FILTER MATERIAL
  // ===================================================

  const filterMaterials = (materials) => {

    if (filter === "all") {
      return materials;
    }

    return materials.filter(
      (m) => m.type === filter
    );
  };

  // ===================================================
  // OPEN MATERIAL
  // ===================================================

  const openMaterial = async (mat) => {

    window.open(mat.link, "_blank");

    try {

      await fetch(
        `http://localhost:5000/api/material/${mat.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            student_id: studentId,
          }),
        }
      );

      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div style={styles.wrapper}>

      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <h1 style={{ margin: 0 }}>
            📚 {courseName}
          </h1>

          <p style={{ marginTop: "8px" }}>
            Track your study progress 🚀
          </p>
        </div>

        {/* FILTER */}

        <div style={styles.filterBox}>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.dropdown}
          >
            <option value="all">
              All Materials
            </option>

            <option value="video">
              🎥 Videos
            </option>

            <option value="pdf">
              📄 PDFs
            </option>

            <option value="doc">
              📝 Docs
            </option>

            <option value="link">
              🔗 Links
            </option>

          </select>

        </div>

        {/* SUBJECTS */}

        {data.map((sub, i) => (

          <div key={i} style={styles.card}>

            {/* SUBJECT */}

            <div
              style={styles.subject}
              onClick={() => toggleSubject(i)}
            >

              <span>
                {sub.subject}
              </span>

              <span>
                {openSubject === i ? "▲" : "▼"}
              </span>

            </div>

            {/* TOPICS */}

            {openSubject === i && (

              sub.topics.map((topic, j) => {

                const materials = filterMaterials(
                  topic.materials
                );

                if (!materials.length) {
                  return null;
                }

                return (

                  <div key={j} style={styles.topic}>

                    <h3 style={styles.topicTitle}>
                      {topic.name}
                    </h3>

                    <div style={styles.row}>

                      {materials.map((mat) => (

                        <div
                          key={mat.id}
                          style={{
                            ...styles.material,

                            background:
                              mat.progress === 100
                                ? "#dcfce7"
                                : "#ffffff",
                          }}

                          onClick={() => openMaterial(mat)}
                        >

                          <div style={styles.icon}>
                            {getIcon(mat.type)}
                          </div>

                          <div style={styles.title}>
                            {mat.title}
                          </div>

                          <div style={styles.percent}>
                            {mat.progress}% Completed
                          </div>

                          <div style={styles.bar}>

                            <div
                              style={{
                                ...styles.fill,
                                width: `${mat.progress}%`,
                              }}
                            />

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>
                );
              })
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default SubjectPerformance;


// ===================================================
// STYLES
// ===================================================

const styles = {

  wrapper: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "1150px",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },

  header: {
    background: "linear-gradient(135deg,#4f46e5,#9333ea)",
    color: "white",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  },

  filterBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },

  dropdown: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },

  card: {
    background: "white",
    padding: "18px",
    borderRadius: "16px",
    marginTop: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  subject: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#4f46e5",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topic: {
    marginTop: "20px",
  },

  topicTitle: {
    color: "#475569",
    marginBottom: "12px",
  },

  row: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "10px",
  },

  material: {
    minWidth: "200px",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "0.3s",
    border: "1px solid #e5e7eb",
  },

  icon: {
    fontSize: "28px",
  },

  title: {
    fontSize: "14px",
    marginTop: "10px",
    fontWeight: "600",
    color: "#111827",
  },

  percent: {
    fontSize: "13px",
    marginTop: "10px",
    fontWeight: "bold",
    color: "#6366f1",
  },

  bar: {
    height: "7px",
    background: "#e5e7eb",
    borderRadius: "10px",
    marginTop: "8px",
  },

  fill: {
    height: "100%",
    background: "#6366f1",
    borderRadius: "10px",
    transition: "0.4s",
  },
};