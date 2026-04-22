/* eslint-disable */
import { useState, useEffect, useRef } from "react";

var GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY || "";
var STRIPE_MO = process.env.REACT_APP_STRIPE_MONTHLY || "";
var STRIPE_YR = process.env.REACT_APP_STRIPE_ANNUAL || "";
var MODEL = "llama-3.3-70b-versatile";
var APIURL = "https://api.groq.com/openai/v1/chat/completions";

var css = [
"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');",
"*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
"html,body,#root{height:100%}",
"body{font-family:'DM Sans',sans-serif;background:#FAF7F2;color:#1C1C1E;-webkit-font-smoothing:antialiased}",
".app{min-height:100vh;display:flex;flex-direction:column}",
".nav{background:#FFFDF9;border-bottom:1px solid rgba(0,0,0,.07);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}",
".logo{display:flex;align-items:center;gap:10px}",
".logo-box{width:34px;height:34px;background:linear-gradient(135deg,#C97B4B,#A85E2E);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px}",
".logo-text{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:#1C1C1E}",
".logo-text span{color:#C97B4B}",
".nav-tabs{display:flex;gap:2px}",
".tab{padding:6px 14px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#8A8A8E;cursor:pointer}",
".tab:hover{background:#F5F0E8;color:#1C1C1E}",
".tab.on{background:rgba(201,123,75,.1);color:#C97B4B}",
".nav-right{display:flex;align-items:center;gap:8px}",
".pro-badge{background:linear-gradient(135deg,#D4A843,#C97B4B);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px}",
".avi{width:32px;height:32px;background:linear-gradient(135deg,#2D4A3E,#3D6356);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600}",
".btn{background:#C97B4B;color:#fff;border:none;padding:8px 16px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(201,123,75,.3)}",
".btn:hover{background:#A85E2E;transform:translateY(-1px)}",
".btn:disabled{opacity:.6;transform:none;cursor:not-allowed}",
".btn-sm{padding:5px 12px;font-size:12px}",
".main{flex:1;max-width:1160px;margin:0 auto;width:100%;padding:28px 20px 60px}",
".hero{text-align:center;padding:44px 0 36px}",
".eyebrow{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C97B4B;margin-bottom:12px}",
".h1{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,54px);font-weight:700;line-height:1.12;color:#1C1C1E;margin-bottom:14px;letter-spacing:-1px}",
".h1 em{color:#C97B4B;font-style:italic}",
".sub{font-size:16px;color:#8A8A8E;max-width:460px;margin:0 auto 28px;line-height:1.6}",
".stats{display:flex;justify-content:center;gap:32px;margin-bottom:8px}",
".stat-num{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#1C1C1E}",
".stat-lbl{font-size:11px;color:#8A8A8E}",
".row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}",
".h2{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1C1C1E}",
".week{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:32px}",
".day{background:#FFFDF9;border-radius:12px;padding:12px 10px;border:1.5px solid transparent;min-height:120px;display:flex;flex-direction:column;cursor:pointer;position:relative;transition:all .18s}",
".day:hover{border-color:#B5CFC8;transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.07)}",
".day.today{border-color:#C97B4B;background:linear-gradient(160deg,#FFF8F2,#FFFDF9)}",
".day.sel{border-color:#2D4A3E;box-shadow:0 0 0 3px rgba(45,74,62,.1)}",
".dlbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8A8A8E;margin-bottom:3px}",
".dnum{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1C1C1E;margin-bottom:8px;line-height:1}",
".dot{width:6px;height:6px;background:#C97B4B;border-radius:50%;position:absolute;top:10px;right:10px}",
".mpill{font-size:10px;font-weight:500;color:#1C1C1E;background:#F5F0E8;border-radius:6px;padding:4px 7px;line-height:1.3;border-left:3px solid #B5CFC8;flex:1;overflow:hidden}",
".mpill.load{background:linear-gradient(90deg,#F5F0E8 25%,#EDE8DE 50%,#F5F0E8 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;color:transparent;min-height:32px}",
".empty{font-size:10px;color:#C4C4C6;font-style:italic;margin-top:auto}",
".addbtn{background:none;border:1.5px dashed #C4C4C6;border-radius:6px;color:#C4C4C6;font-size:16px;width:100%;height:28px;cursor:pointer;margin-top:auto}",
".addbtn:hover{border-color:#7BA99A;color:#7BA99A}",
".two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:32px}",
".card{background:#FFFDF9;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.06);display:flex;flex-direction:column;box-shadow:0 2px 10px rgba(0,0,0,.04)}",
".card-head{padding:14px 18px;background:linear-gradient(135deg,#2D4A3E,#3D6356);display:flex;align-items:center;gap:9px}",
".card-head.orange{background:linear-gradient(135deg,#C97B4B,#A85E2E)}",
".card-head h3{font-family:'Playfair Display',serif;font-size:15px;color:#fff;margin-bottom:1px}",
".card-head p{font-size:11px;color:rgba(255,255,255,.65)}",
".msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:260px;max-height:300px;background:#FAF7F2}",
".msg{max-width:88%;padding:9px 13px;border-radius:13px;font-size:13px;line-height:1.5}",
".msg.ai{background:#fff;border:1px solid rgba(0,0,0,.07);align-self:flex-start;border-bottom-left-radius:3px;color:#1C1C1E}",
".msg.user{background:linear-gradient(135deg,#C97B4B,#A85E2E);color:#fff;align-self:flex-end;border-bottom-right-radius:3px}",
".msg.typing{background:#fff;border:1px solid rgba(0,0,0,.07);align-self:flex-start;color:#8A8A8E;font-style:italic}",
".input-row{display:flex;gap:7px;padding:10px 14px;background:#FFFDF9;border-top:1px solid rgba(0,0,0,.06)}",
".tinput{flex:1;border:1.5px solid rgba(0,0,0,.1);border-radius:9px;padding:9px 12px;font-family:'DM Sans',sans-serif;font-size:13px;background:#FAF7F2;color:#1C1C1E;outline:none;resize:none;min-height:40px;max-height:90px}",
".tinput:focus{border-color:#C97B4B}",
".sendbtn{background:linear-gradient(135deg,#C97B4B,#A85E2E);border:none;width:40px;height:40px;border-radius:9px;color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 7px rgba(201,123,75,.3)}",
".sendbtn:disabled{opacity:.5;cursor:not-allowed}",
".gitems{padding:10px 14px;min-height:180px;max-height:300px;overflow-y:auto}",
".gcat{margin-bottom:12px}",
".gcatn{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8A8A8E;margin-bottom:6px;padding-bottom:3px;border-bottom:1px solid rgba(0,0,0,.05)}",
".gitem{display:flex;align-items:center;gap:9px;padding:5px 0;cursor:pointer}",
".gitem.done{opacity:.4}",
".gitem.done .gname{text-decoration:line-through}",
".gcheck{width:17px;height:17px;border-radius:4px;border:2px solid #B5CFC8;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
".gcheck.done{background:#2D4A3E;border-color:#2D4A3E;color:#fff;font-size:10px}",
".gname{font-size:13px;color:#1C1C1E;flex:1}",
".gqty{font-size:11px;color:#8A8A8E}",
".rsec{background:#FFFDF9;border-radius:16px;border:1px solid rgba(0,0,0,.06);padding:22px;margin-bottom:32px;box-shadow:0 2px 10px rgba(0,0,0,.04)}",
".rmeta{display:flex;gap:18px;margin:10px 0 18px;flex-wrap:wrap}",
".rmi{display:flex;align-items:center;gap:5px;font-size:12px;color:#8A8A8E}",
".rbody{display:grid;grid-template-columns:1fr 1.6fr;gap:22px}",
".rbody h4{font-family:'Playfair Display',serif;font-size:14px;margin-bottom:10px;color:#1C1C1E}",
".ings{list-style:none}",
".ings li{padding:5px 0;font-size:13px;border-bottom:1px solid rgba(0,0,0,.05);color:#1C1C1E;display:flex;gap:7px}",
".steps{list-style:none;counter-reset:s}",
".steps li{padding:7px 0 7px 34px;font-size:13px;line-height:1.5;border-bottom:1px solid rgba(0,0,0,.05);color:#1C1C1E;position:relative;counter-increment:s}",
".steps li::before{content:counter(s);position:absolute;left:0;top:7px;width:21px;height:21px;background:#2D4A3E;color:#fff;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}",
".pantry-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px;margin-top:18px}",
".pitem{background:#FFFDF9;border-radius:11px;padding:13px;text-align:center;border:1.5px solid transparent;transition:all .18s;box-shadow:0 1px 4px rgba(0,0,0,.04)}",
".pitem:hover{border-color:#B5CFC8;transform:translateY(-2px)}",
".pitem.low{border-color:#D4A843}",
".pitem.out{border-color:#D94F3F;opacity:.7}",
".pemi{font-size:26px;margin-bottom:7px}",
".pname{font-size:12px;font-weight:600;color:#1C1C1E;margin-bottom:3px}",
".pstat{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}",
".pstat.good{color:#2D4A3E}",
".pstat.low{color:#D4A843}",
".pstat.out{color:#D94F3F}",
".igrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px}",
".icard{background:#FFFDF9;border-radius:14px;padding:18px;border:1px solid rgba(0,0,0,.06);text-align:center;box-shadow:0 2px 7px rgba(0,0,0,.04)}",
".iico{font-size:26px;margin-bottom:9px}",
".inum{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#1C1C1E;margin-bottom:3px}",
".ilbl{font-size:11px;color:#8A8A8E;font-weight:500;line-height:1.4}",
".overlay{position:fixed;inset:0;background:rgba(28,28,30,.75);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center}",
".pwall{background:#FFFDF9;border-radius:22px;max-width:450px;width:90%;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.25);max-height:92vh;overflow-y:auto}",
".ptop{background:linear-gradient(135deg,#2D4A3E,#3D6356 60%,#7BA99A);padding:32px 28px 24px;text-align:center}",
".ptop h2{font-family:'Playfair Display',serif;font-size:24px;color:#fff;margin-bottom:7px}",
".ptop p{font-size:13px;color:rgba(255,255,255,.75);line-height:1.5}",
".pbody{padding:24px 28px}",
".pfeat{list-style:none;margin-bottom:20px}",
".pfeat li{padding:7px 0;font-size:13px;color:#1C1C1E;display:flex;align-items:center;gap:9px;border-bottom:1px solid rgba(0,0,0,.05)}",
".fcheck{width:20px;height:20px;background:linear-gradient(135deg,#2D4A3E,#3D6356);border-radius:50%;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
".plans{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}",
".plan{border:2px solid rgba(0,0,0,.1);border-radius:13px;padding:13px;cursor:pointer;text-align:center;position:relative;transition:all .18s}",
".plan:hover{border-color:#C97B4B}",
".plan.on{border-color:#C97B4B;background:rgba(201,123,75,.05)}",
".popular{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#C97B4B;color:#fff;font-size:9px;font-weight:700;padding:2px 9px;border-radius:20px;white-space:nowrap}",
".pln{font-size:11px;font-weight:600;color:#8A8A8E;text-transform:uppercase;letter-spacing:.7px;margin-bottom:5px}",
".ppr{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#1C1C1E;line-height:1}",
".ppr span{font-family:'DM Sans',sans-serif;font-size:11px;color:#8A8A8E;font-weight:400}",
".psave{font-size:10px;color:#2D4A3E;font-weight:600;margin-top:3px}",
".pcta{width:100%;background:linear-gradient(135deg,#C97B4B,#A85E2E);color:#fff;border:none;padding:15px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(201,123,75,.4)}",
".pcta:hover{transform:translateY(-2px)}",
".pdis{width:100%;background:none;border:none;color:#8A8A8E;font-size:12px;margin-top:10px;cursor:pointer;font-family:'DM Sans',sans-serif}",
".ptrust{font-size:10px;color:#8A8A8E;text-align:center;margin-top:9px}",
".oboard{position:fixed;inset:0;background:#2D4A3E;z-index:300;display:flex;align-items:center;justify-content:center}",
".ocard{max-width:480px;width:90%}",
".oprog{display:flex;gap:5px;margin-bottom:28px;justify-content:center}",
".odot{width:26px;height:4px;border-radius:2px;background:rgba(255,255,255,.25)}",
".odot.on{background:#C97B4B}",
".odot.done{background:rgba(255,255,255,.6)}",
".ocard h2{font-family:'Playfair Display',serif;font-size:28px;color:#fff;margin-bottom:10px;line-height:1.2}",
".ocard p{font-size:15px;color:rgba(255,255,255,.65);line-height:1.6;margin-bottom:24px}",
".oopts{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:28px}",
".oopt{padding:9px 16px;border-radius:50px;border:2px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer}",
".oopt:hover{border-color:rgba(255,255,255,.5)}",
".oopt.on{background:#C97B4B;border-color:#C97B4B}",
".onext{width:100%;background:#C97B4B;color:#fff;border:none;padding:14px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(201,123,75,.4)}",
".ibanner{background:linear-gradient(135deg,#2D4A3E,#3D6356);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}",
".ibanner-txt{font-size:12px;color:#fff;font-weight:500}",
".ibanner-txt strong{display:block;font-size:13px;margin-bottom:1px}",
".ibtn{background:#fff;color:#2D4A3E;border:none;padding:7px 14px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0}",
".idis{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;cursor:pointer;padding:0 3px;flex-shrink:0}",
".sbanner{background:linear-gradient(135deg,#2D4A3E,#3D6356);padding:14px 20px;text-align:center;color:#fff}",
".sbanner h3{font-family:'Playfair Display',serif;font-size:17px;margin-bottom:3px}",
".sbanner p{font-size:12px;color:rgba(255,255,255,.75)}",
"@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}",
"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
".spin{display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}",
"@media(max-width:900px){.week{grid-template-columns:repeat(4,1fr)}.two{grid-template-columns:1fr}.rbody{grid-template-columns:1fr}.igrid{grid-template-columns:1fr 1fr}}",
"@media(max-width:600px){.week{grid-template-columns:repeat(2,1fr)}.nav-tabs{display:none}.stats{gap:16px}.igrid{grid-template-columns:1fr 1fr}}"
].join("\n");

var DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var TOD = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

var STEPS = [
  {q:"What does your household look like?",h:"We will tailor every meal to your family.",opts:["Just me","Couple","Family of 3-4","Family of 5+","Roommates"]},
  {q:"Any dietary needs?",h:"Select all that apply.",opts:["None","Vegetarian","Vegan","Gluten-Free","Dairy-Free","Nut-Free","Keto"]},
  {q:"How much time on weeknights?",h:"Be honest, we are not judging.",opts:["Under 20 min","20-30 min","30-45 min","1+ hour","Varies"]}
];

var MEALS0 = [
  ["Sheet Pan Salmon and Asparagus",null,null],
  ["Chicken Tikka Masala",null,null],
  [null,null,null],
  ["Turkey Taco Bowls",null,null],
  ["Pasta Primavera",null,null],
  ["Homemade Ramen",null,null],
  [null,"Shakshuka",null]
];

var PANTRY = [
  {e:"🍚",n:"Basmati Rice",s:"good"},{e:"🧄",n:"Garlic",s:"good"},
  {e:"🫒",n:"Olive Oil",s:"low"},{e:"🥫",n:"Canned Tomatoes",s:"good"},
  {e:"🧅",n:"Onions",s:"low"},{e:"🌶️",n:"Chili Flakes",s:"good"},
  {e:"🥚",n:"Eggs",s:"low"},{e:"🧈",n:"Butter",s:"out"},
  {e:"🍋",n:"Lemons",s:"good"},{e:"🥩",n:"Ground Turkey",s:"out"},
  {e:"🧀",n:"Parmesan",s:"good"},{e:"🥦",n:"Broccoli",s:"low"}
];

