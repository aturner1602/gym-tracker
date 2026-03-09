import { useState, useEffect } from "react";

// ============================================================
// CONFIGURATION — Edit SHEETS_URL after deploying Apps Script
// ============================================================
const SHEETS_URL = "https://script.google.com/macros/s/AKfycby7tC8BLLyMYL_gJH1GnLR-R7j7mmYakcZNux-w-klCwiTW3_Mr1x2weBqDT1mG3mij/exec";

const PROGRAM = {
  Monday: {
    title: "Lower Body Strength",
    subtitle: "The Squat",
    emoji: "🏋️",
    warmup: true,
    blocks: [
      {
        id: "back_squat",
        name: "Back Squat",
        type: "barbell",
        sets: 5,
        reps: 5,
        note: "RPE 8. Rest 3 mins between sets.",
        trackWeight: true,
      },
      {
        id: "kb_or_sled_mon",
        name: "KB Engine or Sled Push",
        type: "choice",
        choices: [
          {
            id: "kb_engine_mon",
            label: "KB Engine",
            type: "emom",
            trackWeight: true,
            weightLabel: "KB Weight (kg)",
            exercises: [
              { min: 1, name: "Goblet Squats", reps: 10 },
              { min: 2, name: "Lateral Lunges per side", reps: 6 },
              { min: 3, name: "KB Swings", reps: 15 },
            ],
          },
          {
            id: "sled_push_mon",
            label: "Sled Push",
            type: "emom",
            trackWeight: true,
            weightLabel: "Sled Weight (kg)",
            note: "15 min EMOM sled push intervals.",
          },
        ],
      },
      {
        id: "zone2_mon",
        name: "Zone 2 Cardio",
        type: "cardio",
        duration: "40 mins",
        note: "Rower or Bike. Nasal breathing only.",
        trackWeight: false,
      },
    ],
  },
  Tuesday: {
    title: "Horizontal Push & Pull",
    subtitle: "Bench Day",
    emoji: "💪",
    warmup: true,
    blocks: [
      {
        id: "bench_press",
        name: "Bench Press",
        type: "barbell",
        sets: 5,
        reps: 5,
        note: "During each 3-min rest: 8–10 Weighted Pull-ups or Lat Pulldowns.",
        trackWeight: true,
      },
      {
        id: "pullup_superset",
        name: "Pull-ups / Lat Pulldown (superset)",
        type: "superset",
        sets: 5,
        reps: "8-10",
        note: "Done during bench rest periods.",
        trackWeight: true,
      },
      {
        id: "kb_engine_tue",
        name: "KB Engine (15m EMOM)",
        type: "emom",
        trackWeight: true,
        weightLabel: "KB Weight (kg)",
        exercises: [
          { min: 1, name: "Renegade Rows (per side)", reps: 5 },
          { min: 2, name: "Tactical Swings (Hand-to-hand)", reps: 12 },
          { min: 3, name: "Plank or Hollow Hold", reps: "45s" },
        ],
      },
      {
        id: "zone2_tue",
        name: "Zone 2 Cardio",
        type: "cardio",
        duration: "40 mins",
        note: "Incline Treadmill Walk.",
        trackWeight: false,
      },
    ],
  },
  Wednesday: {
    title: "Fat Loss & Stability",
    subtitle: "Bridge Day",
    emoji: "🧘",
    warmup: false,
    blocks: [
      {
        id: "stability_circuit",
        name: "Stability Circuit (3 Rounds)",
        type: "circuit",
        trackWeight: false,
        exercises: [
          { name: "Turkish Get-Ups per side", reps: 2, note: "~45s per rep, move slow" },
          { name: "90/90 Hip Switches", reps: 10, note: "Controlled rotation" },
          { name: "Dead Hangs", reps: "60s", note: "Decompresses spine" },
        ],
      },
      {
        id: "zone2_wed",
        name: "Zone 2 Cardio",
        type: "cardio",
        duration: "75 mins",
        note: "Primary fat-burning session.",
        trackWeight: false,
      },
    ],
  },
  Thursday: {
    title: "Posterior Chain Power",
    subtitle: "The Deadlift",
    emoji: "⚡",
    warmup: true,
    blocks: [
      {
        id: "deadlift",
        name: "Deadlift",
        type: "barbell",
        sets: 5,
        reps: 5,
        note: "Rest 3 mins between sets.",
        trackWeight: true,
      },
      {
        id: "kb_or_sled_thu",
        name: "KB Engine or Sled Push",
        type: "choice",
        choices: [
          {
            id: "kb_engine_thu",
            label: "KB Engine",
            type: "emom",
            trackWeight: true,
            weightLabel: "KB Weight (kg)",
            exercises: [
              { min: 1, name: "Heavy KB Swings", reps: 12 },
              { min: 2, name: "KB Cleans per side", reps: 4 },
              { min: 3, name: "Farmer's Carry", reps: "45s", note: "Heavy KBs" },
            ],
          },
          {
            id: "sled_push_thu",
            label: "Sled Push",
            type: "emom",
            trackWeight: true,
            weightLabel: "Sled Weight (kg)",
            note: "15 min EMOM sled push intervals.",
          },
        ],
      },
      {
        id: "zone2_thu",
        name: "Zone 2 Cardio",
        type: "cardio",
        duration: "40 mins",
        note: "Bike or Jog.",
        trackWeight: false,
      },
    ],
  },
  Friday: {
    title: "Vertical Push & Pull",
    subtitle: "Overhead Day",
    emoji: "🔥",
    warmup: true,
    blocks: [
      {
        id: "ohp",
        name: "Overhead Press",
        type: "barbell",
        sets: 5,
        reps: 5,
        note: "During each 3-min rest: 12–15 Face Pulls or Pull-ups.",
        trackWeight: true,
      },
      {
        id: "facepull_superset",
        name: "Face Pulls / Pull-ups (superset)",
        type: "superset",
        sets: 5,
        reps: "12-15",
        note: "Done during OHP rest periods.",
        trackWeight: true,
      },
      {
        id: "kb_engine_fri",
        name: "KB Engine (15m EMOM)",
        type: "emom",
        trackWeight: true,
        weightLabel: "KB Weight (kg)",
        exercises: [
          { min: 1, name: "KB Clean & Press per side", reps: 5 },
          { min: 2, name: "KB Windmills per side", reps: 3 },
          { min: 3, name: "KB Haloes (each direction)", reps: 5 },
        ],
      },
      {
        id: "zone2_fri",
        name: "Zone 2 Cardio",
        type: "cardio",
        duration: "40 mins",
        note: "Elliptical or Rower.",
        trackWeight: false,
      },
    ],
  },
  Saturday: {
    title: "Performance Peak",
    subtitle: "Norwegian 4x4",
    emoji: "🚀",
    warmup: true,
    warmupNote: "Extra focus on calf isometrics.",
    blocks: [
      {
        id: "norwegian_4x4",
        name: "Norwegian 4x4 HIIT",
        type: "hiit",
        trackWeight: false,
        note: "4 mins at 85–95% effort → 3 mins at 60% recovery. Repeat 4 times.",
      },
      {
        id: "core_armour",
        name: "Core Armour (3 Rounds)",
        type: "circuit",
        trackWeight: false,
        exercises: [
          { name: "Pallof Presses per side", reps: 12 },
          { name: "Weighted Deadbugs", reps: 10 },
          { name: "Side Plank per side", reps: "30s" },
        ],
      },
      {
        id: "flush",
        name: "The Flush",
        type: "cardio",
        duration: "30 mins",
        note: "Very light Zone 2 to clear lactate.",
        trackWeight: false,
      },
    ],
  },
  Sunday: null,
};

