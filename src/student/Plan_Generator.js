import React, { useState, useEffect, useRef } from "react";

function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey 👋 I’m your AI Study Assistant.\nTell me your subjects + time and I’ll create a study plan 📚",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 SEND MESSAGE
  const sendMessage = async (customMsg = null) => {
    const msgText = customMsg || input;
    if (!msgText.trim()) return;

    const userMsg = { role: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msgText,
        }),
      });

      const data = await res.json();

      const aiMsg = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error talking to AI" },
      ]);
    }

    setLoading(false);
  };

  // 🔥 QUICK BUTTONS
  const quickPrompts = [
    "Make a study plan for exams in 7 days",
    "Daily timetable for 5 subjects",
    "2-hour focused study routine",
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 AI Study Planner</div>

      {/* CHAT */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageWrapper,
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.message,
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : "#ffffff",
                color: msg.role === "user" ? "white" : "#111",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <div style={styles.loading}>🤖 Typing...</div>}

        <div ref={chatEndRef} />
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.quickBox}>
        {quickPrompts.map((q, i) => (
          <button key={i} style={styles.quickBtn} onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for study plan... (e.g. 3 subjects, 5 days)"
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.sendBtn} onClick={() => sendMessage()}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default AIChatbot;

/* ================= STYLES ================= */
const styles = {
  container: {
    height: "850px",
    display: "flex",
    flexDirection: "column",
    background: "#eef2ff",
    borderRadius: "12px",
    overflow: "hidden",
  },

  header: {
    padding: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    color: "white",
  },

  chatBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  messageWrapper: {
    display: "flex",
  },

  message: {
    padding: "12px 16px",
    borderRadius: "14px",
    maxWidth: "65%",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    whiteSpace: "pre-line",
  },

  loading: {
    fontSize: "12px",
    color: "#555",
    marginLeft: "5px",
  },

  quickBox: {
    padding: "10px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    background: "#f8fafc",
    borderTop: "1px solid #ddd",
  },

  quickBtn: {
    padding: "6px 10px",
    borderRadius: "20px",
    border: "none",
    background: "#e0e7ff",
    cursor: "pointer",
    fontSize: "12px",
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    background: "white",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  sendBtn: {
    marginLeft: "10px",
    padding: "10px 15px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};