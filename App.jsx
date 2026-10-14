import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, CalendarDays, Check, ChevronDown,
  CircleHelp, Clock3, Compass, GraduationCap, LayoutDashboard, LogOut, MapPin,
  Menu, Plus, Search, Settings2, ShieldCheck, Sparkles, Ticket, Trash2, Users,
  X, Pencil, Megaphone, CalendarCheck, Filter, RotateCcw
} from 'lucide-react'

const STORE = 'campusflow_v1'
const starterEvents = [
  { id: 'e1', title: 'TechNova Hackathon', category: 'Technology', date: '2026-10-24', time: '09:00', venue: 'Innovation Lab, Block C', organizer: 'Computer Science Club', capacity: 120, description: 'A high-energy 24-hour build sprint. Form a team, solve a real problem, and present your prototype to mentors and judges.', color: 'violet' },
  { id: 'e2', title: 'Rhythm — Cultural Night', category: 'Cultural', date: '2026-10-29', time: '17:30', venue: 'Open Air Auditorium', organizer: 'Arts & Culture Society', capacity: 300, description: 'An evening of music, dance, performances, and campus creativity. Student performances and club showcases are welcome.', color: 'pink' },
  { id: 'e3', title: 'Career Launch Workshop', category: 'Career', date: '2026-11-03', time: '10:00', venue: 'Seminar Hall 2', organizer: 'Training & Placement Cell', capacity: 80, description: 'Build a stronger placement profile with practical sessions on resumes, interview communication, and internship search strategy.', color: 'blue' },
  { id: 'e4', title: 'Green Campus Drive', category: 'Community', date: '2026-11-07', time: '07:30', venue: 'Main Gate Assembly Point', organizer: 'Eco Club', capacity: 90, description: 'Join fellow students for a campus clean-up and tree-planting morning. Gloves, tools, and refreshments will be provided.', color: 'green' },
  { id: 'e5', title: 'Design Thinking Studio', category: 'Workshop', date: '2026-11-12', time: '14:00', venue: 'Design Studio, Block A', organizer: 'Innovation Cell', capacity: 45, description: 'A hands-on introduction to empathize, define, ideate, prototype, and test. Bring a notebook and curiosity.', color: 'orange' },
  { id: 'e6', title: 'Inter-College Sports Meet', category: 'Sports', date: '2026-11-18', time: '08:00', venue: 'College Sports Ground', organizer: 'Sports Committee', capacity: 220, description: 'A day of friendly competition, team spirit, and campus pride. Check with the organizer for team-based event details.', color: 'cyan' }
]
const starterAnnouncements = [
  { id: 'a1', title: 'Welcome to CampusFlow', body: 'Discover campus events, reserve your spot, and keep your schedule in one place.', date: '2026-10-14' },
  { id: 'a2', title: 'Registration reminder', body: 'Some events have limited capacity. Register early to secure your place.', date: '2026-10-14' }
]
const seed = () => ({
  users: [
    { id: 'u-admin', name: 'Campus Admin', email: 'admin@campus.edu', password: 'Admin@123', role: 'admin', active: true },
    { id: 'u-student', name: 'Demo Student', email: 'student@campus.edu', password: 'Student@123', role: 'student', active: true }
  ],
  events: starterEvents,
  registrations: [{ id: 'r1', userId: 'u-student', eventId: 'e1', date: '2026-10-14' }],
  announcements: starterAnnouncements
})
function loadData() {
  try { return JSON.parse(localStorage.getItem(STORE)) || seed() } catch { return seed() }
}
const dateLabel = (date, time) => {
  const d = new Date(`${date}T${time || '00:00'}:00`)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
const timeLabel = t => {
  const [h, m] = (t || '00:00').split(':').map(Number)
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const categories = ['All categories', 'Technology', 'Cultural', 'Career', 'Community', 'Workshop', 'Sports', 'Other']

export default function App() {
  const [data, setData] = useState(loadData)
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem('campusflow_user')
    return loadData().users.find(u => u.id === id && u.active) || null
  })
  const [page, setPage] = useState('discover')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [availability, setAvailability] = useState('all')
  const [modal, setModal] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [eventForm, setEventForm] = useState({})
  const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '' })

  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(data)) }, [data])
  useEffect(() => { if (user) localStorage.setItem('campusflow_user', user.id); else localStorage.removeItem('campusflow_user') }, [user])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const isAdmin = user?.role === 'admin'
  const myRegistrations = data.registrations.filter(r => r.userId === user?.id)
  const registeredIds = new Set(myRegistrations.map(r => r.eventId))
  const eventCount = id => data.registrations.filter(r => r.eventId === id).length
  const filteredEvents = useMemo(() => data.events.filter(e => {
    const text = `${e.title} ${e.organizer} ${e.venue} ${e.description}`.toLowerCase()
    const matchesText = text.includes(query.toLowerCase())
    const matchesCategory = category === 'All categories' || e.category === category
    const matchesAvailability = availability === 'all' || (availability === 'available' && eventCount(e.id) < Number(e.capacity)) || (availability === 'registered' && registeredIds.has(e.id))
    return matchesText && matchesCategory && matchesAvailability
  }).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [data, query, category, availability, user])

  function updateData(patch) { setData(prev => ({ ...prev, ...patch })) }
  function notify(msg) { setToast(msg) }
  function go(next) { setPage(next); setMobileNav(false); setModal(null) }
  function logout() { setUser(null); setPage('discover'); notify('You have signed out.') }
  function submitAuth(e) {
    e.preventDefault()
    const email = authForm.email.trim().toLowerCase()
    if (authMode === 'login') {
      const found = data.users.find(u => u.email.toLowerCase() === email && u.password === authForm.password && u.active)
      if (!found) return notify('Invalid details, or this account is inactive.')
      setUser(found); setPage(found.role === 'admin' ? 'dashboard' : 'discover'); setModal(null); setAuthForm({ name: '', email: '', password: '' }); notify(`Welcome back, ${found.name.split(' ')[0]}!`)
    } else {
      if (!authForm.name.trim() || authForm.password.length < 6) return notify('Enter your name and a password of at least 6 characters.')
      if (data.users.some(u => u.email.toLowerCase() === email)) return notify('An account with this email already exists.')
      const created = { id: uid(), name: authForm.name.trim(), email, password: authForm.password, role: 'student', active: true }
      updateData({ users: [...data.users, created] }); setUser(created); setPage('discover'); setModal(null); setAuthForm({ name: '', email: '', password: '' }); notify('Account created successfully.')
    }
  }
  function registerEvent(event) {
    if (!user) { setAuthMode('login'); setModal({ type: 'auth' }); return }
    if (!user.active) return notify('This account is inactive.')
    if (registeredIds.has(event.id)) return notify('You are already registered for this event.')
    if (eventCount(event.id) >= Number(event.capacity)) return notify('Sorry, this event is full.')
    updateData({ registrations: [...data.registrations, { id: uid(), userId: user.id, eventId: event.id, date: new Date().toISOString().slice(0, 10) }] })
    notify('You are registered! See you there.')
  }
  function cancelRegistration(eventId) {
    updateData({ registrations: data.registrations.filter(r => !(r.userId === user?.id && r.eventId === eventId)) })
    notify('Registration cancelled.')
  }
  function openNewEvent() {
    setEventForm({ title: '', category: 'Technology', date: '', time: '10:00', venue: '', organizer: '', capacity: 50, description: '', color: 'violet' })
    setModal({ type: 'event', editId: null })
  }
  function openEditEvent(event) { setEventForm({ ...event }); setModal({ type: 'event', editId: event.id }) }
  function saveEvent(e) {
    e.preventDefault()
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.venue.trim() || !eventForm.organizer.trim()) return notify('Please fill in all required fields.')
    const capacity = Math.max(1, Number(eventForm.capacity) || 1)
    if (modal.editId) {
      updateData({ events: data.events.map(ev => ev.id === modal.editId ? { ...eventForm, capacity, id: modal.editId } : ev) })
      notify('Event updated.')
    } else {
      updateData({ events: [...data.events, { ...eventForm, capacity, id: uid() }] })
      notify('Event created.')
    }
    setModal(null)
  }
  function deleteEvent(id) {
    if (!window.confirm('Delete this event and its registrations?')) return
    updateData({ events: data.events.filter(e => e.id !== id), registrations: data.registrations.filter(r => r.eventId !== id) })
    notify('Event deleted.')
  }
  function addAnnouncement(e) {
    e.preventDefault()
    if (!announcementForm.title.trim() || !announcementForm.body.trim()) return notify('Add both a title and announcement message.')
    updateData({ announcements: [{ ...announcementForm, id: uid(), date: new Date().toISOString().slice(0, 10) }, ...data.announcements] })
    setAnnouncementForm({ title: '', body: '' }); notify('Announcement published.')
  }
  function deleteAnnouncement(id) {
    updateData({ announcements: data.announcements.filter(a => a.id !== id) }); notify('Announcement removed.')
  }
  function toggleUser(id) {
    if (id === user.id) return notify('You cannot deactivate your own signed-in account.')
    updateData({ users: data.users.map(u => u.id === id ? { ...u, active: !u.active } : u) })
    notify('Account status updated.')
  }
  function exportCSV() {
    const rows = [['Event', 'Date', 'Time', 'Venue', 'Student', 'Email', 'Registered On']]
    data.registrations.forEach(r => {
      const ev = data.events.find(e => e.id === r.eventId)
      const attendee = data.users.find(u => u.id === r.userId)
      if (ev && attendee) rows.push([ev.title, ev.date, ev.time, ev.venue, attendee.name, attendee.email, r.date])
    })
    const csv = rows.map(row => row.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'campusflow-registrations.csv'; a.click(); URL.revokeObjectURL(url)
    notify('CSV export downloaded.')
  }
  function resetDemo() {
    if (!window.confirm('Reset all local demo changes to the original sample data?')) return
    const fresh = seed(); setData(fresh); setUser(fresh.users[0]); setPage('dashboard'); notify('Demo data reset.')
  }

  if (!user) return <AuthScreen mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} submit={submitAuth} onDemo={(role) => { const found = data.users.find(u => u.email === (role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu')); if (found) { setUser(found); setPage(role === 'admin' ? 'dashboard' : 'discover'); notify('Demo session started.') } }} toast={toast} />

  const nav = isAdmin ? [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'manage', label: 'Manage events', icon: CalendarDays },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'users', label: 'User accounts', icon: ShieldCheck }
  ] : [
    { id: 'discover', label: 'Discover events', icon: Compass },
    { id: 'my-events', label: 'My registrations', icon: Ticket },
    { id: 'announcements', label: 'Announcements', icon: Bell }
  ]

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><CalendarDays size={21}/></div><div><strong>CampusFlow</strong><span>EVENTS, IN SYNC</span></div><button className="icon-button sidebar-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="campus-card"><div className="campus-icon"><GraduationCap size={20}/></div><div><strong>Campus community</strong><small>{isAdmin ? 'Administrator access' : 'Student portal'}</small></div><ChevronDown size={15}/></div>
      <nav className="nav-list">{nav.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => go(item.id)}><item.icon size={18}/><span>{item.label}</span>{item.id === 'my-events' && myRegistrations.length > 0 && <b className="nav-count">{myRegistrations.length}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Make the most of campus life.</p><button onClick={() => notify('For help, contact your campus event coordinator.')}>Help center <ArrowRight size={14}/></button></div><div className="user-mini"><div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div><div className="user-meta"><strong>{user.name}</strong><span>{isAdmin ? 'Administrator' : 'Student account'}</span></div><button className="icon-button" title="Sign out" onClick={logout}><LogOut size={17}/></button></div></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumbs">Workspace <span>/</span> <strong>{nav.find(n => n.id === page)?.label || page}</strong></div><div className="topbar-right"><div className="today-pill"><span className="live-dot"/>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div><button className="notification-button" title="Announcements" onClick={() => go('announcements')}><Bell size={18}/>{data.announcements.length > 0 && <i/>}</button><div className="top-avatar">{user.name.slice(0, 1).toUpperCase()}</div></div></header>
      <div className="page-content">
        {page === 'discover' && <><div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR CAMPUS, YOUR CALENDAR</div><h1>Find your next <span>big moment.</span></h1><p className="subtitle">Discover experiences, meet your people, and make college count.</p></div><div className="welcome-illustration"><div className="illus-ring ring-one"/><div className="illus-ring ring-two"/><CalendarDays size={44}/><span className="illus-star">✦</span></div></div><div className="hero-strip"><div><span className="hero-kicker">UP NEXT ON CAMPUS</span><h2>Good things happen when you show up.</h2><p>From skill-building workshops to nights you'll remember.</p><button className="hero-link" onClick={() => document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' })}>Explore events <ArrowRight size={15}/></button></div><div className="hero-art"><div className="art-sun"/><div className="art-card card-back"><CalendarDays size={23}/></div><div className="art-card card-front"><span>OCT</span><strong>24</strong><small>HACK DAY</small></div><div className="art-spark">✳</div></div></div><div className="section-heading" id="event-list"><div><h2>Explore events</h2><p>Find something worth putting on your calendar.</p></div><span className="result-count">{filteredEvents.length} events</span></div><div className="filters"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events, venues, organizers..." /></div><div className="select-wrap"><Filter size={15}/><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div><div className="select-wrap"><select value={availability} onChange={e => setAvailability(e.target.value)}><option value="all">Any availability</option><option value="available">Seats available</option><option value="registered">I'm registered</option></select></div></div>{filteredEvents.length ? <div className="event-grid">{filteredEvents.map(e => <EventCard key={e.id} event={e} count={eventCount(e.id)} registered={registeredIds.has(e.id)} onRegister={() => registerEvent(e)} onCancel={() => cancelRegistration(e.id)} onDetails={() => setModal({ type: 'details', event: e })}/>)}</div> : <Empty title="No events found" text="Try changing your search or filters." action="Clear filters" onAction={() => { setQuery(''); setCategory('All categories'); setAvailability('all') }}/>}</>}

        {page === 'my-events' && <><PageTitle eyebrow="YOUR CAMPUS CALENDAR" title="My registrations" subtitle="Everything you've signed up for, all in one place."/><div className="stats-row compact-stats"><Stat icon={Ticket} label="Registered events" value={myRegistrations.length} tone="purple"/><Stat icon={CalendarCheck} label="Upcoming events" value={myRegistrations.filter(r => (data.events.find(e => e.id === r.eventId)?.date || '') >= new Date().toISOString().slice(0,10)).length} tone="green"/></div>{myRegistrations.length ? <div className="event-grid">{myRegistrations.map(r => data.events.find(e => e.id === r.eventId)).filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date)).map(e => <EventCard key={e.id} event={e} count={eventCount(e.id)} registered onRegister={() => registerEvent(e)} onCancel={() => cancelRegistration(e.id)} onDetails={() => setModal({ type: 'details', event: e })}/>)}</div> : <Empty title="Your calendar is waiting" text="Register for an event and it will appear here." action="Discover events" onAction={() => go('discover')}/>}</>}

        {page === 'dashboard' && isAdmin && <><PageTitle eyebrow="ADMIN CONSOLE" title="Good to see you, Admin." subtitle="Here's what's happening across your campus events." action={<button className="primary-button" onClick={openNewEvent}><Plus size={17}/> Create event</button>}/><div className="stats-row"><Stat icon={CalendarDays} label="Total events" value={data.events.length} note="Across all categories" tone="purple"/><Stat icon={Users} label="Registered attendees" value={data.registrations.length} note="All event registrations" tone="blue"/><Stat icon={Activity} label="Active accounts" value={data.users.filter(u=>u.active).length} note="Students and admins" tone="green"/><Stat icon={Ticket} label="Seats filled" value={`${data.events.length ? Math.round(data.events.reduce((sum,e)=>sum+eventCount(e.id),0)/Math.max(1,data.events.reduce((sum,e)=>sum+Number(e.capacity),0))*100) : 0}%`} note="Overall event capacity" tone="orange"/></div><div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><h3>Event performance</h3><p>Registrations by event</p></div><button className="text-button" onClick={() => go('manage')}>Manage all <ArrowRight size={14}/></button></div>{data.events.slice().sort((a,b)=>eventCount(b.id)-eventCount(a.id)).slice(0,5).map(e=><div className="performance-row" key={e.id}><div className={`mini-event-icon ${e.color}`}><CalendarDays size={17}/></div><div className="performance-main"><div><strong>{e.title}</strong><span>{eventCount(e.id)} / {e.capacity} seats</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100,eventCount(e.id)/Math.max(1,e.capacity)*100)}%`}}/></div></div></div>)}</section><section className="panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Keep your campus in sync</p></div><Settings2 size={19} className="muted-icon"/></div><button className="quick-action" onClick={openNewEvent}><span className="quick-icon purple"><Plus size={18}/></span><span><strong>Create a new event</strong><small>Publish a campus experience</small></span><ArrowRight size={16}/></button><button className="quick-action" onClick={() => go('registrations')}><span className="quick-icon blue"><Users size={18}/></span><span><strong>View registrations</strong><small>Check the attendee list</small></span><ArrowRight size={16}/></button><button className="quick-action" onClick={() => go('announcements')}><span className="quick-icon orange"><Megaphone size={18}/></span><span><strong>Post an announcement</strong><small>Share an important update</small></span><ArrowRight size={16}/></button></section></div><section className="panel recent-panel"><div className="panel-heading"><div><h3>Upcoming schedule</h3><p>Your next campus moments</p></div><button className="text-button" onClick={() => go('manage')}>View all <ArrowRight size={14}/></button></div><EventTable events={data.events.filter(e=>e.date >= new Date().toISOString().slice(0,10)).slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4)} count={eventCount} admin onEdit={openEditEvent} onDelete={deleteEvent}/></section></>}

        {page === 'manage' && isAdmin && <><PageTitle eyebrow="EVENT OPERATIONS" title="Manage events" subtitle="Create, update, and keep every campus event organized." action={<button className="primary-button" onClick={openNewEvent}><Plus size={17}/> Create event</button>}/><div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your events..."/></div><span className="result-count">{filteredEvents.length} shown</span></div><section className="panel table-panel"><EventTable events={filteredEvents} count={eventCount} admin onEdit={openEditEvent} onDelete={deleteEvent}/></section></>}

        {page === 'registrations' && isAdmin && <><PageTitle eyebrow="ATTENDEE MANAGEMENT" title="Registrations" subtitle="Track who has signed up for your campus events." action={<button className="secondary-button" onClick={exportCSV}><ArrowDownToLine size={16}/> Export CSV</button>}/><div className="stats-row compact-stats"><Stat icon={Users} label="Total registrations" value={data.registrations.length} tone="blue"/><Stat icon={CalendarDays} label="Events with signups" value={new Set(data.registrations.map(r=>r.eventId)).size} tone="purple"/></div><section className="panel table-panel"><div className="panel-heading"><div><h3>Attendee list</h3><p>Registration records across all events</p></div></div>{data.registrations.length ? <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>EVENT</th><th>EVENT DATE</th><th>REGISTERED ON</th></tr></thead><tbody>{data.registrations.map(r=>{const u=data.users.find(x=>x.id===r.userId),e=data.events.find(x=>x.id===r.eventId);if(!u||!e)return null;return <tr key={r.id}><td><div className="person-cell"><div className="avatar small-avatar">{u.name[0]}</div><div><strong>{u.name}</strong><small>{u.email}</small></div></div></td><td>{e.title}</td><td>{dateLabel(e.date,e.time)}</td><td>{dateLabel(r.date,'00:00')}</td></tr>})}</tbody></table></div> : <Empty title="No registrations yet" text="Attendees will appear here after they register."/>}</section></>}

        {page === 'announcements' && <><PageTitle eyebrow={isAdmin ? 'CAMPUS COMMUNICATIONS' : 'STAY IN THE LOOP'} title="Announcements" subtitle={isAdmin ? 'Keep students informed with timely updates.' : 'Important news and updates from your campus.'}/>{isAdmin && <section className="panel announcement-compose"><div className="panel-heading"><div><h3>Publish an announcement</h3><p>It will be visible to everyone using this browser demo.</p></div><Megaphone size={20} className="muted-icon"/></div><form onSubmit={addAnnouncement} className="announcement-form"><input value={announcementForm.title} onChange={e=>setAnnouncementForm({...announcementForm,title:e.target.value})} placeholder="Announcement title" required/><textarea value={announcementForm.body} onChange={e=>setAnnouncementForm({...announcementForm,body:e.target.value})} placeholder="Write your update..." rows="3" required/><div className="form-actions"><button className="primary-button" type="submit"><Megaphone size={16}/> Publish announcement</button></div></form></section>}<div className="announcement-list">{data.announcements.map(a=><article className="announcement-card" key={a.id}><div className="announcement-symbol"><Megaphone size={19}/></div><div className="announcement-content"><div className="announcement-meta"><span> CAMPUS UPDATE</span><time>{dateLabel(a.date,'00:00')}</time></div><h3>{a.title}</h3><p>{a.body}</p></div>{isAdmin && <button className="icon-button danger-icon" title="Delete announcement" onClick={()=>deleteAnnouncement(a.id)}><Trash2 size={17}/></button>}</article>)}{!data.announcements.length && <Empty title="All quiet for now" text="New campus announcements will appear here."/>}</div></>}

        {page === 'users' && isAdmin && <><PageTitle eyebrow="ACCESS & ACCOUNTS" title="User accounts" subtitle="Review student accounts and manage demo access." action={<button className="secondary-button" onClick={resetDemo}><RotateCcw size={16}/> Reset demo data</button>}/><section className="panel table-panel"><div className="panel-heading"><div><h3>Campus accounts</h3><p>{data.users.length} account(s) in this browser demo</p></div></div><div className="table-scroll"><table><thead><tr><th>USER</th><th>ROLE</th><th>STATUS</th><th>REGISTRATIONS</th><th>ACTION</th></tr></thead><tbody>{data.users.map(u=><tr key={u.id}><td><div className="person-cell"><div className="avatar small-avatar">{u.name[0]}</div><div><strong>{u.name}</strong><small>{u.email}</small></div></div></td><td><span className={`role-pill ${u.role}`}>{u.role}</span></td><td><span className={`status-pill ${u.active?'active':'inactive'}`}><i/>{u.active?'Active':'Inactive'}</span></td><td>{data.registrations.filter(r=>r.userId===u.id).length}</td><td><button className={`small-action ${u.active?'deactivate':''}`} disabled={u.id===user.id} onClick={()=>toggleUser(u.id)}>{u.active?'Deactivate':'Activate'}</button></td></tr>)}</tbody></table></div><p className="security-note"><ShieldCheck size={16}/> Demo-only account management. Production role permissions must be enforced by a backend.</p></section></>}
      </div>
      <footer className="footer"><span>© 2026 CampusFlow</span><span>Made for better campus experiences <span className="footer-heart">✦</span></span></footer>
    </main>
    {modal?.type === 'auth' && <Modal title="Welcome back" onClose={() => setModal(null)}><AuthForm mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} submit={submitAuth}/></Modal>}
    {modal?.type === 'event' && <Modal title={modal.editId ? 'Edit event' : 'Create an event'} subtitle="Add the details students need to join in." onClose={() => setModal(null)} wide><form className="event-form" onSubmit={saveEvent}><label>Event title *<input value={eventForm.title||''} onChange={e=>setEventForm({...eventForm,title:e.target.value})} placeholder="e.g. Campus Tech Summit" required/></label><div className="form-grid"><label>Category<select value={eventForm.category||'Technology'} onChange={e=>setEventForm({...eventForm,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Organizer *<input value={eventForm.organizer||''} onChange={e=>setEventForm({...eventForm,organizer:e.target.value})} placeholder="Club or department" required/></label><label>Date *<input type="date" value={eventForm.date||''} onChange={e=>setEventForm({...eventForm,date:e.target.value})} required/></label><label>Start time<input type="time" value={eventForm.time||'10:00'} onChange={e=>setEventForm({...eventForm,time:e.target.value})} required/></label><label>Venue *<input value={eventForm.venue||''} onChange={e=>setEventForm({...eventForm,venue:e.target.value})} placeholder="Building, room, or ground" required/></label><label>Capacity<input type="number" min="1" value={eventForm.capacity||1} onChange={e=>setEventForm({...eventForm,capacity:e.target.value})} required/></label></div><label>Description<textarea rows="4" value={eventForm.description||''} onChange={e=>setEventForm({...eventForm,description:e.target.value})} placeholder="What should attendees know?"/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="primary-button"><Check size={16}/>{modal.editId?'Save changes':'Create event'}</button></div></form></Modal>}
    {modal?.type === 'details' && <Modal title="Event details" onClose={()=>setModal(null)}><div className="detail-hero"><div className={`event-art ${modal.event.color}`}><CalendarDays size={36}/><span>{modal.event.category}</span></div><h2>{modal.event.title}</h2><p>{modal.event.description || 'More information will be shared by the organizer.'}</p><div className="detail-line"><CalendarDays size={17}/><span>{dateLabel(modal.event.date,modal.event.time)} · {timeLabel(modal.event.time)}</span></div><div className="detail-line"><MapPin size={17}/><span>{modal.event.venue}</span></div><div className="detail-line"><Users size={17}/><span>{eventCount(modal.event.id)} of {modal.event.capacity} seats filled</span></div><div className="detail-line"><GraduationCap size={17}/><span>Organized by {modal.event.organizer}</span></div><button className={`primary-button full-button ${registeredIds.has(modal.event.id)?'muted-button':''}`} onClick={()=>registeredIds.has(modal.event.id)?cancelRegistration(modal.event.id):registerEvent(modal.event)}>{registeredIds.has(modal.event.id)?'Cancel registration':eventCount(modal.event.id)>=Number(modal.event.capacity)?'Event full':'Register for event'} <ArrowRight size={16}/></button></div></Modal>}
    {toast && <div className="toast"><span className="toast-check"><Check size={14}/></span>{toast}<button onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>
}

function AuthScreen({ mode, setMode, form, setForm, submit, onDemo, toast }) {
  return <div className="auth-shell"><div className="auth-left"><div className="brand auth-brand"><div className="brand-mark"><CalendarDays size={21}/></div><div><strong>CampusFlow</strong><span>EVENTS, IN SYNC</span></div></div><div className="auth-copy"><div className="eyebrow light"><Sparkles size={14}/> MAKE CAMPUS COUNT</div><h1>Your campus life,<br/><span>well scheduled.</span></h1><p>Discover the events that spark ideas, create connections, and make your college years unforgettable.</p><div className="auth-visual"><div className="auth-orbit orbit-a"/><div className="auth-orbit orbit-b"/><div className="auth-calendar"><div className="auth-calendar-top">CAMPUSFLOW <span>✦</span></div><div className="auth-calendar-date"><small>OCTOBER</small><strong>24</strong><span>TECHNOVA HACKATHON</span></div><div className="auth-calendar-bottom"><span/><span/><span/><span/><span/></div></div><div className="floating-chip chip-one"><Users size={15}/> Meet your people</div><div className="floating-chip chip-two"><CalendarCheck size={15}/> Your next big moment</div></div></div><div className="auth-foot">A little more organized. A lot more involved.</div></div><div className="auth-right"><div className="auth-mobile-brand"><div className="brand-mark"><CalendarDays size={20}/></div><strong>CampusFlow</strong></div><div className="auth-form-wrap"><div className="auth-heading"><span className="auth-step">{mode==='login'?'WELCOME BACK':'GET STARTED'}</span><h2>{mode==='login'?'Sign in to your space':'Create your account'}</h2><p>{mode==='login'?'Pick up where campus life left off.':'Join your campus community and find your next event.'}</p></div><AuthForm mode={mode} setMode={setMode} form={form} setForm={setForm} submit={submit}/><div className="demo-divider"><span>OR TRY A DEMO ACCOUNT</span></div><div className="demo-buttons"><button onClick={()=>onDemo('student')}><div className="demo-avatar student-demo"><GraduationCap size={17}/></div><span><strong>Student demo</strong><small>Explore and register</small></span><ArrowRight size={16}/></button><button onClick={()=>onDemo('admin')}><div className="demo-avatar admin-demo"><ShieldCheck size={17}/></div><span><strong>Admin demo</strong><small>Manage campus events</small></span><ArrowRight size={16}/></button></div><p className="auth-legal">By continuing, you agree to use this demo responsibly. <br/>Your demo data stays in this browser.</p></div></div>{toast&&<div className="toast auth-toast">{toast}</div>}</div>
}
function AuthForm({ mode, setMode, form, setForm, submit }) {
  return <form className="auth-form" onSubmit={submit}>{mode==='signup'&&<label>Full name<div className="input-icon"><Users size={16}/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required/></div></label>}<label>Email address<div className="input-icon"><span className="at-icon">@</span><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@college.edu" required/></div></label><label>Password<div className="input-icon"><ShieldCheck size={16}/><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={mode==='signup'?'At least 6 characters':'Enter your password'} minLength={mode==='signup'?6:1} required/></div></label><button className="primary-button auth-submit" type="submit">{mode==='login'?'Sign in':'Create account'} <ArrowRight size={16}/></button><p className="switch-auth">{mode==='login'?"New to CampusFlow?":"Already have an account?"} <button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Create an account':'Sign in'}</button></p></form>
}
function EventCard({ event, count, registered, onRegister, onCancel, onDetails }) {
  const seats = Math.max(0, Number(event.capacity)-count)
  return <article className="event-card"><div className={`event-art ${event.color}`}><div className="event-art-shape"/><div className="event-date-badge"><span>{new Date(`${event.date}T12:00:00`).toLocaleDateString('en-IN',{month:'short'}).toUpperCase()}</span><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong></div><span className="event-category">{event.category}</span><CalendarDays className="event-art-icon" size={34}/></div><div className="event-card-body"><div className="event-card-top"><span className="organizer-label">{event.organizer}</span><button className="icon-button more-button" onClick={onDetails} aria-label="View details"><ArrowRight size={16}/></button></div><h3>{event.title}</h3><div className="event-meta"><span><Clock3 size={15}/>{timeLabel(event.time)} · {dateLabel(event.date,event.time)}</span><span><MapPin size={15}/>{event.venue}</span></div><p className="event-description">{event.description}</p><div className="event-card-bottom"><div className="seat-info"><div className="seat-bar"><span style={{width:`${Math.min(100,count/Math.max(1,Number(event.capacity))*100)}%`}}/></div><span>{seats===0?'Fully booked':`${seats} seats left`}</span></div><button className={`register-button ${registered?'registered':''}`} disabled={!registered && seats===0} onClick={registered?onCancel:onRegister}>{registered?<><Check size={15}/> Registered</>:seats===0?'Full':<>Join event <ArrowRight size={14}/></>}</button></div></div></article>
}
function PageTitle({ eyebrow, title, subtitle, action }) { return <div className="page-title-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action}</div> }
function Stat({ icon: Icon, label, value, note, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div></div> }
function Empty({ title, text, action, onAction }) { return <div className="empty-state"><div className="empty-icon"><CalendarDays size={25}/></div><h3>{title}</h3><p>{text}</p>{action&&<button className="secondary-button" onClick={onAction}>{action} <ArrowRight size={15}/></button>}</div> }
function EventTable({ events, count, admin, onEdit, onDelete }) {
  if (!events.length) return <Empty title="No events to show" text="Create an event or change your search."/>
  return <div className="table-scroll"><table><thead><tr><th>EVENT</th><th>DATE & TIME</th><th>VENUE</th><th>REGISTRATIONS</th>{admin&&<th>ACTIONS</th>}</tr></thead><tbody>{events.map(e=><tr key={e.id}><td><div className="event-table-name"><span className={`table-event-icon ${e.color}`}><CalendarDays size={16}/></span><div><strong>{e.title}</strong><small>{e.organizer}</small></div></div></td><td><strong>{dateLabel(e.date,e.time)}</strong><small className="table-sub">{timeLabel(e.time)}</small></td><td><span className="venue-cell"><MapPin size={14}/>{e.venue}</span></td><td><div className="registration-cell"><span>{count(e.id)} / {e.capacity}</span><div className="mini-progress"><i style={{width:`${Math.min(100,count(e.id)/Math.max(1,e.capacity)*100)}%`}}/></div></div></td>{admin&&<td><div className="table-actions"><button className="icon-button" title="Edit event" onClick={()=>onEdit(e)}><Pencil size={15}/></button><button className="icon-button danger-icon" title="Delete event" onClick={()=>onDelete(e.id)}><Trash2 size={15}/></button></div></td>}</tr>)}</tbody></table></div>
}
function Modal({ title, subtitle, onClose, children, wide }) {
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className={`modal ${wide?'modal-wide':''}`} role="dialog" aria-modal="true"><div className="modal-header"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose}><X size={19}/></button></div>{children}</div></div>
}
