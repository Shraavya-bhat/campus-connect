import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    fetchEvents();

    setForm({
      title: "",
      description: "",
      category: "",
      date: "",
      location: ""
    });
  };

  const handleRSVP = async (id) => {
  await fetch(`http://localhost:5000/api/events/rsvp/${id}`, {
    method: "POST"
  });

  fetchEvents();
  };

  return (
    <div className="container">
      <h1>CampusConnect</h1>

      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br/><br/>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br/><br/>
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} /><br/><br/>
        <input type="date" name="date" value={form.date} onChange={handleChange} /><br/><br/>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br/><br/>

        <button type="submit">Create Event</button>
      </form>

      <h2>Upcoming Events</h2>

      {events.map(event => (
        <div key={event._id} className="card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><b>Category:</b> {event.category}</p>
          <p><b>Date:</b> {event.date}</p>
          <p><b>Location:</b> {event.location}</p>
          
          <p><b>RSVP Count:</b> {event.rsvpCount}</p>
          <button onClick={() => handleRSVP(event._id)}>
          RSVP
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;