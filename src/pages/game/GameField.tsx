import { useState, useEffect, useRef } from "react";
import { SavedGame } from "./types";
import { GhostBtn } from "./ui";

const COLS = 8;
const ROWS = 8;
const CELL = 60; // px, base size
const FLOOR_COLORS = ["#2a4a1e", "#1e3a14", "#234018", "#1a3010"];
const WALL_COLOR = "#1a1208";
const WALL_TOP = "#2c2010";
const STONE_LINES = "rgba(0,0,0,0.35)";

type CellType = "floor" | "wall" | "player" | "chest" | "stairs";

const INITIAL_GRID: CellType[][] = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) => {
    if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) return "wall";
    if (r === 1 && c === 1) return "player";
    if (r === ROWS - 2 && c === COLS - 2) return "stairs";
    if ((r === 2 && c === 5) || (r === 5 && c === 2)) return "chest";
    return "floor";
  })
);

/* Изометрическая проекция */
const toIso = (col: number, row: number, cw: number, ch: number) => ({
  x: (col - row) * (cw / 2),
  y: (col + row) * (ch / 4),
});

/* Одна клетка в изометрии */
const Cell = ({
  type, col, row, cw, ch, highlight,
}: {
  type: CellType; col: number; row: number; cw: number; ch: number; highlight?: boolean;
}) => {
  const { x, y } = toIso(col, row, cw, ch);
  const hw = cw / 2;
  const hh = ch / 4;
  const wallH = ch / 2.5;

  const floorColor = FLOOR_COLORS[(col + row) % FLOOR_COLORS.length];
  const isWall = type === "wall";

  const floorPts = `
    ${x},${y + hh}
    ${x + hw},${y}
    ${x + cw},${y + hh}
    ${x + hw},${y + hh * 2}
  `;

  const leftPts = `
    ${x},${y + hh}
    ${x},${y + hh + wallH}
    ${x + hw},${y + hh * 2 + wallH}
    ${x + hw},${y + hh * 2}
  `;

  const rightPts = `
    ${x + cw},${y + hh}
    ${x + cw},${y + hh + wallH}
    ${x + hw},${y + hh * 2 + wallH}
    ${x + hw},${y + hh * 2}
  `;

  const topPts = `
    ${x},${y + hh - wallH}
    ${x + hw},${y - wallH}
    ${x + cw},${y + hh - wallH}
    ${x + hw},${y + hh * 2 - wallH}
  `;

  const glowColor = highlight ? "rgba(212,168,67,0.7)" : "none";

  return (
    <g>
      {isWall ? (
        <>
          <polygon points={leftPts}  fill={WALL_COLOR} stroke={STONE_LINES} strokeWidth="0.5"/>
          <polygon points={rightPts} fill="#0f0b06"    stroke={STONE_LINES} strokeWidth="0.5"/>
          <polygon points={topPts}   fill={WALL_TOP}   stroke={STONE_LINES} strokeWidth="0.5"/>
        </>
      ) : (
        <polygon points={floorPts}
          fill={highlight ? "rgba(212,168,67,0.25)" : floorColor}
          stroke={STONE_LINES} strokeWidth="0.5"/>
      )}

      {/* Игрок */}
      {type === "player" && (
        <g transform={`translate(${x + hw - 6}, ${y + hh - 20})`}>
          <ellipse cx="6" cy="24" rx="8" ry="3" fill="rgba(0,0,0,0.4)"/>
          <rect x="2" y="10" width="8" height="12" rx="2" fill="#c8a020"/>
          <circle cx="6" cy="7"  r="5" fill="#e8c060"/>
          <line x1="6" y1="10" x2="6" y2="22" stroke="#8a6010" strokeWidth="1.5"/>
          <line x1="0" y1="14" x2="12" y2="14" stroke="#8a6010" strokeWidth="1.5"/>
        </g>
      )}

      {/* Сундук */}
      {type === "chest" && (
        <g transform={`translate(${x + hw - 10}, ${y + hh - 14})`}>
          <rect x="0" y="6" width="20" height="12" rx="2" fill="#5c3a10"/>
          <rect x="0" y="6" width="20" height="6"  rx="2" fill="#7a5018"/>
          <rect x="8" y="9" width="4"  height="6"  rx="1" fill="#d4a030"/>
          <line x1="0" y1="12" x2="20" y2="12" stroke="#3a2008" strokeWidth="1"/>
        </g>
      )}

      {/* Лестница вниз */}
      {type === "stairs" && (
        <g transform={`translate(${x + hw - 10}, ${y + hh - 8})`}>
          {[0,1,2,3].map(i => (
            <rect key={i} x={i*2} y={i*3} width={20 - i*4} height="4"
              rx="0.5" fill={`rgba(212,168,67,${0.5 + i * 0.12})`}/>
          ))}
        </g>
      )}

      {/* Свечение при hover */}
      {highlight && !isWall && (
        <polygon points={floorPts} fill="none"
          stroke={glowColor} strokeWidth="1.5" opacity="0.9"/>
      )}
    </g>
  );
};

