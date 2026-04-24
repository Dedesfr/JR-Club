// V1 "Authority" — Rahardja Kinetic Design System
// Structured, data-forward. Inter only. Surface bg shifts for separation.
// Primary #0056a4, no 1px dividers, xl cards, pill chips, card shadow.

const DS = {
  primary:           "#0056a4",
  primaryContainer:  "#006ecf",
  primaryFixed:      "#d5e3ff",
  primaryFixedDim:   "#a7c8ff",
  onPrimary:         "#ffffff",
  onPrimaryFixed:    "#001b3c",
  secondary:         "#376093",
  secondaryContainer:"#9fc6ff",
  tertiary:          "#8f3d00",
  tertiaryContainer: "#b55002",
  tertiaryFixed:     "#ffdbca",
  onTertiary:        "#ffffff",
  surface:           "#f7f9fb",
  surfaceDim:        "#d8dadc",
  surfaceVariant:    "#e0e3e5",
  surfaceLowest:     "#ffffff",
  surfaceLow:        "#f2f4f6",
  surfaceContainer:  "#eceef0",
  surfaceHigh:       "#e6e8ea",
  surfaceHighest:    "#e0e3e5",
  inverseSurface:    "#2d3133",
  onSurface:         "#191c1e",
  onSurfaceVariant:  "#414752",
  inverseOnSurface:  "#eff1f3",
  outline:           "#717784",
  outlineVariant:    "#c1c6d5",
  error:             "#ba1a1a",
  errorContainer:    "#ffdad6",
  onError:           "#ffffff",
};

const shadow = {
  card:   "0px 12px 32px rgba(15,23,42,0.04)",
  header: "0px 12px 32px rgba(15,23,42,0.06)",
  nav:    "0px 12px 32px rgba(15,23,42,0.12)",
  cta:    "0px 8px 16px rgba(0,86,164,0.15)",
  ctaHov: "0px 12px 24px rgba(0,86,164,0.25)",
};

const radius = { sm: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" };
const font = "'Inter', sans-serif";
const gradientCTA = "linear-gradient(135deg, #0056a4, #006ecf)";
const glass = { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" };

const v1Base = { width:"100%", height:"100%", background: DS.surface, color: DS.onSurface, fontFamily: font, fontSize: 14, overflow:"hidden", display:"flex", flexDirection:"column" };

// ── Shared Nav ────────────────────────────────────────────────
function A1Nav({ active }) {
  const links = ["Events","Dashboard","Standings","Admin"];
  return (
    <div style={{ ...glass, boxShadow: shadow.header, padding:"0 32px", display:"flex", alignItems:"center", gap:8, height:64, flexShrink:0, position:"relative", zIndex:10 }}>
      {/* Wordmark */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:16 }}>
        <div style={{ width:36, height:36, borderRadius: radius.lg, background: gradientCTA, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: shadow.cta }}>
          <span style={{ color:"#fff", fontSize:18, fontWeight:900, letterSpacing:"-0.04em" }}>JR</span>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:15, letterSpacing:"-0.01em", lineHeight:1 }}>JR Club</div>
          <div style={{ fontSize:11, color: DS.onSurfaceVariant, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase", lineHeight:1.2 }}>Event Hub</div>
        </div>
      </div>

      {links.map(l => (
        <span key={l} style={{
          fontSize:13.5, fontWeight: l===active ? 700 : 500,
          color: l===active ? DS.primary : DS.onSurfaceVariant,
          padding:"6px 14px", borderRadius: radius.full,
          background: l===active ? DS.primaryFixed : "transparent",
        }}>{l}</span>
      ))}

      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius: radius.full, background: gradientCTA, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>KP</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, lineHeight:1.2 }}>K. Putri</div>
          <div style={{ fontSize:11, color: DS.onSurfaceVariant }}>Player</div>
        </div>
      </div>
    </div>
  );
}

// Pill chip
function Pill({ children, color = DS.primary, bg = DS.primaryFixed }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius: radius.full, background: bg, color, fontSize:11, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {children}
    </span>
  );
}