var GRO0 = {
  Produce:[{n:"Asparagus",q:"1 bunch",c:false},{n:"Cherry Tomatoes",q:"1 pint",c:false},{n:"Lemons",q:"4",c:true},{n:"Ginger",q:"1 piece",c:false}],
  Protein:[{n:"Salmon Fillets",q:"4 pieces",c:false},{n:"Chicken Thighs",q:"2 lbs",c:false},{n:"Ground Turkey",q:"1 lb",c:false}],
  Pantry:[{n:"Basmati Rice",q:"2 cups",c:true},{n:"Tikka Masala Paste",q:"1 jar",c:false},{n:"Coconut Milk",q:"1 can",c:false}],
  Dairy:[{n:"Butter",q:"1 stick",c:false},{n:"Plain Yogurt",q:"1 cup",c:false}]
};

var RCP = {
  ings:["4 salmon fillets (6 oz each)","1 bunch asparagus trimmed","3 tbsp olive oil","4 garlic cloves minced","1 lemon sliced","1 tsp smoked paprika","Salt and pepper to taste","Fresh dill to garnish"],
  steps:["Preheat oven to 425F. Line a sheet pan with parchment paper.","Toss asparagus with olive oil salt and pepper. Spread on pan.","Pat salmon dry. Mix oil with garlic and paprika. Rub over salmon.","Nestle salmon among asparagus. Top with lemon slices.","Roast 12-15 min until salmon flakes easily.","Garnish with dill and lemon. Serve immediately."]
};

