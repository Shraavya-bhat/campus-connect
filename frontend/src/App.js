import React, { useEffect, useState } from "react";
import "./App.css";

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
  });

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();

    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    setEvents(sorted);
    setFilteredEvents(sorted);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (event) =>
          event.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [search, categoryFilter, events]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createEvent = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      title: "",
      description: "",
      category: "",
      date: "",
      location: "",
    });

    fetchEvents();
  };

  const handleRSVP = async (id) => {
    await fetch(`http://localhost:5000/api/events/rsvp/${id}`, {
      method: "POST",
    });

    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await fetch(`http://localhost:5000/api/events/delete/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  return (
    <div className="container">
      <h1 className="title">CampusConnect</h1>

      <div className="navbar">
        <input
          className="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          <button onClick={() => setCategoryFilter("All")}>All</button>
          <button onClick={() => setCategoryFilter("Technical")}>
            Technical
          </button>
          <button onClick={() => setCategoryFilter("Cultural")}>
            Cultural
          </button>
          <button onClick={() => setCategoryFilter("Sports")}>
            Sports
          </button>
        </div>
      </div>

      <h2>Create Event</h2>

      <form className="card" onSubmit={createEvent}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category (Technical / Cultural / Sports)"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Event</button>
      </form>

      <h2>Upcoming Events ({filteredEvents.length})</h2>

      {filteredEvents.map((event) => (
        <div key={event._id} className="card">
          <h3>{event.title}</h3>

          <p>{event.description}</p>

          <p>
            <b>Category:</b> {event.category}
          </p>

          <p>
            <b>Date:</b> {event.date}
          </p>

          <p>
            <b>Location:</b> {event.location}
          </p>

          <p>
            <b>RSVP Count:</b> {event.rsvpCount}
          </p>

          <button onClick={() => handleRSVP(event._id)}>RSVP</button>

          <button
            style={{ background: "#e74c3c", marginLeft: "10px" }}
            onClick={() => deleteEvent(event._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;