import React, { useState } from "react";

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (form.email === "admin@gmail.com" && form.password === "1234") {
      onLogin();
    } else {
      alert("Invalid Admin Credentials ❌");
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Poppins", sans-serif;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        /* LEFT SIDE */
        .left {
          flex: 1;
          background: linear-gradient(180deg, #0f172a, #1e3a8a);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 40px;
          animation: slideLeft 1s ease;
        }

        .left h1 {
          font-size: 50px;   /* 🔥 bigger */
          font-weight: bold;
          text-align: center;
        }

        .left p {
          font-size: 22px;   /* 🔥 bigger */
          margin-top: 10px;
        }

        /* RIGHT SIDE */
        .right {
          flex: 1;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 1.2s ease;
        }

        /* CARD */
        .card {
          width: 420px;      /* 🔥 bigger form */
          padding: 40px;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          animation: popUp 0.8s ease;
        }

        h2 {
          text-align: center;
          color: #1e3a8a;
          font-size: 28px;   /* 🔥 bigger */
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 14px;     /* 🔥 bigger input */
          margin: 12px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        input:focus {
          border-color: #1e3a8a;
          outline: none;
        }

        button {
          width: 100%;
          padding: 14px;     /* 🔥 bigger button */
          border: none;
          border-radius: 12px;
          background: linear-gradient(180deg, #0f172a, #1e3a8a);
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s;
        }

        button:hover {
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(30,58,138,0.4);
        }

        /* 🔥 ANIMATIONS */
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popUp {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

      `}</style>

      <div className="container">

        {/* LEFT PANEL */}
        <div className="left">
          <h1>Smart Campus Management 🎓</h1>
          <p>Admin Panel</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="card">
            <h2>Admin Login</h2>

            <input
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />

            <button onClick={handleLogin}>Login</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default AdminLogin;