const WARMUP = [
  { name: "Isometric Calf Holds", detail: "3 sets × 30 seconds on a step" },
  { name: "Tibialis Raises", detail: "20 reps — toes to shins against wall" },
  { name: "World's Greatest Stretch", detail: "3 reps/side — Lunge + Elbow + Reach" },
  { name: "Glute Bridges", detail: "15 reps to wake the posterior chain" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const USERS = [["adam", "Adam"], ["kelly", "Kelly"]];

const TYPE_COLORS = {
  barbell: "#f59e0b", superset: "#60a5fa", emom: "#34d399",
  circuit: "#a78bfa", hiit: "#f87171", cardio: "#94a3b8", choice: "#34d399",
};

// ── Local Storage helpers (falls back gracefully if unavailable) ──
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getStorageKey(user, day, exerciseId) {
  return `gym:${user}:${day}:${exerciseId}`;
}

function loadLog(user, day, exerciseId) {
  return Promise.resolve(lsGet(getStorageKey(user, day, exerciseId)));
}

async function saveLog(user, day, exerciseId, data) {
  const payload = { ...data, savedAt: new Date().toISOString() };
  lsSet(getStorageKey(user, day, exerciseId), payload);

  // Also sync to Google Sheets if URL is configured
  if (SHEETS_URL && SHEETS_URL !== "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user, day, exerciseId,
          weight: data.weight,
          reps: data.reps,
          savedAt: payload.savedAt,
        }),
      });
    } catch (e) {
      console.warn("Sheets sync failed (app still works):", e);
    }
  }
}

async function loadLastSession(user, exerciseId, currentDay) {
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentIdx = dayOrder.indexOf(currentDay);
  for (let i = 1; i <= 6; i++) {
    const idx = (currentIdx - i + 6) % 6;
    const log = await loadLog(user, dayOrder[idx], exerciseId);
    if (log && log.weight) return { day: dayOrder[idx], ...log };
  }
  return null;
}

function WeightInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      <input
        type="number" inputMode="decimal" value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder || "—"}
        style={{
          background: "#1a1a1a", border: "1px solid #333", borderRadius: 8,
          color: "#fff", fontSize: 18, fontWeight: 700, padding: "10px 12px",
          width: "100%", outline: "none", fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function WeightTracker({ id, user, day, weightLabel, color }) {
  const [lastSession, setLastSession] = useState(null);
  const [todayWeight, setTodayWeight] = useState("");
  const [todayReps, setTodayReps] = useState("");
  const [saved, setSaved] = useState(false);
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setSaved(false); setSynced(false);
    setTodayWeight(""); setTodayReps("");
    Promise.all([loadLog(user, day, id), loadLastSession(user, id, day)])
      .then(([todayLog, last]) => {
        if (todayLog) { setTodayWeight(todayLog.weight || ""); setTodayReps(todayLog.reps || ""); setSaved(true); setSynced(true); }
        setLastSession(last);
        setLoading(false);
      });
  }, [user, day, id]);

  if (loading) return null;

  const handleSave = async () => {
    setSaved(true);
    await saveLog(user, day, id, { weight: todayWeight, reps: todayReps });
    setSynced(true);
  };

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1d1d1d" }}>
      {lastSession ? (
        <div style={{ marginBottom: 12, background: "#0d0d0d", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Last session ({lastSession.day})
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{lastSession.weight}</span>
              <span style={{ fontSize: 11, color: "#555", marginLeft: 3 }}>kg</span>
            </div>
            {lastSession.reps && (
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa" }}>{lastSession.reps}</span>
                <span style={{ fontSize: 11, color: "#555", marginLeft: 3 }}>reps</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "#444", marginBottom: 10, fontStyle: "italic" }}>No previous session — first time!</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <WeightInput label={weightLabel || "Weight (kg)"} value={todayWeight} onChange={setTodayWeight} placeholder="e.g. 24" />
        <WeightInput label="Reps / Notes" value={todayReps} onChange={setTodayReps} placeholder="e.g. 5" />
      </div>
      <button
        onClick={handleSave}
        style={{
          width: "100%", padding: "12px", borderRadius: 8, border: "none",
          background: saved ? "#1a3a1a" : color, color: saved ? "#34d399" : "#000",
          fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          letterSpacing: "0.05em", transition: "all 0.2s",
        }}
      >
        {saved ? (synced ? "✓ Saved & Synced to Sheets" : "✓ Saved (Syncing...)") : "Save Today's Numbers"}
      </button>
    </div>
  );
}

function ExerciseCard({ block, user, day }) {
  const color = TYPE_COLORS[block.type] || "#888";
  return (
    <div style={{
      background: "#111", border: `1px solid #222`, borderLeft: `3px solid ${color}`,
      borderRadius: 12, padding: "16px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{block.name}</div>
          {block.sets && <div style={{ fontSize: 12, color: "#666" }}>{block.sets} sets × {block.reps} reps</div>}
          {block.duration && <div style={{ fontSize: 12, color: "#666" }}>{block.duration}</div>}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
          color, background: color + "20", padding: "3px 8px", borderRadius: 20,
        }}>{block.type}</span>
      </div>
      {block.note && <div style={{ fontSize: 12, color: "#555", marginBottom: 10, fontStyle: "italic" }}>{block.note}</div>}
      {block.exercises && (
        <div style={{ marginBottom: 4 }}>
          {block.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "4px 0", borderBottom: "1px solid #1a1a1a" }}>
              {ex.min && <span style={{ fontSize: 11, color, fontWeight: 700, minWidth: 40 }}>Min {ex.min}</span>}
              <span style={{ fontSize: 13, color: "#ccc" }}>{ex.name}</span>
              <span style={{ fontSize: 12, color: "#555", marginLeft: "auto" }}>×{ex.reps}</span>
            </div>
          ))}
        </div>
      )}
      {block.trackWeight && (
        <WeightTracker id={block.id} user={user} day={day} weightLabel={block.weightLabel} color={color} />
      )}
    </div>
  );
}

