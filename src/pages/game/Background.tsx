import { BG_IMAGE } from "./types";

export const Background = () => (
  <>
    {/* Фон */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `url(${BG_IMAGE})`,
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
    }} />

    {/* Анимированные тучи — SVG поверх фона */}
    <svg
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMin slice"
      style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "55%",
        pointerEvents: "none", zIndex: 2,
        mixBlendMode: "multiply",
      }}
    >
      <defs>
        <filter id="blur1"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>

      {/* Туча левая */}
      <g filter="url(#blur1)" opacity="0.82">
        <animateTransform attributeName="transform" type="translate"
          values="-18,0; 18,4; -18,0" dur="18s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
        <ellipse cx="155" cy="72" rx="110" ry="44" fill="#2a2a2e"/>
        <ellipse cx="105" cy="85" rx="75"  ry="36" fill="#232328"/>
        <ellipse cx="200" cy="82" rx="80"  ry="32" fill="#2c2c32"/>
        <ellipse cx="150" cy="95" rx="95"  ry="28" fill="#1e1e22"/>
      </g>

      {/* Туча правая */}
      <g filter="url(#blur1)" opacity="0.78">
        <animateTransform attributeName="transform" type="translate"
          values="16,0; -16,6; 16,0" dur="22s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
        <ellipse cx="650" cy="68" rx="120" ry="42" fill="#252528"/>
        <ellipse cx="700" cy="80" rx="80"  ry="34" fill="#2a2a2e"/>
        <ellipse cx="600" cy="78" rx="85"  ry="30" fill="#202024"/>
        <ellipse cx="655" cy="92" rx="100" ry="26" fill="#1c1c20"/>
      </g>

      {/* Центральная туча над башней */}
      <g filter="url(#blur2)" opacity="0.9">
        <animateTransform attributeName="transform" type="scale"
          values="1,1; 1.06,1.04; 1,1" dur="12s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          additive="sum" origin="400 60"/>
        <animateTransform attributeName="transform" type="translate"
          values="-8,0; 8,3; -8,0" dur="16s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          additive="sum"/>
        <ellipse cx="400" cy="54" rx="130" ry="46" fill="#1a1a1f"/>
        <ellipse cx="370" cy="66" rx="95"  ry="38" fill="#141418"/>
        <ellipse cx="430" cy="64" rx="100" ry="36" fill="#18181c"/>
        <ellipse cx="400" cy="80" rx="115" ry="30" fill="#111114"/>
        <ellipse cx="400" cy="92" rx="80"  ry="22" fill="#0e0e11"/>
      </g>

      {/* Мелкие клочья */}
      <g opacity="0.55" filter="url(#blur1)">
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 28,8; 0,0" dur="26s" repeatCount="indefinite" calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
        <ellipse cx="300" cy="100" rx="60" ry="20" fill="#222226"/>
        <ellipse cx="510" cy="96"  rx="55" ry="18" fill="#1e1e22"/>
      </g>
    </svg>

    {/* Затемнение по краям */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 3,
      background: "radial-gradient(ellipse 80% 80% at center, transparent 55%, rgba(0,0,0,0.3) 100%)",
    }} />

    {/* Подложка снизу */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 3,
      background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 40%)",
    }} />

    {/* Версия */}
    <div style={{
      position: "absolute", bottom: "14px", right: "16px",
      fontFamily: "'Cinzel', serif",
      fontSize: "10px",
      letterSpacing: "0.12em",
      color: "rgba(212,168,67,0.45)",
      textShadow: "0 1px 6px rgba(0,0,0,0.8)",
      pointerEvents: "none",
      zIndex: 30,
    }}>
      beta 1
    </div>
  </>
);
