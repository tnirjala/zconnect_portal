import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const SessionParticipants = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BACKEND_URL}/api/sessions`);
      if (!res.ok) {
        const text = await res.text(); // read raw response to help debug
        throw new Error(`Failed to fetch sessions: ${res.status} ${text}`);
      }
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (sessionId) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/participants`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch participants: ${res.status} ${text}`);
      }
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      setError(err.message);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setSearchTerm("");
    setParticipants([]);
    fetchParticipants(session.id);
  };

  const handleCancelRegistration = async (email) => {
    if (!selectedSession) return;

    if (!window.confirm(`Cancel registration for ${email}?`)) return;

    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${BACKEND_URL}/api/sessions/${selectedSession.id}/participants/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to cancel registration");
      }
      setParticipants((prev) => prev.filter((p) => p.email !== email));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!selectedSession || participants.length === 0) return;

    const filtered = filteredParticipants();

    const header = ["Name", "Email", "Registered At"];
    const rows = filtered.map((p) => [
      p.name,
      p.email,
      new Date(p.registered_at).toLocaleString(),
    ]);

    const csvContent =
      [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSession.title.replace(/\s+/g, "_")}_participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredParticipants = () => {
    if (!searchTerm.trim()) return participants;
    return participants.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sessions Participants</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Select a Session</h2>
        {loading && !sessions.length ? (
          <p>Loading sessions...</p>
        ) : (
          <select
            className="border p-2 rounded w-full"
            onChange={(e) => {
              const sessionId = e.target.value;
              const session = sessions.find((s) => s.id.toString() === sessionId);
              if (session) handleSelectSession(session);
            }}
            value={selectedSession?.id || ""}
          >
            <option value="" disabled>
              -- Select session --
            </option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title} ({new Date(session.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedSession && (
        <>
          <h2 className="font-semibold mb-2">
            Participants for "{selectedSession.title}"
          </h2>

          <div className="mb-3 flex gap-2">
            <input
              type="text"
              placeholder="Search by name or email"
              className="border p-2 rounded flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={exportCSV}
              disabled={participants.length === 0}
              className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <p>Loading participants...</p>
          ) : filteredParticipants().length === 0 ? (
            <p>No participants found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-left">Email</th>
                  <th className="border border-gray-300 p-2 text-left">Registered At</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants().map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{p.name}</td>
                    <td className="border border-gray-300 p-2">{p.email}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(p.registered_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => handleCancelRegistration(p.email)}
                        className="text-red-600 hover:underline"
                        title="Cancel Registration"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default SessionParticipants;
