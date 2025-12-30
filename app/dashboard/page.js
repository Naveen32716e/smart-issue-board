"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Data state
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Fetch issues
  const fetchIssues = async () => {
    const snapshot = await getDocs(collection(db, "issues"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setIssues(data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // Create issue with similar issue handling
  const createIssue = async () => {
    if (!title || !description) {
      alert("Please fill all required fields");
      return;
    }

    const isSimilar = issues.some(
      (issue) =>
        issue.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(issue.title.toLowerCase())
    );

    if (isSimilar) {
      const proceed = window.confirm(
        "A similar issue already exists. Do you want to continue?"
      );
      if (!proceed) return;
    }

    await addDoc(collection(db, "issues"), {
      title,
      description,
      assignedTo: assignedTo || "Not assigned",
      priority,
      status: "Open",
      createdBy: auth.currentUser?.email,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("Medium");

    fetchIssues();
  };

  // Status rule
  const updateStatus = async (id, oldStatus, newStatus) => {
    if (oldStatus === "Open" && newStatus === "Done") {
      alert("Issue must move to 'In Progress' before 'Done'");
      return;
    }

    await updateDoc(doc(db, "issues", id), { status: newStatus });
    fetchIssues();
  };

  // Filters
  const filteredIssues = issues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (priorityFilter === "All" || issue.priority === priorityFilter)
  );

  return (
    <div className="min-vh-100 py-5">
      <div className="container">

        {/* 🔥 ORANGE NAVBAR */}
        <nav
          className="navbar rounded-4 px-4 py-3 mb-4"
          style={{
            background: "linear-gradient(90deg, #ff8a00, #ffb347)",
            boxShadow: "0 10px 28px rgba(255, 138, 0, 0.35)",
          }}
        >
          <span className="fw-bold fs-4 text-white">
            Smart Issue Board
          </span>

          <div className="d-flex align-items-center gap-3">
            <span className="text-white opacity-75 small">
              {auth.currentUser?.email}
            </span>
            <button
              className="btn btn-light btn-sm fw-semibold px-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* 🧡 CREATE ISSUE */}
        <div
          className="card border-0 rounded-4 p-4 mb-4"
          style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
        >
          <h5 className="fw-bold mb-3">Create Issue</h5>

          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Assigned To (email or name)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <select
            className="form-select mb-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            className="btn text-white fw-semibold"
            style={{
              background: "linear-gradient(90deg, #ff8a00, #ffb347)",
              border: "none",
            }}
            onClick={createIssue}
          >
            Create Issue
          </button>
        </div>

        {/* 🎯 FILTERS */}
        <div className="row mb-4">
          <div className="col">
            <select
              className="form-select"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="col">
            <select
              className="form-select"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* 📦 ISSUE CARDS */}
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="mb-4">
            <div
              className="card border-0 rounded-4 p-4"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            >
              {/* PRIORITY BADGE */}
              <span
                className="badge rounded-pill px-3 py-2 mb-2"
                style={{
                  background:
                    issue.priority === "High"
                      ? "linear-gradient(90deg, #ff416c, #ff4b2b)"
                      : issue.priority === "Medium"
                      ? "linear-gradient(90deg, #ffd200, #ffea00)"
                      : "linear-gradient(90deg, #a8ff78, #78ffd6)",
                }}
              >
                {issue.priority} Priority
              </span>

              <h5 className="fw-bold mt-2">{issue.title}</h5>
              <p className="text-muted">{issue.description}</p>

              <p>
                <strong>Assigned To:</strong> {issue.assignedTo}
              </p>

              <select
                className="form-select"
                value={issue.status}
                disabled={issue.status === "Done"}
                onChange={(e) =>
                  updateStatus(issue.id, issue.status, e.target.value)
                }
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>

              {issue.status === "Done" && (
                <small className="text-muted mt-2 d-block">
                  This issue is marked as Done and cannot be changed.
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
