import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { FaTrashAlt } from "react-icons/fa";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");
  const [apiEvents, setApiEvents] = useState([]);

  const publicHolidays = [new Date(2024, 0, 1), new Date(2024, 11, 25)];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);


  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (
        publicHolidays.some(
          (holiday) => holiday.toDateString() === date.toDateString()
        )
      ) {
        return "holiday";
      }

      if (date.toDateString() === new Date().toDateString()) {
        return "today";
      }

      const apiEvent = apiEvents.find(
        (event) => date >= event.startDate && date <= event.endDate
      );

      if (apiEvent) {
        return "green";
      }

      if (date.getDay() === 0) {
        return "sunday";
      }

      if (date.getDay() === 6) {
        return "saturday";
      }
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventDate = date.toDateString();
      if (events[eventDate] && events[eventDate].length > 0) {
        return (
          <div className="tile-content">
            <span className="event-dot"></span>
          </div>
        );
      }
    }
    return null;
  };

  const handleAddEvent = () => {
    const eventDate = date.toDateString();
    const updatedEvents = {
      ...events,
      [eventDate]: [...(events[eventDate] || []), newEvent],
    };
    setEvents(updatedEvents);
    setNewEvent("");
  };

  const handleDeleteEvent = (eventToDelete) => {
    const eventDate = date.toDateString();
    const updatedEvents = {
      ...events,
      [eventDate]: events[eventDate].filter((event) => event !== eventToDelete),
    };
    if (updatedEvents[eventDate].length === 0) {
      delete updatedEvents[eventDate];
    }
    setEvents(updatedEvents);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}.${month}.${day} ${weekDay}`;
  };

  return (
    <div className="app-container">
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={date}
          view="month"
          locale="ko-KR"
          tileClassName={tileClassName}
          tileContent={tileContent}
          showNeighboringMonth={false}
          formatDay={(locale, date) => date.getDate()}
        />
      </div>
      <div className="sidebar">
        <h2>일정</h2>
        <div>{formatDate(date)}</div> {/* 날짜를 원하는 형식으로 표시 */}
        <textarea
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          className="event-input"
          rows="1"
        />
        <button onClick={handleAddEvent}>일정 추가</button>
        <ul className="event-list">
          {events[date.toDateString()] &&
            events[date.toDateString()].map((event, index) => (
              <li key={index} className="event-item">
                {event}
                <span
                  className="delete-icon"
                  onClick={() => handleDeleteEvent(event)}
                >
                  <FaTrashAlt />
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent;
