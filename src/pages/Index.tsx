import { useState, useEffect, useRef } from "react";

type Screen = "menu" | "new-game" | "continue" | "settings";

interface SavedGame {
  id: number;
  name: string;
  date: string;
  level: number;
}

const INITIAL_SAVES: SavedGame[] = [
  { id: 1, name: "Первое приключение", date: "10.05.2026", level: 7 },
  { id: 2, name: "Темное подземелье", date: "09.05.2026", level: 3 },
  { id: 3, name: "Битва с драконом", date: "07.05.2026", level: 12 },
];

const MENU_ITEMS = [
  { id: "new-game" as Screen, label: "НОВАЯ ИГРА", icon: "⚔", exitBtn: false },
  { id: "continue" as Screen, label: "ПРОДОЛЖИТЬ", icon: "💾", exitBtn: false },
  { id: "settings" as Screen, label: "НАСТРОЙКИ", icon: "⚙", exitBtn: false },
  { id: "exit" as Screen, label: "ВЫХОД", icon: "✕", exitBtn: true },
];

const PixelDecor = () => {
  const pixels = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pixels.map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 37 + 11) % 95}%`,
            top: `${(i * 53 + 7) % 90}%`,
            width: i % 3 === 0 ? "6px" : "4px",
            height: i % 3 === 0 ? "6px" : "4px",
            background: i % 4 === 0 ? "var(--pixel-yellow)" : "var(--pixel-green)",
            opacity: 0.15 + (i % 5) * 0.06,
            animation: `floatPixel ${2.5 + (i % 4) * 0.8}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
};

