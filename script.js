const CITY = "El Oued";
const COUNTRY = "Algeria";
const METHOD = 19;
const API = "https://api.aladhan.com/v1";
const prayers = [
  {key:"Fajr",name:"الفجر",symbol:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M24.5 23A11 11 0 0 1 11 7.5 11.5 11.5 0 1 0 24.5 23Z"/><path d="M7 25h18M10 28h12"/><path d="m23 5 .8 2.1 2.2.8-2.2.8L23 11l-.8-2.3-2.2-.8 2.2-.8L23 5Z"/></svg>'},
  {key:"Dhuhr",name:"الظهر",symbol:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6"/><path d="M16 2.5v4M16 25.5v4M2.5 16h4M25.5 16h4M6.4 6.4l2.8 2.8m13.6 13.6 2.8 2.8m0-19.2-2.8 2.8M9.2 22.8l-2.8 2.8"/></svg>'},
  {key:"Asr",name:"العصر",symbol:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 23h24M7 27h18M9 19a7 7 0 0 1 14 0"/><path d="M16 3v4M5.5 8.5l3 3m18-3-3 3"/></svg>'},
  {key:"Maghrib",name:"المغرب",symbol:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 23h24M7 27h18M9 23a7 7 0 0 1 14 0"/><path d="M16 4v4M5 10l3 3m19-3-3 3"/><path d="M11 17h10"/></svg>'},
  {key:"Isha",name:"العشاء",symbol:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M24.5 23A11 11 0 0 1 11 7.5 11.5 11.5 0 1 0 24.5 23Z"/><path d="m24 5 .8 2.1 2.2.8-2.2.8L24 11l-.8-2.3-2.2-.8 2.2-.8L24 5Z"/><path d="m8 7 .5 1.4L10 9l-1.5.6L8 11l-.5-1.4L6 9l1.5-.6L8 7Z"/></svg>'}
];
const $ = id => document.getElementById(id);
let prayerTimes = null, hijriInfo = null, nextPrayerIndex = 0, timerInterval = null;
let calendarDate = new Date();
let notificationEnabled = false, notifiedPrayer = "";
const morningAzkar = [
  ["أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.","مرة واحدة","صحيح مسلم"],
  ["اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.","مرة واحدة","سنن الترمذي"],
  ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.","100 مرة","صحيح مسلم"],
  ["رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.","3 مرات","سنن أبي داود"],
  ["اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ.","مرة واحدة","سنن أبي داود"],
  ["بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.","3 مرات","سنن أبي داود"],
  ["اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ.","10 مرات","ذكر مشروع"]
];
const eveningAzkar = [
  ["أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.","مرة واحدة","صحيح مسلم"],
  ["اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.","مرة واحدة","سنن الترمذي"],
  ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.","100 مرة","صحيح مسلم"],
  ["أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.","3 مرات","صحيح مسلم"],
  ["رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.","3 مرات","سنن أبي داود"],
  ["بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.","3 مرات","سنن أبي داود"],
  ["اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ.","10 مرات","ذكر مشروع"]
];
function datePath(date=new Date()){return `${String(date.getDate()).padStart(2,"0")}-${String(date.getMonth()+1).padStart(2,"0")}-${date.getFullYear()}`;}
function cleanTime(value){return String(value||"").split(" ")[0].slice(0,5);}
function timeToday(value, dayOffset=0){
  const [h,m]=cleanTime(value).split(":").map(Number);
  const d=new Date();d.setDate(d.getDate()+dayOffset);d.setHours(h||0,m||0,0,0);return d;
}
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timeout);showToast.timeout=setTimeout(()=>t.classList.remove("show"),2600);}
function updateClock(){
  const now=new Date();
  $("liveClock").textContent=new Intl.DateTimeFormat("ar-DZ",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
  $("gregorianDate").textContent=new Intl.DateTimeFormat("ar-DZ",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
  $("year").textContent=now.getFullYear();
}
async function fetchPrayerTimes(){
  $("refreshBtn").classList.add("loading");
  try{
    const url=`${API}/timingsByCity/${datePath()}?city=${encodeURIComponent(CITY)}&country=${encodeURIComponent(COUNTRY)}&method=${METHOD}`;
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok)throw new Error("تعذر الاتصال بخدمة المواقيت");
    const json=await response.json();if(json.code!==200)throw new Error("لم تصل بيانات المواقيت");
    prayerTimes=json.data.timings;hijriInfo=json.data.date.hijri;
    renderPrayerCards();renderHijri();updateNextPrayer();showToast("تم تحديث مواقيت الصلاة");
  }catch(error){
    console.error(error);showToast("تعذر جلب المواقيت. تحقق من اتصال الإنترنت.");
    $("prayerGrid").innerHTML='<div class="empty-state">تعذر تحميل المواقيت حالياً. تحقق من الإنترنت ثم اضغط تحديث.</div>';
    $("nextPrayerHint").textContent="تحقق من اتصال الإنترنت لتحديث المواقيت.";
  }finally{$("refreshBtn").classList.remove("loading");}
}
function renderPrayerCards(){
  if(!prayerTimes)return;
  $("todayLabel").textContent=new Intl.DateTimeFormat("ar-DZ",{day:"numeric",month:"long"}).format(new Date());
  $("prayerGrid").innerHTML=prayers.map(p=>`<article class="prayer-card" id="card-${p.key}"><span class="prayer-symbol">${p.symbol}</span><h3>${p.name}</h3><time>${cleanTime(prayerTimes[p.key])}</time></article>`).join("");
}
function renderHijri(){
  if(!hijriInfo)return;
  const formatted=`${hijriInfo.day} ${hijriInfo.month.ar} ${hijriInfo.year} هـ`;
  $("hijriDate").textContent=formatted;$("calendarHijriToday").textContent=formatted;
  $("calendarGregorianToday").textContent=new Intl.DateTimeFormat("ar-DZ",{day:"numeric",month:"long",year:"numeric"}).format(new Date());
}
function updateNextPrayer(){
  if(!prayerTimes)return;
  const now=new Date();let upcoming=-1, target=null;
  for(let i=0;i<prayers.length;i++){const t=timeToday(prayerTimes[prayers[i].key]);if(t>now){upcoming=i;target=t;break;}}
  if(upcoming===-1){upcoming=0;target=timeToday(prayerTimes.Fajr,1);}
  nextPrayerIndex=upcoming;
  $("nextPrayerName").textContent=prayers[upcoming].name;
  $("nextPrayerHint").textContent=`موعد الأذان ${cleanTime(prayerTimes[prayers[upcoming].key])}${upcoming===0&&target.getDate()!==now.getDate()?" · غداً":""}`;
  document.querySelectorAll(".prayer-card").forEach(c=>c.classList.remove("current"));
  const card=$(`card-${prayers[upcoming].key}`);if(card)card.classList.add("current");
  if(timerInterval)clearInterval(timerInterval);
  const tick=()=>{
    const diff=Math.max(0,target-new Date());
    const h=Math.floor(diff/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
    $("hours").textContent=String(h).padStart(2,"0");$("minutes").textContent=String(m).padStart(2,"0");$("seconds").textContent=String(s).padStart(2,"0");
    if(diff===0){if(notificationEnabled&&notifiedPrayer!==prayers[upcoming].key){showToast(`حان الآن وقت صلاة ${prayers[upcoming].name}`);notifiedPrayer=prayers[upcoming].key;}fetchPrayerTimes();}
  };
  tick();timerInterval=setInterval(tick,1000);
}
function renderAzkar(kind="morning"){
  const data=kind==="morning"?morningAzkar:eveningAzkar;
  $("azkarList").innerHTML=data.map((z,i)=>`<article class="zekr-card"><div class="zekr-text">${z[0]}</div><div class="zekr-footer"><span class="zekr-source">${z[2]} · ${z[1]}</span><button class="counter-btn" data-count="${i}" data-total="${parseInt(z[1])||1}">تم الذكر ✓</button></div></article>`).join("");
  $("azkarList").querySelectorAll(".counter-btn").forEach(btn=>btn.addEventListener("click",()=>{btn.classList.add("done");btn.textContent="أحسنت ✓";}));
}
async function loadCalendar(){
  const year=calendarDate.getFullYear(),month=calendarDate.getMonth()+1;
  $("calendarMonth").textContent=new Intl.DateTimeFormat("ar-DZ",{month:"long",year:"numeric"}).format(calendarDate);
  $("calendarBody").innerHTML='<tr><td colspan="7">جارٍ تحميل التقويم...</td></tr>';
  try{
    const url=`${API}/calendarByCity/${year}/${month}?city=${encodeURIComponent(CITY)}&country=${encodeURIComponent(COUNTRY)}&method=${METHOD}`;
    const res=await fetch(url);if(!res.ok)throw new Error("calendar");
    const json=await res.json();const days=json.data;
    const first=new Date(year,month-1,1).getDay();const total=new Date(year,month,0).getDate();
    const cells=Array(first).fill(null).concat(days.slice(0,total));
    while(cells.length%7)cells.push(null);
    let rows="";
    for(let i=0;i<cells.length;i+=7){
      rows+="<tr>"+cells.slice(i,i+7).map(day=>{
        if(!day)return '<td class="empty"></td>';
        const g=day.date.gregorian;const isToday=g.date===datePath() || (Number(g.day)===new Date().getDate()&&Number(g.month.number)===new Date().getMonth()+1&&Number(g.year)===new Date().getFullYear());
        return `<td class="${isToday?"today":""}">${Number(g.day)}<span class="hijri-day">${day.date.hijri.day} ${day.date.hijri.month.ar}</span></td>`;
      }).join("")+"</tr>";
    }
    $("calendarBody").innerHTML=rows;
  }catch(e){$("calendarBody").innerHTML='<tr><td colspan="7">تعذر تحميل التقويم. حاول مرة أخرى.</td></tr>';}
}
function setupSettings(){
  $("settingsOpen").addEventListener("click",()=>$("settingsModal").classList.add("open"));
  $("settingsClose").addEventListener("click",()=>$("settingsModal").classList.remove("open"));
  $("settingsModal").addEventListener("click",e=>{if(e.target===$("settingsModal"))$("settingsModal").classList.remove("open");});
  $("settingsDone").addEventListener("click",()=>{
    $("hijriDate").style.display=$("hijriToggle").checked?"block":"none";
    document.body.classList.toggle("no-motion",!$("motionToggle").checked);
    notificationEnabled=$("notifyToggle").checked;
    if(notificationEnabled&&"Notification"in window&&Notification.permission==="default")Notification.requestPermission();
    $("settingsModal").classList.remove("open");showToast("تم حفظ إعداداتك");
  });
  $("refreshBtn").addEventListener("click",fetchPrayerTimes);
  $("prevMonth").addEventListener("click",()=>{calendarDate.setMonth(calendarDate.getMonth()-1);loadCalendar();});
  $("nextMonth").addEventListener("click",()=>{calendarDate.setMonth(calendarDate.getMonth()+1);loadCalendar();});
  document.querySelectorAll(".seg-btn").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".seg-btn").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");renderAzkar(btn.dataset.kind);
  }));
}
function init(){
  updateClock();setInterval(updateClock,1000);setupSettings();renderAzkar();fetchPrayerTimes();loadCalendar();
  // اتجاه القبلة التقريبي لمدينة الوادي
  $("qiblaNeedle").style.transform="rotate(111deg)";
}
document.addEventListener("DOMContentLoaded",init);
