// import React, { useState } from "react";

// function Login({ onLogin, goToRegister,goToForgot  }) {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🔥 LOGIN API CALL
//   // 🔥 LOGIN API CALL
// const handleLogin = async () => {

//   // 🔴 REQUIRED FIELD VALIDATION
//   if (!form.email || !form.password) {
//     alert("Please fill all fields ⚠️");
//     return;
//   }

//   // 🔴 EMAIL VALIDATION
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(form.email)) {
//     alert("Invalid Email Format ❌");
//     return;
//   }

//   // 🔴 PASSWORD VALIDATION
//   if (form.password.length < 6) {
//     alert("Password must be at least 6 characters ❌");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (data.success) {
//   // ✅ STORE USER DATA IN LOCAL STORAGE
//   localStorage.setItem("facultyId", data.user_id);  // for faculty
//   localStorage.setItem("role", data.role);          // optional

//   // ✅ continue login flow
//   onLogin(data.role);

//     } else {
//       alert("Invalid Credentials ❌");
//     }
//   } catch (error) {
//     alert("Server Error ⚠️");
//   }
// };

//   return (
//     <>
//       <style>{`
//         body {
//           margin: 0;
//           font-family: "Poppins", sans-serif;
//         }

//         .container {
//           display: flex;
//           height: 100vh;
//         }

//         /* LEFT SIDE */
//         .left {
//           flex: 1;
//           background: linear-gradient(180deg, #0f172a, #1e3a8a);
//           color: white;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           flex-direction: column;
//           padding: 40px;
//         }

//         .left h1 {
//           font-size: 50px;
//           font-weight: bold;
//           text-align: center;
//         }

//         .left p {
//           font-size: 22px;
//           margin-top: 10px;
//         }

//         /* RIGHT SIDE */
//         .right {
//           flex: 1;
//           background: #f1f5f9;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         /* CARD */
//         .card {
//           width: 420px;
//           padding: 40px;
//           border-radius: 20px;
//           background: white;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.15);
//         }

//         h2 {
//           text-align: center;
//           color: #1e3a8a;
//           font-size: 28px;
//           margin-bottom: 20px;
//         }

//         input {
//           width: 100%;
//           padding: 14px;
//           margin: 12px 0;
//           border-radius: 10px;
//           border: 1px solid #ccc;
//           font-size: 16px;
//         }

//         button {
//           width: 100%;
//           padding: 14px;
//           border: none;
//           border-radius: 12px;
//           background: linear-gradient(180deg, #0f172a, #1e3a8a);
//           color: white;
//           font-weight: bold;
//           font-size: 16px;
//           cursor: pointer;
//           margin-top: 10px;
//         }

//         button:hover {
//           transform: scale(1.03);
//         }

//         /* LINKS */
//         .links {
//           margin-top: 15px;
//           text-align: center;
//         }

//         .links span {
//           color: #1e3a8a;
//           cursor: pointer;
//           font-size: 14px;
//           display: block;
//           margin-top: 8px;
//         }

//         .links span:hover {
//           text-decoration: underline;
//         }

//       `}</style>

//       <div className="container">

//         {/* LEFT PANEL */}
//         <div className="left">
//           <h1>Smart Campus Management 🎓</h1>
//           <p>Login System</p>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="right">
//           <div className="card">
//             <h2>Login</h2>

//             <input
//               name="email"
//               placeholder="Enter Email"
//               onChange={handleChange}
//             />

//             <input
//               name="password"
//               type="password"
//               placeholder="Enter Password"
//               onChange={handleChange}
//             />

//             <button onClick={handleLogin}>Login</button>

//             {/* 🔥 REGISTER & FORGOT PASSWORD */}
//             <div className="links">
// <span onClick={goToRegister}>                New User? Register
//               </span>

//               <span onClick={goToForgot}>
//   Forgot Password?
// </span>
//             </div>

//           </div>
//         </div>

//       </div>
//     </>
//   );
// }

// export default Login;

import React, { useState } from "react";

function Login({ onLogin, goToRegister, goToForgot }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 LOGIN API CALL
  const handleLogin = async () => {

    // 🔴 REQUIRED FIELD VALIDATION
    if (!form.email || !form.password) {
      alert("Please fill all fields ⚠️");
      return;
    }

    // 🔴 EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      alert("Invalid Email Format ❌");
      return;
    }

    // 🔴 PASSWORD VALIDATION
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {

        // ✅ FIXED: store FULL user data (IMPORTANT FOR TIMETABLE)
        localStorage.setItem(
  "user",
  JSON.stringify({
    user_id: data.user_id,
    faculty_id: data.faculty_id || null,
    name: data.name,
    role: data.role,
    course_id: data.course_id || null,
    semester: data.semester || null
  })
);

if (data.role === "faculty") {
  localStorage.setItem(
    "facultyId",
    data.faculty_id
  );
}

        localStorage.setItem("role", data.role);

        // ✅ continue login flow (UNCHANGED)
        onLogin(data.role);

      } else {
        alert("Invalid Credentials ❌");
      }

    } catch (error) {
      alert("Server Error ⚠️");
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

        .left {
          flex: 1;
          background: linear-gradient(180deg, #0f172a, #1e3a8a);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 40px;
        }

        .left h1 {
          font-size: 50px;
          font-weight: bold;
          text-align: center;
        }

        .left p {
          font-size: 22px;
          margin-top: 10px;
        }

        .right {
          flex: 1;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
          width: 420px;
          padding: 40px;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        h2 {
          text-align: center;
          color: #1e3a8a;
          font-size: 28px;
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 14px;
          margin: 12px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(180deg, #0f172a, #1e3a8a);
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
        }

        button:hover {
          transform: scale(1.03);
        }

        .links {
          margin-top: 15px;
          text-align: center;
        }

        .links span {
          color: #1e3a8a;
          cursor: pointer;
          font-size: 14px;
          display: block;
          margin-top: 8px;
        }

        .links span:hover {
          text-decoration: underline;
        }

      `}</style>

      <div className="container">

        <div className="left">
          <h1>Smart Campus Management 🎓</h1>
          <p>Login System</p>
        </div>

        <div className="right">
          <div className="card">
            <h2>Login</h2>

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

            <div className="links">
              <span onClick={goToRegister}>
                New User? Register
              </span>

              <span onClick={goToForgot}>
                Forgot Password?
              </span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Login;