export const GameField = ({
  save,
  onBack,
}: {
  save: SavedGame;
  onBack: () => void;
}) => {
  const [grid] = useState<CellType[][]>(INITIAL_GRID);
  const [hovered, setHovered] = useState<[number,number] | null>(null);
  const [cw, setCw] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      setCw(Math.max(36, Math.min(64, w / (COLS + 2))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const ch = cw;
  const viewW = (COLS + ROWS) * (cw / 2) + cw;
  const viewH = (COLS + ROWS) * (ch / 4) + ch;

  /* Клетки рендерим от дальних к ближним (painter's algorithm) */
  const cells: { col: number; row: number; type: CellType }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ col: c, row: r, type: grid[r][c] });
    }
  }

  return (
    <div className="screen-in" style={{
      width: "min(520px, 96vw)",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: "12px",
      position: "relative", zIndex: 10,
    }}>
      {/* Заголовок */}
      <div style={{ textAlign: "center" }}>
        <h2 className="gold-glow" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(18px, 5vw, 26px)",
          fontWeight: 700,
          color: "var(--f-gold)",
          margin: "0 0 2px",
          letterSpacing: "0.1em",
          textShadow: "0 0 20px rgba(212,168,67,0.6), 0 3px 12px rgba(0,0,0,0.9)",
        }}>
          {save.name}
        </h2>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "10px",
          color: "rgba(212,168,67,0.5)",
          letterSpacing: "0.15em",
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        }}>
          ЭТАЖ {Math.min(Math.max(save.level, 1), 15)}
        </div>
      </div>

      {/* 3D поле */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(212,168,67,0.25)",
          backdropFilter: "blur(8px)",
          padding: "8px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,168,67,0.1)",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <svg
          width={viewW}
          height={viewH}
          style={{ display: "block", margin: "0 auto" }}
        >
          <g transform={`translate(${(ROWS * cw) / 2}, 8)`}>
            {cells.map(({ col, row, type }) => {
              const isHov = hovered?.[0] === col && hovered?.[1] === row;
              return (
                <g
                  key={`${col}-${row}`}
                  style={{ cursor: type !== "wall" ? "pointer" : "default" }}
                  onMouseEnter={() => type !== "wall" && setHovered([col, row])}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Cell
                    type={type} col={col} row={row}
                    cw={cw} ch={ch} highlight={isHov && type !== "wall"}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Легенда */}
      <div style={{
        display: "flex", gap: "18px", flexWrap: "wrap", justifyContent: "center",
      }}>
        {[
          { icon: "🧙", label: "Герой" },
          { icon: "📦", label: "Сундук" },
          { icon: "🪜", label: "Лестница" },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "9px",
            color: "rgba(212,168,67,0.5)",
            letterSpacing: "0.1em",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            <span style={{ fontSize: "12px" }}>{icon}</span> {label}
          </div>
        ))}
      </div>

      <GhostBtn center small onClick={onBack}>
        ← Назад
      </GhostBtn>
    </div>
  );
};
