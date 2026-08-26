import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const formatDate = (date) => new Intl.DateTimeFormat('es-ES', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(new Date(date));

async function request(path, options) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación');
  return data;
}

function App() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [userId, setUserId] = useState('user-1');
  const [status, setStatus] = useState({ loading: true, error: '' });

  const loadEvents = async () => {
    try {
      setStatus({ loading: true, error: '' });
      const data = await request('/api/events');
      setEvents(data);
      setSelected((current) => data.find((event) => event.id === current?.id) || data[0] || null);
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      return;
    }
    setStatus({ loading: false, error: '' });
  };

  const loadAttendees = async (eventId) => {
    try {
      setAttendees(await request(`/api/events/${eventId}/attendees`));
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  };

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { if (selected) loadAttendees(selected.id); }, [selected]);

  const changeAttendance = async (method) => {
    if (!selected || !userId.trim()) return;
    try {
      setStatus((current) => ({ ...current, error: '' }));
      await request(`/api/events/${selected.id}/attendance`, {
        method,
        body: JSON.stringify({ userId: userId.trim() }),
      });
      await loadAttendees(selected.id);
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/">wuolah<span>.</span></a>
        <div className="topbar-meta"><span className="live-dot" /> EVENTOS EN DIRECTO</div>
      </header>

      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">AGENDA ABIERTA</p>
            <h1>Encuentra algo<br /><em>que recordar.</em></h1>
          </div>
          <p className="intro-copy">Descubre los próximos eventos y decide dónde quieres estar.</p>
        </section>

        {status.error && <div className="notice">{status.error}</div>}
        {status.loading && <div className="empty-state">Cargando eventos...</div>}
        {!status.loading && !events.length && <div className="empty-state">No hay eventos disponibles todavía.</div>}

        <section className="workspace">
          <div className="event-list">
            <div className="section-label"><span>PRÓXIMOS EVENTOS</span><strong>{events.length}</strong></div>
            {events.map((event) => (
              <button className={`event-row ${selected?.id === event.id ? 'active' : ''}`} key={event.id} onClick={() => setSelected(event)}>
                <span className="event-date">{formatDate(event.date).split(' ')[0]}<small>{formatDate(event.date).split(' ').slice(1).join(' ')}</small></span>
                <span className="event-summary"><b>{event.title}</b><small>{event.location}</small></span>
                <span className="arrow">↗</span>
              </button>
            ))}
          </div>

          {selected && <article className="event-detail">
            <div className="detail-tag">EVENTO SELECCIONADO</div>
            <h2>{selected.title}</h2>
            <p className="description">{selected.description}</p>
            <div className="facts"><div><span>CUÁNDO</span><b>{formatDate(selected.date)}</b></div><div><span>DÓNDE</span><b>{selected.location}</b></div></div>
            <div className="attendance-panel">
              <div className="panel-heading"><span>¿VAS A VENIR?</span><span className="attendee-count">{attendees.length} confirmados</span></div>
              <div className="user-action"><label htmlFor="userId">Tu ID de usuario</label><input id="userId" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="user-1" /></div>
              <div className="action-row"><button className="primary" onClick={() => changeAttendance('PUT')}>Confirmar asistencia <span>↗</span></button><button className="secondary" onClick={() => changeAttendance('DELETE')}>Cancelar</button></div>
              {attendees.length > 0 && <div className="attendees">{attendees.map((attendee) => <span key={attendee.id} title={attendee.name}>{attendee.name.slice(0, 1)}</span>)}</div>}
            </div>
          </article>}
        </section>
      </main>
      <footer><span>WUOLAH EVENTS</span><span>BUILT FOR GETTING OUT THERE</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
