//frontend/src/pages/agent/AgentDashboardPage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AgentDashboardPage = () => {
  const { auth } = useContext(AuthContext);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState({}); // FIX 1: Set initial state to empty object
  const [sseConnection, setSseConnection] = useState(null);

  const config = {
    headers: {
      'Authorization': `Bearer ${auth.token}`
    }
  };

  // --- 1. Fetch Agent Details and Assigned Complaints ---
  useEffect(() => {
    const fetchData = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, config);
        setAgentDetails(userResponse.data);

        const complaintsResponse = await axios.get(`${API_BASE_URL}/agent/my-complaints`, config);
        setAssignedComplaints(complaintsResponse.data);

      } catch (error) {
        console.error("Failed to fetch agent data:", error);
        toast.error("Failed to load dashboard data.");
        setAgentDetails({}); // Set empty object on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location Permission Granted!");
        },
        (error) => {
          console.warn("Location Permission Denied/Error:", error);
          // toast.error("Please allow location access for navigation."); // Toast ko hata dete hain taki woh prompt ko disturb na kare
        },
        // FIX: options object add karte hain taaki browser ko prompt dikhana pade
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // Koi cached location use na ho
        }
      );
    }

  }, [auth.token]);


  // --- 2. SSE Listener Setup for Real-time Assignment ---
  useEffect(() => {
    if (!auth.email || !auth.token) return;

    // FIX 2: SSE URL mein token query param se bhej rahe hain
    const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;

    if (sseConnection) {
      sseConnection.close();
      setSseConnection(null);
    }

    const eventSource = new EventSource(sseUrl);
    setSseConnection(eventSource);

    eventSource.onopen = () => {
      console.log("SSE Connection established for Agent.");
    };

    eventSource.addEventListener("agent_assigned", (event) => {
      const newAssignment = JSON.parse(event.data);

      if (newAssignment.agent && newAssignment.agent.email === auth.email) {
        toast.success(`🎉 NEW COMPLAINT ASSIGNED: ${newAssignment.ticketId}!`);

        setAssignedComplaints(prevComplaints => [newAssignment, ...prevComplaints]);
      }
    });

    eventSource.onerror = (err) => {
      console.error("EventSource failed for Agent:", err);
      eventSource.close();
      setSseConnection(null);
    };

    // Cleanup
    return () => {
      console.log("Closing SSE Connection for Agent.");
      eventSource.close();
    };

  }, [auth.email, auth.token]);


  if (loading) {
    return <p>Loading Agent Dashboard...</p>;
  }

  // FIX 3: Robust check for agentDetails
  if (!agentDetails || !agentDetails.id) {
    return <p>Error: Could not load Agent details. Please log in again.</p>;
  }

  const totalAssigned = assignedComplaints.length;
  const pendingCount = assignedComplaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Agent Dashboard: {agentDetails.name}</h1>
      <p><strong>Employee ID:</strong> {agentDetails.employeeId} |
        <strong>Division:</strong> {agentDetails.division} |
        <strong>Status:</strong> <span style={{ color: pendingCount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>{pendingCount > 0 ? 'ON DUTY' : 'AVAILABLE'}</span></p>

      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={cardStyle}>
          <h3>Total Assigned: {totalAssigned}</h3>
        </div>
        <div style={cardStyle}>
          <h3>Pending Complaints: {pendingCount}</h3>
        </div>
      </div>

      <h2>My Assigned Complaints ({pendingCount})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={tableHeaderStyle}>Ticket ID</th>
            <th style={tableHeaderStyle}>Category</th>
            <th style={tableHeaderStyle}>Location</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedComplaints.length > 0 ? (
            assignedComplaints.map(complaint => (
              <tr key={complaint.id}>
                <td style={tableCellStyle}>{complaint.ticketId}</td>
                <td style={tableCellStyle}>{complaint.category}</td>
                <td style={tableCellStyle}>{complaint.location ? complaint.location.substring(0, 30) + '...' : 'N/A'}</td>
                <td style={{ ...tableCellStyle, color: complaint.status === 'Resolved' ? 'green' : 'red', fontWeight: 'bold' }}>{complaint.status}</td>
                <td style={tableCellStyle}>
                  <Link to={`/agent/complaint/${complaint.id}`} style={{ color: '#007bff' }}>View/Update</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ ...tableCellStyle, textAlign: 'center' }}>You have no complaints assigned yet. Enjoy your break! (Status: AVAILABLE)</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Simple inline styling for table
const tableHeaderStyle = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' };
const tableCellStyle = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' };
const cardStyle = { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };


export default AgentDashboardPage;