function callGroq(messages) {
  return fetch(APIURL, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":"Bearer " + GROQ_KEY},
    body: JSON.stringify({model:MODEL, max_tokens:1000, messages:messages})
  }).then(function(r) {
    return r.json();
  }).then(function(d) {
    if (d.choices && d.choices[0] && d.choices[0].message) {
      return d.choices[0].message.content || "";
    }
    return "";
  }).catch(function(err) {
    console.error("Groq error:", err);
    return "";
  });
}

export default function App() {
  var s1 = useState(true); var ob = s1[0]; var setOb = s1[1];
  var s2 = useState(0); var obStep = s2[0]; var setObStep = s2[1];
  var s3 = useState({}); var obSel = s3[0]; var setObSel = s3[1];
  var s4 = useState("planner"); var tab = s4[0]; var setTab = s4[1];
  var s5 = useState(false); var pw = s5[0]; var setPw = s5[1];
  var s6 = useState("annual"); var plan = s6[0]; var setPlan = s6[1];
  var s7 = useState(false); var pro = s7[0]; var setPro = s7[1];
  var s8 = useState(MEALS0); var meals = s8[0]; var setMeals = s8[1];
  var s9 = useState(false); var loadW = s9[0]; var setLoadW = s9[1];
  var s10 = useState([{r:"ai",t:"Hi! I am your DinnerOS assistant. Ask me anything about dinner or recipes!"}]);
  var msgs = s10[0]; var setMsgs = s10[1];
  var s11 = useState(""); var inp = s11[0]; var setInp = s11[1];
  var s12 = useState(false); var chatLoad = s12[0]; var setChatLoad = s12[1];
  var s13 = useState(GRO0); var gro = s13[0]; var setGro = s13[1];
  var s14 = useState(false); var groLoad = s14[0]; var setGroLoad = s14[1];
  var s15 = useState(null); var selDay = s15[0]; var setSelDay = s15[1];
  var s16 = useState(false); var showR = s16[0]; var setShowR = s16[1];
  var s17 = useState(false); var ibanner = s17[0]; var setIbanner = s17[1];
  var s18 = useState(null); var iprompt = s18[0]; var setIprompt = s18[1];
  var s19 = useState(false); var sbanner = s19[0]; var setSbanner = s19[1];
  var end = useRef(null);

  useEffect(function() {
    if (localStorage.getItem("pro") === "1") setPro(true);
    var p = new URLSearchParams(window.location.search);
    if (p.get("success") === "1") {
      setPro(true);
      localStorage.setItem("pro","1");
      setSbanner(true);
      window.history.replaceState({},"",window.location.pathname);
      setTimeout(function() { setSbanner(false); }, 5000);
    }
  }, []);

  useEffect(function() {
    function handler(e) {
      e.preventDefault();
      setIprompt(e);
      setIbanner(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return function() { window.removeEventListener("beforeinstallprompt", handler); };
  }, []);

  useEffect(function() {
    if (end.current) end.current.scrollIntoView({behavior:"smooth"});
  }, [msgs]);

  function subscribe() {
    var url = plan === "annual" ? STRIPE_YR : STRIPE_MO;
    if (!url) { alert("Stripe not configured yet."); return; }
    window.location.href = url + "?success_url=" + encodeURIComponent(window.location.origin + "/?success=1");
  }

  function genWeek() {
    if (!pro) { setPw(true); return; }
    setLoadW(true);
    var prefs = Object.values(obSel).join(", ") || "family";
    var prompt = "Create a 7-day dinner meal plan for a household that is: " + prefs + ". Respond with ONLY a JSON object. No extra text. No markdown. No code fences. The JSON must have a meals key containing an array of exactly 7 arrays. Each inner array must have a meal name string as first element then null then null. Use short meal names of 2 to 5 words only.";
    callGroq([
      {role:"system",content:"You are a meal planning assistant. Return ONLY valid JSON. No markdown. No explanation."},
      {role:"user",content:prompt}
    ]).then(function(txt) {
      try {
        var clean = txt.replace(/```json/g,"").replace(/```/g,"").trim();
        var parsed = JSON.parse(clean);
        if (parsed && parsed.meals && parsed.meals.length === 7) {
          setMeals(parsed.meals);
        }
      } catch(e) { console.error("parse error:",e); }
      setLoadW(false);
    }).catch(function(e) {
      console.error("genWeek error:",e);
      setLoadW(false);
    });
  }

  function send() {
    var t = inp.trim();
    if (!t || chatLoad) return;
    setInp("");
    var next = msgs.concat([{r:"user",t:t}]);
    setMsgs(next);
    setChatLoad(true);
    var hist = next.map(function(m) { return {role:m.r==="ai"?"assistant":"user",content:m.t}; });
    callGroq([{role:"system",content:"You are DinnerOS, a helpful dinner planning assistant. Be friendly and concise. No markdown."}].concat(hist)).then(function(reply) {
      setMsgs(function(prev) { return prev.concat([{r:"ai",t:reply||"Sorry, try again!"}]); });
      setChatLoad(false);
    }).catch(function() {
      setMsgs(function(prev) { return prev.concat([{r:"ai",t:"Something went wrong. Please try again!"}]); });
      setChatLoad(false);
    });
  }

  function genGro() {
    if (!pro) { setPw(true); return; }
    setGroLoad(true);
    var dinners = meals.map(function(d,i) { return d[0] ? DAYS[i]+": "+d[0] : null; }).filter(Boolean).join(", ");
    var prompt = "Create a grocery list for these dinners: " + dinners + ". Respond with ONLY a JSON object. No extra text. No markdown. No code fences. The JSON must have keys Produce Protein Pantry and Dairy. Each key must be an array of objects with n for item name and q for quantity. Include 3 to 5 items per category.";
    callGroq([
      {role:"system",content:"You are a meal planning assistant. Return ONLY valid JSON. No markdown. No explanation."},
      {role:"user",content:prompt}
    ]).then(function(txt) {
      try {
        var clean = txt.replace(/```json/g,"").replace(/```/g,"").trim();
        var parsed = JSON.parse(clean);
        var out = {};
        Object.keys(parsed).forEach(function(k) {
          out[k] = parsed[k].map(function(item) { return {n:item.n,q:item.q,c:false}; });
        });
        setGro(out);
      } catch(e) { console.error("parse error:",e); }
      setGroLoad(false);
    }).catch(function(e) {
      console.error("genGro error:",e);
      setGroLoad(false);
    });
  }

  function togGro(cat,i) {
    setGro(function(prev) {
      var updated = {};
      Object.keys(prev).forEach(function(k) { updated[k] = prev[k].slice(); });
      var item = updated[cat][i];
      updated[cat][i] = {n:item.n,q:item.q,c:!item.c};
      return updated;
    });
  }

  var allItems = Object.values(gro).reduce(function(a,b){return a.concat(b);},[]);
  var checked = allItems.filter(function(x){return x.c;}).length;
  var total = allItems.length;

  return (
    <div className="app">
      <style>{css}</style>

      {ob ? (
        <div className="oboard">
          <div className="ocard">
            <div className="oprog">
              {STEPS.map(function(_,i){
                var cls = "odot";
                if (i < obStep) cls = "odot done";
                else if (i === obStep) cls = "odot on";
                return <div key={i} className={cls} />;
              })}
            </div>
            <h2>{STEPS[obStep].q}</h2>
            <p>{STEPS[obStep].h}</p>
            <div className="oopts">
              {STEPS[obStep].opts.map(function(o){
                var cls = obSel[obStep] === o ? "oopt on" : "oopt";
                return (
                  <button key={o} className={cls} onClick={function(){
                    var n = {}; Object.keys(obSel).forEach(function(k){n[k]=obSel[k];}); n[obStep]=o; setObSel(n);
                  }}>{o}</button>
                );
              })}
            </div>
            <button className="onext" onClick={function(){
              if (obStep < STEPS.length - 1) setObStep(obStep + 1); else setOb(false);
            }}>
              {obStep < STEPS.length - 1 ? "Continue" : "Start Planning Dinner"}
            </button>
          </div>
        </div>
      ) : null}

      {pw ? (
        <div className="overlay" onClick={function(e){if(e.target.className==="overlay")setPw(false);}}>
          <div className="pwall">
            <div className="ptop">
              <div style={{fontSize:"38px",marginBottom:"10px"}}>🍽️</div>
              <h2>Unlock DinnerOS Pro</h2>
              <p>Your personal AI chef. Planning, shopping and cooking made effortless.</p>
            </div>
            <div className="pbody">
              <ul className="pfeat">
                {["AI-generated weekly meal plans","Auto grocery lists by aisle","Pantry inventory tracking","Family preferences","Unlimited recipe suggestions","Nutrition insights"].map(function(f){
                  return <li key={f}><span className="fcheck">v</span>{f}</li>;
                })}
              </ul>
              <div className="plans">
                {[{id:"monthly",lbl:"Monthly",price:"$9",per:"/mo",save:"",pop:false},{id:"annual",lbl:"Annual",price:"$5",per:"/mo",save:"Save 44%",pop:true}].map(function(pl){
                  var cls = plan === pl.id ? "plan on" : "plan";
                  return (
                    <div key={pl.id} className={cls} onClick={function(){setPlan(pl.id);}}>
                      {pl.pop ? <span className="popular">Most Popular</span> : null}
                      <div className="pln">{pl.lbl}</div>
                      <div className="ppr">{pl.price}<span>{pl.per}</span></div>
                      {pl.save ? <div className="psave">{pl.save}</div> : null}
                    </div>
                  );
                })}
              </div>
              <button className="pcta" onClick={subscribe}>
                {plan === "annual" ? "Start for $59/year" : "Start for $9/month"}
              </button>
              <button className="pdis" onClick={function(){setPw(false);}}>Maybe later</button>
              <div className="ptrust">Secure checkout via Stripe. Cancel anytime.</div>
            </div>
          </div>
        </div>
      ) : null}

      {ibanner ? (
        <div className="ibanner">
          <div className="ibanner-txt"><strong>Add to your home screen</strong>Works like a real app</div>
          <button className="ibtn" onClick={function(){
            if(iprompt){iprompt.prompt();iprompt.userChoice.then(function(r){if(r.outcome==="accepted")setIbanner(false);});}
          }}>Install</button>
          <button className="idis" onClick={function(){setIbanner(false);}}>x</button>
        </div>
      ) : null}

      {sbanner ? (
        <div className="sbanner">
          <h3>Welcome to DinnerOS Pro!</h3>
          <p>All features are now unlocked. Enjoy!</p>
        </div>
      ) : null}

      <nav className="nav">
        <div className="logo">
          <div className="logo-box">🍽️</div>
          <span className="logo-text">Dinner<span>OS</span></span>
        </div>
        <div className="nav-tabs">
          {[["planner","Week Planner"],["grocery","Grocery"],["pantry","Pantry"],["insights","Insights"]].map(function(item){
            return <button key={item[0]} className={tab===item[0]?"tab on":"tab"} onClick={function(){setTab(item[0]);}}>{item[1]}</button>;
          })}
        </div>
        <div className="nav-right">
          {pro ? <span className="pro-badge">PRO</span> : <button className="btn btn-sm" onClick={function(){setPw(true);}}>Upgrade</button>}
          <div className="avi">A</div>
        </div>
      </nav>

      <main className="main">

        {tab === "planner" ? (
          <div>
            <div className="hero">
              <div className="eyebrow">Your Personal AI Chef</div>
              <h1 className="h1">No more <em>what is for dinner?</em></h1>
              <p className="sub">DinnerOS plans your week, builds your grocery list, and learns what your family loves.</p>
              <div className="stats">
                <div><div className="stat-num">156x</div><div className="stat-lbl">dinner arguments per year</div></div>
                <div><div className="stat-num">17 min</div><div className="stat-lbl">deciding what to eat</div></div>
                <div><div className="stat-num">$220</div><div className="stat-lbl">saved vs takeout monthly</div></div>
              </div>
            </div>
            <div className="row">
              <h2 className="h2">This Week</h2>
              <button className="btn" onClick={genWeek} disabled={loadW}>
                {loadW ? <span><span className="spin" /> Planning...</span> : "AI Plan My Week"}
              </button>
            </div>
            <div className="week">
              {DAYS.map(function(day,i){
                var cls = "day";
                if (i===TOD) cls="day today";
                if (selDay===i) cls=cls+" sel";
                var hasM = meals[i] && meals[i][0];
                return (
                  <div key={day} className={cls} onClick={function(){setSelDay(i);setShowR(hasM?true:false);}}>
                    {i===TOD ? <div className="dot" /> : null}
                    <div className="dlbl">{day}</div>
                    <div className="dnum">{new Date(Date.now()-(TOD-i)*86400000).getDate()}</div>
                    {hasM ? <div className={loadW?"mpill load":"mpill"}>{loadW?"":meals[i][0]}</div> : <div className="empty">Not planned</div>}
                    <button className="addbtn" onClick={function(e){e.stopPropagation();if(!pro)setPw(true);}}>+</button>
                  </div>
                );
              })}
            </div>
            {showR && selDay!==null && meals[selDay] && meals[selDay][0] ? (
              <div className="rsec">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"}}>
                  <h2 className="h2">{meals[selDay][0]}</h2>
                  <button style={{background:"none",border:"none",fontSize:"18px",cursor:"pointer",color:"#8A8A8E"}} onClick={function(){setShowR(false);}}>x</button>
                </div>
                <div className="rmeta">
                  <span className="rmi">25 min</span>
                  <span className="rmi">4 servings</span>
                  <span className="rmi">420 cal</span>
                  <span className="rmi">Easy</span>
                </div>
                <div className="rbody">
                  <div><h4>Ingredients</h4><ul className="ings">{RCP.ings.map(function(x,i){return <li key={i}>{x}</li>;})}</ul></div>
                  <div><h4>Instructions</h4><ol className="steps">{RCP.steps.map(function(x,i){return <li key={i}>{x}</li>;})}</ol></div>
                </div>
              </div>
            ) : null}
            <div className="two">
              <div className="card">
                <div className="card-head">
                  <span style={{fontSize:"18px"}}>🤖</span>
                  <div><h3>DinnerOS AI</h3><p>Ask me anything about dinner</p></div>
                </div>
                <div className="msgs">
                  {msgs.map(function(m,i){return <div key={i} className={"msg "+m.r}>{m.t}</div>;})}
                  {chatLoad ? <div className="msg typing">Thinking...</div> : null}
                  <div ref={end} />
                </div>
                <div className="input-row">
                  <textarea className="tinput" placeholder="What is in my fridge? Suggest a quick dinner..." value={inp}
                    onChange={function(e){setInp(e.target.value);}}
                    onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                    rows={1}
                  />
                  <button className="sendbtn" onClick={send} disabled={chatLoad||!inp.trim()}>
                    {chatLoad ? <span className="spin" /> : "up"}
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-head orange">
                  <span style={{fontSize:"18px"}}>🛒</span>
                  <div><h3>Grocery List</h3><p>{checked}/{total} items checked</p></div>
                </div>
                <div className="gitems">
                  {Object.keys(gro).map(function(cat){
                    return (
                      <div key={cat} className="gcat">
                        <div className="gcatn">{cat}</div>
                        {gro[cat].slice(0,3).map(function(x,i){
                          return (
                            <div key={i} className={x.c?"gitem done":"gitem"} onClick={function(){togGro(cat,i);}}>
                              <div className={x.c?"gcheck done":"gcheck"}>{x.c?"v":""}</div>
                              <span className="gname">{x.n}</span>
                              <span className="gqty">{x.q}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div style={{padding:"10px 14px",borderTop:"1px solid rgba(0,0,0,.06)",background:"#FFFDF9"}}>
                  <button className="btn" style={{width:"100%",justifyContent:"center"}} onClick={function(){setTab("grocery");}}>View Full List</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "grocery" ? (
          <div>
            <div className="row" style={{marginTop:"8px"}}>
              <h2 className="h2">Grocery List</h2>
              <button className="btn" onClick={genGro} disabled={groLoad}>
                {groLoad ? <span><span className="spin" /> Generating...</span> : "AI Generate from Plan"}
              </button>
            </div>
            <p style={{color:"#8A8A8E",fontSize:"13px",marginBottom:"20px"}}>{checked} of {total} items checked</p>
            <div style={{background:"#FFFDF9",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(0,0,0,.06)"}}>
              <div className="gitems" style={{maxHeight:"none",padding:"18px 22px"}}>
                {Object.keys(gro).map(function(cat){
                  return (
                    <div key={cat} className="gcat">
                      <div className="gcatn">{cat}</div>
                      {gro[cat].map(function(x,i){
                        return (
                          <div key={i} className={x.c?"gitem done":"gitem"} onClick={function(){togGro(cat,i);}}>
                            <div className={x.c?"gcheck done":"gcheck"}>{x.c?"v":""}</div>
                            <span className="gname">{x.n}</span>
                            <span className="gqty">{x.q}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "pantry" ? (
          <div>
            <div className="row" style={{marginTop:"8px"}}>
              <h2 className="h2">Pantry</h2>
              <button className="btn" onClick={function(){if(!pro)setPw(true);}}>+ Add Item</button>
            </div>
            <p style={{color:"#8A8A8E",fontSize:"13px",marginBottom:"4px"}}>Track what you have so DinnerOS plans around it.</p>
            <div style={{display:"flex",gap:"12px",marginBottom:"18px",marginTop:"10px",flexWrap:"wrap"}}>
              {[["Well Stocked",PANTRY.filter(function(p){return p.s==="good";}).length,"#2D4A3E"],["Running Low",PANTRY.filter(function(p){return p.s==="low";}).length,"#D4A843"],["Out of Stock",PANTRY.filter(function(p){return p.s==="out";}).length,"#D94F3F"]].map(function(item){
                return (
                  <div key={item[0]} style={{display:"flex",alignItems:"center",gap:"7px",background:"#FFFDF9",padding:"9px 14px",borderRadius:"9px",border:"1px solid rgba(0,0,0,.06)"}}>
                    <div style={{width:"7px",height:"7px",borderRadius:"50%",background:item[2]}} />
                    <span style={{fontSize:"12px",color:"#1C1C1E",fontWeight:600}}>{item[1]}</span>
                    <span style={{fontSize:"11px",color:"#8A8A8E"}}>{item[0]}</span>
                  </div>
                );
              })}
            </div>
            <div className="pantry-grid">
              {PANTRY.map(function(x,i){
                return (
                  <div key={i} className={"pitem "+x.s}>
                    <div className="pemi">{x.e}</div>
                    <div className="pname">{x.n}</div>
                    <div className={"pstat "+x.s}>{x.s==="good"?"In Stock":x.s==="low"?"Low":"Out"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === "insights" ? (
          <div>
            <div style={{marginTop:"8px",marginBottom:"22px"}}>
              <h2 className="h2">Dinner Insights</h2>
              <p style={{color:"#8A8A8E",fontSize:"13px",marginTop:"4px"}}>Your stats this month</p>
            </div>
            <div className="igrid">
              {[["🍽️","18","Dinners cooked at home"],["💰","$340","Saved vs takeout"],["🥦","94%","Nutrition variety"],["⏱","22 min","Avg cook time"],["♻️","$28","Food waste avoided"],["❤️","6","Family favorites"]].map(function(item,i){
                return (
                  <div key={i} className="icard">
                    <div className="iico">{item[0]}</div>
                    <div className="inum">{item[1]}</div>
                    <div className="ilbl">{item[2]}</div>
                  </div>
                );
              })}
            </div>
            {!pro ? (
              <div style={{background:"linear-gradient(135deg,#2D4A3E,#3D6356)",borderRadius:"16px",padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff",gap:"16px",flexWrap:"wrap"}}>
                <div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",marginBottom:"5px"}}>Unlock Full Insights</h3>
                  <p style={{fontSize:"13px",color:"rgba(255,255,255,.7)",maxWidth:"360px",lineHeight:"1.5"}}>Get macro tracking nutrition breakdowns weekly reports and personalized goals with Pro.</p>
                </div>
                <button className="btn" onClick={function(){setPw(true);}}>Upgrade to Pro</button>
              </div>
            ) : null}
          </div>
        ) : null}

      </main>
    </div>
  );
}