// Stat cell
function StatCell({ label, value, accent = DS.primary, sub }) {
  return (
    <div style={{ padding:"18px 20px", background: DS.surfaceLowest, borderRadius: radius.xl, boxShadow: shadow.card }}>
      <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
      <div style={{ fontSize:40, fontWeight:900, color: accent, letterSpacing:"-0.03em", lineHeight:1.1, marginTop:4 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color: DS.onSurfaceVariant, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

// ── WELCOME ───────────────────────────────────────────────────
function V1Welcome() {
  const events = MOCK_EVENTS.slice(0,3);
  return (
    <div style={v1Base}>
      <A1Nav active="Events" />
      <div style={{ flex:1, overflow:"auto", padding:"32px 32px 48px", background: DS.surface }}>

        {/* Hero */}
        <div style={{ background: gradientCTA, borderRadius: radius.xl, padding:"48px 48px 52px", position:"relative", overflow:"hidden", marginBottom:24, boxShadow: shadow.cta }}>
          <div style={{ position:"absolute", top:-60, right:-80, width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
          <div style={{ position:"absolute", bottom:-80, right:60, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
          <Pill bg="rgba(255,255,255,0.2)" color="#fff">● 6 Fixtures Live · Season XII</Pill>
          <h1 style={{ fontSize:72, fontWeight:900, color:"#fff", letterSpacing:"-0.04em", lineHeight:0.95, margin:"18px 0 16px", maxWidth:680 }}>
            Corporate sport,<br />run with precision.
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.82)", lineHeight:1.65, maxWidth:520, margin:"0 0 32px" }}>
            Browse live fixtures, register for upcoming sessions, and track your standings — across Jakarta, Bekasi, and Surabaya.
          </p>
          <div style={{ display:"flex", gap:12 }}>
            <button style={{ background:"#fff", color: DS.primary, border:"none", borderRadius: radius.full, padding:"14px 28px", fontFamily: font, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow: shadow.ctaHov }}>
              Browse Events →
            </button>
            <button style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", borderRadius: radius.full, padding:"14px 28px", fontFamily: font, fontSize:14, fontWeight:600, cursor:"pointer" }}>
              My Dashboard
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          <StatCell label="Open Fixtures" value="06" sub="This week" />
          <StatCell label="Total Entrants" value="222" accent={DS.secondary} sub="↑ 18% vs Q1" />
          <StatCell label="Cities Active" value="03" accent={DS.tertiary} sub="JKT · BKS · SBY" />
          <StatCell label="Avg Turnout" value="98%" sub="Season XII" />
        </div>

        {/* Event cards */}
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.01em", margin:0 }}>Featured Fixtures</h2>
            <span style={{ fontSize:13, color: DS.primary, fontWeight:600 }}>View all →</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {events.map((e,i) => (
              <div key={e.id} style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
                <div style={{ height:160, overflow:"hidden", position:"relative" }}>
                  <img src={e.banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.5))" }} />
                  <div style={{ position:"absolute", top:12, left:12 }}>
                    <Pill bg={e.is_registered ? "#fff" : "rgba(255,255,255,0.9)"} color={e.is_registered ? DS.primary : DS.onSurfaceVariant}>
                      {e.is_registered ? "● Registered" : e.registration_is_open ? "○ Open" : "× Closed"}
                    </Pill>
                  </div>
                </div>
                <div style={{ padding:"18px 18px 20px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{e.recurrence} · {e.venue.city}</div>
                  <h3 style={{ fontSize:18, fontWeight:700, letterSpacing:"-0.01em", margin:"0 0 12px", lineHeight:1.25 }}>{e.name}</h3>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <span style={{ fontSize:13, color: DS.onSurfaceVariant }}>
                      {fmtDate(e.starts_at)} · {fmtTime(e.starts_at)}
                    </span>
                    <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface }}>{e.participants_count}/{e.max_participants}</span>
                  </div>
                  {/* fill bar */}
                  <div style={{ height:4, background: DS.surfaceContainer, borderRadius: radius.full, overflow:"hidden", marginBottom:14 }}>
                    <div style={{ height:"100%", width:`${Math.round(e.participants_count/e.max_participants*100)}%`, background: gradientCTA, borderRadius: radius.full }} />
                  </div>
                  <button style={{ width:"100%", background: gradientCTA, color:"#fff", border:"none", borderRadius: radius.full, padding:"12px", fontFamily: font, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow: shadow.cta }}>
                    {e.is_registered ? "View Briefing" : "Join Event"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EVENTS INDEX ──────────────────────────────────────────────
function V1EventsIndex() {
  const events = MOCK_EVENTS;
  const filters = ["All","Badminton","Soccer","Basketball","Tennis","Running","Finished"];
  return (
    <div style={v1Base}>
      <A1Nav active="Events" />
      <div style={{ flex:1, overflow:"auto" }}>
        {/* Page header */}
        <div style={{ padding:"28px 32px 0", background: DS.surfaceLowest, boxShadow: shadow.header }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Upcoming Fixtures · Week 17</div>
              <h1 style={{ fontSize:42, fontWeight:900, letterSpacing:"-0.03em", margin:0, lineHeight:1 }}>Events</h1>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, background: DS.surfaceContainer, borderRadius: radius.xl, padding:"10px 16px" }}>
                <span style={{ fontSize:16, color: DS.outline }}>⌕</span>
                <span style={{ fontSize:13, color: DS.outline }}>Search events…</span>
              </div>
            </div>
          </div>
          {/* Filter tabs */}
          <div style={{ display:"flex", gap:4, paddingBottom:0 }}>
            {filters.map((f,i) => (
              <span key={f} style={{
                padding:"9px 18px", borderRadius:`${radius.full} ${radius.full} 0 0`,
                background: i===0 ? DS.surface : "transparent",
                color: i===0 ? DS.primary : DS.onSurfaceVariant,
                fontWeight: i===0 ? 700 : 500, fontSize:13,
                borderBottom: i===0 ? `2px solid ${DS.primary}` : "2px solid transparent",
              }}>{f}</span>
            ))}
          </div>
        </div>

        <div style={{ padding:"24px 32px 48px", background: DS.surface }}>
          {/* Featured */}
          <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", marginBottom:20, boxShadow: shadow.card, display:"grid", gridTemplateColumns:"340px 1fr" }}>
            <div style={{ position:"relative", overflow:"hidden" }}>
              <img src={events[0].banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent 60%,rgba(255,255,255,0.95))" }} />
              <div style={{ position:"absolute", top:16, left:16 }}>
                <Pill bg="rgba(0,86,164,0.12)" color={DS.primary}>● Registered</Pill>
              </div>
            </div>
            <div style={{ padding:"28px 32px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <Pill bg={DS.primaryFixed} color={DS.onPrimaryFixed}>Monthly League</Pill>
                <Pill bg={DS.tertiaryFixed} color={DS.tertiary}>Jakarta</Pill>
              </div>
              <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:"-0.025em", margin:"0 0 8px", lineHeight:1.1 }}>{events[0].name}</h2>
              <div style={{ fontSize:14, color: DS.onSurfaceVariant, marginBottom:20, lineHeight:1.6 }}>
                {events[0].venue.name} · {fmtDay(events[0].starts_at)} {fmtDate(events[0].starts_at)} at {fmtTime(events[0].starts_at)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20, padding:"16px 0", borderTop:`1px solid ${DS.surfaceContainer}`, borderBottom:`1px solid ${DS.surfaceContainer}` }}>
                {[["Entrants",`${events[0].participants_count}/${events[0].max_participants}`],["Fill rate","87%"],["Status","Registered"]].map(([k,v],i) => (
                  <div key={i}>
                    <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em" }}>{k}</div>
                    <div style={{ fontSize:22, fontWeight:800, color: DS.onSurface, letterSpacing:"-0.02em", marginTop:4 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ background: gradientCTA, color:"#fff", border:"none", borderRadius: radius.full, padding:"12px 24px", fontFamily: font, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow: shadow.cta }}>View Briefing →</button>
                <button style={{ background: DS.surfaceLow, color: DS.onSurface, border:"none", borderRadius: radius.full, padding:"12px 24px", fontFamily: font, fontSize:13, fontWeight:600, cursor:"pointer" }}>Venue Map</button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
            {events.slice(1).map((e) => {
              const pct = Math.round(e.participants_count/e.max_participants*100);
              return (
                <div key={e.id} style={{ background: DS.surfaceLowest, borderRadius: radius.xl, padding:"18px 20px", boxShadow: shadow.card, display:"grid", gridTemplateColumns:"64px 1fr", gap:16, alignItems:"start" }}>
                  <div style={{ width:64, height:64, borderRadius: radius.lg, overflow:"hidden", background: DS.surfaceContainer, flexShrink:0 }}>
                    <img src={e.banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em" }}>{e.recurrence}</div>
                      <Pill bg={e.registration_is_open ? DS.primaryFixed : e.champion_name ? DS.tertiaryFixed : DS.surfaceHighest} color={e.registration_is_open ? DS.primary : e.champion_name ? DS.tertiary : DS.outline}>
                        {e.is_registered ? "Mine" : e.champion_name ? "Done" : e.registration_is_open ? "Open" : "Closed"}
                      </Pill>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700, letterSpacing:"-0.01em", marginBottom:8, lineHeight:1.25 }}>{e.name}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12, color: DS.onSurfaceVariant }}>
                      <span>{e.venue.city} · {fmtDate(e.starts_at)}</span>
                      <span style={{ fontWeight:600, color: DS.onSurface }}>{e.participants_count}/{e.max_participants}</span>
                    </div>
                    <div style={{ height:3, background: DS.surfaceContainer, borderRadius: radius.full, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background: gradientCTA, borderRadius: radius.full }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EVENT DETAIL ──────────────────────────────────────────────
function V1EventDetail() {
  const e = MOCK_EVENTS[0];
  return (
    <div style={v1Base}>
      <A1Nav active="Events" />
      <div style={{ flex:1, overflow:"auto" }}>
        {/* Hero */}
        <div style={{ position:"relative", height:320, overflow:"hidden" }}>
          <img src={e.banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,86,164,0.9) 100%)" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"28px 32px" }}>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <Pill bg="rgba(255,255,255,0.2)" color="#fff">● Registered</Pill>
              <Pill bg="rgba(255,255,255,0.15)" color="#fff">{e.recurrence}</Pill>
            </div>
            <h1 style={{ fontSize:52, fontWeight:900, color:"#fff", letterSpacing:"-0.035em", lineHeight:1, margin:0, textShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>{e.name}</h1>
            <div style={{ display:"flex", gap:24, marginTop:14, fontSize:13, color:"rgba(255,255,255,0.88)", fontWeight:500 }}>
              <span>📅 {fmtDay(e.starts_at)} {fmtDate(e.starts_at)} · {fmtTime(e.starts_at)}</span>
              <span>📍 {e.venue.name}, {e.venue.city}</span>
              <span>👥 {e.participants_count}/{e.max_participants} entrants</span>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:0, background: DS.surface }}>
          {/* Main */}
          <div style={{ padding:"28px 32px", borderRight:`8px solid ${DS.surface}` }}>
            {/* CTA row */}
            <div style={{ display:"flex", gap:10, marginBottom:28, padding:"20px", background: DS.surfaceLowest, borderRadius: radius.xl, boxShadow: shadow.card }}>
              <button style={{ background: gradientCTA, color:"#fff", border:"none", borderRadius: radius.full, padding:"14px 28px", fontFamily: font, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow: shadow.cta }}>✓ You're Registered</button>
              <button style={{ background: DS.surfaceLow, color: DS.onSurface, border:"none", borderRadius: radius.full, padding:"14px 24px", fontFamily: font, fontSize:13, fontWeight:600, cursor:"pointer" }}>View on Maps</button>
              <button style={{ background: DS.surfaceLow, color: DS.error, border:"none", borderRadius: radius.full, padding:"14px 24px", fontFamily: font, fontSize:13, fontWeight:600, cursor:"pointer" }}>Withdraw</button>
            </div>

            {/* Info grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:24 }}>
              {[
                ["Participant Count", `${e.participants_count} joined`, DS.primary],
                ["Registration", "Open · Closes Sun", DS.secondary],
                ["Format", "Group + Elimination", DS.tertiary],
                ["Tournament Stage", "Group Stage · R3", DS.primary],
              ].map(([k,v,c],i) => (
                <div key={i} style={{ background: DS.surfaceLowest, borderRadius: radius.xl, padding:"18px 20px", boxShadow: shadow.card, borderLeft:`4px solid ${c}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{k}</div>
                  <div style={{ fontSize:22, fontWeight:800, color: DS.onSurface, letterSpacing:"-0.015em" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Standings table */}
            <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card, marginBottom:24 }}>
              <div style={{ padding:"16px 20px", background: DS.surfaceHigh, borderBottom:`4px solid ${DS.surface}` }}>
                <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>Group A · Standings</h2>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background: DS.surfaceContainer, fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                    {["#","Player","Team","W","L","Diff","Pts"].map((h,i) => (
                      <th key={i} style={{ padding:"10px 16px", textAlign: i===0||i>=3 ? "center" : "left", fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_GROUPS[0].entries.map((r,i) => (
                    <tr key={r.id} style={{ borderTop:`4px solid ${DS.surface}`, background: i<2 ? `${DS.primaryFixed}40` : DS.surfaceLowest }}>
                      <td style={{ padding:"14px 16px", textAlign:"center", fontSize:18, fontWeight:800, color: i<2 ? DS.primary : DS.outline }}>{r.rank}</td>
                      <td style={{ padding:"14px 16px", fontWeight:600, fontSize:14 }}>{r.player}</td>
                      <td style={{ padding:"14px 16px", fontSize:12, color: DS.onSurfaceVariant }}>Engineering</td>
                      <td style={{ padding:"14px 16px", textAlign:"center", fontWeight:700, color: DS.onSurface }}>{r.wins}</td>
                      <td style={{ padding:"14px 16px", textAlign:"center", fontWeight:500, color: DS.onSurfaceVariant }}>{r.losses}</td>
                      <td style={{ padding:"14px 16px", textAlign:"center", fontWeight:700, color: r.diff>=0 ? DS.primary : DS.error }}>{r.diff>=0?"+":""}{r.diff}</td>
                      <td style={{ padding:"14px 16px", textAlign:"center", fontSize:18, fontWeight:900, color: DS.primary }}>{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Roster */}
            <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
              <div style={{ padding:"16px 20px", background: DS.surfaceHigh, borderBottom:`4px solid ${DS.surface}`, display:"flex", justifyContent:"space-between" }}>
                <h2 style={{ margin:0, fontSize:16, fontWeight:700 }}>Confirmed Participants</h2>
                <span style={{ fontSize:13, color: DS.primary, fontWeight:600 }}>Show all 28 →</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
                {MOCK_PARTICIPANTS.slice(0,8).map((p,i) => (
                  <div key={p.id} style={{ padding:"14px 16px", borderRight: i%4<3 ? `4px solid ${DS.surface}` : "none", borderBottom:`4px solid ${DS.surface}`, display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius: radius.full, background: gradientCTA, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>
                      {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, lineHeight:1.2 }}>{p.name}</div>
                      <div style={{ fontSize:11, color: DS.onSurfaceVariant }}>{p.team}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ padding:"28px 24px", background: DS.surfaceLow, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
              <div style={{ aspectRatio:"4/3", overflow:"hidden", position:"relative" }}>
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=900&auto=format&fit=crop" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.55))" }} />
                <div style={{ position:"absolute", bottom:12, left:14, color:"#fff" }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{e.venue.name}</div>
                  <div style={{ fontSize:12, opacity:0.85 }}>{e.venue.city}</div>
                </div>
              </div>
              <div style={{ padding:"16px" }}>
                <div style={{ fontSize:13, color: DS.onSurfaceVariant, marginBottom:12, lineHeight:1.5 }}>{e.venue.address}, {e.venue.city}</div>
                <button style={{ width:"100%", background: DS.surfaceLow, color: DS.primary, border:"none", borderRadius: radius.full, padding:"12px", fontFamily: font, fontSize:13, fontWeight:700, cursor:"pointer" }}>Open in Maps →</button>
              </div>
            </div>

            <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, padding:"18px", boxShadow: shadow.card }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 14px" }}>Tournament Progress</h3>
              {[["Group Stage","In progress",DS.primary],["Quarter-Final","Pending",DS.outline],["Semi-Final","Pending",DS.outline],["Final","Pending",DS.outline]].map(([s,st,c],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderTop: i===0 ? "none" : `4px solid ${DS.surfaceLow}` }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{s}</div>
                  <Pill bg={i===0?DS.primaryFixed:DS.surfaceContainer} color={c}>{st}</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function V1Dashboard() {
  const u = MOCK_USER;
  const mine = MOCK_EVENTS.filter(e => e.is_registered || e.id <= 3);
  return (
    <div style={v1Base}>
      <A1Nav active="Dashboard" />
      <div style={{ flex:1, overflow:"auto", background: DS.surface, padding:"28px 32px 48px" }}>

        {/* Greeting + season stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:24, marginBottom:24, alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Season XII · Week 17</div>
            <h1 style={{ fontSize:52, fontWeight:900, color: DS.onSurface, letterSpacing:"-0.03em", margin:0, lineHeight:1 }}>
              Good evening, <span style={{ color: DS.primary }}>Kartika</span>.
            </h1>
            <p style={{ fontSize:15, color: DS.onSurfaceVariant, margin:"10px 0 0", lineHeight:1.55 }}>
              You have 3 upcoming fixtures. Your next match is in 2 days.
            </p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {[["12","Wins",DS.primary],["27","Played",DS.secondary],["44%","Win Rate",DS.tertiary]].map(([v,l,c],i) => (
              <div key={i} style={{ background: DS.surfaceLowest, borderRadius: radius.xl, padding:"18px 20px", textAlign:"center", boxShadow: shadow.card, minWidth:100 }}>
                <div style={{ fontSize:38, fontWeight:900, color: c, letterSpacing:"-0.03em", lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:11, fontWeight:700, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em", marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next fixture hero */}
        <div style={{ background: gradientCTA, borderRadius: radius.xl, padding:"0", overflow:"hidden", marginBottom:24, boxShadow: shadow.ctaHov, display:"grid", gridTemplateColumns:"200px 1fr auto" }}>
          <div style={{ position:"relative", overflow:"hidden" }}>
            <img src={MOCK_EVENTS[0].banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.7 }} />
          </div>
          <div style={{ padding:"24px 28px" }}>
            <Pill bg="rgba(255,255,255,0.2)" color="#fff">● Next Up · 2 Days Away</Pill>
            <h2 style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.025em", margin:"10px 0 6px", lineHeight:1.1 }}>{MOCK_EVENTS[0].name}</h2>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:16 }}>
              {MOCK_EVENTS[0].venue.name} · {fmtDay(MOCK_EVENTS[0].starts_at)} {fmtDate(MOCK_EVENTS[0].starts_at)} · {fmtTime(MOCK_EVENTS[0].starts_at)}
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {[["Court","02"],["Seed","#11"],["Group","A"],["R1 Opp","I. Wijaya"]].map(([k,v],i)=>(
                <div key={i}>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{k}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:"#fff", letterSpacing:"-0.01em" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"24px 24px", display:"flex", flexDirection:"column", gap:8, justifyContent:"center" }}>
            <button style={{ background:"#fff", color: DS.primary, border:"none", borderRadius: radius.full, padding:"12px 22px", fontFamily: font, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Open Briefing →</button>
            <button style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", borderRadius: radius.full, padding:"12px 22px", fontFamily: font, fontSize:13, fontWeight:600, cursor:"pointer" }}>Directions</button>
          </div>
        </div>

        {/* 3-col */}
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr", gap:16 }}>
          {/* Schedule */}
          <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
            <div style={{ padding:"16px 20px", background: DS.surfaceHigh, borderBottom:`4px solid ${DS.surface}` }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Your Schedule</h3>
            </div>
            {MOCK_EVENTS.slice(0,4).map((e,i) => (
              <div key={e.id} style={{ padding:"14px 20px", borderTop: i===0 ? "none" : `4px solid ${DS.surface}`, display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:48, height:48, background: DS.surfaceContainer, borderRadius: radius.lg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ fontSize:9, fontWeight:700, color: DS.primary, textTransform:"uppercase", letterSpacing:"0.06em" }}>{fmtDay(e.starts_at)}</div>
                  <div style={{ fontSize:22, fontWeight:900, color: DS.onSurface, lineHeight:1 }}>{new Date(e.starts_at).getDate()}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, lineHeight:1.2, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.name}</div>
                  <div style={{ fontSize:11, color: DS.onSurfaceVariant }}>{e.venue.city} · {fmtTime(e.starts_at)}</div>
                </div>
                <Pill bg={e.is_registered ? DS.primaryFixed : DS.surfaceContainer} color={e.is_registered ? DS.primary : DS.outline}>
                  {e.is_registered ? "Mine" : "Open"}
                </Pill>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
            <div style={{ padding:"16px 20px", background: DS.surfaceHigh, borderBottom:`4px solid ${DS.surface}` }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Last 10 Results</h3>
            </div>
            <div style={{ padding:"16px 20px" }}>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:16 }}>
                {["W","W","L","W","W","W","W","L","W","W"].map((r,i) => (
                  <div key={i} style={{ width:32, height:32, borderRadius: radius.lg, background: r==="W" ? DS.primaryFixed : DS.errorContainer, color: r==="W" ? DS.primary : DS.error, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 }}>{r}</div>
                ))}
              </div>
              {[["Streak","+2W",""],["Win Rate","44%",DS.primary],["Avg Margin","+4.2 pts",""]].map(([k,v,c],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderTop:`4px solid ${DS.surface}` }}>
                  <span style={{ fontSize:13, color: DS.onSurfaceVariant }}>{k}</span>
                  <span style={{ fontSize:14, fontWeight:700, color: c||DS.onSurface }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Win rate chart */}
          <div style={{ background: DS.surfaceLowest, borderRadius: radius.xl, overflow:"hidden", boxShadow: shadow.card }}>
            <div style={{ padding:"16px 20px", background: DS.surfaceHigh, borderBottom:`4px solid ${DS.surface}` }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Win Rate · 2026</h3>
            </div>
            <div style={{ padding:"16px 20px" }}>
              <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:80, marginBottom:12 }}>
                {[40,55,35,62,70,45,80,66,75,58,72,44].map((h,i) => (
                  <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:`${radius.sm} ${radius.sm} 0 0`, background: i===6 ? gradientCTA : DS.primaryFixed }} />
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontWeight:600, color: DS.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                <span>Jan</span><span>Apr</span><span>Jul</span><span>Dec</span>
              </div>
              <div style={{ marginTop:14, padding:"12px 14px", background: DS.primaryFixed, borderRadius: radius.lg }}>
                <div style={{ fontSize:11, fontWeight:700, color: DS.primary, textTransform:"uppercase", letterSpacing:"0.05em" }}>Season high</div>
                <div style={{ fontSize:28, fontWeight:900, color: DS.primary, letterSpacing:"-0.02em", marginTop:2 }}>80% <span style={{ fontSize:13, fontWeight:500, color: DS.onSurfaceVariant }}>in July</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { V1Welcome, V1EventsIndex, V1EventDetail, V1Dashboard });
