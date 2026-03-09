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
    image: ""
  });

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();

    const sorted = data.sort((a, b) => b.rsvpCount - a.rsvpCount);

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

    alert("Event created successfully!");
    fetchEvents();
  };

  const handleRSVP = async (id) => {
    await fetch(`http://localhost:5000/api/events/rsvp/${id}`, {
      method: "POST",
    });

    fetchEvents();
  };

  const deleteEvent = async (id) => {

  const confirmDelete = window.confirm("Are you sure you want to delete this event?");

  if (!confirmDelete) return;

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
          placeholder="Search events by title..."
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

        <input
          name="image"
          placeholder="Event Poster Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <button type="submit">Create Event</button>
      </form>

      <h2>Upcoming Events ({filteredEvents.length})</h2>

      {filteredEvents.length === 0 && (
        <p>No events found.</p>
      )}

{filteredEvents.map((eventItem) => (
  <div key={eventItem._id} className="card">

    {eventItem.image && (
      <img
        src={eventItem.image}
        alt="event"
        style={{
          width: "100%",
          borderRadius: "8px",
          marginBottom: "10px"
        }}
      />
    )}

    <h3>🎉 {eventItem.title}</h3>

    <p>{eventItem.description}</p>

    <p>
      <b>Category:</b> {eventItem.category}
    </p>

    <p>
      <b>Date:</b> {new Date(eventItem.date).toDateString()}
    </p>

    <p>
      <b>Location:</b> {eventItem.location}
    </p>

    <p>
      <b>RSVP Count:</b> {eventItem.rsvpCount}
    </p>

    <button onClick={() => handleRSVP(eventItem._id)}>
      RSVP
    </button>

    <button
      style={{ background: "#e74c3c", marginLeft: "10px" }}
      onClick={() => deleteEvent(eventItem._id)}
    >
      Delete
    </button>

  </div>
))}
      <footer style={{ marginTop: "40px", textAlign: "center" }}>
  CampusConnect © 2026 |
  <a
    href="https://github.com/Shraavya-bhat/campus-connect"
    target="_blank"
    rel="noreferrer"
    style={{ marginLeft: "8px" }}
  >
    GitHub Repo
  </a>
</footer>
    </div>
  );
}

export default App;