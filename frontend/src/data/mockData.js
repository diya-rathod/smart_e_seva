// src/data/mockData.js

export const allComplaints = [
  { 
    ticketId: 'TKT-001', 
    category: 'Water Leakage', 
    status: 'In Progress', 
    dateRaised: '28 Sep, 2025',
    description: 'Significant water pipe leakage near the community hall for the past 2 days. It is causing water logging and traffic issues.',
    photoUrl: 'https://via.placeholder.com/400x250.png?text=Leaking+Pipe',
    location: '123, Main Street, Ahmedabad',
    agent: { name: 'Ramesh Patel', contact: '+91 98765 43210' },
    timeline: [
      { step: 'Submitted', date: '28 Sep, 09:25 AM', completed: true },
      { step: 'Assigned', date: '28 Sep, 10:05 AM', completed: true },
      { step: 'In Progress', date: '28 Sep, 11:00 AM', completed: true, active: true },
      { step: 'Resolved', date: null, completed: false },
    ],
    updates: [
      { timestamp: '2025-09-28 11:00 AM', note: 'Agent has started working on the issue.' },
      { timestamp: '2025-09-28 10:05 AM', note: 'Complaint assigned to agent Ramesh Patel.' },
    ] 
  },
  { 
    ticketId: 'TKT-002', 
    category: 'Street Light Not Working', 
    status: 'Resolved', 
    dateRaised: '25 Sep, 2025',
    description: 'Street light on corner of sector 5 is not working since last week.',
    photoUrl: 'https://via.placeholder.com/400x250.png?text=Street+Light',
    location: 'Corner of Sector 5, Ahmedabad',
    agent: { name: 'Suresh Verma', contact: '+91 98765 11111' },
    timeline: [
        { step: 'Submitted', date: '25 Sep, 04:10 PM', completed: true },
        { step: 'Assigned', date: '26 Sep, 09:00 AM', completed: true },
        { step: 'In Progress', date: '26 Sep, 11:30 AM', completed: true },
        { step: 'Resolved', date: '26 Sep, 02:00 PM', completed: true, active: true },
    ],
    updates: [{ timestamp: '2025-09-26 02:00 PM', note: 'Issue has been resolved by the technical team.' }] 
  },
  { 
    ticketId: 'TKT-003', 
    category: 'Waste Management', 
    status: 'New', 
    dateRaised: '27 Sep, 2025',
    description: 'Garbage has not been collected from our society for 3 days.',
    photoUrl: 'https://via.placeholder.com/400x250.png?text=Waste+Garbage',
    location: 'Opposite Central Park, Ahmedabad',
    agent: { name: 'N/A', contact: 'N/A' },
    timeline: [
        { step: 'Submitted', date: '27 Sep, 11:00 AM', completed: true, active: true },
        { step: 'Assigned', date: null, completed: false },
        { step: 'In Progress', date: null, completed: false },
        { step: 'Resolved', date: null, completed: false },
    ],
    updates: [{ timestamp: '2025-09-27 11:00 AM', note: 'Complaint has been submitted and is awaiting assignment.' }] 
  },
];