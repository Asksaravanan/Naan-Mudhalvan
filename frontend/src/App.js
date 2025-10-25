import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({
    email: '',
    subject: '',
    message: '',
    remindAt: ''
  });
  const [reminders, setReminders] = useState([]);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/reminders';

  useEffect(() => {
    fetchReminders();
  }, []);

  async function fetchReminders() {
    try {
      const res = await axios.get(API);
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        remindAt: new Date(form.remindAt).toISOString()
      };
      await axios.post(API, payload);
      setForm({ email: '', subject: '', message: '', remindAt: '' });
      fetchReminders();
    } catch (err) {
      console.error(err);
      alert('Failed to create reminder');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Email Reminder</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br/>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{width:'100%'}} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Subject</label><br/>
          <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} style={{width:'100%'}} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Message</label><br/>
          <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{width:'100%'}} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Remind At (local datetime)</label><br/>
          <input type="datetime-local" value={form.remindAt} onChange={e => setForm({...form, remindAt: e.target.value})} required />
        </div>
        <button type="submit">Create Reminder</button>
      </form>

      <h2>Reminders</h2>
      <ul>
        {reminders.map(r => (
          <li key={r._id} style={{ marginBottom: 6 }}>
            <strong>{r.subject}</strong> — {r.email} — {new Date(r.remindAt).toLocaleString()} — {r.sent ? 'SENT' : 'PENDING'}
            <div>{r.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