const PixelBar = ({ value, color = "var(--pixel-green)" }: { value: number; color?: string }) => (
  <div style={{
    width: "100%", height: "12px",
    background: "#111", border: "2px solid var(--pixel-green-dim)",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      height: "100%", width: `${value}%`,
      background: `repeating-linear-gradient(90deg, ${color} 0, ${color} 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 10px)`,
      transition: "width 0.4s ease-out",
    }} />
  </div>
);

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [gameName, setGameName] = useState("");
  const [saves, setSaves] = useState<SavedGame[]>(INITIAL_SAVES);
  const [volumes, setVolumes] = useState({ effects: 70, music: 50, voices: 80 });
  const [time, setTime] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen === "new-game") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [screen]);

  const goTo = (s: Screen) => {
    if (s === "exit") {
      window.close();
      return;
    }
    setScreen(s);
  };

  const startNewGame = () => {
    if (!gameName.trim()) return;
    const newSave: SavedGame = {
      id: Date.now(),
      name: gameName.trim(),
      date: new Date().toLocaleDateString("ru-RU"),
      level: 1,
    };
    setSaves((prev) => [newSave, ...prev]);
    setGameName("");
    setScreen("menu");
  };

  return (
    <div
      className="scanlines"
      style={{
        width: "100dvw", height: "100dvh",
        background: "var(--pixel-bg)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <PixelDecor />

      {/* Status bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 16px",
        background: "rgba(0,0,0,0.7)",
        borderBottom: "2px solid var(--pixel-green-dim)",
        fontSize: "9px", color: "var(--pixel-green-dim)",
        fontFamily: "'Press Start 2P', monospace",
        zIndex: 20,
      }}>
        <span>PIXEL.GAME v1.0</span>
        <span className="blink">{time}</span>
      </div>

      {/* ─── MAIN MENU ─── */}
      {screen === "menu" && (
        <div className="screen-in" style={{
          width: "min(420px, 92vw)",
          display: "flex", flexDirection: "column", gap: "24px",
          padding: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "8px", color: "var(--pixel-green-dim)", marginBottom: "12px", letterSpacing: "3px" }}>
              ══════ ГЛАВНОЕ МЕНЮ ══════
            </div>
            <h1 className="title-pulse" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(20px, 5.5vw, 30px)",
              color: "var(--pixel-green)",
              lineHeight: 1.4,
              margin: 0,
            }}>
              PIXEL
              <br />
              <span style={{ color: "var(--pixel-yellow)" }}>QUEST</span>
            </h1>
            <div style={{ marginTop: "10px", fontSize: "8px", color: "var(--pixel-muted)", letterSpacing: "2px" }}>
              ► ВЫБЕРИ ДЕЙСТВИЕ ◄
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MENU_ITEMS.map((item, i) => (
              <button
                key={item.id}
                className={`pixel-btn ${selectedMenu === i ? "selected" : ""}`}
                onMouseEnter={() => setSelectedMenu(i)}
                onClick={() => goTo(item.id)}
                style={{
                  color: item.exitBtn
                    ? "var(--pixel-red)"
                    : selectedMenu === i ? "#fff" : "var(--pixel-green)",
                  borderColor: item.exitBtn ? "var(--pixel-red)" : undefined,
                  boxShadow: item.exitBtn
                    ? "4px 4px 0px #880022, 0 0 15px rgba(255,34,68,0.15)"
                    : undefined,
                  fontSize: "clamp(9px, 2.3vw, 12px)",
                  padding: "16px 20px",
                }}
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                {item.label}
                {selectedMenu === i && (
                  <span className="blink" style={{ marginLeft: "auto", fontSize: "12px" }}>◄</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", fontSize: "8px", color: "var(--pixel-muted)", letterSpacing: "2px" }}>
            ▓▒░ © 2026 PIXEL QUEST ░▒▓
          </div>
        </div>
      )}

      {/* ─── NEW GAME ─── */}
      {screen === "new-game" && (
        <div className="screen-in" style={{
          width: "min(420px, 92vw)",
          display: "flex", flexDirection: "column", gap: "22px",
          padding: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "8px", color: "var(--pixel-green-dim)", marginBottom: "12px", letterSpacing: "3px" }}>
              ══════ НОВАЯ ИГРА ══════
            </div>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚔️</div>
            <h2 className="crt-glow" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(13px, 3.5vw, 17px)",
              color: "var(--pixel-green)",
              margin: 0,
            }}>
              НОВАЯ ПАРТИЯ
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "9px", color: "var(--pixel-green-dim)", letterSpacing: "2px" }}>
              НАЗВАНИЕ ПАРТИИ:
            </label>
            <input
              ref={inputRef}
              className="pixel-input"
              type="text"
              maxLength={24}
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startNewGame()}
              placeholder="МОЯ ЭПИЧЕСКАЯ САГА..."
            />
            <div style={{ fontSize: "8px", color: "var(--pixel-muted)", textAlign: "right" }}>
              {gameName.length}/24
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              className="pixel-btn"
              onClick={startNewGame}
              disabled={!gameName.trim()}
              style={{
                justifyContent: "center", textAlign: "center",
                opacity: gameName.trim() ? 1 : 0.4,
                cursor: gameName.trim() ? "pointer" : "not-allowed",
                color: "var(--pixel-yellow)",
                borderColor: "var(--pixel-yellow)",
                boxShadow: "4px 4px 0px #886600, 0 0 15px rgba(255,230,0,0.15)",
              }}
            >
              ▶ НАЧАТЬ ИГРУ
            </button>
            <button
              className="pixel-btn"
              onClick={() => setScreen("menu")}
              style={{ justifyContent: "center", textAlign: "center", fontSize: "11px" }}
            >
              ← НАЗАД
            </button>
          </div>
        </div>
      )}

      {/* ─── CONTINUE ─── */}
      {screen === "continue" && (
        <div className="screen-in" style={{
          width: "min(420px, 92vw)",
          display: "flex", flexDirection: "column", gap: "18px",
          padding: "16px",
          maxHeight: "88dvh",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "8px", color: "var(--pixel-green-dim)", marginBottom: "12px", letterSpacing: "3px" }}>
              ══════ ПРОДОЛЖИТЬ ══════
            </div>
            <h2 className="crt-glow" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(12px, 3vw, 15px)",
              color: "var(--pixel-green)",
              margin: 0,
            }}>
              СОХРАНЁННЫЕ ИГРЫ
            </h2>
          </div>

          <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            overflowY: "auto", maxHeight: "52dvh",
          }}>
            {saves.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "32px",
                color: "var(--pixel-muted)", fontSize: "10px",
                border: "2px solid var(--pixel-muted)",
              }}>
                НЕТ СОХРАНЕНИЙ
              </div>
            ) : (
              saves.map((save, i) => (
                <button
                  key={save.id}
                  className="pixel-btn"
                  style={{
                    flexDirection: "column", alignItems: "flex-start",
                    gap: "10px", padding: "14px",
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <span style={{ fontSize: "clamp(8px, 2.2vw, 10px)", color: "var(--pixel-yellow)" }}>
                      💾 {save.name}
                    </span>
                    <span style={{ fontSize: "9px", color: "var(--pixel-muted)", whiteSpace: "nowrap" }}>
                      LVL {save.level}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    <div style={{ fontSize: "8px", color: "var(--pixel-muted)" }}>
                      ПРОГРЕСС: {Math.min(save.level * 8, 100)}%
                    </div>
                    <PixelBar value={Math.min(save.level * 8, 100)} />
                  </div>
                  <div style={{ fontSize: "8px", color: "var(--pixel-muted)" }}>
                    📅 {save.date}
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            className="pixel-btn"
            onClick={() => setScreen("menu")}
            style={{ justifyContent: "center", textAlign: "center", fontSize: "11px" }}
          >
            ← НАЗАД
          </button>
        </div>
      )}

      {/* ─── SETTINGS ─── */}
      {screen === "settings" && (
        <div className="screen-in" style={{
          width: "min(420px, 92vw)",
          display: "flex", flexDirection: "column", gap: "22px",
          padding: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "8px", color: "var(--pixel-green-dim)", marginBottom: "12px", letterSpacing: "3px" }}>
              ══════ НАСТРОЙКИ ══════
            </div>
            <h2 className="crt-glow" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(13px, 3vw, 16px)",
              color: "var(--pixel-green)",
              margin: 0,
            }}>
              🔊 ЗВУК
            </h2>
          </div>

          <div style={{
            display: "flex", flexDirection: "column", gap: "26px",
            padding: "20px",
            border: "3px solid var(--pixel-green-dim)",
            background: "rgba(0,255,65,0.03)",
            boxShadow: "4px 4px 0 var(--pixel-green-dim)",
          }}>
            {([
              { key: "effects" as const, label: "🔊 ЭФФЕКТЫ", color: "var(--pixel-green)" },
              { key: "music" as const, label: "🎵 МУЗЫКА", color: "var(--pixel-blue)" },
              { key: "voices" as const, label: "🎙 ГОЛОСА", color: "var(--pixel-yellow)" },
            ] as const).map(({ key, label, color }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{
                    fontSize: "clamp(7px, 1.9vw, 10px)",
                    color,
                    fontFamily: "'Press Start 2P', monospace",
                  }}>
                    {label}
                  </label>
                  <span style={{
                    fontSize: "10px", color,
                    fontFamily: "'Press Start 2P', monospace",
                    minWidth: "36px", textAlign: "right",
                  }}>
                    {volumes[key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0} max={100}
                  value={volumes[key]}
                  onChange={(e) =>
                    setVolumes((v) => ({ ...v, [key]: Number(e.target.value) }))
                  }
                  className="pixel-slider"
                />
                {/* Pixel level bars */}
                <div style={{ display: "flex", gap: "3px" }}>
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} style={{
                      flex: 1, height: "8px",
                      background: i < Math.round(volumes[key] / 5) ? color : "#1a1a1a",
                      transition: "background 0.1s",
                      border: "1px solid rgba(0,0,0,0.3)",
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="pixel-btn"
            onClick={() => setScreen("menu")}
            style={{ justifyContent: "center", textAlign: "center", fontSize: "11px" }}
          >
            ← СОХРАНИТЬ И ВЫЙТИ
          </button>
        </div>
      )}
    </div>
  );
}
