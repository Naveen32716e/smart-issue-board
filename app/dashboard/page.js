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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
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

  // 🔐 Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // 🧠 Create Issue with SIMILAR ISSUE HANDLING
  const createIssue = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    // 🔍 SIMILAR ISSUE CHECK (APPROACH 2)
    const isSimilar = issues.some((issue) =>
      issue.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(issue.title.toLowerCase())
    );

    if (isSimilar) {
      const proceed = window.confirm(
        "A similar issue already exists. Do you want to continue creating this issue?"
      );
      if (!proceed) return;
    }

    await addDoc(collection(db, "issues"), {
      title,
      description,
      priority,
      status: "Open",
      createdBy: auth.currentUser?.email,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    fetchIssues();
  };

  // 🔄 Status update with rule enforcement
  const updateStatus = async (id, oldStatus, newStatus) => {
    if (oldStatus === "Open" && newStatus === "Done") {
      alert("Issue must move to 'In Progress' before 'Done'");
      return;
    }

    await updateDoc(doc(db, "issues", id), {
      status: newStatus,
    });

    fetchIssues();
  };

  // 🔎 Apply filters
  const filteredIssues = issues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (priorityFilter === "All" || issue.priority === priorityFilter)
  );

  return (
    <div className="container py-4">

      {/* NAVBAR */}
      <nav className="navbar navbar-light bg-white shadow-sm mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Smart Issue Board</span>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted">
              {auth.currentUser?.email}
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CREATE ISSUE */}
      <div className="card shadow p-4 mb-4">
        <h5>Create Issue</h5>

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

        <select
          className="form-select mb-3"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="btn btn-primary" onClick={createIssue}>
          Create Issue
        </button>
      </div>

      {/* FILTERS */}
      <div className="row mb-3">
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

      {/* ISSUE LIST */}
      <div className="row">
        {filteredIssues.map((issue) => (
          <div className="col-md-6 mb-3" key={issue.id}>
            <div className="card shadow-sm p-3">
              <h5>{issue.title}</h5>
              <p className="text-muted">{issue.description}</p>
              <p><b>Priority:</b> {issue.priority}</p>
              <p><b>Status:</b> {issue.status}</p>

              <select
                className="form-select"
                value={issue.status}
                onChange={(e) =>
                  updateStatus(issue.id, issue.status, e.target.value)
                }
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
