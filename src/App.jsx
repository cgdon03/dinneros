/* eslint-disable */
import { useState, useEffect, useRef } from "react";

const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY || "";
const STRIPE_MO = process.env.REACT_APP_STRIPE_MONTHLY || "";
const STRIPE_YR = process.env.REACT_APP_STRIPE_ANNUAL || "";
const MODEL = "llama-3.3-70b-versatile";
const API = "https://api.groq.com/openai/v1/chat/completions";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
body{font-family:'DM Sans',sans-serif;background:#FAF7F2;color:#1C1C1E;-webkit-font-smoothing:antialiased}
.app{min-height:100vh;display:flex;flex-direction:column}
.nav{background:#FFFDF9;border-bottom:1px solid rgba(0,0,0,.07);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:10px}
.logo-box{width:34px;height:34px;background:linear-gradient(135deg,#C97B4B,#A85E2E);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px}
.logo-text{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:#1C1C1E}
.logo-text span{color:#C97B4B}
.nav-tabs{display:flex;gap:2px}
.tab{padding:6px 14px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#8A8A8E;cursor:pointer}
.tab:hover{background:#F5F0E8;color:#1C1C1E}
.tab.on{background:rgba(201,123,75,.1);color:#C97B4B}
.nav-right{display:flex;align-items:center;gap:8px}
.pro-badge{background:linear-gradient(135deg,#D4A843,#C97B4B);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px}
.avi{width:32px;height:32px;background:linear-gradient(135deg,#2D4A3E,#3D6356);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600}
.btn{background:#C97B4B;color:#fff;border:none;padding:8px 16px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(201,123,75,.3)}
.btn:hover{background:#A85E2E;transform:translateY(-1px)}
.btn:disabled{opacity:.6;transform:none;cursor:not-allowed}
.btn-sm{padding:5px 12px;font-size:12px}
.main{flex:1;max-width:1160px;margin:0 auto;width:100%;padding:28px 20px 60px}
.hero{text-align:center;padding:44px 0 36px}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C97B4B;margin-bottom:12px}
.h1{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,54px);font-weight:700;line-height:1.12;color:#1C1C1E;margin-bottom:14px;letter-spacing:-1px}
.h1 em{color:#C97B4B;font-style:italic}
.sub{font-size:16px;color:#8A8A8E;max-width:460px;margin:0 auto 28px;line-height:1.6}
.stats{display:flex;justify-content:center;gap:32px}
.stat-num{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#1C1C1E}
.stat-lbl{font-size:11px;color:#8A8A8E}
.row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.h2{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1C1C1E}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:32px}
.day{background:#FFFDF9;border-radius:12px;padding:12px 10px;border:1.5px solid transparent;min-height:120px;display:flex;flex-direction:column;cursor:pointer;position:relative;transition:all .18s}
.day:hover{border-color:#B5CFC8;transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.07)}
.day.today{border-color:#C97B4B;background:linear-gradient(160deg,#FFF8F2,#FFFDF9)}
.day.sel{border-color:#2D4A3E;box-shadow:0 0 0 3px rgba(45,74,62,.1)}
.dlbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8A8A8E;margin-bottom:3px}
.dnum{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1C1C1E;margin-bottom:8px;line-height:1}
.dot{width:6px;height:6px;background:#C97B4B;border-radius:50%;position:absolute;top:10px;right:10px}
.mpill{font-size:10px;font-weight:500;color:#1C1C1E;background:#F5F0E8;border-radius:6px;padding:4px 7px;line-height:1.3;border-left:3px solid #B5CFC8;flex:1;overflow:hidden}
.mpill.load{background:linear-gradient(90deg,#F5F0E8 25%,#EDE8DE 50%,#F5F0E8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;color:transparent;min-height:32px}
.empty{font-size:10px;color:#C4C4C6;font-style:italic;margin-top:auto}
.addbtn{background:none;border:1.5px dashed #C4C4C6;border-radius:6px;color:#C4C4C6;font-size:16px;width:100%;height:28px;cursor:pointer;margin-top:auto}
.addbtn:hover{border-color:#7BA99A;color:#7BA99A}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:32px}
.card{background:#FFFDF9;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.06);display:flex;flex-direction:column;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.card-head{padding:14px 18px;background:linear-gradient(135deg,#2D4A3E,#3D6356);display:flex;align-items:center;gap:9px}
.card-head.orange{background:linear-gradient(135deg,#C97B4B,#A85E2E)}
.card-head h3{font-family:'Playfair Display',serif;font-size:15px;color:#fff;margin-bottom:1px}
.card-head p{font-size:11px;color:rgba(255,255,255,.65)}
.msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:260px;max-height:300px;background:#FAF7F2}
.msg{max-width:88%;padding:9px 13px;border-radius:13px;font-size:13px;line-height:1.5}
.msg.ai{background:#fff;border:1px solid rgba(0,0,0,.07);align-self:flex-start;border-bottom-left-radius:3px;color:#1C1C1E}
.msg.user{background:linear-gradient(135deg,#C97B4B,#A85E2E);color:#fff;align-self:flex-end;border-bottom-right-radius:3px}
.msg.typing{background:#fff;border:1px solid rgba(0,0,0,.07);align-self:flex-start;color:#8A8A8E;font-style:italic}
.input-row{display:flex;gap:7px;padding:10px 14px;background:#FFFDF9;border-top:1px solid rgba(0,0,0,.06)}
.tinput{flex:1;border:1.5px solid rgba(0,0,0,.1);border-radius:9px;padding:9px 12px;font-family:'DM Sans',sans-serif;font-size:13px;background:#FAF7F2;color:#1C1C1E;outline:none;resize:none;min-height:40px;max-height:90px}
.tinput:focus{border-color:#C97B4B}
.sendbtn{background:linear-gradient(135deg,#C97B4B,#A85E2E);border:none;width:40px;height:40px;border-radius:9px;color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 7px rgba(201,123,75,.3)}
.sendbtn:disabled{opacity:.5;cursor:not-allowed}
.gitems{padding:10px 14px;min-height:180px;max-height:300px;overflow-y:auto}
.gcat{margin-bottom:12px}
.gcatn{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8A8A8E;margin-bottom:6px;padding-bottom:3px;border-bottom:1px solid rgba(0,0,0,.05)}
.gitem{display:flex;align-items:center;gap:9px;padding:5px 0;cursor:pointer}
.gitem.done{opacity:.4}
.gitem.done .gname{text-decoration:line-through}
.gcheck{width:17px;height:17px;border-radius:4px;border:2px solid #B5CFC8;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.gcheck.done{background:#2D4A3E;border-color:#2D4A3E;color:#fff;font-size:10px}
.gname{font-size:13px;color:#1C1C1E;flex:1}
.gqty{font-size:11px;color:#8A8A8E}
.rsec{background:#FFFDF9;border-radius:16px;border:1px solid rgba(0,0,0,.06);padding:22px;margin-bottom:32px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.rmeta{display:flex;gap:18px;margin:10px 0 18px;flex-wrap:wrap}
.rmi{display:flex;align-items:center;gap:5px;font-size:12px;color:#8A8A8E}
.rbody{display:grid;grid-template-columns:1fr 1.6fr;gap:22px}
.rbody h4{font-family:'Playfair Display',serif;font-size:14px;margin-bottom:10px;color:#1C1C1E}
.ings{list-style:none}
.ings li{padding:5px 0;font-size:13px;border-bottom:1px solid rgba(0,0,0,.05);color:#1C1C1E;display:flex;gap:7px}
.ings li::before{content:"*";color:#C97B4B;font-weight:700;flex-shrink:0}
.steps{list-style:none;counter-reset:s}
.steps li{padding:7px 0 7px 34px;font-size:13px;line-height:1.5;border-bottom:1px solid rgba(0,0,0,.05);color:#1C1C1E;position:relative;counter-increment:s}
.steps li::before{content:counter(s);position:absolute;left:0;top:7px;width:21px;height:21px;background:#2D4A3E;color:#fff;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}
.pantry-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px;margin-top:18px}
.pitem{background:#FFFDF9;border-radius:11px;padding:13px;text-align:center;border:1.5px solid transparent;transition:all .18s;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.pitem:hover{border-color:#B5CFC8;transform:translateY(-2px)}
.pitem.low{border-color:#D4A843}
.pitem.out{border-color:#D94F3F;opacity:.7}
.pemi{font-size:26px;margin-bottom:7px}
.pname{font-size:12px;font-weight:600;color:#1C1C1E;margin-bottom:3px}
.pstat{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.pstat.good{color:#2D4A3E}
.pstat.low{color:#D4A843}
.pstat.out{color:#D94F3F}
.igrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px}
.icard{background:#FFFDF9;border-radius:14px;padding:18px;border:1px solid rgba(0,0,0,.06);text-align:center;box-shadow:0 2px 7px rgba(0,0,0,.04)}
.iico{font-size:26px;margin-bottom:9px}
.inum{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#1C1C1E;margin-bottom:3px}
.ilbl{font-size:11px;color:#8A8A8E;font-weight:500;line-height:1.4}
.overlay{position:fixed;inset:0;background:rgba(28,28,30,.75);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center}
.pwall{background:#FFFDF9;border-radius:22px;max-width:450px;width:90%;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.25);max-height:92vh;overflow-y:auto}
.ptop{background:linear-gradient(135deg,#2D4A3E,#3D6356 60%,#7BA99A);padding:32px 28px 24px;text-align:center}
.ptop h2{font-family:'Playfair Display',serif;font-size:24px;color:#fff;margin-bottom:7px}
.ptop p{font-size:13px;color:rgba(255,255,255,.75);line-height:1.5}
.pbody{padding:24px 28px}
.pfeat{list-style:none;margin-bottom:20px}
.pfeat li{padding:7px 0;font-size:13px;color:#1C1C1E;display:flex;align-items:center;gap:9px;border-bottom:1px solid rgba(0,0,0,.05)}
.fcheck{width:20px;height:20px;background:linear-gradient(135deg,#2D4A3E,#3D6356);border-radius:50%;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.plans{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}
.plan{border:2px solid rgba(0,0,0,.1);border-radius:13px;padding:13px;cursor:pointer;text-align:center;position:relative;transition:all .18s}
.plan:hover{border-color:#C97B4B}
.plan.on{border-color:#C97B4B;background:rgba(201,123,75,.05)}
.popular{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#C97B4B;color:#fff;font-size:9px;font-weight:700;padding:2px 9px;border-radius:20px;white-space:nowrap}
.pln{font-size:11px;font-weight:600;color:#8A8A8E;text-transform:uppercase;letter-spacing:.7px;margin-bottom:5px}
.ppr{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#1C1C1E;line-height:1}
.ppr span{font-family:'DM Sans',sans-serif;font-size:11px;color:#8A8A8E;font-weight:400}
.psave{font-size:10px;color:#2D4A3E;font-weight:600;margin-top:3px}
.pcta{width:100%;background:linear-gradient(135deg,#C97B4B,#A85E2E);color:#fff;border:none;padding:15px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(201,123,75,.4)}
.pcta:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,123,75,.45)}
.pdis{width:100%;background:none;border:none;color:#8A8A8E;font-size:12px;margin-top:10px;cursor:pointer;font-family:'DM Sans',sans-serif}
.ptrust{font-size:10px;color:#8A8A8E;text-align:center;margin-top:9px}
.oboard{position:fixed;inset:0;background:#2D4A3E;z-index:300;display:flex;align-items:center;justify-content:center}
.ocard{max-width:480px;width:90%}
.oprog{display:flex;gap:5px;margin-bottom:28px;justify-content:center}
.odot{width:26px;height:4px;border-radius:2px;background:rgba(255,255,255,.25)}
.odot.on{background:#C97B4B}
.odot.done{background:rgba(255,255,255,.6)}
.ocard h2{font-family:'Playfair Display',serif;font-size:28px;color:#fff;margin-bottom:10px;line-height:1.2}
.ocard p{font-size:15px;color:rgba(255,255,255,.65);line-height:1.6;margin-bottom:24px}
.oopts{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:28px}
.oopt{padding:9px 16px;border-radius:50px;border:2px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer}
.oopt:hover{border-color:rgba(255,255,255,.5)}
.oopt.on{background:#C97B4B;border-color:#C97B4B}
.onext{width:100%;background:#C97B4B;color:#fff;border:none;padding:14px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(201,123,75,.4)}
.ibanner{background:linear-gradient(135deg,#2D4A3E,#3D6356);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.ibanner-txt{font-size:12px;color:#fff;font-weight:500}
.ibanner-txt strong{display:block;font-size:13px;margin-bottom:1px}
.ibtn{background:#fff;color:#2D4A3E;border:none;padding:7px 14px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0}
.idis{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;cursor:pointer;padding:0 3px;flex-shrink:0}
.sbanner{background:linear-gradient(135deg,#2D4A3E,#3D6356);padding:14px 20px;text-align:center;color:#fff}
.sbanner h3{font-family:'Playfair Display',serif;font-size:17px;margin-bottom:3px}
.sbanner p{font-size:12px;color:rgba(255,255,255,.75)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.spin{display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@media(max-width:900px){.week{grid-template-columns:repeat(4,1fr)}.two{grid-template-columns:1fr}.rbody{grid-template-columns:1fr}.igrid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.week{grid-template-columns:repeat(2,1fr)}.nav-tabs{display:none}.stats{gap:16px}.igrid{grid-template-columns:1fr 1fr}}
`;

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TOD = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const STEPS = [
  {q:"What does your household look like?",h:"We will tailor every meal to your family.",opts:["Just me","Couple","Family of 3-4","Family of 5+","Roommates"]},
  {q:"Any dietary needs?",h:"Select all that apply.",opts:["None","Vegetarian","Vegan","Gluten-Free","Dairy-Free","Nut-Free","Keto"]},
  {q:"How much time on weeknights?",h:"Be honest, we are not judging.",opts:["Under 20 min","20-30 min","30-45 min","1+ hour","Varies"]},
];

const MEALS0 = [
  ["Sheet Pan Salmon and Asparagus",null,null],
  ["Chicken Tikka Masala",null,null],
  [null,null,null],
  ["Turkey Taco Bowls",null,null],
  ["Pasta Primavera",null,null],
  ["Homemade Ramen",null,null],
  [null,"Shakshuka",null],
];

const GRO0 = {
  Produce:[{n:"Asparagus",q:"1 bunch",c:false},{n:"Cherry Tomatoes",q:"1 pint",c:false}],
  Protein:[{n:"Salmon Fillets",q:"4 pieces",c:false}],
  Pantry:[{n:"Basmati Rice",q:"2 cups",c:true}],
  Dairy:[{n:"Butter",q:"1 stick",c:false}],
};

async function groq(messages) {
  const r = await fetch(API, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":"Bearer " + GROQ_KEY},
    body: JSON.stringify({model:MODEL, max_tokens:1000, messages}),
  });
  const d = await r.json();
  return d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content : "";
}

export default function App() {
  const [ob, setOb] = useState(true);
  const [obStep, setObStep] = useState(0);
  const [obSel, setObSel] = useState({});
  const [tab, setTab] = useState("planner");
  const [pro, setPro] = useState(false);
  const [meals, setMeals] = useState(MEALS0);
  const [loadW, setLoadW] = useState(false);
  const [msgs, setMsgs] = useState([{r:"ai",t:"Hi! I am your DinnerOS assistant."}]);
  const [inp, setInp] = useState("");
  const [gro, setGro] = useState(GRO0);
  const end = useRef(null);

  const genWeek = async () => {
    setLoadW(true);
    try {
      const prefs = Object.values(obSel).join(", ");
      const txt = await groq([{role:"user",content: `Generate a plan for ${prefs}.`}]);
      if (txt) setMeals(JSON.parse(txt));
    } catch (e) { console.error(e); }
    finally { setLoadW(false); }
  };

  const handleNext = () => {
    if (obStep < STEPS.length - 1) setObStep(s => s + 1);
    else setOb(false);
  };

  return (
    <div className="app">
      <style>{css}</style>
      
      {ob && (
        <div className="oboard">
          <div className="ocard">
            <div className="oprog">
              {STEPS.map((_, i) => <div key={i} className={`odot ${i <= obStep ? 'on' : ''}`} />)}
            </div>
            <h2>{STEPS[obStep].q}</h2>
            <p>{STEPS[obStep].h}</p>
            <div className="oopts">
              {STEPS[obStep].opts.map(o => (
                <button key={o} className={`oopt ${obSel[obStep] === o ? 'on' : ''}`} onClick={() => setObSel({...obSel, [obStep]: o})}>{o}</button>
              ))}
            </div>
            <button className="onext" onClick={handleNext}>Next Step</button>
          </div>
        </div>
      )}

      <nav className="nav">
        <div className="logo"><div className="logo-box">🥘</div><div className="logo-text">Dinner<span>OS</span></div></div>
        <div className="nav-tabs">
          <button onClick={() => setTab("planner")} className={`tab ${tab === "planner" ? 'on' : ''}`}>Planner</button>
          <button onClick={() => setTab("pantry")} className={`tab ${tab === "pantry" ? 'on' : ''}`}>Pantry</button>
        </div>
        <div className="nav-right">{pro && <span className="pro-badge">PRO</span>}<div className="avi">ME</div></div>
      </nav>

      <main className="main">
        {tab === "planner" ? (
          <>
            <header className="hero">
              <div className="eyebrow">Dinner is served</div>
              <h1 className="h1">Weekly <em>Planner</em></h1>
              <button className="btn" onClick={genWeek} disabled={loadW}>{loadW ? <span className="spin"></span> : "✨ Generate Week"}</button>
            </header>
            <div className="week">
              {DAYS.map((d, i) => (
                <div key={d} className={`day ${i === TOD ? 'today' : ''}`}>
                  <div className="dlbl">{d}</div>
                  <div className="mpill">{meals[i][0] || "No meal"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="pantry-grid"><p>Pantry coming soon...</p></div>
        )}
      </main>
    </div>
  );
}
