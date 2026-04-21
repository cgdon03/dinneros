import { useState, useEffect, useRef } from "react";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || "";

// ─── Fonts via Google (loaded in useEffect) ───
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

// ─── Color palette ───
const C = {
  cream: "#FAF7F2",
  warmWhite: "#FFFDF9",
  clay: "#C97B4B",
  clayLight: "#E8A97A",
  clayDark: "#A85E2E",
  forest: "#2D4A3E",
  forestLight: "#3D6356",
  sage: "#7BA99A",
  sageLight: "#B5CFC8",
  charcoal: "#1C1C1E",
  muted: "#8A8A8E",
  mutedLight: "#C4C4C6",
  paper: "#F5F0E8",
  gold: "#D4A843",
  surface: "#FFFFFF",
  error: "#D94F3F",
};

const styles = `
  @import url('${FONT_URL}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'DM Sans', sans-serif; background: ${C.cream}; color: ${C.charcoal}; -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .nav { background: ${C.warmWhite}; border-bottom: 1px solid rgba(0,0,0,0.07); padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, ${C.clay} 0%, ${C.clayDark} 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(201,123,75,0.35); }
  .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: ${C.charcoal}; letter-spacing: -0.3px; }
  .nav-logo-text span { color: ${C.clay}; }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: ${C.muted}; cursor: pointer; transition: all 0.18s ease; }
  .nav-tab:hover { color: ${C.charcoal}; background: ${C.paper}; }
  .nav-tab.active { color: ${C.clay}; background: rgba(201,123,75,0.1); }
  .nav-pro-badge { display: flex; align-items: center; gap: 8px; }
  .badge-pro { background: linear-gradient(135deg, ${C.gold} 0%, ${C.clay} 100%); color: white; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; letter-spacing: 0.5px; }
  .avatar { width: 34px; height: 34px; background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestLight} 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; }
  .main { flex: 1; max-width: 1180px; margin: 0 auto; width: 100%; padding: 32px 24px 60px; }
  .hero { text-align: center; padding: 48px 0 40px; animation: fadeUp 0.6s ease forwards; }
  .hero-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${C.clay}; margin-bottom: 14px; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 5vw, 58px); font-weight: 700; line-height: 1.12; color: ${C.charcoal}; margin-bottom: 16px; letter-spacing: -1px; }
  .hero-title em { color: ${C.clay}; font-style: italic; }
  .hero-sub { font-size: 17px; color: ${C.muted}; font-weight: 400; max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }
  .hero-stats { display: flex; justify-content: center; gap: 36px; margin-bottom: 8px; }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: ${C.charcoal}; }
  .hero-stat-label { font-size: 12px; color: ${C.muted}; font-weight: 400; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${C.charcoal}; }
  .section-action { background: ${C.clay}; color: white; border: none; padding: 9px 18px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s ease; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(201,123,75,0.3); }
  .section-action:hover { background: ${C.clayDark}; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,123,75,0.4); }
  .section-action:disabled { opacity: 0.6; transform: none; cursor: not-allowed; }
  .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-bottom: 36px; }
  .day-card { background: ${C.warmWhite}; border-radius: 14px; padding: 14px 12px; border: 1.5px solid transparent; transition: all 0.2s ease; min-height: 130px; display: flex; flex-direction: column; cursor: pointer; position: relative; }
  .day-card:hover { border-color: ${C.sageLight}; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
  .day-card.today { border-color: ${C.clay}; background: linear-gradient(160deg, #FFF8F2 0%, ${C.warmWhite} 100%); }
  .day-card.selected { border-color: ${C.forest}; box-shadow: 0 0 0 3px rgba(45,74,62,0.12); }
  .day-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${C.muted}; margin-bottom: 4px; }
  .day-date { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${C.charcoal}; margin-bottom: 10px; line-height: 1; }
  .today-dot { width: 6px; height: 6px; background: ${C.clay}; border-radius: 50%; position: absolute; top: 12px; right: 12px; }
  .meal-pill { font-size: 11px; font-weight: 500; color: ${C.charcoal}; background: ${C.paper}; border-radius: 7px; padding: 5px 8px; margin-bottom: 5px; line-height: 1.3; border-left: 3px solid ${C.sageLight}; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .meal-pill.loading { border-left-color: ${C.clay}; background: linear-gradient(90deg, ${C.paper} 25%, #EDE8DE 50%, ${C.paper} 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; color: transparent; min-height: 36px; }
  .meal-empty { font-size: 11px; color: ${C.mutedLight}; font-style: italic; margin-top: auto; }
  .add-meal-btn { background: none; border: 1.5px dashed ${C.mutedLight}; border-radius: 7px; color: ${C.mutedLight}; font-size: 18px; width: 100%; height: 32px; cursor: pointer; transition: all 0.15s ease; margin-top: auto; }
  .add-meal-btn:hover { border-color: ${C.sage}; color: ${C.sage}; background: rgba(123,169,154,0.05); }
  .cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 36px; }
  .chat-card { background: ${C.warmWhite}; border-radius: 18px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .chat-header { padding: 16px 20px; background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestLight} 100%); display: flex; align-items: center; gap: 10px; }
  .chat-header-icon { font-size: 20px; }
  .chat-header-info h3 { font-family: 'Playfair Display', serif; font-size: 16px; color: white; margin-bottom: 1px; }
  .chat-header-info p { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 400; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 280px; max-height: 320px; background: ${C.cream}; }
  .msg { max-width: 88%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; animation: fadeUp 0.25s ease; }
  .msg.ai { background: white; border: 1px solid rgba(0,0,0,0.07); align-self: flex-start; border-bottom-left-radius: 4px; color: ${C.charcoal}; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .msg.user { background: linear-gradient(135deg, ${C.clay} 0%, ${C.clayDark} 100%); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
  .msg.typing { background: white; border: 1px solid rgba(0,0,0,0.07); align-self: flex-start; color: ${C.muted}; font-style: italic; }
  .chat-input-row { display: flex; gap: 8px; padding: 12px 16px; background: ${C.warmWhite}; border-top: 1px solid rgba(0,0,0,0.06); }
  .chat-input { flex: 1; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: ${C.cream}; color: ${C.charcoal}; outline: none; transition: border-color 0.15s; resize: none; min-height: 42px; max-height: 100px; }
  .chat-input:focus { border-color: ${C.clay}; }
  .chat-send { background: linear-gradient(135deg, ${C.clay} 0%, ${C.clayDark} 100%); border: none; width: 42px; height: 42px; border-radius: 10px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s ease; box-shadow: 0 2px 8px rgba(201,123,75,0.3); }
  .chat-send:hover { transform: scale(1.05); }
  .chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .grocery-card { background: ${C.warmWhite}; border-radius: 18px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .grocery-header { padding: 16px 20px; background: linear-gradient(135deg, ${C.clay} 0%, ${C.clayDark} 100%); display: flex; align-items: center; justify-content: space-between; }
  .grocery-header-left { display: flex; align-items: center; gap: 10px; }
  .grocery-header h3 { font-family: 'Playfair Display', serif; font-size: 16px; color: white; }
  .grocery-header p { font-size: 12px; color: rgba(255,255,255,0.65); }
  .grocery-gen-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s ease; }
  .grocery-gen-btn:hover { background: rgba(255,255,255,0.3); }
  .grocery-gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .grocery-items { padding: 12px 16px; min-height: 200px; max-height: 320px; overflow-y: auto; }
  .grocery-category { margin-bottom: 14px; }
  .grocery-category-name { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: ${C.muted}; margin-bottom: 7px; padding-bottom: 4px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .grocery-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; cursor: pointer; transition: opacity 0.15s; }
  .grocery-item.checked { opacity: 0.4; }
  .grocery-item.checked .grocery-item-name { text-decoration: line-through; }
  .grocery-check { width: 18px; height: 18px; border-radius: 5px; border: 2px solid ${C.sageLight}; background: transparent; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s ease; }
  .grocery-check.checked { background: ${C.forest}; border-color: ${C.forest}; color: white; font-size: 11px; }
  .grocery-item-name { font-size: 13.5px; color: ${C.charcoal}; flex: 1; }
  .grocery-item-qty { font-size: 12px; color: ${C.muted}; font-weight: 500; }
  .recipe-section { background: ${C.warmWhite}; border-radius: 18px; border: 1px solid rgba(0,0,0,0.06); padding: 24px; margin-bottom: 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); animation: fadeUp 0.4s ease; }
  .recipe-meta { display: flex; gap: 20px; margin: 12px 0 20px; flex-wrap: wrap; }
  .recipe-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${C.muted}; }
  .recipe-meta-icon { font-size: 16px; }
  .recipe-body { display: grid; grid-template-columns: 1fr 1.6fr; gap: 24px; }
  .recipe-ingredients h4, .recipe-steps h4 { font-family: 'Playfair Display', serif; font-size: 15px; margin-bottom: 12px; color: ${C.charcoal}; }
  .ingredient-list { list-style: none; }
  .ingredient-list li { padding: 6px 0; font-size: 13.5px; border-bottom: 1px solid rgba(0,0,0,0.05); color: ${C.charcoal}; display: flex; gap: 8px; }
  .ingredient-list li::before { content: "·"; color: ${C.clay}; font-weight: 700; flex-shrink: 0; }
  .steps-list { list-style: none; counter-reset: step; }
  .steps-list li { padding: 8px 0 8px 36px; font-size: 13.5px; line-height: 1.55; border-bottom: 1px solid rgba(0,0,0,0.05); color: ${C.charcoal}; position: relative; counter-increment: step; }
  .steps-list li::before { content: counter(step); position: absolute; left: 0; top: 8px; width: 22px; height: 22px; background: ${C.forest}; color: white; border-radius: 50%; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .paywall-overlay { position: fixed; inset: 0; background: rgba(28,28,30,0.75); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.25s ease; }
  .paywall-card { background: ${C.warmWhite}; border-radius: 24px; max-width: 460px; width: 90%; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.25); animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1); }
  .paywall-top { background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestLight} 60%, ${C.sage} 100%); padding: 36px 32px 28px; text-align: center; }
  .paywall-emoji { font-size: 42px; margin-bottom: 12px; }
  .paywall-top h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: white; margin-bottom: 8px; }
  .paywall-top p { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.5; }
  .paywall-body { padding: 28px 32px; }
  .paywall-features { list-style: none; margin-bottom: 24px; }
  .paywall-features li { padding: 8px 0; font-size: 14px; color: ${C.charcoal}; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .feature-check { width: 22px; height: 22px; background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestLight} 100%); border-radius: 50%; color: white; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .paywall-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .plan-option { border: 2px solid rgba(0,0,0,0.1); border-radius: 14px; padding: 14px; cursor: pointer; transition: all 0.18s ease; text-align: center; position: relative; }
  .plan-option:hover { border-color: ${C.clay}; }
  .plan-option.selected { border-color: ${C.clay}; background: rgba(201,123,75,0.06); }
  .plan-popular { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${C.clay}; color: white; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; white-space: nowrap; letter-spacing: 0.5px; }
  .plan-name { font-size: 12px; font-weight: 600; color: ${C.muted}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .plan-price { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: ${C.charcoal}; line-height: 1; }
  .plan-price span { font-family: 'DM Sans', sans-serif; font-size: 12px; color: ${C.muted}; font-weight: 400; }
  .plan-save { font-size: 11px; color: ${C.forest}; font-weight: 600; margin-top: 4px; }
  .paywall-cta { width: 100%; background: linear-gradient(135deg, ${C.clay} 0%, ${C.clayDark} 100%); color: white; border: none; padding: 16px; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.18s ease; box-shadow: 0 4px 16px rgba(201,123,75,0.4); letter-spacing: 0.2px; }
  .paywall-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,123,75,0.45); }
  .paywall-dismiss { width: 100%; background: none; border: none; color: ${C.muted}; font-size: 13px; margin-top: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.15s; }
  .paywall-dismiss:hover { color: ${C.charcoal}; }
  .paywall-trust { font-size: 11px; color: ${C.muted}; text-align: center; margin-top: 10px; }
  .onboard-overlay { position: fixed; inset: 0; background: ${C.forest}; z-index: 300; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.4s ease; }
  .onboard-card { max-width: 500px; width: 90%; animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  .onboard-progress { display: flex; gap: 6px; margin-bottom: 32px; justify-content: center; }
  .onboard-dot { width: 28px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.25); transition: background 0.3s; }
  .onboard-dot.active { background: ${C.clay}; }
  .onboard-dot.done { background: rgba(255,255,255,0.6); }
  .onboard-step h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: white; margin-bottom: 12px; line-height: 1.2; }
  .onboard-step h2 em { color: ${C.clayLight}; font-style: italic; }
  .onboard-step p { font-size: 16px; color: rgba(255,255,255,0.65); line-height: 1.6; margin-bottom: 28px; }
  .onboard-options { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
  .onboard-option { padding: 10px 18px; border-radius: 50px; border: 2px solid rgba(255,255,255,0.25); background: transparent; color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.18s ease; }
  .onboard-option:hover { border-color: rgba(255,255,255,0.5); }
  .onboard-option.selected { background: ${C.clay}; border-color: ${C.clay}; }
  .onboard-next { width: 100%; background: ${C.clay}; color: white; border: none; padding: 16px; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.18s ease; box-shadow: 0 4px 20px rgba(201,123,75,0.4); }
  .onboard-next:hover { transform: translateY(-2px); background: ${C.clayDark}; }
  .pantry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 20px; }
  .pantry-item { background: ${C.warmWhite}; border-radius: 12px; padding: 14px; text-align: center; cursor: pointer; border: 1.5px solid transparent; transition: all 0.18s ease; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .pantry-item:hover { border-color: ${C.sageLight}; transform: translateY(-2px); }
  .pantry-item.low { border-color: ${C.gold}; }
  .pantry-item.out { border-color: ${C.error}; opacity: 0.7; }
  .pantry-emoji { font-size: 28px; margin-bottom: 8px; }
  .pantry-name { font-size: 13px; font-weight: 600; color: ${C.charcoal}; margin-bottom: 4px; }
  .pantry-status { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .pantry-status.good { color: ${C.forest}; }
  .pantry-status.low { color: ${C.gold}; }
  .pantry-status.out { color: ${C.error}; }
  .insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
  .insight-card { background: ${C.warmWhite}; border-radius: 16px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-align: center; }
  .insight-icon { font-size: 28px; margin-bottom: 10px; }
  .insight-num { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: ${C.charcoal}; margin-bottom: 4px; }
  .insight-label { font-size: 12px; color: ${C.muted}; font-weight: 500; line-height: 1.4; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @med
