import { useEffect } from "react";

function Logout() {

  useEffect(() => {
    // 🔥 Redirect to Login page
    window.location.href = "/";
  }, []);

  return (
    <h2 style={{ textAlign: "center", marginTop: "50px" }}>
      Logging out...
    </h2>
  );
}

export default Logout;