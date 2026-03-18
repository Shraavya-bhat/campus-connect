import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<h1 style={{color: "red"}}>NOW WORKING 🔥</h1>

function EventPage() {

  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();

    const found = data.find(e => e._id === id);
    setEvent(found);
  };

  if (!event) return <p>Loading...</p>;

  return (
  <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>

    {event.image && (
  <img
    src={event.image}
    alt="event"
    style={{
      width: "100%",
      maxWidth: "800px",
      height: "300px",
      objectFit: "cover",
      borderRadius: "10px",
      display: "block",
      margin: "0 auto"
    }}
  />
)}

    <h1>{event.title}</h1>

    <p>{event.description}</p>

    <p><b>Category:</b> {event.category}</p>
    <p><b>Date:</b> {new Date(event.date).toDateString()}</p>
    <p><b>📍 Location:</b> {event.location}</p>

    <p><b>RSVP Count:</b> {event.rsvpCount}</p>

  </div>
);
}
export default EventPage;
