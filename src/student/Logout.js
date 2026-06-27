import React, { useEffect } from "react";

function Logout() {

  useEffect(() => {
    // ✅ Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Redirect to home/login
    window.location.href = "/";
  }, []);

  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px"
    }}>
      <h2 style={{ color: "red" }}>Logging out...</h2>
      <p>Please wait...</p>
    </div>
  );
}

export default Logout;