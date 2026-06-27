import React, { useEffect } from "react";

function Logout() {

  useEffect(() => {
    // clear data (optional)
    localStorage.clear();

    // redirect to login page
    window.location.href = "/";
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging out...</h2>
    </div>
  );
}

export default Logout;