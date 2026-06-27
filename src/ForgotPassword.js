import React, { useState } from "react";

function ForgotPassword({ goLogin }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🔐 CONNECTED TO BACKEND (USING FETCH)
  const reset = async () => {
    if (!email || !newPassword) {
      alert("Enter all fields ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password updated successfully ✅");
        goLogin();
      } else {
        alert(data.message || "Email not found ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server Error ❌");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 🔵 LEFT SIDEBAR */}
      <div style={styles.left}>
        <h1 style={styles.title}>Smart Campus Management</h1>
        <h1>🎓</h1>
        <p style={styles.subtitle}>

          Login system
        </p>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2>Forgot Password</h2>

          <input
            style={styles.input}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 🔥 NEW PASSWORD INPUT */}
          <input
            style={styles.input}
            type="password"
            placeholder="Enter New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button style={styles.button} onClick={reset}>
            Reset Password
          </button>

          <span style={styles.link} onClick={goLogin}>
            Back to Login
          </span>
        </div>
      </div>

    </div>
  );
}

export default ForgotPassword;


// 🎨 STYLES (UNCHANGED)
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Poppins, sans-serif",
    width: "1500px",
  },

  left: {
    flex: 1,
    background: "#172f6e",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
  },

  title: {
    fontSize: "46px",
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: "10px",
    fontSize: "22px",
    opacity: 0.8,
  },

  right: {
    flex: 1,
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    background: "#172f6e",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  link: {
    fontSize: "14px",
    color: "#172f6e",
    cursor: "pointer",
    textAlign: "center",
  },
};