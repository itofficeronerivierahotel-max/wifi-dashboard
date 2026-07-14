/* =========================================================
   WiFi Dashboard - Hotel & Resident  (ລາວ Edition)
   ========================================================= */

const STORAGE_KEY = "wifi_dashboard_records_v1";
const USERS_STORAGE_KEY = "wifi_dashboard_users_v1";
/* ⚠️ ສຳຄັນ: ປ່ຽນ URL ນີ້ໃຫ້ເປັນ URL ຂອງທ່ານເອງຫຼັງຈາກ Deploy Google Apps Script ແລ້ວ
   (ເບິ່ງຄຳແນະນຳໃນໄຟລ໌ Code.gs / setup-guide.md) */
/* ⚠️ ສຳຄັນ: ປ່ຽນ URL ລຸ່ມນີ້ເປັນ Google Apps Script Web App URL ຂອງທ່ານເອງ
   ວິທີສ້າງ ເບິ່ງ SETUP_GUIDE.md + Code.gs ທີ່ໃຫ້ໄປພ້ອມກັນ */
const API_URL = "https://script.google.com/macros/s/AKfycbzK4xdgjHN7XshGDMmMAVdPbl9To98t_OGj6fZNx4eJniOCSskSUCaGvWL4G5Ake8eOIw/exec";
const SETTINGS_STORAGE_KEY = "wifi_dashboard_settings_v1";
const AUTH_SESSION_KEY = "wifi_dashboard_session_v1";
const FLOOR_OPTIONS = ["G","2","3","4","5","6","7","8","9","10"];
const TESTER_OPTIONS = ["IT","Engineer","Security","Manager","Outsource"];
const ROLE_OPTIONS = ["Admin","IT","Manager"];
const PERMISSION_OPTIONS = [
  {value:"admin",  label:"Admin (ແກ້ໄຂໄດ້ທຸກຢ່າງ)"},
  {value:"user",   label:"User (ອ່ານ/ເພີ່ມ/ແກ້ໄຂ ແຕ່ລົບບໍ່ໄດ້)"},
  {value:"viewer", label:"Viewer (ເບິ່ງໄດ້ສະເພາະໜ້າ Dashboard, ບໍ່ສາມາດແກ້ໄຂຫຍັງໄດ້)"}
];
const LOGO_OPTIONS = ["📶","🛜","📡","🏨","🏢","⚙️","🔧","🌐"];

/* ---- Lao month names ---- */
const LAO_MONTHS = ["ມັງກອນ","ກຸມພາ","ມີນາ","ເມສາ","ພຶດສະພາ","ມິຖຸນາ",
                    "ກໍລະກົດ","ສິງຫາ","ກັນຍາ","ຕຸລາ","ພະຈິກ","ທັນວາ"];

