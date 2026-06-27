import React, { useState } from "react";

function Register({ goLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 REGISTER FUNCTION (USING FETCH)
const register = async () => {
  const { name, email, password, role } = form;

  // 🔴 REQUIRED FIELD VALIDATION (ADDED)
  if (!name || !email || !password) {
    alert("All fields are required ❌");
    return;
  }

  // 🔴 EMAIL VALIDATION (ADDED)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Invalid Email Format ❌");
    return;
  }

  // 🔴 PASSWORD VALIDATION (ADDED)
  // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordPattern.test(password)) {
    alert(
      "Password must contain:\n• 1 Uppercase\n• 1 Lowercase\n• 1 Number\n• 1 Special Character\n• Minimum 8 characters ❌"
    );
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Registered Successfully ✅");
      goLogin();
    } else {
      alert(data.message || "Registration failed ❌");
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

      {/* ⚪ RIGHT REGISTER */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2>Register</h2>

          <input
            style={styles.input}
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {/* 🔥 ROLE DROPDOWN */}
          <select
            style={styles.input}
            name="role"
            onChange={handleChange}
            value={form.role}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          <button style={styles.button} onClick={register}>
            Register
          </button>

          <span style={styles.link} onClick={goLogin}>
            Back to Login
          </span>
        </div>
      </div>

    </div>
  );
}

export default Register;


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