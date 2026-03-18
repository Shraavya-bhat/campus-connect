import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import EventPage from "./EventPageNew";
function App() {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    image: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
    setFilteredEvents(data);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEvents(filtered);
  };

  const handleFilter = (category) => {
    setCategoryFilter(category);

    if (category === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.category === category);
      setFilteredEvents(filtered);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createEvent = async () => {
    await fetch("http://localhost:5000/api/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    setFormData({
      title: "",
      description: "",
      category: "",
      date: "",
      location: "",
      image: ""
    });

    fetchEvents();
  };

  const handleRSVP = async (id) => {
    await fetch(`http://localhost:5000/api/events/rsvp/${id}`, {
      method: "PUT"
    });

    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    await fetch(`http://localhost:5000/api/events/delete/${id}`, {
      method: "DELETE"
    });

    fetchEvents();
  };

  return (
    <Routes>

      <Route path="/" element={
        <div className="container">

          <h1 className="title">CampusConnect</h1>
          <p>Discover and manage campus events easily.</p>

          <input
            placeholder="Search events..."
            value={search}
            onChange={handleSearch}
          />

          <div className="filters">
            <button onClick={() => handleFilter("All")}>All</button>
            <button onClick={() => handleFilter("Technical")}>Technical</button>
            <button onClick={() => handleFilter("Cultural")}>Cultural</button>
            <button onClick={() => handleFilter("Sports")}>Sports</button>
          </div>

          <h2>Create Event</h2>

          <div className="form">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
            <input name="date" type="date" value={formData.date} onChange={handleChange} />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
            <input name="image" placeholder="Event Poster Image URL" value={formData.image} onChange={handleChange} />

            <button onClick={createEvent}>Create Event</button>
          </div>

          <h2>Upcoming Events ({filteredEvents.length})</h2>

          {filteredEvents.map((event) => (
            <div
  key={event._id}
  className="card"
  style={{
    maxWidth: "600px",
    margin: "20px auto",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }}
>

              <Link to={`/event/${event._id}`} style={{ textDecoration: "none", color: "black" }}>

                {event.image && (
  <img
    src={event.image}
    alt="event"
    style={{
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "10px"
    }}
  />
)}

                <h3>🎉 {event.title}</h3>
              </Link>

              <p>{event.description}</p>

              <p><b>Category:</b> {event.category}</p>
              <p><b>Date:</b> {new Date(event.date).toDateString()}</p>
              <p><b>📍 Location:</b> {event.location}</p>
              <p><b>RSVP Count:</b> {event.rsvpCount}</p>

              <button onClick={() => handleRSVP(event._id)}>RSVP</button>
              <button onClick={() => deleteEvent(event._id)} style={{ background: "red" }}>
                Delete
              </button>

            </div>
          ))}

        </div>
      } />

      <Route path="/event/:id" element={<EventPage />} />

    </Routes>
  );
}

export default App;