import React, { useEffect, useState } from "react";

function FacultyNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/faculty/notifications");
      let data = await res.json();

      data = data.filter(
        (n) => n.target === "all" || n.target === "faculty"
      );

      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <style>{`

        body {
          background: #f4f6fb;
        }

        .container {
          padding: 25px;
          max-width: 900px;
          margin: auto;
        }

        /* HEADER */
        .header {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          padding: 18px 20px;
          border-radius: 14px;
          margin-bottom: 20px;
          box-shadow: 0 10px 25px rgba(59,130,246,0.3);
        }

        .header h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 0.5px;
        }

        .header p {
          margin: 5px 0 0;
          font-size: 12px;
          opacity: 0.9;
        }

        /* FEED */
        .feed {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card {
          background: #fff;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          display: flex;
          gap: 12px;
          transition: 0.2s ease;
          position: relative;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        /* LEFT DOT (timeline feel) */
        .dot {
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* CONTENT */
        .content {
          flex: 1;
        }

        .msg {
          font-size: 15px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 6px;
        }

        .meta {
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* BADGES */
        .badge {
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 20px;
          color: white;
          text-transform: capitalize;
        }

        .reminder { background: #10b981; }
        .alert { background: #ef4444; }

        /* TIME STYLE */
        .time {
          font-size: 11px;
          color: #9ca3af;
        }

        /* EMPTY */
        .empty {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }

      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h2>📢 Faculty Notification Center</h2>
          <p>All updates from administration & faculty announcements</p>
        </div>

        {/* FEED */}
        {notifications.length === 0 ? (
          <div className="empty">No notifications found</div>
        ) : (
          <div className="feed">

            {notifications.map((n) => (
              <div className="card" key={n.notification_id}>

                <div className="dot"></div>

                <div className="content">

                  <div className="msg">
                    {n.message}
                  </div>

                  <div className="meta">

                    <span className={`badge ${n.type}`}>
                      {n.type}
                    </span>

                    <span className="time">
                      {new Date(n.created_at).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default FacultyNotification;