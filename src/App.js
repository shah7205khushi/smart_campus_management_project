// import React from "react";
// import Login from "./Login";

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;



// import React, { useState, useEffect } from "react";
// import Login from "./Login";
// import AdminLogin from "./admin/admin_login";
// import AdminDashboard from "./admin/AdminDashboard";

// function App() {
//   const [page, setPage] = useState("student");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // 👇 Check URL
//   useEffect(() => {
//     if (window.location.pathname.includes("admin")) {
//       setPage("admin"); // open admin login
//     } else {
//       setPage("student"); // default student login
//     }
//   }, []);

//   return (
//     <div>

//       {/* 🔹 Login / Dashboard */}
//       {isLoggedIn ? (
//         <AdminDashboard />
//       ) : page === "student" ? (
//         <Login onLogin={() => setIsLoggedIn(true)} />
//       ) : (
//         <AdminLogin onLogin={() => setIsLoggedIn(true)} />
//       )}

//     </div>
//   );
// }

// export default App;



import React, { useState } from "react";
import Login from "./Login";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";
import Register from "./Register";   // ✅ ADD THIS
import ForgotPassword from "./ForgotPassword";
// import Logout from "./student/Logout";
import FacultyDashboard from "./faculty/FacultyDashboard";


function App() {
  const [role, setRole] = useState("");
  const [page, setPage] = useState("login");   // ✅ ADD THIS

  // 🔹 SHOW REGISTER PAGE
  if (page === "register") {
    return <Register goLogin={() => setPage("login")} />;
  }

  // 🔹 SHOW FORGOT PASSWORD PAGE
  if (page === "forgot") {
    return <ForgotPassword goLogin={() => setPage("login")} />;
  }

  // 🔹 If not logged in → show login
  if (!role) {
    return (
      <Login
        onLogin={setRole}
        goToRegister={() => setPage("register")}
        goToForgot={() => setPage("forgot")} // ✅ ADDED
      />
    );
  }

  // 🔹 Role-based dashboard
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "faculty") {
    return <FacultyDashboard />;
  }

  if (role === "student") {
    return <StudentDashboard />;
  }
}

{/* <Route path="/Logout" element={<Logout />} /> */}
export default App;