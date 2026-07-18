"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [filterTab, setFilterTab] = useState("all");

  const fetchMessages = useCallback(async (authToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        setError(data.error || "Failed to load messages.");
        if (res.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem("admin_token");
        }
      }
    } catch (err) {
      setError("Network error. Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchMessages(savedToken);
    }
  }, [fetchMessages]);

  useEffect(() => {
    const total = messages.length;
    const unread = messages.filter((m) => !m.read).length;
    const read = total - unread;
    setStats({ total, unread, read });
  }, [messages]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        setToken(password);
        setIsLoggedIn(true);
        localStorage.setItem("admin_token", password);
        fetchMessages(password);
      } else {
        const data = await res.json();
        setLoginError(data.message || data.error || "Invalid password. Please try again.");
      }
    } catch (err) {
      setLoginError("Connection error. Could not authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read: !msg.read } : msg))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error contacting API.");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        alert("Failed to delete message.");
      }
    } catch (err) {
      alert("Error contacting API.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    setPassword("");
    localStorage.removeItem("admin_token");
    setMessages([]);
  };

  const filteredMessages = messages.filter((m) => {
    if (filterTab === "unread") return !m.read;
    if (filterTab === "read") return m.read;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <a href="/" style={{ color: "var(--accent-cyan)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Portfolio
        </a>
      </div>

      {!isLoggedIn ? (
        <div className="admin-login-wrapper">
          <div className="glass-card admin-login-card">
            <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", textAlign: "center" }}>Admin Panel</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", textAlign: "center", fontSize: "0.95rem" }}>
              Enter your administration password to view received messages.
            </p>

            <form onSubmit={handleLoginSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="admin-password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <div className="form-status error" style={{ marginTop: "1rem" }}>
                  ✖ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1.5rem" }}
              >
                {loading ? "Verifying..." : "Login Securely"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="admin-header">
            <div>
              <h1 className="text-gradient" style={{ fontSize: "2.2rem" }}>Admin Dashboard</h1>
              <p style={{ color: "var(--text-secondary)" }}>Manage your inquiries and messages</p>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="admin-stats">
            <div className="glass-card stat-card">
              <span className="stat-num" style={{ color: "var(--text-primary)" }}>{stats.total}</span>
              <span className="stat-label">Total Messages</span>
            </div>
            <div className="glass-card stat-card" style={{ borderColor: "rgba(6, 182, 212, 0.2)" }}>
              <span className="stat-num" style={{ color: "var(--accent-cyan)" }}>{stats.unread}</span>
              <span className="stat-label">Unread Messages</span>
            </div>
            <div className="glass-card stat-card" style={{ borderColor: "rgba(168, 85, 247, 0.2)" }}>
              <span className="stat-num" style={{ color: "var(--accent-purple)" }}>{stats.read}</span>
              <span className="stat-label">Read Messages</span>
            </div>
          </div>

          <div className="project-filters" style={{ justifyContent: "flex-start", marginBottom: "2rem" }}>
            <button
              className={`filter-btn ${filterTab === "all" ? "active" : ""}`}
              onClick={() => setFilterTab("all")}
            >
              All ({stats.total})
            </button>
            <button
              className={`filter-btn ${filterTab === "unread" ? "active" : ""}`}
              onClick={() => setFilterTab("unread")}
            >
              Unread ({stats.unread})
            </button>
            <button
              className={`filter-btn ${filterTab === "read" ? "active" : ""}`}
              onClick={() => setFilterTab("read")}
            >
              Read ({stats.read})
            </button>
          </div>

          {loading && <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>Loading messages...</p>}
          {error && <p style={{ color: "var(--accent-rose)", textAlign: "center" }}>Error: {error}</p>}
          
          {!loading && !error && filteredMessages.length === 0 && (
            <div className="glass-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                No messages found in this filter category.
              </p>
            </div>
          )}

          {!loading && !error && filteredMessages.length > 0 && (
            <div className="admin-messages-list">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className={`glass-card message-card ${!msg.read ? "unread" : ""}`}>
                  <div className="message-meta">
                    <div>
                      <span className="message-sender">{msg.name}</span>
                      {" • "}
                      <a href={`mailto:${msg.email}`} className="message-email">
                        {msg.email}
                      </a>
                    </div>
                    <div className="message-date">
                      {new Date(msg.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  
                  <h3 className="message-subject">{msg.subject}</h3>
                  <div className="message-body">{msg.message}</div>
                  
                  <div className="message-actions">
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
                      onClick={() => handleToggleRead(msg.id)}
                    >
                      {msg.read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", color: "var(--accent-rose)", borderColor: "rgba(244,63,94,0.2)" }}
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