function ChoiceCard({ block, user, day }) {
  const color = TYPE_COLORS.choice;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
    loadLog(user, day, block.id + "_choice").then(log => {
      if (log && log.choice) setSelected(log.choice);
    });
  }, [user, day, block.id]);

  const handleChoose = async (choiceId) => {
    setSelected(choiceId);
    lsSet(getStorageKey(user, day, block.id + "_choice"), { choice: choiceId });
  };

  const selectedChoice = block.choices.find(c => c.id === selected);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        background: "#111", border: `1px solid #222`, borderLeft: `3px solid ${color}`,
        borderRadius: selected ? "12px 12px 0 0" : 12, padding: "14px 16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{block.name}</div>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color, background: color + "20", padding: "3px 8px", borderRadius: 20,
          }}>choose one</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {block.choices.map(choice => (
            <button key={choice.id} onClick={() => handleChoose(choice.id)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
              background: selected === choice.id ? color : "#1a1a1a",
              color: selected === choice.id ? "#000" : "#666",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {selected === choice.id ? "✓ " : ""}{choice.label}
            </button>
          ))}
        </div>
      </div>
      {selectedChoice && (
        <div style={{
          background: "#0d0d0d", border: `1px solid #222`, borderTop: "none",
          borderLeft: `3px solid ${color}`, borderRadius: "0 0 12px 12px", padding: "14px 16px",
        }}>
          {selectedChoice.note && (
            <div style={{ fontSize: 12, color: "#555", marginBottom: 10, fontStyle: "italic" }}>{selectedChoice.note}</div>
          )}
          {selectedChoice.exercises && (
            <div style={{ marginBottom: 4 }}>
              {selectedChoice.exercises.map((ex, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "4px 0", borderBottom: "1px solid #1a1a1a" }}>
                  {ex.min && <span style={{ fontSize: 11, color, fontWeight: 700, minWidth: 40 }}>Min {ex.min}</span>}
                  <span style={{ fontSize: 13, color: "#ccc" }}>{ex.name}</span>
                  <span style={{ fontSize: 12, color: "#555", marginLeft: "auto" }}>×{ex.reps}</span>
                </div>
              ))}
            </div>
          )}
          <WeightTracker id={selectedChoice.id} user={user} day={day} weightLabel={selectedChoice.weightLabel} color={color} />
        </div>
      )}
    </div>
  );
}

export default function GymTracker() {
  const today = DAYS[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(today === "Sunday" ? "Monday" : today);
  const [user, setUser] = useState("adam");
  const [showWarmup, setShowWarmup] = useState(false);
  const workout = PROGRAM[selectedDay];
  const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", maxWidth: 480,
      margin: "0 auto", paddingBottom: 40,
    }}>
      <div style={{
        padding: "24px 20px 16px", borderBottom: "1px solid #1a1a1a",
        position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {workout ? workout.emoji : "😴"} {selectedDay}
            </div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 1 }}>
              {workout ? `${workout.title} — ${workout.subtitle}` : "Rest Day"}
            </div>
          </div>
          <div style={{ display: "flex", background: "#111", border: "1px solid #222", borderRadius: 30, padding: 3 }}>
            {USERS.map(([val, label]) => (
              <button key={val} onClick={() => setUser(val)} style={{
                padding: "6px 14px", borderRadius: 24, border: "none",
                background: user === val ? "#f59e0b" : "transparent",
                color: user === val ? "#000" : "#555",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {workDays.map(day => {
            const isToday = day === today, isSelected = day === selectedDay;
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                padding: "6px 12px", borderRadius: 20,
                border: isToday && !isSelected ? "1px solid #f59e0b" : "1px solid #222",
                background: isSelected ? "#f59e0b" : "#111",
                color: isSelected ? "#000" : isToday ? "#f59e0b" : "#555",
                fontWeight: isSelected || isToday ? 700 : 500,
                fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "inherit", transition: "all 0.15s", flexShrink: 0,
              }}>{day.slice(0, 3)}</button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {!workout && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>💤</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#555" }}>Rest Day</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Recovery is part of the program.</div>
          </div>
        )}
        {workout && (
          <>
            {workout.warmup && (
              <div style={{
                background: "#111", border: "1px solid #222", borderLeft: "3px solid #6366f1",
                borderRadius: 12, marginBottom: 12, overflow: "hidden",
              }}>
                <button onClick={() => setShowWarmup(!showWarmup)} style={{
                  width: "100%", padding: "14px 16px", background: "transparent",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontFamily: "inherit",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, textAlign: "left" }}>🔥 Mandatory 10-Min Warm-Up</div>
                    {workout.warmupNote && <div style={{ fontSize: 12, color: "#555", textAlign: "left", marginTop: 2 }}>{workout.warmupNote}</div>}
                  </div>
                  <span style={{ color: "#6366f1", fontSize: 18 }}>{showWarmup ? "▲" : "▼"}</span>
                </button>
                {showWarmup && (
                  <div style={{ padding: "0 16px 14px" }}>
                    {WARMUP.map((ex, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: i < WARMUP.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{ex.name}</div>
                        <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{ex.detail}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {workout.blocks.map(block =>
              block.type === "choice"
                ? <ChoiceCard key={block.id + user} block={block} user={user} day={selectedDay} />
                : <ExerciseCard key={block.id + user} block={block} user={user} day={selectedDay} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