/* ---------- Mock data ---------- */
function buildMockData(){
  const today = todayDMY();
  const hotel = [
    {code:"WIFI-260616-153750", date:today, building:"Hotel", floor:"G",  download:12,  upload:16, ping:16, tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-161057", date:today, building:"Hotel", floor:"9",  download:7,   upload:27, ping:27, tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-163712", date:today, building:"Hotel", floor:"2",  download:138, upload:8,  ping:8,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-164039", date:today, building:"Hotel", floor:"3",  download:117, upload:7,  ping:7,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-164235", date:today, building:"Hotel", floor:"4",  download:31,  upload:5,  ping:5,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-164408", date:today, building:"Hotel", floor:"5",  download:85,  upload:6,  ping:6,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-164603", date:today, building:"Hotel", floor:"6",  download:44,  upload:8,  ping:8,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-164734", date:today, building:"Hotel", floor:"7",  download:16,  upload:5,  ping:5,  tester:"IT", status:"ok",     remark:""},
    {code:"WIFI-260616-165025", date:today, building:"Hotel", floor:"8",  download:2,   upload:5,  ping:5,  tester:"IT", status:"issue",  remark:"ສັນຍານອ່ອນກວ່າປົກກະຕິ ຕ້ອງກວດສອບ Access Point"}
  ];
  const resident = [
    {code:"WIFI-260616-154038", date:today, building:"Resident", floor:"G", download:9,   upload:23, ping:23, tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-160716", date:today, building:"Resident", floor:"9", download:10,  upload:27, ping:27, tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-161626", date:today, building:"Resident", floor:"8", download:5,   upload:72, ping:72, tester:"IT", status:"issue", remark:"Ping ສູງຜິດປົກກະຕິ ກຳລັງກວດສອບສາຍ LAN"},
    {code:"WIFI-260616-161844", date:today, building:"Resident", floor:"7", download:35,  upload:12, ping:12, tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-162101", date:today, building:"Resident", floor:"6", download:135, upload:13, ping:13, tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-162313", date:today, building:"Resident", floor:"5", download:45,  upload:5,  ping:5,  tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-162550", date:today, building:"Resident", floor:"4", download:8,   upload:12, ping:12, tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-162805", date:today, building:"Resident", floor:"3", download:72,  upload:6,  ping:6,  tester:"IT", status:"ok",    remark:""},
    {code:"WIFI-260616-163010", date:today, building:"Resident", floor:"2", download:96,  upload:6,  ping:6,  tester:"IT", status:"ok",    remark:""}
  ];
  const trend = [
    {date:"11/06", download:62,  upload:18, ping:24},
    {date:"12/06", download:98,  upload:34, ping:21},
    {date:"13/06", download:182, upload:48, ping:16},
    {date:"14/06", download:96,  upload:40, ping:27},
    {date:"15/06", download:108, upload:38, ping:30},
    {date:"16/06", download:55,  upload:14, ping:32},
    {date:"17/06", download:118, upload:42, ping:25}
  ];
  let all = [...hotel,...resident].map((r,i)=>({id:"rec_"+Date.now()+"_"+i,...r}));
  return {records:all, trend};
}

function buildMockUsers(){
  return [
    {id:"usr_1", name:"IT Admin",       email:"it.admin@wifidashboard.local",  role:"Admin",   username:"admin",   permission:"admin", passwordHash:null, defaultPassword:"admin123"},
    {id:"usr_2", name:"ສົມຊາຍ ເທັກ",    email:"somchai.t@wifidashboard.local", role:"IT",      username:"somchai", permission:"user",  passwordHash:null, defaultPassword:"user123"},
    {id:"usr_3", name:"ແພວ ແມັນເນເຈີ",  email:"praew.m@wifidashboard.local",  role:"Manager", username:"praew",   permission:"user",  passwordHash:null, defaultPassword:"user123"}
  ];
}
function buildDefaultSettings(){
  return {companyName:"WiFi Dashboard", companySub:"Hotel & Resident", logo:"📶", logoUrl:"", printLayout:"separate"};
}
function logoHtml(set,sizeStyle){
  if(set.logoUrl) return `<img src="${escapeHtml(set.logoUrl)}" alt="logo" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  return set.logo;
}

let STATE = {
  records:[],
  trend:[],
  users:[],
  settings:null,
  currentUser:null,
  ui:{
    page:"dashboard",
    hotelPage:1, residentPage:1,
    hotelFullPage:1, residentFullPage:1, allPage:1,
    pageSize:9,
    hotelSearch:"", residentSearch:"",
    hotelFullSearch:"", residentFullSearch:"", allSearch:"",
    allFilterBuilding:"all", allFilterStatus:"all",
    editingId:null, deleteTarget:null,
    chartRangeMain:"7", chartRangePing:"7",
    reportDailyDate:todayISODate(),
    reportMonthlyMonth:currentYearMonth(),
    editingUserId:null, userDeleteTarget:null,
    loginError:"",
    sidebarOpen:true,
    formPanelOpen:false
  }
};

/* ---------- Date normalizer ----------
   Google Sheets returns dates either as a plain "DD/MM/YYYY" string
   (good) OR as a serialized Date/ISO string like
   "2026-06-28T17:00:00.000Z" (bad — needs converting back to DD/MM/YYYY
   so it matches what the rest of the app expects). This function makes
   sure whatever comes in always normalizes to DD/MM/YYYY. */
function normalizeDateValue(val){
  if(!val) return todayDMY();
  const s=String(val).trim();
  // Already DD/MM/YYYY (or D/M/YYYY) -> keep as-is
  if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)){
    const [dd,mm,yyyy]=s.split("/");
    return `${dd.padStart(2,"0")}/${mm.padStart(2,"0")}/${yyyy}`;
  }
  // ISO date or ISO datetime (e.g. 2026-06-28 or 2026-06-28T17:00:00.000Z)
  const isoMatch=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(isoMatch){
    const [, yyyy, mm, dd]=isoMatch;
    return `${dd}/${mm}/${yyyy}`;
  }
  // Fallback: try Date parsing
  const parsed=new Date(s);
  if(!isNaN(parsed.getTime())){
    return `${String(parsed.getDate()).padStart(2,"0")}/${String(parsed.getMonth()+1).padStart(2,"0")}/${parsed.getFullYear()}`;
  }
  return todayDMY();
}

/* ---------- Persistence ---------- */
let ONLINE_OK = false; // tracks whether the last API call succeeded, used to warn the user

async function loadState(){
  // 1) Load local cache first as an offline fallback / instant paint.
  let localRecords=null, localTrend=null, localUsers=null, localSettings=null;
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && Array.isArray(parsed.records)){
        localRecords = parsed.records.map(r=>({...r,date:normalizeDateValue(r.date)}));
        localTrend   = parsed.trend && parsed.trend.length ? parsed.trend : null;
      }
    }
  }catch(e){ /* ignore */ }
  try{
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if(rawUsers){
      const parsedUsers = JSON.parse(rawUsers);
      if(Array.isArray(parsedUsers) && parsedUsers.length) localUsers = parsedUsers;
    }
  }catch(e){ /* ignore */ }
  try{
    const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if(rawSettings){
      const ps = JSON.parse(rawSettings);
      if(ps && ps.companyName) localSettings = ps;
    }
  }catch(e){ /* ignore */ }

  // 2) Try to fetch fresh data (records + users) from Google Sheet via Apps Script.
  //    This is the real shared database — if it succeeds it always wins over
  //    the local cache, since the sheet is the single source of truth across
  //    every device/browser using this dashboard.
  let onlineRecords=null, onlineUsers=null;
  try{
    const response = await fetch(API_URL + "?type=all");
    const data = await response.json();
    if(data && data.ok){
      onlineRecords = (data.records||[]).map(r=>({
        id:String(r.id), code:String(r.id), date:normalizeDateValue(r.date),
        building:r.building, floor:r.floor, room:r.room||"",
        download:Number(r.download)||0, upload:Number(r.upload)||0, ping:Number(r.ping)||0,
        status:r.status, tester:r.tester, remark:r.remark||""
      }));
      onlineUsers = (data.users||[]).map(u=>({
        id:String(u.id), name:u.name, email:u.email, role:u.role,
        username:u.username, permission:u.permission, passwordHash:u.passwordHash
      }));
      ONLINE_OK = true;
    } else {
      ONLINE_OK = false;
    }
  }catch(err){ console.error("loadState online:", err); ONLINE_OK = false; }

  // Records
  if(onlineRecords && onlineRecords.length>0){
    STATE.records = onlineRecords;
    STATE.trend   = localTrend || buildMockData().trend;
  } else if(localRecords && localRecords.length>0){
    STATE.records = localRecords;
    STATE.trend   = localTrend || buildMockData().trend;
  } else if(!ONLINE_OK){
    const mock = buildMockData();
    STATE.records = mock.records;
    STATE.trend   = mock.trend;
  } else {
    // online worked but sheet is genuinely empty
    STATE.records = [];
    STATE.trend   = localTrend || buildMockData().trend;
  }

  // Users
  if(onlineUsers && onlineUsers.length>0){
    STATE.users = onlineUsers;
  } else if(localUsers && localUsers.length>0){
    STATE.users = localUsers;
  } else if(!ONLINE_OK){
    STATE.users = buildMockUsers();
    for(const u of STATE.users){
      if(!u.passwordHash && u.defaultPassword){
        u.passwordHash = await hashPassword(u.defaultPassword);
        delete u.defaultPassword;
      }
    }
  } else {
    STATE.users = [];
  }

  STATE.settings = Object.assign(buildDefaultSettings(), localSettings||{});

  loadSession();
  persist(); persistUsers(); persistSettings();
}

function persist(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify({records:STATE.records, trend:STATE.trend})); }
  catch(e){ showToast("ບໍ່ສາມາດບັນທຶກຂໍ້ມູນອັດຕະໂນມັດໄດ້ (ພື້ນທີ່ເຕັມ)", true); }
}
function persistUsers(){
  try{ localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(STATE.users)); }
  catch(e){ showToast("ບໍ່ສາມາດບັນທຶກຂໍ້ມູນຜູ້ໃຊ້ງານໄດ້", true); }
}
function persistSettings(){
  try{ localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(STATE.settings)); }
  catch(e){ showToast("ບໍ່ສາມາດບັນທຶກການຕັ້ງຄ່າໄດ້", true); }
}

/* ---------- Session ---------- */
function loadSession(){
  try{
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if(!raw) return;
    const session = JSON.parse(raw);
    if(!session||!session.userId) return;
    const u = STATE.users.find(x=>x.id===session.userId);
    if(u) STATE.currentUser = {id:u.id, name:u.name, username:u.username, role:u.role, permission:u.permission};
  }catch(e){}
}
function persistSession(){
  try{
    if(STATE.currentUser) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({userId:STATE.currentUser.id}));
    else localStorage.removeItem(AUTH_SESSION_KEY);
  }catch(e){}
}

/* ---------- Utils ---------- */
function fmtNum(n, decimals=0){
  if(n===null||n===undefined||isNaN(n)) return "-";
  return Number(n).toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
}
function todayDMY(){
  const d=new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}
function todayLaoLong(){
  const d=new Date();
  return `${d.getDate()} ${LAO_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function genCode(){
  const d=new Date();
  const yy=String(d.getFullYear()).slice(2);
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const dd=String(d.getDate()).padStart(2,"0");
  const hh=String(d.getHours()).padStart(2,"0");
  const mi=String(d.getMinutes()).padStart(2,"0");
  const ss=String(d.getSeconds()).padStart(2,"0");
  return `WIFI-${yy}${mm}${dd}-${hh}${mi}${ss}`;
}
function uid(){ return "rec_"+Date.now()+"_"+Math.floor(Math.random()*100000); }
function todayISODate(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function currentYearMonth(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function dmyToISO(dmy){
  if(!dmy||typeof dmy!=="string") return null;
  const parts=dmy.split("/");
  if(parts.length!==3) return null;
  const [dd,mm,yyyy]=parts;
  if(!dd||!mm||!yyyy) return null;
  return `${yyyy}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`;
}
function isoToDMY(iso){
  if(!iso) return "";
  const [yyyy,mm,dd]=iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}
function formatLaoDateLong(iso){
  if(!iso) return "";
  const [yyyy,mm,dd]=iso.split("-").map(Number);
  return `${dd} ${LAO_MONTHS[mm-1]} ${yyyy}`;
}
function formatLaoMonthLong(ym){
  if(!ym) return "";
  const [yyyy,mm]=ym.split("-").map(Number);
  return `${LAO_MONTHS[mm-1]} ${yyyy}`;
}
function daysInMonth(year,month){ return new Date(year,month,0).getDate(); }

function showToast(msg,isErr=false){
  const wrap=document.getElementById("toastWrap");
  const el=document.createElement("div");
  el.className="toast"+(isErr?" err":"");
  el.textContent=msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .3s"; setTimeout(()=>el.remove(),300); },2800);
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ---------- Password hashing ---------- */
async function hashPassword(plain){
  const enc=new TextEncoder().encode("wifidash_salt_v1::"+plain);
  const buf=await crypto.subtle.digest("SHA-256",enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

/* ---------- Derived stats ---------- */
function getStats(){
  const all=STATE.records;
  const total=all.length;
  const ok=all.filter(r=>r.status==="ok").length;
  const issue=all.filter(r=>r.status==="issue").length;
  const closed=all.filter(r=>r.status==="closed").length;
  const avgPing=total?(all.reduce((s,r)=>s+Number(r.ping||0),0)/total):0;
  const avgDownload=total?(all.reduce((s,r)=>s+Number(r.download||0),0)/total):0;
  const avgUpload=total?(all.reduce((s,r)=>s+Number(r.upload||0),0)/total):0;
  return {total,ok,issue,closed,avgPing,avgDownload,avgUpload};
}
function getTopProblemGroups(){
  const map={};
  STATE.records.forEach(r=>{
    if(r.status==="issue"||r.status==="closed"){
      const key=`${r.building} - ຊັ້ນ ${r.floor}`;
      map[key]=(map[key]||0)+1;
    }
  });
  return Object.entries(map).map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count).slice(0,5);
}

/* =========================================================
   Root render
   ========================================================= */
function render(){
  const app=document.getElementById("app");
  if(!STATE.currentUser){
    app.className="app-2col login-mode";
    app.innerHTML=renderLoginPage();
    bindEvents();
    return;
  }
  const page=STATE.ui.page;
  const pagesWithFormPanel=["dashboard","hotel","resident","all-records"];
  const showFormPanel=pagesWithFormPanel.includes(page)&&!isViewer();
  let cls="app"+(showFormPanel?"":" app-2col");
  if(!STATE.ui.sidebarOpen) cls+=" sidebar-collapsed";
  if(showFormPanel && !STATE.ui.formPanelOpen) cls+=" form-panel-collapsed";
  cls += ((STATE.settings&&STATE.settings.printLayout)==="flow") ? " print-flow" : " print-separate";
  app.className=cls;
  app.innerHTML=`
    ${renderSidebar()}
    <div class="sidebar-backdrop" data-action="toggle-sidebar"></div>
    <div>
      ${renderTopbar()}
      <div class="main">${renderPageContent(page)}</div>
    </div>
    ${showFormPanel?renderFormPanel():""}
  `;
  bindEvents();
  drawChartsForPage(page);
}

function renderPageContent(page){
  if((page==="users"||page==="settings")&&!isAdmin()){
    page="dashboard"; STATE.ui.page="dashboard";
  }
  if(page!=="dashboard"&&isViewer()){
    page="dashboard"; STATE.ui.page="dashboard";
  }
  switch(page){
    case "dashboard":       return renderDashboardPage();
    case "all-records":     return renderAllRecordsPage();
    case "hotel":           return renderBuildingPage("Hotel");
    case "resident":        return renderBuildingPage("Resident");
    case "report-daily":    return renderReportDailyPage();
    case "report-monthly":  return renderReportMonthlyPage();
    case "users":           return renderUsersPage();
    case "settings":        return renderSettingsPage();
    default:                return renderDashboardPage();
  }
}
function drawChartsForPage(page){
  if(page==="dashboard")      drawAllCharts();
  if(page==="report-monthly") drawMonthlyChart();
}
/* =========================================================
   Share Link — ສ້າງລິ້ງເປີດກົງໄປໜ້າລາຍງານ (ວັນທີ/ເດືອນທີ່ເລືອກ)
   ຄົນທີ່ໄດ້ຮັບລິ້ງຕ້ອງເປີດຈາກ URL ໂຮສຂອງແອັບນີ້ ແລະ login ດ້ວຍບັນຊີຂອງຕົນເອງ
   (ຫຼືມີ session ຄ້າງໄວ້ໃນ browser ນັ້ນແລ້ວ) ຈຶ່ງຈະເຫັນຂໍ້ມູນໄດ້.
   ========================================================= */
const HASH_ROUTABLE_PAGES=["dashboard","all-records","hotel","resident","report-daily","report-monthly"];
function buildShareHash(page){
  page = page||STATE.ui.page;
  if(page==="report-daily")   return `#report-daily?date=${STATE.ui.reportDailyDate||todayISODate()}`;
  if(page==="report-monthly") return `#report-monthly?month=${STATE.ui.reportMonthlyMonth||currentYearMonth()}`;
  return `#${page}`;
}
function buildShareLink(page){
  return `${location.origin}${location.pathname}${buildShareHash(page)}`;
}
function applyHashRoute(){
  const raw=(location.hash||"").replace(/^#/,"");
  if(!raw) return;
  const [page,qs]=raw.split("?");
  if(!HASH_ROUTABLE_PAGES.includes(page)) return;
  STATE.ui.page=page;
  if(qs){
    const params=new URLSearchParams(qs);
    if(page==="report-daily"&&params.get("date"))     STATE.ui.reportDailyDate=params.get("date");
    if(page==="report-monthly"&&params.get("month"))  STATE.ui.reportMonthlyMonth=params.get("month");
  }
}
async function copyReportLink(page){
  const link=buildShareLink(page);
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(link);
    }else{
      const ta=document.createElement("textarea");
      ta.value=link; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    showToast("📋 ຄັດລອກລິ້ງລາຍງານແລ້ວ — ເອົາໄປວາງໃນກຸ່ມສົ່ງໄດ້ເລີຍ");
  }catch(e){
    showToast(`ຄັດລອກອັດຕະໂນມັດບໍ່ໄດ້, ນີ້ຄືລິ້ງ: ${link}`,true);
  }
}

function navigateTo(page){
  STATE.ui.page=page;
  if(page!=="dashboard"&&page!=="hotel"&&page!=="resident") STATE.ui.editingId=null;
  render();
  window.scrollTo({top:0,behavior:"instant"});
}
function isAdmin(){ return !!(STATE.currentUser&&STATE.currentUser.permission==="admin"); }
function isViewer(){ return !!(STATE.currentUser&&STATE.currentUser.permission==="viewer"); }

/* =========================================================
   Dashboard
   ========================================================= */
function renderDashboardPage(){
  const set=STATE.settings||buildDefaultSettings();
  return `
  <div class="page-head">
    <div>
      <div class="page-title">🏠 ໜ້າຫຼັກ (Dashboard)</div>
      <div class="page-sub">ພາບລວມລະບົບກວດສອບ WiFi ທັງໝົດ</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="sync-data">🔄 ຊິງຂໍ້ມູນ</button>
      <button class="btn btn-primary" data-action="copy-report-link" data-page="dashboard">📋 ຄັດລອກລິ້ງ</button>
      <button class="btn btn-primary" data-action="print-dashboard">🖨️ ສົ່ງອອກ PDF</button>
    </div>
  </div>
  <div class="dash-print-head">
    <div class="biz">
      <div class="biz-logo">${logoHtml(set)}</div>
      <div>
        <div class="biz-name">${escapeHtml(set.companyName)}</div>
        <div class="biz-sub">${escapeHtml(set.companySub)} — ລາຍງານພາບລວມ Dashboard</div>
      </div>
    </div>
    <div class="meta"><div>ພິມວັນທີ: <b>${todayLaoLong()}</b></div></div>
  </div>
  <div class="dash-flow">
    <div class="dash-sec-kpi">${renderKpiRow()}</div>
    <div class="dash-sec-charts">${renderChartsRow()}</div>
    <div class="dash-sec-bottom">${renderBottomRow()}</div>
    <div class="dash-sec-tables">${renderTablesRow()}</div>
  </div>`;
}

/* =========================================================
   Login
   ========================================================= */
function renderLoginPage(){
  const set=STATE.settings||buildDefaultSettings();
  const err=STATE.ui.loginError;
  return `
  <div class="login-screen">
    <div class="login-card">
      <div class="login-brand">
        <div class="login-brand-icon">${logoHtml(set)}</div>
        <div class="login-brand-title">${escapeHtml(set.companyName)}</div>
        <div class="login-brand-sub">${escapeHtml(set.companySub)}</div>
      </div>
      ${err?`<div class="login-error">⚠️ ${escapeHtml(err)}</div>`:""}
      <div class="field">
        <label>ຊື່ຜູ້ໃຊ້ງານ (Username)</label>
        <input class="input" type="text" id="login-username" placeholder="ເຊັ່ນ admin" autocomplete="username">
      </div>
      <div class="field">
        <label>ລະຫັດຜ່ານ (Password)</label>
        <input class="input" type="password" id="login-password" placeholder="••••••••" autocomplete="current-password">
      </div>
      <button class="btn btn-primary btn-full" id="btnLogin">🔓 ເຂົ້າສູ່ລະບົບ</button>
      <div class="login-hint">
        ກາລຸນາປ້ອນຂໍ້ມູນ: <b> ID / Password </b> ຂອງທ່ານເອງ ເພື່ອເຂົ້າໃນລະບົບ
      </div>
      <div class="security-note">
        <span class="ic">⚠️</span>
        <span> ລະບົບນີ້ໃຊ້ພາຍໃນໂຮງແຮມ Oneriviera hotel ເທົ່ານັ້ນ</span>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   Sidebar  — ສະແດງ ເພີ່ມຂໍ້ມູນ / ຕັ້ງຄ່າ ສະເພາະໜ້າ Dashboard
   ========================================================= */
function renderSidebar(){
  const page=STATE.ui.page;
  const isActive=p=>page===p?"active":"";
  const s=STATE.settings||buildDefaultSettings();
  const admin=isAdmin();
  const viewer=isViewer();
  const isDash=page==="dashboard";

  if(viewer){
    return `
    <div class="sidebar">
      <div class="brand" title="${escapeHtml(s.companyName)}">
        <div class="brand-icon">${logoHtml(s)}</div>
        <div>
          <div class="brand-title">${escapeHtml(s.companyName)}</div>
          <div class="brand-sub">${escapeHtml(s.companySub)}</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item active"><span class="ic">🏠</span> ໜ້າຫຼັກ</div>
      </div>
      <div class="sidebar-foot">👁️ ສິດເບິ່ງຢ່າງດຽວ<br>© 2026 ${escapeHtml(s.companyName)}<br>v1.3.0 — Offline</div>
    </div>`;
  }

  return `
  <div class="sidebar">
    <div class="brand" data-action="nav-to" data-page="dashboard" style="cursor:pointer;" title="ກັບໄປໜ້າຫຼັກ">
      <div class="brand-icon">${logoHtml(s)}</div>
      <div>
        <div class="brand-title">${escapeHtml(s.companyName)}</div>
        <div class="brand-sub">${escapeHtml(s.companySub)}</div>
      </div>
    </div>

    <div class="nav-group">
      <div class="nav-item ${isActive("dashboard")}" data-action="nav-to" data-page="dashboard"><span class="ic">🏠</span> ໜ້າຫຼັກ</div>
    </div>

    <div class="nav-group">
      <div class="nav-label">ຈັດການຂໍ້ມູນ</div>
      ${isDash?`<div class="nav-item" data-action="focus-form"><span class="ic">➕</span> ເພີ່ມຂໍ້ມູນ</div>`:""}
      <div class="nav-item ${isActive("all-records")}" data-action="nav-to" data-page="all-records"><span class="ic">📋</span> ລາຍການທັງໝົດ</div>
      <div class="nav-item ${isActive("hotel")}" data-action="nav-to" data-page="hotel"><span class="ic">🏨</span> Hotel WiFi</div>
      <div class="nav-item ${isActive("resident")}" data-action="nav-to" data-page="resident"><span class="ic">🏢</span> Resident WiFi</div>
    </div>

    <div class="nav-group">
      <div class="nav-label">ລາຍງານ</div>
      <div class="nav-item ${isActive("report-daily")}" data-action="nav-to" data-page="report-daily"><span class="ic">📅</span> ລາຍງານປະຈຳວັນ</div>
      <div class="nav-item ${isActive("report-monthly")}" data-action="nav-to" data-page="report-monthly"><span class="ic">🗓️</span> ລາຍງານປະຈຳເດືອນ</div>
    </div>

    ${admin?`
    <div class="nav-group">
      <div class="nav-label">ຕັ້ງຄ່າ</div>
      <div class="nav-item ${isActive("users")}" data-action="nav-to" data-page="users"><span class="ic">👥</span> ຜູ້ໃຊ້ງານ</div>
      ${isDash?`<div class="nav-item ${isActive("settings")}" data-action="nav-to" data-page="settings"><span class="ic">⚙️</span> ຕັ້ງຄ່າ</div>`:""}
    </div>`:""}

    <div class="sidebar-foot">© 2026 ${escapeHtml(s.companyName)}<br>v1.3.0 — Offline</div>
  </div>`;
}

/* =========================================================
   Topbar — ປຸ່ມ ເພີ່ມຂໍ້ມູນ ແລະ ຕັ້ງຄ່າ ສະເພາະໜ້າ Dashboard
   ========================================================= */
function renderTopbar(){
  const me=STATE.currentUser;
  const initials=me?(me.name||"?").trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase():"?";
  const admin=isAdmin();
  const isDash=STATE.ui.page==="dashboard";
  const connBadge = ONLINE_OK
    ? `<div class="conn-badge conn-ok" title="ເຊື່ອມຕໍ່ Google Sheet ສຳເລັດ">🟢 ອອນລາຍ</div>`
    : `<div class="conn-badge conn-bad" title="ບໍ່ສາມາດເຊື່ອມຕໍ່ Google Sheet ໄດ້ — ກວດສອບອິນເຕີເນັດ ຫຼື API_URL">🔴 ອອບໄລນ໌</div>`;
  return `
  <div class="topbar">
    <div class="topbar-left"><div class="burger" data-action="toggle-sidebar" title="ເປີດ/ປິດ ເມນູຂ້າງ">☰</div></div>
    ${connBadge}
    ${isDash&&admin?`<div class="icon-btn" data-action="focus-form" title="ເພີ່ມຂໍ້ມູນ">➕</div>`:""}
    ${isDash&&admin?`<div class="icon-btn" data-action="nav-to" data-page="settings" title="ຕັ້ງຄ່າ">⚙️</div>`:""}
    <div class="date-pill">📅 ${todayLaoLong()}</div>
    <div class="profile" title="${admin?"ຈັດການຜູ້ໃຊ້ງານ":""}">
      <div class="avatar">${escapeHtml(initials)}</div>
      <div>
        <div class="profile-name">${escapeHtml(me?me.name:"-")}</div>
        <div class="profile-role">${admin?"Administrator":(isViewer()?"Viewer (ອ່ານຢ່າງດຽວ)":"User")}</div>
      </div>
    </div>
    <div class="icon-btn" data-action="logout" title="ອອກຈາກລະບົບ">⎋</div>
  </div>`;
}

/* =========================================================
   KPI Row
   ========================================================= */
function renderKpiRow(){
  const s=getStats();
  return `
  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-icon blue">📶</div>
      <div>
        <div class="kpi-label">ລວມທັງໝົດ</div>
        <div class="kpi-value">${fmtNum(s.total)}<span class="unit">ລາຍການ</span></div>
        <div class="kpi-delta up">▲ ຂໍ້ມູນທັງໝົດໃນລະບົບ</div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon green">✅</div>
      <div>
        <div class="kpi-label">ປົກກະຕິ (OK)</div>
        <div class="kpi-value">${fmtNum(s.ok)}<span class="unit">ລາຍການ</span></div>
        <div class="kpi-delta up">▲ ${s.total?Math.round(s.ok/s.total*100):0}% ຈາກທັງໝົດ</div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon amber">⚠️</div>
      <div>
        <div class="kpi-label kpi-label-amber">ມີບັນຫາ</div>
        <div class="kpi-value">${fmtNum(s.issue)}<span class="unit">ລາຍການ</span></div>
        <div class="kpi-delta up">▲ ${s.total?Math.round(s.issue/s.total*100):0}% ຈາກທັງໝົດ</div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon purple">⏱️</div>
      <div>
        <div class="kpi-label">ຄ່າ Ping ສະເລ່ຍ</div>
        <div class="kpi-value">${fmtNum(s.avgPing,0)}<span class="unit">ms</span></div>
        <div class="kpi-delta down">▼ ສະເລ່ຍຈາກທຸກລາຍການ</div>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   Tables
   ========================================================= */
function statusDot(status){
  if(status==="ok")     return `<span class="status-dot ok">✓</span>`;
  if(status==="issue")  return `<span class="status-dot issue">!</span>`;
  return `<span class="status-dot closed">✕</span>`;
}
function statusLabel(status){
  if(status==="ok")     return "ປົກກະຕິ";
  if(status==="issue")  return "ມີບັນຫາ";
  return "ປິດງານ";
}
function deleteIconHtml(action,id,title){
  if(isAdmin()) return `<div class="icon-mini del" data-action="${action}" data-id="${id}" title="${title||"ລົບ"}">🗑</div>`;
  return `<div class="icon-mini is-disabled" title="ຕ້ອງເປັນ Admin ເທົ່ານັ້ນຈຶ່ງລົບໄດ້">🗑</div>`;
}
function editIconHtml(id){
  if(isViewer()) return `<div class="icon-mini is-disabled" title="ສິດ Viewer ເບິ່ງໄດ້ຢ່າງດຽວ">✎</div>`;
  return `<div class="icon-mini" data-action="edit-record" data-id="${id}" title="ແກ້ໄຂ">✎</div>`;
}
function codeLinkHtml(r){
  if(isViewer()) return escapeHtml(r.code);
  return `<span class="code-link" data-action="edit-record" data-id="${r.id}">${escapeHtml(r.code)}</span>`;
}

function filterRecords(building,search){
  let list=STATE.records.filter(r=>r.building===building);
  if(search&&search.trim()){
    const q=search.trim().toLowerCase();
    list=list.filter(r=>
      r.code.toLowerCase().includes(q)||
      String(r.floor).toLowerCase().includes(q)||
      (r.tester||"").toLowerCase().includes(q)||
      (r.remark||"").toLowerCase().includes(q)||
      (r.room||"").toLowerCase().includes(q)
    );
  }
  return [...list].sort((a,b)=>b.code>a.code?1:-1);
}

function renderTableSection(building){
  const isHotel=building==="Hotel";
  const search=isHotel?STATE.ui.hotelSearch:STATE.ui.residentSearch;
  const page=isHotel?STATE.ui.hotelPage:STATE.ui.residentPage;
  const pageSize=STATE.ui.pageSize;
  const all=filterRecords(building,search);
  const totalPages=Math.max(1,Math.ceil(all.length/pageSize));
  const safePage=Math.min(page,totalPages);
  const start=(safePage-1)*pageSize;
  const pageItems=all.slice(start,start+pageSize);
  const icon=isHotel?"🏨":"🏢";
  const title=isHotel?"Hotel WiFi":"Resident WiFi";
  const idPrefix=isHotel?"hotel":"resident";

  const rowsHtml=pageItems.length?pageItems.map(r=>`
    <tr>
      <td>${statusDot(r.status)}</td>
      <td>${codeLinkHtml(r)}</td>
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.building)}</td>
      <td>${escapeHtml(r.floor)}</td>
      <td>${escapeHtml(r.room||"-")}</td>
      <td>${fmtNum(r.download)}</td>
      <td>${fmtNum(r.upload)}</td>
      <td>${fmtNum(r.ping)}</td>
      <td>${escapeHtml(r.tester)}</td>
      <td><div class="row-actions">
        ${editIconHtml(r.id)}
        ${deleteIconHtml("delete-record",r.id)}
      </div></td>
    </tr>
  `).join(""):
  `<tr><td colspan="11"><div class="empty-state">ບໍ່ພົບຂໍ້ມູນ${search?" ທີ່ກົງກັບການຄົ້ນຫາ":""}</div></td></tr>`;

  return `
  <div class="panel" id="panel-${idPrefix}">
    <div class="panel-head">
      <div class="panel-title"><span class="ic">${icon}</span> ${title}</div>
      <div class="panel-actions">
        <div class="search-box"><span>🔍</span>
          <input type="text" placeholder="ຄົ້ນຫາ..." value="${escapeHtml(search)}" data-action="search-${idPrefix}">
        </div>
        <button class="btn btn-primary btn-sm" data-action="quick-add-${idPrefix}">＋ ເພີ່ມຂໍ້ມູນ</button>
        <button class="btn btn-sm" data-action="view-all-${idPrefix}">📋 ເບິ່ງທັງໝົດ</button>
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th>
        <th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th><th></th>
      </tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table></div>
    <div class="table-footer">
      <div>ສະແດງ ${all.length?(start+1):0} ຫາ ${Math.min(start+pageSize,all.length)} ຈາກ ${all.length} ລາຍການ</div>
      <div class="pager">
        <div class="pager-btn" data-action="page-${idPrefix}" data-dir="-1" ${safePage<=1?"style='opacity:.4'":""}>‹</div>
        <div class="pager-btn active">${safePage}</div>
        <div class="pager-btn" data-action="page-${idPrefix}" data-dir="1" ${safePage>=totalPages?"style='opacity:.4'":""}>›</div>
      </div>
    </div>
  </div>`;
}
function renderTablesRow(){
  return `<div class="tables-row">${renderTableSection("Hotel")}${renderTableSection("Resident")}</div>`;
}

/* =========================================================
   Full page table
   ========================================================= */
function filterRecordsFull({building,status,search}){
  let list=[...STATE.records];
  if(building&&building!=="all") list=list.filter(r=>r.building===building);
  if(status&&status!=="all")     list=list.filter(r=>r.status===status);
  if(search&&search.trim()){
    const q=search.trim().toLowerCase();
    list=list.filter(r=>
      r.code.toLowerCase().includes(q)||
      String(r.floor).toLowerCase().includes(q)||
      (r.tester||"").toLowerCase().includes(q)||
      (r.remark||"").toLowerCase().includes(q)||
      r.building.toLowerCase().includes(q)||
      (r.room||"").toLowerCase().includes(q)
    );
  }
  return list.sort((a,b)=>b.code>a.code?1:-1);
}

function renderFullTable(opts){
  const ui=STATE.ui;
  const pageField=opts.pageKey+"Page";
  const searchField=opts.pageKey+"Search";
  const page=ui[pageField]||1;
  const search=ui[searchField]||"";
  const buildingFilter=opts.showBuildingFilter?ui.allFilterBuilding:opts.building;
  const statusFilter=opts.showStatusFilter?ui.allFilterStatus:"all";
  const pageSize=ui.pageSize;
  const all=filterRecordsFull({building:buildingFilter,status:statusFilter,search});
  const totalPages=Math.max(1,Math.ceil(all.length/pageSize));
  const safePage=Math.min(page,totalPages);
  const start=(safePage-1)*pageSize;
  const pageItems=all.slice(start,start+pageSize);
  const stats={
    total:all.length,
    ok:all.filter(r=>r.status==="ok").length,
    issue:all.filter(r=>r.status==="issue").length,
    closed:all.filter(r=>r.status==="closed").length
  };

  const rowsHtml=pageItems.length?pageItems.map(r=>`
    <tr>
      <td>${statusDot(r.status)}</td>
      <td>${codeLinkHtml(r)}</td>
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.building)}</td>
      <td>${escapeHtml(r.floor)}</td>
      <td>${escapeHtml(r.room||"-")}</td>
      <td>${fmtNum(r.download)}</td>
      <td>${fmtNum(r.upload)}</td>
      <td>${fmtNum(r.ping)}</td>
      <td>${escapeHtml(r.tester)}</td>
      <td><div class="row-actions">
        ${editIconHtml(r.id)}
        ${deleteIconHtml("delete-record",r.id)}
      </div></td>
    </tr>
  `).join(""):
  `<tr><td colspan="11"><div class="empty-state">ບໍ່ພົບຂໍ້ມູນ${search?" ທີ່ກົງກັບການຄົ້ນຫາ":""}</div></td></tr>`;

  const buildingChips=opts.showBuildingFilter?`
    <div class="filter-group"><label>ອາຄານ:</label>
      <div class="chip-group">
        <div class="chip ${ui.allFilterBuilding==="all"?"active":""}" data-action="filter-all-building" data-value="all">ທັງໝົດ</div>
        <div class="chip ${ui.allFilterBuilding==="Hotel"?"active":""}" data-action="filter-all-building" data-value="Hotel">🏨 Hotel</div>
        <div class="chip ${ui.allFilterBuilding==="Resident"?"active":""}" data-action="filter-all-building" data-value="Resident">🏢 Resident</div>
      </div>
    </div>`:"";

  const statusChips=opts.showStatusFilter?`
    <div class="filter-group"><label>ສະຖານະ:</label>
      <div class="chip-group">
        <div class="chip ${ui.allFilterStatus==="all"?"active":""}" data-action="filter-all-status" data-value="all">ທັງໝົດ</div>
        <div class="chip ${ui.allFilterStatus==="ok"?"active f-ok":""}" data-action="filter-all-status" data-value="ok">✓ ປົກກະຕິ</div>
        <div class="chip ${ui.allFilterStatus==="issue"?"active f-issue":""}" data-action="filter-all-status" data-value="issue">⚠ ມີບັນຫາ</div>
        <div class="chip ${ui.allFilterStatus==="closed"?"active f-closed":""}" data-action="filter-all-status" data-value="closed">✕ ປິດງານ</div>
      </div>
    </div>`:"";

  const addTarget=opts.pageKey==="hotelFull"?"hotel":"resident";
  return `
  <div class="page-head">
    <div>
      <div class="page-title">${opts.icon} ${opts.title}</div>
      <div class="page-sub">ພົບຂໍ້ມູນທັງໝົດ ${stats.total} ລາຍການ</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="quick-add-${addTarget}">＋ ເພີ່ມຂໍ້ມູນ</button>
    </div>
  </div>
  <div class="summary-strip">
    <div class="summary-box"><div class="num">${fmtNum(stats.total)}</div><div class="lbl">ລວມທັງໝົດ</div></div>
    <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(stats.ok)}</div><div class="lbl">ປົກກະຕິ (OK)</div></div>
    <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(stats.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
    <div class="summary-box"><div class="num" style="color:var(--red);">${fmtNum(stats.closed)}</div><div class="lbl">ປິດງານ</div></div>
  </div>
  <div class="filter-bar">
    <div class="search-box" style="width:220px;"><span>🔍</span>
      <input type="text" placeholder="ຄົ້ນຫາ Code, ຊັ້ນ, ຫ້ອງ, Tester..." value="${escapeHtml(search)}" data-action="search-${opts.pageKey}">
    </div>
    ${buildingChips}${statusChips}
  </div>
  <div class="panel full-table-panel" id="${opts.panelId}">
    <div class="table-wrap"><table>
      <thead><tr>
        <th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th>
        <th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th><th></th>
      </tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table></div>
    <div class="table-footer">
      <div>ສະແດງ ${all.length?(start+1):0} ຫາ ${Math.min(start+pageSize,all.length)} ຈາກ ${all.length} ລາຍການ</div>
      <div class="pager">
        <div class="pager-btn" data-action="page-${opts.pageKey}" data-dir="-1" ${safePage<=1?"style='opacity:.4'":""}>‹</div>
        <div class="pager-btn active">${safePage}</div>
        <div class="pager-btn" data-action="page-${opts.pageKey}" data-dir="1" ${safePage>=totalPages?"style='opacity:.4'":""}>›</div>
      </div>
    </div>
  </div>`;
}

function renderAllRecordsPage(){
  return renderFullTable({pageKey:"all",title:"ລາຍການທັງໝົດ",icon:"📋",building:"all",showBuildingFilter:true,showStatusFilter:true,panelId:"panel-all-records"});
}
function renderBuildingPage(building){
  const isHotel=building==="Hotel";
  return renderFullTable({
    pageKey:isHotel?"hotelFull":"residentFull",
    title:isHotel?"Hotel WiFi":"Resident WiFi",
    icon:isHotel?"🏨":"🏢",
    building,showBuildingFilter:false,showStatusFilter:true,
    panelId:isHotel?"panel-hotel-full":"panel-resident-full"
  });
}

/* =========================================================
   Charts row
   ========================================================= */
function renderChartsRow(){
  const s=getStats();
  return `
  <div class="charts-row">
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title"><span class="ic">📈</span> ສະຫຼຸບຄວາມໄວ (Mbps)</div>
        <select class="select-mini" data-action="range-main">
          <option value="7" ${STATE.ui.chartRangeMain==="7"?"selected":""}>7 ວັນຫຼ້າສຸດ</option>
          <option value="30" ${STATE.ui.chartRangeMain==="30"?"selected":""}>30 ວັນຫຼ້າສຸດ</option>
        </select>
      </div>
      <div class="chart-body">
        <div class="legend-row" style="margin-bottom:10px;">
          <span><span class="legend-dot" style="background:#3b82f6;"></span>Download (Mbps)</span>
          <span><span class="legend-dot" style="background:#22c55e;"></span>Upload (Mbps)</span>
        </div>
        <div id="lineChartHost"></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><div class="panel-title"><span class="ic">🔘</span> ສະຖານະການກວດສອບ</div></div>
      <div class="chart-body">
        <div class="donut-wrap">
          <div id="donutChartHost"></div>
          <div class="donut-legend">
            <div class="donut-legend-item"><span class="legend-dot" style="background:#22c55e;"></span>ປົກກະຕິ (OK) <b>&nbsp;${s.ok} (${s.total?Math.round(s.ok/s.total*1000)/10:0}%)</b></div>
            <div class="donut-legend-item"><span class="legend-dot" style="background:#f59e0b;"></span>ມີບັນຫາ <b>&nbsp;${s.issue} (${s.total?Math.round(s.issue/s.total*1000)/10:0}%)</b></div>
            <div class="donut-legend-item"><span class="legend-dot" style="background:#ef4444;"></span>ປິດງານ <b>&nbsp;${s.closed} (${s.total?Math.round(s.closed/s.total*1000)/10:0}%)</b></div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title"><span class="ic">📊</span> ຄ່າ Ping (ms)</div>
        <select class="select-mini" data-action="range-ping">
          <option value="7" ${STATE.ui.chartRangePing==="7"?"selected":""}>7 ວັນຫຼ້າສຸດ</option>
          <option value="30" ${STATE.ui.chartRangePing==="30"?"selected":""}>30 ວັນຫຼ້າສຸດ</option>
        </select>
      </div>
      <div class="chart-body"><div id="barChartHost"></div></div>
    </div>
  </div>`;
}

/* =========================================================
   Bottom row
   ========================================================= */
function renderBottomRow(){
  const top5=getTopProblemGroups();
  const maxCount=top5.length?top5[0].count:1;
  const s=getStats();
  const top5Html=top5.length?top5.map((item,i)=>`
    <div class="bar-item">
      <div class="bar-rank">${i+1}. ${escapeHtml(item.label)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(8,item.count/maxCount*100)}%;"></div></div>
      <div class="bar-count">${item.count} ລາຍການ</div>
    </div>
  `).join(""):
  `<div class="empty-state">ບໍ່ມີລາຍການທີ່ມີບັນຫາໃນຂະນະນີ້ 🎉</div>`;

  return `
  <div class="bottom-row">
    <div class="panel">
      <div class="panel-head"><div class="panel-title"><span class="ic">🏷️</span> Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ</div></div>
      <div class="chart-body">${top5Html}</div>
    </div>
    <div class="panel">
      <div class="panel-head"><div class="panel-title"><span class="ic">📊</span> ຄ່າສະເລ່ຍລວມ</div></div>
      <div class="avg-grid">
        <div class="avg-item">
          <div class="avg-icon" style="background:radial-gradient(circle at 30% 30%,#5b9bff,#2563eb);">⬇️</div>
          <div><div class="avg-value">${fmtNum(s.avgDownload,1)}</div><div class="avg-label">Download Mbps</div></div>
        </div>
        <div class="avg-item">
          <div class="avg-icon" style="background:radial-gradient(circle at 30% 30%,#34e08a,#16a34a);">⬆️</div>
          <div><div class="avg-value">${fmtNum(s.avgUpload,1)}</div><div class="avg-label">Upload Mbps</div></div>
        </div>
        <div class="avg-item">
          <div class="avg-icon" style="background:radial-gradient(circle at 30% 30%,#c084fc,#9333ea);">⏱️</div>
          <div><div class="avg-value">${fmtNum(s.avgPing,0)}</div><div class="avg-label">Ping ສະເລ່ຍ (ms)</div></div>
        </div>
        <div class="avg-cta" data-action="view-all-records">
          <span style="font-size:18px;">📋</span> ລາຍການທັງໝົດ
        </div>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   Reports helpers
   ========================================================= */
function computeStatsForRecords(list){
  const total=list.length;
  const ok=list.filter(r=>r.status==="ok").length;
  const issue=list.filter(r=>r.status==="issue").length;
  const closed=list.filter(r=>r.status==="closed").length;
  const avgPing=total?(list.reduce((s,r)=>s+Number(r.ping||0),0)/total):0;
  const avgDownload=total?(list.reduce((s,r)=>s+Number(r.download||0),0)/total):0;
  const avgUpload=total?(list.reduce((s,r)=>s+Number(r.upload||0),0)/total):0;
  return {total,ok,issue,closed,avgPing,avgDownload,avgUpload};
}
function recordsForDate(iso){ return STATE.records.filter(r=>dmyToISO(r.date)===iso); }
function recordsForMonth(ym){
  return STATE.records.filter(r=>{ const ri=dmyToISO(r.date); return ri&&ri.slice(0,7)===ym; });
}

/* ---- ຕາຕະລາງ ສະຫຼຸບຄວາມໄວ (Mbps) + Ping — ລວມເປັນຕາຕະລາງດຽວ, ແຍກຕາມອາຄານ ---- */
function reportSpeedPingTableHtml(hotelStats,resStats,overall){
  const rows=[
    {label:"🏨 Hotel WiFi",     s:hotelStats},
    {label:"🏢 Resident WiFi",  s:resStats},
    {label:"📊 ລວມທັງໝົດ",      s:overall}
  ];
  return `<table>
    <thead><tr><th>ອາຄານ</th><th>Download ສະເລ່ຍ (Mbps)</th><th>Upload ສະເລ່ຍ (Mbps)</th><th>Ping ສະເລ່ຍ (ms)</th></tr></thead>
    <tbody>${rows.map(r=>`
      <tr>
        <td><b>${r.label}</b></td>
        <td>${fmtNum(r.s.avgDownload,1)}</td>
        <td>${fmtNum(r.s.avgUpload,1)}</td>
        <td>${fmtNum(r.s.avgPing,0)}</td>
      </tr>`).join("")}</tbody>
  </table>`;
}

/* ---- ຕາຕະລາງ ສະຖານະການກວດສອບ — ແຍກຕາມອາຄານ ---- */
function reportStatusTableHtml(hotelStats,resStats,overall){
  const rows=[
    {label:"🏨 Hotel WiFi",     s:hotelStats},
    {label:"🏢 Resident WiFi",  s:resStats},
    {label:"📊 ລວມທັງໝົດ",      s:overall}
  ];
  return `<table>
    <thead><tr><th>ອາຄານ</th><th>ປົກກະຕິ (OK)</th><th>ມີບັນຫາ</th><th>ປິດງານ</th><th>ລວມທັງໝົດ</th></tr></thead>
    <tbody>${rows.map(r=>`
      <tr>
        <td><b>${r.label}</b></td>
        <td style="color:var(--green);font-weight:700;">${fmtNum(r.s.ok)}</td>
        <td style="color:var(--amber);font-weight:700;">${fmtNum(r.s.issue)}</td>
        <td style="color:var(--red);font-weight:700;">${fmtNum(r.s.closed)}</td>
        <td>${fmtNum(r.s.total)}</td>
      </tr>`).join("")}</tbody>
  </table>`;
}

/* ---- Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ (ນັບ issue + closed ລວມກັນ) ---- */
function reportTop5ProblemHtml(list){
  const map={};
  list.forEach(r=>{
    const key=r.building+"||"+r.floor;
    if(!map[key]) map[key]={building:r.building, floor:r.floor, total:0, problems:0};
    map[key].total++;
    if(r.status==="issue"||r.status==="closed") map[key].problems++;
  });
  const rows=Object.values(map)
    .filter(x=>x.problems>0)
    .sort((a,b)=> b.problems-a.problems || b.total-a.total)
    .slice(0,5);
  if(!rows.length){
    return `<div class="empty-state" style="padding:20px;">🎉 ບໍ່ພົບບັນຫາໃນຊ່ວງເວລານີ້</div>`;
  }
  return `<table>
    <thead><tr><th>ອັນດັບ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຈຳນວນບັນຫາ</th><th>ຈຳນວນກວດທັງໝົດ</th><th>ອັດຕາບັນຫາ</th></tr></thead>
    <tbody>${rows.map((r,i)=>`
      <tr>
        <td><b>#${i+1}</b></td>
        <td>${r.building==="Hotel"?"🏨 Hotel":"🏢 Resident"}</td>
        <td>ຊັ້ນ ${escapeHtml(String(r.floor))}</td>
        <td style="color:var(--red);font-weight:700;">${r.problems}</td>
        <td>${r.total}</td>
        <td>${r.total?Math.round(r.problems/r.total*100):0}%</td>
      </tr>`).join("")}</tbody>
  </table>`;
}

function reportRowsHtml(list){
  if(!list.length) return `<tr><td colspan="10"><div class="empty-state">ບໍ່ມີຂໍ້ມູນໃນຊ່ວງເວລານີ້</div></td></tr>`;
  return [...list].sort((a,b)=>b.code>a.code?1:-1).map(r=>`
    <tr>
      <td>${statusDot(r.status)}</td>
      <td>${escapeHtml(r.code)}</td>
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.building)}</td>
      <td>${escapeHtml(r.floor)}</td>
      <td>${escapeHtml(r.room||"-")}</td>
      <td>${fmtNum(r.download)}</td>
      <td>${fmtNum(r.upload)}</td>
      <td>${fmtNum(r.ping)}</td>
      <td>${escapeHtml(r.tester)}</td>
    </tr>
  `).join("");
}

/* =========================================================
   Report: Daily (ລາຍງານປະຈຳວັນ)
   ========================================================= */
function renderReportDailyPage(){
  const iso=STATE.ui.reportDailyDate||todayISODate();
  const list=recordsForDate(iso);
  const s=computeStatsForRecords(list);
  const set=STATE.settings||buildDefaultSettings();

  // group by building
  const hotelList=list.filter(r=>r.building==="Hotel");
  const resList=list.filter(r=>r.building==="Resident");
  const hotelStats=computeStatsForRecords(hotelList);
  const resStats=computeStatsForRecords(resList);

  return `
  <div class="page-head">
    <div>
      <div class="page-title">📅 ລາຍງານປະຈຳວັນ</div>
      <div class="page-sub">ສະຫຼຸບຂໍ້ມູນກວດສອບ WiFi ລາຍວັນ</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="copy-report-link" data-page="report-daily">📋 ຄັດລອກລິ້ງ</button>
      <button class="btn btn-primary" data-action="print-report">🖨️ ສົ່ງອອກ PDF</button>
    </div>
  </div>
  <div class="report-controls">
    <div class="field">
      <label>ເລືອກວັນທີ</label>
      <input type="date" class="input" id="dailyDateInput" value="${iso}" data-action="set-daily-date">
    </div>
  </div>

  <div class="panel report-doc" id="reportPrintArea">
    <!-- ====== ຫົວເອກະສານ ====== -->
    <div style="padding:20px 20px 0;">
      <div class="report-doc-head">
        <div class="biz">
          <div class="biz-logo">${logoHtml(set)}</div>
          <div>
            <div class="biz-name">${escapeHtml(set.companyName)}</div>
            <div class="biz-sub">${escapeHtml(set.companySub)} — ລາຍງານປະຈຳວັນ</div>
          </div>
        </div>
        <div class="meta">
          <div>ວັນທີໃນລາຍງານ: <b>${formatLaoDateLong(iso)}</b></div>
          <div>ພິມວັນທີ: <b>${todayLaoLong()}</b></div>
        </div>
      </div>

      <!-- ====== ສະຫຼຸບລວມ ====== -->
      <div class="report-section-title">📊 ສະຫຼຸບລວມ</div>
      <div class="summary-strip">
        <div class="summary-box"><div class="num">${fmtNum(s.total)}</div><div class="lbl">ລວມທັງໝົດ</div></div>
        <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(s.ok)}</div><div class="lbl">ປົກກະຕິ (OK)</div></div>
        <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(s.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
        <div class="summary-box"><div class="num" style="color:var(--red);">${fmtNum(s.closed)}</div><div class="lbl">ປິດງານ</div></div>
      </div>
      <div class="summary-strip" style="margin-bottom:4px;">
        <div class="summary-box"><div class="num">${fmtNum(s.avgDownload,1)}</div><div class="lbl">Download ສະເລ່ຍ (Mbps)</div></div>
        <div class="summary-box"><div class="num">${fmtNum(s.avgUpload,1)}</div><div class="lbl">Upload ສະເລ່ຍ (Mbps)</div></div>
        <div class="summary-box"><div class="num">${fmtNum(s.avgPing,0)}</div><div class="lbl">Ping ສະເລ່ຍ (ms)</div></div>
        <div class="summary-box"><div class="num">${list.length?Math.round(s.ok/s.total*100):0}%</div><div class="lbl">ອັດຕາປົກກະຕິ</div></div>
      </div>

      <!-- ====== ຕາຕະລາງ ສະຫຼຸບຄວາມໄວ (Mbps) ແລະ Ping ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">📶 ຕາຕະລາງສະຫຼຸບຄວາມໄວ (Mbps) ແລະ Ping</div>
        <div class="table-wrap">${reportSpeedPingTableHtml(hotelStats,resStats,s)}</div>
      </div>

      <!-- ====== ສະຖານະການກວດສອບ ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">🚦 ສະຖານະການກວດສອບ</div>
        <div class="table-wrap">${reportStatusTableHtml(hotelStats,resStats,s)}</div>
      </div>

      <!-- ====== Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">⚠️ Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ</div>
        <div class="table-wrap">${reportTop5ProblemHtml(list)}</div>
      </div>

      <!-- ====== Hotel ແລະ Resident — ຍ້າຍມາລຸ່ມສຸດ, ແຍກຄົນລະບລັອກ, ຄົນລະໜ້າພິມ ບໍ່ໃຫ້ຄາບກັນ ====== -->
      <div class="report-tables-bottom" style="margin-top:18px;">
        ${hotelList.length?`
        <div class="report-building-block">
          <div class="report-section-title">🏨 Hotel WiFi — ${fmtNum(hotelList.length)} ລາຍການ</div>
          <div class="summary-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:10px;">
            <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(hotelStats.ok)}</div><div class="lbl">ປົກກະຕິ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(hotelStats.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--red);">${fmtNum(hotelStats.closed)}</div><div class="lbl">ປິດງານ</div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th><th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th></tr></thead>
            <tbody>${reportRowsHtml(hotelList)}</tbody>
          </table></div>
        </div>`:""}

        ${resList.length?`
        <div class="report-building-block">
          <div class="report-section-title" style="margin-top:18px;">🏢 Resident WiFi — ${fmtNum(resList.length)} ລາຍການ</div>
          <div class="summary-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:10px;">
            <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(resStats.ok)}</div><div class="lbl">ປົກກະຕິ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(resStats.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--red);">${fmtNum(resStats.closed)}</div><div class="lbl">ປິດງານ</div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th><th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th></tr></thead>
            <tbody>${reportRowsHtml(resList)}</tbody>
          </table></div>
        </div>`:""}
      </div>

      ${!list.length?`<div class="empty-state" style="padding:40px;">ບໍ່ມີຂໍ້ມູນໃນວັນທີ ${formatLaoDateLong(iso)}</div>`:""}
      <div style="height:20px;"></div>
    </div>
  </div>`;
}

/* =========================================================
   Report: Monthly (ລາຍງານປະຈຳເດືອນ)
   ========================================================= */
function renderReportMonthlyPage(){
  const ym=STATE.ui.reportMonthlyMonth||currentYearMonth();
  const list=recordsForMonth(ym);
  const s=computeStatsForRecords(list);
  const set=STATE.settings||buildDefaultSettings();
  const [yyyy,mm]=ym.split("-").map(Number);
  const totalDays=daysInMonth(yyyy,mm);
  const dayBuckets=[];
  for(let d=1;d<=totalDays;d++){
    const iso=`${yyyy}-${String(mm).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const dayList=list.filter(r=>dmyToISO(r.date)===iso);
    if(dayList.length){ const ds=computeStatsForRecords(dayList); dayBuckets.push({day:d,...ds}); }
  }
  LAST_MONTHLY_BUCKETS=dayBuckets;

  const hotelList=list.filter(r=>r.building==="Hotel");
  const resList=list.filter(r=>r.building==="Resident");
  const hotelStats=computeStatsForRecords(hotelList);
  const resStats=computeStatsForRecords(resList);

  return `
  <div class="page-head">
    <div>
      <div class="page-title">🗓️ ລາຍງານປະຈຳເດືອນ</div>
      <div class="page-sub">ສະຫຼຸບຂໍ້ມູນກວດສອບ WiFi ລວມທັງເດືອນ</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="copy-report-link" data-page="report-monthly">📋 ຄັດລອກລິ້ງ</button>
      <button class="btn btn-primary" data-action="print-report">🖨️ ສົ່ງອອກ PDF</button>
    </div>
  </div>
  <div class="report-controls">
    <div class="field">
      <label>ເລືອກເດືອນ/ປີ</label>
      <input type="month" class="input" id="monthlyMonthInput" value="${ym}" data-action="set-monthly-month">
    </div>
  </div>

  <div class="panel report-doc" id="reportPrintArea">
    <div style="padding:20px 20px 0;">
      <!-- ຫົວ -->
      <div class="report-doc-head">
        <div class="biz">
          <div class="biz-logo">${logoHtml(set)}</div>
          <div>
            <div class="biz-name">${escapeHtml(set.companyName)}</div>
            <div class="biz-sub">${escapeHtml(set.companySub)} — ລາຍງານປະຈຳເດືອນ</div>
          </div>
        </div>
        <div class="meta">
          <div>ເດືອນໃນລາຍງານ: <b>${formatLaoMonthLong(ym)}</b></div>
          <div>ພິມວັນທີ: <b>${todayLaoLong()}</b></div>
        </div>
      </div>

      <!-- ສະຫຼຸບລວມ -->
      <div class="report-section-title">📊 ສະຫຼຸບລວມເດືອນ ${formatLaoMonthLong(ym)}</div>
      <div class="summary-strip">
        <div class="summary-box"><div class="num">${fmtNum(s.total)}</div><div class="lbl">ລວມທັງໝົດ</div></div>
        <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(s.ok)}</div><div class="lbl">ປົກກະຕິ (OK)</div></div>
        <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(s.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
        <div class="summary-box"><div class="num" style="color:var(--red);">${fmtNum(s.closed)}</div><div class="lbl">ປິດງານ</div></div>
      </div>
      <div class="summary-strip" style="margin-bottom:4px;">
        <div class="summary-box"><div class="num">${fmtNum(s.avgDownload,1)}</div><div class="lbl">Download ສະເລ່ຍ (Mbps)</div></div>
        <div class="summary-box"><div class="num">${fmtNum(s.avgUpload,1)}</div><div class="lbl">Upload ສະເລ່ຍ (Mbps)</div></div>
        <div class="summary-box"><div class="num">${fmtNum(s.avgPing,0)}</div><div class="lbl">Ping ສະເລ່ຍ (ms)</div></div>
        <div class="summary-box"><div class="num">${list.length?Math.round(s.ok/s.total*100):0}%</div><div class="lbl">ອັດຕາປົກກະຕິ</div></div>
      </div>

      <!-- ກຣາຟ -->
      ${dayBuckets.length?`
      <div class="report-section-title">📈 ຈຳນວນລາຍການກວດສອບຕໍ່ວັນ</div>
      <div style="margin-bottom:16px;"><div id="monthlyChartHost"></div></div>`:""}

      <!-- ====== ຕາຕະລາງ ສະຫຼຸບຄວາມໄວ (Mbps) ແລະ Ping ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">📶 ຕາຕະລາງສະຫຼຸບຄວາມໄວ (Mbps) ແລະ Ping</div>
        <div class="table-wrap">${reportSpeedPingTableHtml(hotelStats,resStats,s)}</div>
      </div>

      <!-- ====== ສະຖານະການກວດສອບ ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">🚦 ສະຖານະການກວດສອບ</div>
        <div class="table-wrap">${reportStatusTableHtml(hotelStats,resStats,s)}</div>
      </div>

      <!-- ====== Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ ====== -->
      <div class="report-subsection">
        <div class="report-section-title" style="margin-top:18px;">⚠️ Top 5 ອາຄານ/ຊັ້ນ ທີ່ມີບັນຫາຫຼາຍທີ່ສຸດ</div>
        <div class="table-wrap">${reportTop5ProblemHtml(list)}</div>
      </div>

      <!-- Hotel ແລະ Resident — ຍ້າຍມາລຸ່ມສຸດ, ແຍກຄົນລະບລັອກ, ຄົນລະໜ້າພິມ ບໍ່ໃຫ້ຄາບກັນ -->
      <div class="report-tables-bottom" style="margin-top:18px;">
        ${hotelList.length?`
        <div class="report-building-block">
          <div class="report-section-title">🏨 Hotel WiFi — ${fmtNum(hotelList.length)} ລາຍການ</div>
          <div class="summary-strip" style="grid-template-columns:repeat(4,1fr);margin-bottom:10px;">
            <div class="summary-box"><div class="num">${fmtNum(hotelList.length)}</div><div class="lbl">ລວມ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(hotelStats.ok)}</div><div class="lbl">ປົກກະຕິ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(hotelStats.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
            <div class="summary-box"><div class="num">${fmtNum(hotelStats.avgDownload,1)} / ${fmtNum(hotelStats.avgUpload,1)}</div><div class="lbl">DL/UL ສະເລ່ຍ</div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th><th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th></tr></thead>
            <tbody>${reportRowsHtml(hotelList)}</tbody>
          </table></div>
        </div>`:""}

        ${resList.length?`
        <div class="report-building-block">
          <div class="report-section-title" style="margin-top:18px;">🏢 Resident WiFi — ${fmtNum(resList.length)} ລາຍການ</div>
          <div class="summary-strip" style="grid-template-columns:repeat(4,1fr);margin-bottom:10px;">
            <div class="summary-box"><div class="num">${fmtNum(resList.length)}</div><div class="lbl">ລວມ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--green);">${fmtNum(resStats.ok)}</div><div class="lbl">ປົກກະຕິ</div></div>
            <div class="summary-box"><div class="num" style="color:var(--amber);">${fmtNum(resStats.issue)}</div><div class="lbl">ມີບັນຫາ</div></div>
            <div class="summary-box"><div class="num">${fmtNum(resStats.avgDownload,1)} / ${fmtNum(resStats.avgUpload,1)}</div><div class="lbl">DL/UL ສະເລ່ຍ</div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>ສະຖານະ</th><th>Code</th><th>ວັນທີ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຫ້ອງ</th><th>Download</th><th>Upload</th><th>Ping</th><th>Tester</th></tr></thead>
            <tbody>${reportRowsHtml(resList)}</tbody>
          </table></div>
        </div>`:""}
      </div>

      ${!list.length?`<div class="empty-state" style="padding:40px;">ບໍ່ມີຂໍ້ມູນໃນເດືອນ ${formatLaoMonthLong(ym)}</div>`:""}
      <div style="height:20px;"></div>
    </div>
  </div>`;
}

/* =========================================================
   Users page
   ========================================================= */
let USER_DRAFT=null;
function newUserDraft(){ return {id:null,name:"",email:"",role:"IT",username:"",password:"",permission:"user"}; }
function roleClass(role){ if(role==="Admin") return "admin"; if(role==="Manager") return "manager"; return "it"; }

function renderUsersPage(){
  if(!USER_DRAFT) USER_DRAFT=newUserDraft();
  const isEdit=!!STATE.ui.editingUserId;
  const meId=STATE.currentUser?STATE.currentUser.id:null;
  const rowsHtml=STATE.users.length?STATE.users.map(u=>{
    const isSelf=u.id===meId;
    return `<tr>
      <td><div class="user-row-name">
        <div class="user-avatar">${escapeHtml((u.name||"?").trim().charAt(0).toUpperCase())}</div>
        <div>${escapeHtml(u.name)}${isSelf?' <span style="color:var(--text-2);font-size:11px;">(ທ່ານ)</span>':""}</div>
      </div></td>
      <td>${escapeHtml(u.username||"-")}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="role-badge ${roleClass(u.role)}">${escapeHtml(u.role)}</span></td>
      <td><span class="role-pill">${u.permission==="admin"?"🛡️ Admin":(u.permission==="viewer"?"👁️ Viewer":"👤 User")}</span></td>
      <td><div class="row-actions">
        <div class="icon-mini" data-action="edit-user" data-id="${u.id}" title="ແກ້ໄຂ">✎</div>
        ${deleteIconHtml("delete-user",u.id)}
      </div></td>
    </tr>`;
  }).join(""):
  `<tr><td colspan="6"><div class="empty-state">ຍັງບໍ່ມີຜູ້ໃຊ້ງານໃນລະບົບ</div></td></tr>`;

  return `
  <div class="page-head">
    <div><div class="page-title">👥 ຜູ້ໃຊ້ງານ</div>
    <div class="page-sub">ຈັດການບັນຊີຜູ້ໃຊ້ງານ ແລະ ສິດການເຂົ້າເຖິງ (${STATE.users.length} ຄົນ)</div></div>
  </div>
  <div class="users-grid">
    <div class="panel"><div class="table-wrap"><table>
      <thead><tr><th>ຊື່</th><th>Username</th><th>ອີເມວ</th><th>ຕຳແໜ່ງ</th><th>ສິດ</th><th></th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table></div></div>
    <div class="panel" style="padding:20px;">
      <div class="form-title">${isEdit?"✎ ແກ້ໄຂຜູ້ໃຊ້ງານ":"➕ ເພີ່ມຜູ້ໃຊ້ງານໃໝ່"}</div>
      <div class="field"><label>ຊື່-ນາມສະກຸນ <span class="req">*</span></label>
        <input class="input" type="text" id="u-name" data-ufield="name" value="${escapeHtml(USER_DRAFT.name)}" placeholder="ເຊັ່ນ ສົມຊາຍ ໃຈດີ"></div>
      <div class="field"><label>Username (ສຳລັບ Login) <span class="req">*</span></label>
        <input class="input" type="text" id="u-username" data-ufield="username" value="${escapeHtml(USER_DRAFT.username||"")}"></div>
      <div class="field"><label>ອີເມວ <span class="req">*</span></label>
        <input class="input" type="email" id="u-email" data-ufield="email" value="${escapeHtml(USER_DRAFT.email)}" placeholder="name@example.com"></div>
      <div class="field"><label>ລະຫັດຜ່ານ ${isEdit?'<span style="color:var(--text-2);font-weight:400;">(ປ່ອຍຫວ່າງຖ້າບໍ່ຕ້ອງການປ່ຽນ)</span>':'<span class="req">*</span>'}</label>
        <input class="input" type="password" id="u-password" data-ufield="password" value="${escapeHtml(USER_DRAFT.password||"")}" placeholder="${isEdit?"••••••••":"ຕັ້ງລະຫັດຜ່ານເລີ່ມຕົ້ນ"}" autocomplete="new-password"></div>
      <div class="field"><label>ຕຳແໜ່ງ <span class="req">*</span></label>
        <select class="input" id="u-role" data-ufield="role">
          ${ROLE_OPTIONS.map(r=>`<option value="${r}" ${USER_DRAFT.role===r?"selected":""}>${r}</option>`).join("")}
        </select></div>
      <div class="field"><label>ສິດການໃຊ້ງານ <span class="req">*</span></label>
        <select class="input" id="u-permission" data-ufield="permission">
          ${PERMISSION_OPTIONS.map(p=>`<option value="${p.value}" ${USER_DRAFT.permission===p.value?"selected":""}>${p.label}</option>`).join("")}
        </select></div>
      <div class="form-footer-actions">
        ${isEdit?`<button class="btn" id="btnCancelUserEdit" style="flex:1;justify-content:center;">ຍົກເລີກ`:""}
        <button class="btn btn-primary btn-full" id="btnSaveUser">💾 ບັນທຶກຜູ້ໃຊ້ງານ</button>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   Settings page
   ========================================================= */
function renderSettingsPage(){
  const s=STATE.settings||buildDefaultSettings();
  return `
  <div class="page-head">
    <div><div class="page-title">⚙️ ຕັ້ງຄ່າ</div>
    <div class="page-sub">ຕັ້ງຄ່າທົ່ວໄປຂອງລະບົບ ແລະ ຈັດການຂໍ້ມູນ</div></div>
  </div>
  <div class="settings-grid">
    <div class="panel" style="padding:20px;">
      <div class="settings-section">
        <div class="settings-section-title">🏢 ຂໍ້ມູນອົງກອນ</div>
        <div class="field"><label>ຊື່ບໍລິສັດ / ລະບົບ</label>
          <input class="input" type="text" id="set-company-name" value="${escapeHtml(s.companyName)}" placeholder="ຊື່ບໍລິສັດ"></div>
        <div class="field"><label>ຄຳອະທິບາຍຫຍໍ້ (Subtitle)</label>
          <input class="input" type="text" id="set-company-sub" value="${escapeHtml(s.companySub)}" placeholder="ເຊັ່ນ Hotel & Resident"></div>
        <div class="field"><label>ໂລໂກ້ບໍລິສັດ (ອັບໂລດຮູບພາບ)</label>
          <div class="logo-upload-row">
            <div class="logo-preview" id="logoPreview">${logoHtml(s)}</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button class="btn btn-sm" id="btnUploadLogo">⬆️ ອັບໂລດໂລໂກ້</button>
              ${s.logoUrl?`<button class="btn btn-sm btn-danger" id="btnRemoveLogo">🗑 ລົບໂລໂກ້ທີ່ອັບໂລດ</button>`:""}
            </div>
            <input type="file" id="logoFileInput" accept="image/*" class="hidden-file">
          </div>
        </div>
        <div class="field"><label>ຫຼື ເລືອກໄອຄອນ (ໃຊ້ເມື່ອບໍ່ມີຮູບອັບໂລດ)</label>
          <div class="logo-picker">${LOGO_OPTIONS.map(l=>`<div class="logo-opt ${s.logo===l&&!s.logoUrl?"active":""}" data-action="pick-logo" data-value="${l}">${l}</div>`).join("")}</div>
        </div>

        <div class="settings-section-title" style="margin-top:20px;">🖨️ ຮູບແບບການພິມ (Dashboard/ລາຍງານ PDF)</div>
        <div class="field">
          <label>ການແບ່ງໜ້າເອກະສານເວລາສົ່ງອອກ PDF</label>
          <select class="input" id="set-print-layout">
            <option value="separate" ${(s.printLayout||"separate")==="separate"?"selected":""}>ແຍກແຕ່ລະສ່ວນຄົນລະໜ້າ (ປອດໄພສຸດ, ບໍ່ຂາດ/ຄາບ ແຕ່ໄດ້ໜ້າຫຼາຍກວ່າ)</option>
            <option value="flow" ${s.printLayout==="flow"?"selected":""}>ໃຫ້ໄຫຼຕໍ່ຕາມພື້ນທີ່ (ປະຫຍັດເຈ້ຍ, ຍັງປ້ອງກັນການຕັດເຄິ່ງກາງ)</option>
          </select>
          <div style="font-size:11px;color:var(--text-2);margin-top:6px;line-height:1.6;">
            ${(s.printLayout||"separate")==="separate"
              ? "ແຕ່ລະສ່ວນ (ກຣາຟ, ຕາຕະລາງ Hotel/Resident, ສະຫຼຸບຕ່າງໆ) ຈະຂຶ້ນໜ້າໃໝ່ຂອງມັນເອງສະເໝີ —  ຈຳນວນໜ້າຫຼາຍຂຶ້ນ."
              : "ຫຼາຍສ່ວນອາດຢູ່ໜ້າດຽວກັນຖ້າພື້ນທີ່ພໍ (ໜ້າໜ້ອຍລົງ) — ແຕ່ລະສ່ວນຍັງຖືກປ້ອງກັນບໍ່ໃຫ້ຖືກຕັດເຄິ່ງກາງຄືເກົ່າ."}
          </div>
        </div>

        <button class="btn btn-primary btn-full" id="btnSaveSettings" style="margin-top:14px;">💾 ບັນທຶກການຕັ້ງຄ່າ</button>
      </div>
    </div>
    <div class="panel" style="padding:20px;">
      <div class="settings-section">
        <div class="settings-section-title">💾 ຈັດການຂໍ້ມູນ (Backup)</div>
        <p style="font-size:12.5px;color:var(--text-1);line-height:1.7;margin:0 0 14px;">
          ຂໍ້ມູນທັງໝົດຖືກບັນທຶກໄວ້ໃນເຄື່ອງນີ້ໂດຍອັດຕະໂນມັດ. ທ່ານສາມາດສຳຮອງຂໍ້ມູນ ຫຼື ນຳເຂົ້າຈາກໄຟລ໌ໄດ້ທີ່ນີ້.
        </p>
        <div class="settings-actions-row">
          <button class="btn" data-action="export">⬇️ Export JSON</button>
          <button class="btn" data-action="import">⬆️ Import JSON</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="danger-zone">
          <div class="settings-section-title">⚠️ ຄືນຄ່າຂໍ້ມູນເລີ່ມຕົ້ນ</div>
          <p style="font-size:12.5px;color:var(--text-1);line-height:1.7;margin:0 0 14px;">
            ການດຳເນີນການນີ້ຈະລົບຂໍ້ມູນ WiFi ທັງໝົດ ແລະ ແທນທີ່ດ້ວຍຂໍ້ມູນຕົວຢ່າງ ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </p>
          <button class="btn btn-danger" data-action="reset-mock">↺ ຄືນຄ່າຕົວຢ່າງ</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   Form panel (ເພີ່ມ/ແກ້ໄຂ)
   ========================================================= */
let DRAFT=null;
let LAST_MONTHLY_BUCKETS=[];

function newDraft(){
  return {id:null, code:genCode(), date:todayDMY(), building:"Resident",
          floor:"", room:"", download:"", upload:"", ping:"",
          tester:"IT", remark:"", status:"ok"};
}
function startEdit(id){
  if(isViewer()) return;
  const rec=STATE.records.find(r=>r.id===id);
  if(!rec) return;
  DRAFT={...rec};
  STATE.ui.editingId=id;
  STATE.ui.formPanelOpen=true;
  render();
  document.getElementById("formPanelTop")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function startNew(building){
  if(isViewer()) return;
  DRAFT=newDraft();
  if(building) DRAFT.building=building;
  STATE.ui.editingId=null;
  STATE.ui.formPanelOpen=true;
  render();
}
function ensureDraft(){ if(!DRAFT) DRAFT=newDraft(); }

function floorOptionsHtml(selected){
  return [`<option value="" ${!selected?"selected":""} disabled>ເລືອກຊັ້ນ</option>`]
    .concat(FLOOR_OPTIONS.map(f=>`<option value="${f}" ${String(selected)===f?"selected":""}>${f}</option>`)).join("");
}
function testerOptionsHtml(selected){
  return TESTER_OPTIONS.map(t=>`<option value="${t}" ${selected===t?"selected":""}>${t}</option>`).join("");
}

function renderFormPanel(){
  ensureDraft();
  const d=DRAFT;
  const isEdit=!!STATE.ui.editingId;
  const open=STATE.ui.formPanelOpen;
  return `
  <div class="form-panel">
    <div id="formPanelTop"></div>
    <div class="form-panel-toggle" data-action="toggle-form-panel">
      <div class="form-title" style="margin-bottom:0;"><span>📝</span> ${isEdit?"ແກ້ໄຂຂໍ້ມູນ WiFi":"ເພີ່ມຂໍ້ມູນ WiFi"}</div>
      <span class="form-panel-arrow">${open?"▾":"▸"}</span>
    </div>
    <div class="form-panel-body" ${open?"":'style="display:none;"'}>

    <div class="field"><label>Code <span class="req">*</span></label>
      <div class="field-readonly">${escapeHtml(d.code)}</div></div>

    <div class="field"><label>ວັນທີ <span class="req">*</span></label>
      <input class="input" type="text" id="f-date" value="${escapeHtml(d.date)}" placeholder="DD/MM/YYYY" data-field="date"></div>

    <div class="field"><label>ອາຄານ <span class="req">*</span></label>
      <div class="toggle-pair">
        <div class="toggle-btn ${d.building==="Resident"?"active":""}" data-action="set-building" data-value="Resident">Resident</div>
        <div class="toggle-btn ${d.building==="Hotel"?"active":""}" data-action="set-building" data-value="Hotel">Hotel</div>
      </div></div>

    <div class="field"><label>ຊັ້ນ <span class="req">*</span></label>
      <select class="input" id="f-floor" data-field="floor">${floorOptionsHtml(d.floor)}</select></div>

    <div class="field"><label>ເລກຫ້ອງ (ທາງເລືອກ)</label>
      <input class="input" type="text" id="f-room" value="${escapeHtml(d.room||"")}" placeholder="ເຊັ່ນ 101, 205, G01" data-field="room"></div>

    <div class="field speedtest-block">
      <a href="https://www.speedtest.net/th" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full speedtest-external-btn">🔗 ເປີດ Speedtest.net ເພື່ອທົດສອບ</a>
      <div class="speedtest-hint">ທົດສອບຄວາມໄວຢູ່ Speedtest.net ແລ້ວພິມຄ່າທີ່ໄດ້ໃສ່ 3 ຊ່ອງລຸ່ມນີ້ດ້ວຍມືເອງ</div>
    </div>

    <div class="field"><label>Download Mbps <span class="req">*</span></label>
      <div class="stepper">
        <div class="stepper-btn" data-action="step" data-field="download" data-dir="-1">−</div>
        <input class="input" type="number" min="0" id="f-download" value="${d.download}" placeholder="0" data-field="download">
        <div class="stepper-btn" data-action="step" data-field="download" data-dir="1">+</div>
      </div></div>

    <div class="field"><label>Upload Mbps <span class="req">*</span></label>
      <div class="stepper">
        <div class="stepper-btn" data-action="step" data-field="upload" data-dir="-1">−</div>
        <input class="input" type="number" min="0" id="f-upload" value="${d.upload}" placeholder="0" data-field="upload">
        <div class="stepper-btn" data-action="step" data-field="upload" data-dir="1">+</div>
      </div></div>

    <div class="field"><label>Ping Ms <span class="req">*</span></label>
      <div class="stepper">
        <div class="stepper-btn" data-action="step" data-field="ping" data-dir="-1">−</div>
        <input class="input" type="number" min="0" id="f-ping" value="${d.ping}" placeholder="0" data-field="ping">
        <div class="stepper-btn" data-action="step" data-field="ping" data-dir="1">+</div>
      </div></div>

    <div class="field"><label>Tester <span class="req">*</span></label>
      <select class="input" id="f-tester" data-field="tester">${testerOptionsHtml(d.tester)}</select></div>

    <div class="field"><label>ໝາຍເຫດ</label>
      <textarea class="input" id="f-remark" placeholder="ເພີ່ມໝາຍເຫດ (ຖ້າມີ)" data-field="remark">${escapeHtml(d.remark||"")}</textarea></div>

    <div class="field"><label>ສະຖານະ <span class="req">*</span></label>
      <div class="status-pick">
        <div class="s-btn ok ${d.status==="ok"?"active":""}" data-action="set-status" data-value="ok">✓ ປົກກະຕິ</div>
        <div class="s-btn issue ${d.status==="issue"?"active":""}" data-action="set-status" data-value="issue">⚠ ມີບັນຫາ</div>
        <div class="s-btn closed ${d.status==="closed"?"active":""}" data-action="set-status" data-value="closed">✕ ປິດງານ</div>
      </div></div>

    <div class="form-footer-actions">
      ${isEdit?`<button class="btn" id="btnCancelEdit" style="flex:1;justify-content:center;">ຍົກເລີກ</button>`:""}
      <button class="btn btn-primary btn-full" id="btnSave">💾 ບັນທຶກຂໍ້ມູນ</button>
    </div>
    ${isEdit&&isAdmin()?`<button class="btn btn-danger btn-full" style="margin-top:10px;" id="btnDeleteFromForm">🗑 ລົບລາຍການນີ້</button>`:""}
    </div>
  </div>`;
}

/* =========================================================
   Charts (Canvas)
   ========================================================= */
function makeCanvas(host,width,height){
  host.innerHTML="";
  const canvas=document.createElement("canvas");
  const dpr=window.devicePixelRatio||1;
  canvas.width=width*dpr; canvas.height=height*dpr;
  canvas.style.width=width+"px"; canvas.style.height=height+"px";
  host.appendChild(canvas);
  const ctx=canvas.getContext("2d");
  ctx.scale(dpr,dpr);
  return ctx;
}
function getHostWidth(host){ return Math.max(240,host.clientWidth||host.parentElement.clientWidth-36); }
function drawAllCharts(){ drawLineChart(); drawDonutChart(); drawBarChart(); }

/* ---------- Canvas charts: ໂໝດພິມ (light-theme) ----------
   ກຣາຟ (donut/line/bar)ແມ່ນແຕ້ມໃສ່ <canvas> ດ້ວຍສີ hard-code ໄວ້ໃນໂຄ້ດ —
   CSS ຂອງ browser ບໍ່ສາມາດປ່ຽນສີ pixel ພາຍໃນ canvas ໄດ້ (ຄືກັນກັບຮູບພາບ).
   ຈຶ່ງຕ້ອງ "ແຕ້ມຄືນໃໝ່" ດ້ວຍຊຸດສີສະຫວ່າງ (ດຳເທິງຂາວ) ກ່ອນພິມ, ແລ້ວແຕ້ມກັບຄືນ
   ເປັນຊຸດສີທີມມືດເມື່ອພິມສຳເລັດ — ໃຊ້ event beforeprint/afterprint ຂອງ browser */
let PRINT_MODE=false;
function chartColors(){
  return PRINT_MODE ? {
    grid:"rgba(0,0,0,0.10)", axisText:"#444",
    donutHole:"#ffffff", donutHoleBorder:"#cccccc",
    donutCenterNum:"#111111", donutCenterLbl:"#555555",
    donutEmpty:"#e5e7eb"
  } : {
    grid:"rgba(255,255,255,0.06)", axisText:"#76849f",
    donutHole:"#121b2e", donutHoleBorder:null,
    donutCenterNum:"#eef2f9", donutCenterLbl:"#76849f",
    donutEmpty:"#1c2942"
  };
}
if(typeof window!=="undefined"){
  window.addEventListener("beforeprint",()=>{ PRINT_MODE=true; drawAllCharts(); drawMonthlyChart(); });
  window.addEventListener("afterprint", ()=>{ PRINT_MODE=false; drawAllCharts(); drawMonthlyChart(); });
  // ສຳຮອງ: matchMedia("print") ໜ້າເຊື່ອຖືກວ່າ beforeprint/afterprint ໃນບາງ browser/driver
  // (ໂດຍສະເພາະ "Microsoft Print to PDF" ບາງເທື່ອບໍ່ຍິງ beforeprint/afterprint ໃຫ້ຄົບ)
  if(window.matchMedia){
    try{
      const mql=window.matchMedia("print");
      const onChange=(m)=>{ PRINT_MODE=m.matches; drawAllCharts(); drawMonthlyChart(); };
      if(mql.addEventListener) mql.addEventListener("change",onChange);
      else if(mql.addListener) mql.addListener(onChange); // Safari ເກົ່າ
    }catch(e){ /* ignore */ }
  }
}

function drawLineChart(){
  const host=document.getElementById("lineChartHost");
  if(!host) return;
  const width=getHostWidth(host), height=230;
  const ctx=makeCanvas(host,width,height);
  const cc=chartColors();
  const data=STATE.trend;
  const padL=36,padR=14,padT=14,padB=28;
  const plotW=width-padL-padR, plotH=height-padT-padB;
  const allVals=data.flatMap(d=>[d.download,d.upload]);
  const maxVal=Math.max(50,Math.ceil(Math.max(...allVals)/50)*50);
  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle=cc.grid;
  ctx.fillStyle=cc.axisText;
  ctx.font="11px Times New Roman, serif";
  ctx.textAlign="right";
  const steps=4;
  for(let i=0;i<=steps;i++){
    const v=Math.round(maxVal-(maxVal/steps)*i);
    const y=padT+(plotH/steps)*i;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(width-padR,y); ctx.stroke();
    ctx.fillText(v,padL-8,y+4);
  }
  const xStep=data.length>1?plotW/(data.length-1):0;
  function xy(val,idx){ return [padL+xStep*idx, padT+plotH-(val/maxVal)*plotH]; }
  function drawSeries(key,color,fill){
    if(fill){
      ctx.beginPath();
      data.forEach((d,i)=>{ const [x,y]=xy(d[key],i); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      const [lastX]=xy(data[data.length-1][key],data.length-1);
      ctx.lineTo(lastX,padT+plotH); ctx.lineTo(padL,padT+plotH); ctx.closePath();
      const grad=ctx.createLinearGradient(0,padT,0,padT+plotH);
      grad.addColorStop(0,color+"33"); grad.addColorStop(1,color+"02");
      ctx.fillStyle=grad; ctx.fill();
    }
    ctx.beginPath();
    data.forEach((d,i)=>{ const [x,y]=xy(d[key],i); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.lineJoin="round"; ctx.stroke();
    data.forEach((d,i)=>{
      const [x,y]=xy(d[key],i);
      ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
      ctx.lineWidth=1.5; ctx.strokeStyle=PRINT_MODE?"#ffffff":"#0e1626"; ctx.stroke();
    });
  }
  drawSeries("download","#3b82f6",true);
  drawSeries("upload","#22c55e",true);
  ctx.fillStyle=cc.axisText; ctx.textAlign="center";
  data.forEach((d,i)=>{ const [x]=xy(0,i); ctx.fillText(d.date,x,height-8); });
}

function drawDonutChart(){
  const host=document.getElementById("donutChartHost");
  if(!host) return;
  const size=190;
  const ctx=makeCanvas(host,size,size);
  const cc=chartColors();
  const s=getStats();
  const total=s.total||1;
  const segments=[{value:s.ok,color:"#22c55e"},{value:s.issue,color:"#f59e0b"},{value:s.closed,color:"#ef4444"}].filter(sg=>sg.value>0);
  const cx=size/2,cy=size/2,rOuter=80,rInner=52;
  let startAngle=-Math.PI/2;
  ctx.clearRect(0,0,size,size);
  if(segments.length===0){
    ctx.beginPath(); ctx.arc(cx,cy,rOuter,0,Math.PI*2); ctx.fillStyle=cc.donutEmpty; ctx.fill();
  } else {
    segments.forEach(seg=>{
      const angle=(seg.value/total)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,rOuter,startAngle,startAngle+angle);
      ctx.closePath(); ctx.fillStyle=seg.color; ctx.fill(); startAngle+=angle;
    });
  }
  ctx.beginPath(); ctx.arc(cx,cy,rInner,0,Math.PI*2); ctx.fillStyle=cc.donutHole; ctx.fill();
  if(cc.donutHoleBorder){ ctx.lineWidth=1; ctx.strokeStyle=cc.donutHoleBorder; ctx.stroke(); }
  ctx.fillStyle=cc.donutCenterNum; ctx.textAlign="center";
  ctx.font="700 26px Times New Roman, serif"; ctx.fillText(fmtNum(s.total),cx,cy-2);
  ctx.fillStyle=cc.donutCenterLbl; ctx.font="11px Phetsarath OT, serif"; ctx.fillText("ລາຍການ",cx,cy+18);
}

function drawBarChart(){
  const host=document.getElementById("barChartHost");
  if(!host) return;
  const width=getHostWidth(host),height=230;
  const ctx=makeCanvas(host,width,height);
  const cc=chartColors();
  const data=STATE.trend;
  const padL=30,padR=10,padT=14,padB=28;
  const plotW=width-padL-padR,plotH=height-padT-padB;
  const maxVal=Math.max(10,Math.ceil(Math.max(...data.map(d=>d.ping))/10)*10);
  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle=cc.grid;
  ctx.fillStyle=cc.axisText; ctx.font="11px Times New Roman, serif"; ctx.textAlign="right";
  const steps=4;
  for(let i=0;i<=steps;i++){
    const v=Math.round(maxVal-(maxVal/steps)*i), y=padT+(plotH/steps)*i;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(width-padR,y); ctx.stroke();
    ctx.fillText(v,padL-6,y+4);
  }
  const slot=plotW/data.length, barWidth=Math.min(34,slot*0.5);
  data.forEach((d,i)=>{
    const cx=padL+slot*i+slot/2, barH=(d.ping/maxVal)*plotH;
    const x=cx-barWidth/2, y=padT+plotH-barH;
    const grad=ctx.createLinearGradient(0,y,0,padT+plotH);
    grad.addColorStop(0,"#c084fc"); grad.addColorStop(1,"#9333ea");
    ctx.fillStyle=grad; roundRectTop(ctx,x,y,barWidth,barH,5); ctx.fill();
    ctx.fillStyle=cc.axisText; ctx.textAlign="center"; ctx.font="11px Times New Roman, serif";
    ctx.fillText(d.date,cx,height-8);
  });
}

function roundRectTop(ctx,x,y,w,h,r){
  if(h<=0){ctx.beginPath();return;}
  r=Math.min(r,w/2,h);
  ctx.beginPath(); ctx.moveTo(x,y+h); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h); ctx.closePath();
}

function drawMonthlyChart(){
  const host=document.getElementById("monthlyChartHost");
  if(!host) return;
  const data=LAST_MONTHLY_BUCKETS;
  if(!data.length) return;
  const width=getHostWidth(host),height=200;
  const ctx=makeCanvas(host,width,height);
  const cc=chartColors();
  const padL=32,padR=12,padT=14,padB=26;
  const plotW=width-padL-padR,plotH=height-padT-padB;
  const maxVal=Math.max(4,Math.ceil(Math.max(...data.map(d=>d.total))/4)*4);
  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle=cc.grid;
  ctx.fillStyle=cc.axisText; ctx.font="11px Times New Roman, serif"; ctx.textAlign="right";
  const steps=4;
  for(let i=0;i<=steps;i++){
    const v=Math.round(maxVal-(maxVal/steps)*i),y=padT+(plotH/steps)*i;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(width-padR,y); ctx.stroke();
    ctx.fillText(v,padL-6,y+4);
  }
  const slot=plotW/data.length,barWidth=Math.min(22,slot*0.6);
  const labelEvery=data.length>20?3:data.length>10?2:1;
  data.forEach((d,i)=>{
    const cx=padL+slot*i+slot/2,barH=(d.total/maxVal)*plotH;
    const x=cx-barWidth/2,y=padT+plotH-barH;
    const hasIssue=d.issue>0||d.closed>0;
    const grad=ctx.createLinearGradient(0,y,0,padT+plotH);
    if(hasIssue){grad.addColorStop(0,"#fbbf24");grad.addColorStop(1,"#d97706");}
    else{grad.addColorStop(0,"#5b9bff");grad.addColorStop(1,"#2563eb");}
    ctx.fillStyle=grad; roundRectTop(ctx,x,y,barWidth,barH,4); ctx.fill();
    if(i%labelEvery===0){
      ctx.fillStyle=cc.axisText; ctx.textAlign="center";
      ctx.font="10px Times New Roman, serif"; ctx.fillText(d.day,cx,height-8);
    }
  });
}

/* =========================================================
   Validation & Save
   ========================================================= */
function validateDraft(d){
  const errors=[];
  if(!d.date||!d.date.trim()) errors.push("ກະລຸນາລະບຸວັນທີ");
  if(!d.building) errors.push("ກະລຸນາເລືອກອາຄານ");
  if(!d.floor) errors.push("ກະລຸນາເລືອກຊັ້ນ");
  if(d.download===""||isNaN(d.download)||d.download<0) errors.push("ກະລຸນາລະບຸ Download Mbps ທີ່ຖືກຕ້ອງ");
  if(d.upload===""||isNaN(d.upload)||d.upload<0) errors.push("ກະລຸນາລະບຸ Upload Mbps ທີ່ຖືກຕ້ອງ");
  if(d.ping===""||isNaN(d.ping)||d.ping<0) errors.push("ກະລຸນາລະບຸ Ping Ms ທີ່ຖືກຕ້ອງ");
  if(!d.tester) errors.push("ກະລຸນາເລືອກ Tester");
  if(!d.status) errors.push("ກະລຸນາເລືອກສະຖານະ");
  return errors;
}

async function saveDraft(){
  if(isViewer()){ showToast("ສິດ Viewer ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",true); return; }
  const d=DRAFT;
  d.download=Number(d.download)||0;
  d.upload=Number(d.upload)||0;
  d.ping=Number(d.ping)||0;
  const errors=validateDraft(d);
  if(errors.length){ showToast(errors[0],true); return; }

  let finalRec;
  const isEdit=!!STATE.ui.editingId;

  if(isEdit){
    const idx=STATE.records.findIndex(r=>r.id===STATE.ui.editingId);
    if(idx>-1){
      finalRec={...STATE.records[idx],...d,id:STATE.ui.editingId};
      STATE.records[idx]=finalRec;
    }
  } else {
    finalRec={...d,id:uid()};
    STATE.records.unshift(finalRec);
  }

  // Sync to Google Sheet (works for both new and edited records)
  if(finalRec){
    try{
      const formData=new FormData();
      formData.append("data", JSON.stringify({action:"save_record", record:finalRec}));
      const resp=await fetch(API_URL,{method:"POST",body:formData});
      const result=await resp.json();
      if(!result || !result.ok){
        showToast("ບັນທຶກໃນເຄື່ອງສຳເລັດ ແຕ່ Sync ກັບ Google Sheet ບໍ່ສຳເລັດ",true);
      }
    }catch(err){
      console.warn("Save sync failed:",err);
      showToast("ບັນທຶກໃນເຄື່ອງສຳເລັດ ແຕ່ບໍ່ສາມາດເຊື່ອມຕໍ່ Google Sheet ໄດ້ (ກວດສອບອິນເຕີເນັດ)",true);
    }
  }

  showToast(isEdit?"ບັນທຶກການແກ້ໄຂສຳເລັດແລ້ວ ✓":"ເພີ່ມຂໍ້ມູນສຳເລັດແລ້ວ ✓");
  persist();
  STATE.ui.editingId=null;
  DRAFT=newDraft();
  if(d.building==="Hotel") STATE.ui.hotelPage=1; else STATE.ui.residentPage=1;
  render();
}

/* ---- Delete with Google Sheet sync ---- */
async function deleteRecord(id){
  if(!isAdmin()){ showToast("ຕ້ອງເປັນ Admin ເທົ່ານັ້ນຈຶ່ງສາມາດລົບຂໍ້ມູນໄດ້",true); return; }
  let syncOk=true;
  try{
    const formData=new FormData();
    formData.append("data", JSON.stringify({action:"delete_record", id:String(id)}));
    const resp=await fetch(API_URL,{method:"POST",body:formData});
    const result=await resp.json();
    if(!result || !result.ok) syncOk=false;
  }catch(e){ console.warn("Delete sync failed:",e); syncOk=false; }

  STATE.records=STATE.records.filter(r=>r.id!==id);
  persist();
  if(STATE.ui.editingId===id){ STATE.ui.editingId=null; DRAFT=newDraft(); }
  render();
  showToast(syncOk?"ລົບລາຍການສຳເລັດແລ້ວ (Google Sheet ຖືກອັບເດດ)":"ລົບໃນເຄື່ອງສຳເລັດ ແຕ່ Sync ກັບ Google Sheet ບໍ່ສຳເລັດ",!syncOk);
}

/* =========================================================
   Auth
   ========================================================= */
async function attemptLogin(username,password){
  const uname=(username||"").trim().toLowerCase();
  if(!uname||!password){ STATE.ui.loginError="ກະລຸນາກອກຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ"; render(); return; }

  // Try the live API first — this is the authoritative check and works
  // across any device, since the Users sheet is the real source of truth.
  let apiUser=null, apiFailed=false;
  try{
    const formData=new FormData();
    formData.append("data", JSON.stringify({action:"login", username:uname, password}));
    const resp=await fetch(API_URL,{method:"POST", body:formData});
    const result=await resp.json();
    if(result && result.ok){ apiUser=result.user; }
    else if(result && result.error){ STATE.ui.loginError=result.error; }
    else { apiFailed=true; }
  }catch(err){ console.warn("Login API unreachable, falling back to local check:", err); apiFailed=true; }

  if(apiUser){
    STATE.currentUser={id:apiUser.id,name:apiUser.name,username:apiUser.username,role:apiUser.role,permission:apiUser.permission};
    STATE.ui.loginError="";
    persistSession(); render();
    showToast(`ເຂົ້າສູ່ລະບົບສຳເລັດ ຍິນດີຕ້ອນຮັບ ${apiUser.name} ✓`);
    return;
  }

  if(!apiFailed){
    // API reached but explicitly rejected the credentials
    render();
    return;
  }

  // Offline fallback: check against the locally cached Users list
  const user=STATE.users.find(u=>(u.username||"").toLowerCase()===uname);
  if(!user||!user.passwordHash){ STATE.ui.loginError="ບໍ່ພົບຊື່ຜູ້ໃຊ້ນີ້ໃນລະບົບ (ອອບໄລນ໌)"; render(); return; }
  const hash=await hashPassword(password);
  if(hash!==user.passwordHash){ STATE.ui.loginError="ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"; render(); return; }
  STATE.currentUser={id:user.id,name:user.name,username:user.username,role:user.role,permission:user.permission};
  STATE.ui.loginError="";
  persistSession();
  render();
  showToast(`ເຂົ້າສູ່ລະບົບສຳເລັດ (ໂໝດອອບໄລນ໌) ຍິນດີຕ້ອນຮັບ ${user.name} ✓`);
}
function logout(){
  STATE.currentUser=null; persistSession();
  STATE.ui.page="dashboard"; render();
}

/* =========================================================
   Users CRUD
   ========================================================= */
function startEditUser(id){
  const u=STATE.users.find(x=>x.id===id);
  if(!u) return;
  USER_DRAFT={...u,password:""};
  STATE.ui.editingUserId=id;
  render();
}
function isValidEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidUsername(u){ return /^[a-zA-Z0-9_.]{3,20}$/.test(u); }

async function saveUserDraft(){
  if(!isAdmin()){ showToast("ຕ້ອງເປັນ Admin ເທົ່ານັ້ນຈຶ່ງຈັດການຜູ້ໃຊ້ງານໄດ້",true); return; }
  const u=USER_DRAFT;
  if(!u.name||!u.name.trim()){ showToast("ກະລຸນາລະບຸຊື່ຜູ້ໃຊ້ງານ",true); return; }
  if(!u.username||!isValidUsername(u.username.trim())){ showToast("Username ຕ້ອງມີ 3-20 ຕົວອັກສອນ (a-z, 0-9, _, .) ເທົ່ານັ້ນ",true); return; }
  if(!u.email||!isValidEmail(u.email.trim())){ showToast("ກະລຸນາລະບຸອີເມວທີ່ຖືກຕ້ອງ",true); return; }
  if(!u.role){ showToast("ກະລຸນາເລືອກຕຳແໜ່ງ",true); return; }
  if(!u.permission){ showToast("ກະລຸນາເລືອກສິດການໃຊ້ງານ",true); return; }
  const isEdit=!!STATE.ui.editingUserId;
  if(!isEdit&&(!u.password||u.password.length<6)){ showToast("ກະລຸນາຕັ້ງລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ",true); return; }
  if(u.password&&u.password.length>0&&u.password.length<6){ showToast("ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ",true); return; }
  if(STATE.users.find(x=>x.email.toLowerCase()===u.email.trim().toLowerCase()&&x.id!==u.id)){ showToast("ອີເມວນີ້ຖືກໃຊ້ງານໂດຍຜູ້ໃຊ້ອື່ນແລ້ວ",true); return; }
  if(STATE.users.find(x=>(x.username||"").toLowerCase()===u.username.trim().toLowerCase()&&x.id!==u.id)){ showToast("Username ນີ້ຖືກໃຊ້ງານໂດຍຜູ້ໃຊ້ອື່ນແລ້ວ",true); return; }
  if(isEdit&&u.permission!=="admin"){
    const editingIsAdmin=STATE.users.find(x=>x.id===STATE.ui.editingUserId)?.permission==="admin";
    if(editingIsAdmin&&STATE.users.filter(x=>x.permission==="admin"&&x.id!==STATE.ui.editingUserId).length===0){
      showToast("ບໍ່ສາມາດຫຼຸດສິດໄດ້ ເນື່ອງຈາກຕ້ອງມີ Admin ຢ່າງໜ້ອຍ 1 ຄົນ",true); return;
    }
  }
  let finalUser, plainPassword="";
  if(isEdit){
    const idx=STATE.users.findIndex(x=>x.id===STATE.ui.editingUserId);
    if(idx>-1){
      finalUser={...STATE.users[idx],name:u.name.trim(),email:u.email.trim(),role:u.role,username:u.username.trim(),permission:u.permission};
      if(u.password&&u.password.length>=6){ finalUser.passwordHash=await hashPassword(u.password); plainPassword=u.password; }
      STATE.users[idx]=finalUser;
      if(STATE.currentUser&&STATE.currentUser.id===finalUser.id)
        STATE.currentUser={id:finalUser.id,name:finalUser.name,username:finalUser.username,role:finalUser.role,permission:finalUser.permission};
    }
  } else {
    plainPassword=u.password;
    finalUser={id:uid(),name:u.name.trim(),email:u.email.trim(),role:u.role,
      username:u.username.trim(),permission:u.permission,passwordHash:await hashPassword(u.password)};
    STATE.users.push(finalUser);
  }

  // Sync to Google Sheet (Users tab)
  let syncOk=true;
  if(finalUser){
    try{
      const formData=new FormData();
      formData.append("data", JSON.stringify({action:"save_user", user:finalUser, password:plainPassword}));
      const resp=await fetch(API_URL,{method:"POST",body:formData});
      const result=await resp.json();
      if(!result || !result.ok) syncOk=false;
    }catch(err){ console.warn("Save user sync failed:",err); syncOk=false; }
  }

  showToast(syncOk
    ? (isEdit?"ບັນທຶກຂໍ້ມູນຜູ້ໃຊ້ງານສຳເລັດ ✓":"ເພີ່ມຜູ້ໃຊ້ງານສຳເລັດ ✓")
    : "ບັນທຶກໃນເຄື່ອງສຳເລັດ ແຕ່ Sync ກັບ Google Sheet ບໍ່ສຳເລັດ", !syncOk);
  persistUsers(); STATE.ui.editingUserId=null; USER_DRAFT=newUserDraft(); render();
}

async function deleteUser(id){
  if(!isAdmin()){ showToast("ຕ້ອງເປັນ Admin ເທົ່ານັ້ນ",true); return; }
  if(STATE.currentUser&&STATE.currentUser.id===id){ showToast("ບໍ່ສາມາດລົບບັນຊີທີ່ກຳລັງໃຊ້ງານຢູ່",true); return; }
  const target=STATE.users.find(u=>u.id===id);
  if(target&&target.permission==="admin"&&STATE.users.filter(u=>u.permission==="admin"&&u.id!==id).length===0){
    showToast("ບໍ່ສາມາດລົບໄດ້ ຕ້ອງມີ Admin ຢ່າງໜ້ອຍ 1 ຄົນ",true); return;
  }
  let syncOk=true;
  try{
    const formData=new FormData();
    formData.append("data", JSON.stringify({action:"delete_user", id:String(id)}));
    const resp=await fetch(API_URL,{method:"POST",body:formData});
    const result=await resp.json();
    if(!result || !result.ok) syncOk=false;
  }catch(e){ console.warn("Delete user sync failed:",e); syncOk=false; }

  STATE.users=STATE.users.filter(u=>u.id!==id);
  persistUsers();
  if(STATE.ui.editingUserId===id){ STATE.ui.editingUserId=null; USER_DRAFT=newUserDraft(); }
  render();
  showToast(syncOk?"ລົບຜູ້ໃຊ້ງານສຳເລັດ":"ລົບໃນເຄື່ອງສຳເລັດ ແຕ່ Sync ກັບ Google Sheet ບໍ່ສຳເລັດ", !syncOk);
}

/* =========================================================
   Settings save
   ========================================================= */
function saveSettingsFromForm(){
  if(!isAdmin()){ showToast("ຕ້ອງເປັນ Admin ເທົ່ານັ້ນ",true); return; }
  const name=(document.getElementById("set-company-name")?.value||"").trim();
  const sub=(document.getElementById("set-company-sub")?.value||"").trim();
  const printLayout=(document.getElementById("set-print-layout")?.value)||STATE.settings.printLayout||"separate";
  if(!name){ showToast("ກະລຸນາລະບຸຊື່ບໍລິສັດ",true); return; }
  STATE.settings={companyName:name,companySub:sub,logo:STATE.settings.logo||"📶",logoUrl:STATE.settings.logoUrl||"",printLayout};
  persistSettings(); render(); showToast("ບັນທຶກການຕັ້ງຄ່າສຳເລັດ ✓");
}

/* =========================================================
   Confirm modal
   ========================================================= */
function openConfirmModal(text,onConfirm){
  const modal=document.getElementById("confirmModal");
  document.getElementById("confirmText").textContent=text;
  modal.classList.add("show");
  const okBtn=document.getElementById("confirmOk");
  const cancelBtn=document.getElementById("confirmCancel");
  function cleanup(){ modal.classList.remove("show"); okBtn.removeEventListener("click",onOk); cancelBtn.removeEventListener("click",onCancel); }
  function onOk(){ cleanup(); onConfirm(); }
  function onCancel(){ cleanup(); }
  okBtn.addEventListener("click",onOk);
  cancelBtn.addEventListener("click",onCancel);
}

/* =========================================================
   Export / Import
   ========================================================= */
function exportData(){
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),records:STATE.records,trend:STATE.trend},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`wifi-backup-${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast("ສົ່ງອອກຂໍ້ມູນ JSON ສຳເລັດ");
}
function importData(file){
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const parsed=JSON.parse(e.target.result);
      if(!parsed||!Array.isArray(parsed.records)) throw new Error("invalid");
      if(!parsed.records.every(r=>r&&typeof r==="object"&&"code"in r&&"building"in r)) throw new Error("invalid structure");
      openConfirmModal(
        `ພົບຂໍ້ມູນ ${parsed.records.length} ລາຍການ ການນຳເຂົ້າຈະແທນທີ່ຂໍ້ມູນທັງໝົດ ຕ້ອງການດຳເນີນການຕໍ່ຫຼືບໍ່?`,
        ()=>{
          STATE.records=parsed.records.map(r=>({...r,id:r.id||uid()}));
          if(Array.isArray(parsed.trend)&&parsed.trend.length) STATE.trend=parsed.trend;
          STATE.ui.hotelPage=1; STATE.ui.residentPage=1; STATE.ui.editingId=null; DRAFT=newDraft();
          persist(); render(); showToast(`ນຳເຂົ້າ ${parsed.records.length} ລາຍການສຳເລັດ ✓`);
        }
      );
    }catch(err){ showToast("ໄຟລ໌ບໍ່ຖືກຕ້ອງ ບໍ່ສາມາດນຳເຂົ້າໄດ້",true); }
  };
  reader.readAsText(file);
}
function resetToMock(){
  openConfirmModal(
    "ຄືນຄ່າຂໍ້ມູນທັງໝົດເປັນຕົວຢ່າງ ຂໍ້ມູນປັດຈຸບັນຈະຖືກແທນທີ່ ຕ້ອງການດຳເນີນການຕໍ່ຫຼືບໍ່?",
    ()=>{
      const mock=buildMockData();
      STATE.records=mock.records; STATE.trend=mock.trend;
      STATE.ui.hotelPage=1; STATE.ui.residentPage=1; STATE.ui.editingId=null; DRAFT=newDraft();
      persist(); render(); showToast("ຄືນຄ່າຕົວຢ່າງສຳເລັດ");
    }
  );
}

/* =========================================================
   Event binding
   ========================================================= */
function bindEvents(){
  const app=document.getElementById("app");
  app.addEventListener("click",onAppClick);
  app.addEventListener("change",onAppChange);
  app.addEventListener("input",onAppInput);
  app.addEventListener("keydown",onAppKeydown);
  document.getElementById("importFile").onchange=e=>{
    const file=e.target.files[0];
    if(file) importData(file);
    e.target.value="";
  };
  const logoInput=document.getElementById("logoFileInput");
  if(logoInput){
    logoInput.onchange=e=>{
      const file=e.target.files[0];
      e.target.value="";
      if(!file) return;
      if(!file.type.startsWith("image/")){ showToast("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບເທົ່ານັ້ນ",true); return; }
      if(file.size>1.5*1024*1024){ showToast("ຮູບໃຫຍ່ເກີນໄປ ກະລຸນາໃຊ້ຮູບທີ່ນ້ອຍກວ່າ 1.5MB",true); return; }
      const reader=new FileReader();
      reader.onload=ev=>{
        STATE.settings.logoUrl=ev.target.result;
        const prev=document.getElementById("logoPreview");
        if(prev) prev.innerHTML=`<img src="${STATE.settings.logoUrl}" alt="logo" style="width:100%;height:100%;object-fit:cover;">`;
        showToast("ອັບໂລດໂລໂກ້ສຳເລັດ ກົດ 'ບັນທຶກການຕັ້ງຄ່າ' ເພື່ອບັນທຶກ");
      };
      reader.readAsDataURL(file);
    };
  }
}

function onAppKeydown(e){
  if(e.key==="Enter"&&e.target.matches('[data-action^="search-"]')) e.preventDefault();
  if(e.key==="Enter"&&(e.target.id==="login-username"||e.target.id==="login-password")){
    e.preventDefault(); document.getElementById("btnLogin")?.click();
  }
}

async function onAppClick(e){
  const loginBtn=e.target.closest("#btnLogin");
  if(loginBtn){
    await attemptLogin(document.getElementById("login-username")?.value, document.getElementById("login-password")?.value);
    return;
  }
  const saveBtn=e.target.closest("#btnSave");
  if(saveBtn){ saveDraft(); return; }
  const cancelBtn=e.target.closest("#btnCancelEdit");
  if(cancelBtn){ STATE.ui.editingId=null; DRAFT=newDraft(); render(); return; }
  const deleteFormBtn=e.target.closest("#btnDeleteFromForm");
  if(deleteFormBtn){
    const id=STATE.ui.editingId;
    const rec=STATE.records.find(r=>r.id===id);
    openConfirmModal(`ຕ້ອງການລົບລາຍການ "${rec?rec.code:""}" ຫຼືບໍ່? ບໍ່ສາມາດຍ້ອນກັບໄດ້`,()=>deleteRecord(id));
    return;
  }
  const saveUserBtn=e.target.closest("#btnSaveUser");
  if(saveUserBtn){ await saveUserDraft(); return; }
  const cancelUserBtn=e.target.closest("#btnCancelUserEdit");
  if(cancelUserBtn){ STATE.ui.editingUserId=null; USER_DRAFT=newUserDraft(); render(); return; }
  const saveSettingsBtn=e.target.closest("#btnSaveSettings");
  if(saveSettingsBtn){ saveSettingsFromForm(); return; }

  const t=e.target.closest("[data-action]");
  if(!t) return;
  const action=t.dataset.action;

  switch(action){
    case "nav-to":       navigateTo(t.dataset.page); break;
    case "logout":       logout(); break;
    case "focus-form":   navigateTo("dashboard"); startNew(); break;
    case "sync-data":
      await loadState(); render(); showToast("ຊິງຂໍ້ມູນຈາກ Google Sheet ສຳເລັດ ✓");
      break;
    case "export":       exportData(); break;
    case "import":       document.getElementById("importFile").click(); break;
    case "reset-mock":   resetToMock(); break;
    case "print-report":
    case "print-dashboard": window.print(); break;

    case "quick-add-hotel":
      startNew("Hotel");
      document.querySelector(".form-panel")?.scrollIntoView({behavior:"smooth"});
      break;
    case "quick-add-resident":
      startNew("Resident");
      document.querySelector(".form-panel")?.scrollIntoView({behavior:"smooth"});
      break;
    case "view-all-hotel":     navigateTo("hotel");       break;
    case "view-all-resident":  navigateTo("resident");    break;
    case "view-all-records":   navigateTo("all-records"); break;

    case "edit-record": startEdit(t.dataset.id); break;
    case "delete-record":{
      const rec=STATE.records.find(r=>r.id===t.dataset.id);
      openConfirmModal(`ຕ້ອງການລົບລາຍການ "${rec?rec.code:""}" ຫຼືບໍ່? ບໍ່ສາມາດຍ້ອນກັບໄດ້`,()=>deleteRecord(t.dataset.id));
      break;
    }

    case "page-hotel":{
      const dir=Number(t.dataset.dir);
      const tp=Math.max(1,Math.ceil(filterRecords("Hotel",STATE.ui.hotelSearch).length/STATE.ui.pageSize));
      STATE.ui.hotelPage=Math.min(tp,Math.max(1,STATE.ui.hotelPage+dir)); render(); break;
    }
    case "page-resident":{
      const dir=Number(t.dataset.dir);
      const tp=Math.max(1,Math.ceil(filterRecords("Resident",STATE.ui.residentSearch).length/STATE.ui.pageSize));
      STATE.ui.residentPage=Math.min(tp,Math.max(1,STATE.ui.residentPage+dir)); render(); break;
    }
    case "page-hotelFull":{
      const dir=Number(t.dataset.dir);
      const tp=Math.max(1,Math.ceil(filterRecordsFull({building:"Hotel",status:"all",search:STATE.ui.hotelFullSearch}).length/STATE.ui.pageSize));
      STATE.ui.hotelFullPage=Math.min(tp,Math.max(1,STATE.ui.hotelFullPage+dir)); render(); break;
    }
    case "page-residentFull":{
      const dir=Number(t.dataset.dir);
      const tp=Math.max(1,Math.ceil(filterRecordsFull({building:"Resident",status:"all",search:STATE.ui.residentFullSearch}).length/STATE.ui.pageSize));
      STATE.ui.residentFullPage=Math.min(tp,Math.max(1,STATE.ui.residentFullPage+dir)); render(); break;
    }
    case "page-all":{
      const dir=Number(t.dataset.dir);
      const tp=Math.max(1,Math.ceil(filterRecordsFull({building:STATE.ui.allFilterBuilding,status:STATE.ui.allFilterStatus,search:STATE.ui.allSearch}).length/STATE.ui.pageSize));
      STATE.ui.allPage=Math.min(tp,Math.max(1,STATE.ui.allPage+dir)); render(); break;
    }

    case "filter-all-building": STATE.ui.allFilterBuilding=t.dataset.value; STATE.ui.allPage=1; render(); break;
    case "filter-all-status":   STATE.ui.allFilterStatus=t.dataset.value;   STATE.ui.allPage=1; render(); break;

    case "set-building": DRAFT.building=t.dataset.value; render(); break;
    case "set-status":   DRAFT.status=t.dataset.value;   render(); break;
    case "step":{
      const field=t.dataset.field, dir=Number(t.dataset.dir);
      DRAFT[field]=Math.max(0,(Number(DRAFT[field])||0)+dir);
      render(); break;
    }

    case "edit-user":   startEditUser(t.dataset.id); break;
    case "delete-user":{
      const u=STATE.users.find(x=>x.id===t.dataset.id);
      openConfirmModal(`ຕ້ອງການລົບຜູ້ໃຊ້ງານ "${u?u.name:""}" ຫຼືບໍ່?`,()=>deleteUser(t.dataset.id));
      break;
    }
    case "pick-logo":
      STATE.settings.logo=t.dataset.value;
      STATE.settings.logoUrl="";
      document.querySelectorAll(".logo-opt").forEach(el=>el.classList.toggle("active",el.dataset.value===t.dataset.value));
      { const prev=document.getElementById("logoPreview"); if(prev) prev.innerHTML=t.dataset.value; }
      break;

    case "toggle-sidebar":
      STATE.ui.sidebarOpen=!STATE.ui.sidebarOpen; render(); break;
    case "toggle-form-panel":
      STATE.ui.formPanelOpen=!STATE.ui.formPanelOpen; render(); break;
    case "copy-report-link":
      copyReportLink(t.dataset.page); break;
  }

  const uploadLogoBtn=e.target.closest("#btnUploadLogo");
  if(uploadLogoBtn){ document.getElementById("logoFileInput")?.click(); return; }
  const removeLogoBtn=e.target.closest("#btnRemoveLogo");
  if(removeLogoBtn){
    if(!isAdmin()){ showToast("ຕ້ອງເປັນ Admin ເທົ່ານັ້ນ",true); return; }
    STATE.settings.logoUrl=""; persistSettings(); render(); showToast("ລົບໂລໂກ້ສຳເລັດ");
    return;
  }
}

function onAppChange(e){
  const el=e.target;
  if(el.dataset&&el.dataset.field){
    let val=el.value;
    if(["download","upload","ping"].includes(el.dataset.field)) val=val===""?0:Number(val);
    DRAFT[el.dataset.field]=val; return;
  }
  if(el.dataset&&el.dataset.ufield){ USER_DRAFT[el.dataset.ufield]=el.value; return; }
  if(el.id==="dailyDateInput"){ STATE.ui.reportDailyDate=el.value||todayISODate(); render(); return; }
  if(el.id==="monthlyMonthInput"){ STATE.ui.reportMonthlyMonth=el.value||currentYearMonth(); render(); return; }
  if(el.dataset.action==="range-main"){ STATE.ui.chartRangeMain=el.value; drawAllCharts(); }
  if(el.dataset.action==="range-ping"){ STATE.ui.chartRangePing=el.value; drawAllCharts(); }
}

let searchDebounce=null;
function onAppInput(e){
  const el=e.target;
  if(el.dataset&&el.dataset.field){
    const field=el.dataset.field, val=el.value;
    DRAFT[field]=["download","upload","ping"].includes(field)?(val===""?"":Number(val)):val;
    return;
  }
  if(el.dataset&&el.dataset.ufield){ USER_DRAFT[el.dataset.ufield]=el.value; return; }
  const searchActions={
    "search-hotel":        {field:"hotelSearch",      page:"hotelPage"},
    "search-resident":     {field:"residentSearch",   page:"residentPage"},
    "search-hotelFull":    {field:"hotelFullSearch",  page:"hotelFullPage"},
    "search-residentFull": {field:"residentFullSearch",page:"residentFullPage"},
    "search-all":          {field:"allSearch",        page:"allPage"}
  };
  const ak=el.dataset.action;
  if(searchActions[ak]){
    const {field,page}=searchActions[ak];
    clearTimeout(searchDebounce);
    const cur=el.selectionStart;
    searchDebounce=setTimeout(()=>{
      STATE.ui[field]=el.value; STATE.ui[page]=1; render();
      const newEl=document.querySelector(`[data-action="${ak}"]`);
      if(newEl){ newEl.focus(); try{newEl.setSelectionRange(cur,cur);}catch(_){} }
    },250);
  }
}

let resizeTimer=null;
window.addEventListener("resize",()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(drawAllCharts,150); });

/* =========================================================
   Boot
   ========================================================= */
async function boot(){
  await loadState();
  applyHashRoute();
  DRAFT=newDraft();
  USER_DRAFT=newUserDraft();
  // ໜ້າຈໍນ້ອຍ (ມືຖື/ແທັບເລັດ): ໃຫ້ເມນູຂ້າງເລີ່ມຕົ້ນປິດໄວ້ (ເປັນລິ້ນຊັກເລື່ອນ),
  // ໜ້າຈໍໃຫຍ່ (PC/Notebook): ໃຫ້ເມນູຂ້າງເປີດໄວ້ຄືເກົ່າ
  if(typeof window!=="undefined" && window.innerWidth<=1100) STATE.ui.sidebarOpen=false;
  render();
  setInterval(async()=>{
    if(STATE.ui.editingId) return; // don't yank data out from under an active edit
    await loadState(); render();
  },30000);
}
boot();
