const $ = (id)=>document.getElementById(id);
const money = (n)=>"$" + (Number(n)||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const num = (v)=>Number(v)||0;
const goldKs = ["8","9","10","14","18","21","22","24"];
const silverCols = ["999","925","900","800","600","400"];
const storeKey = () => "cashout_register_" + ($("date").value || new Date().toISOString().slice(0,10));

function todayTime(){ return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }
function blankGold(){ return {time:todayTime(), receipt:"", cash:"", k8:"", k9:"", k10:"", k14:"", k18:"", k21:"", k22:"", k24:"", other:"", notes:""}; }
function blankSilver(){ return {time:todayTime(), receipt:"", cash:"", s999:"", s925:"", s900:"", s800:"", s600:"", s400:"", other:"", notes:""}; }

let state = {date:new Date().toISOString().slice(0,10), employee:"", startingCash:"", totalCashOut:"", gold:[blankGold()], silver:[blankSilver()]};

function cell(row, key, type="text"){
  return `<td><input data-key="${key}" value="${row[key] ?? ""}" ${type==="number" ? 'type="number" step="0.01"' : ""}></td>`;
}

function render(){
  $("date").value = state.date;
  $("employee").value = state.employee;
  $("startingCash").value = state.startingCash;
  $("totalCashOut").value = state.totalCashOut;

  const gt = $("goldTable").querySelector("tbody");
  gt.innerHTML = state.gold.map((r,i)=>`<tr data-i="${i}">
    ${cell(r,"time")}${cell(r,"receipt")}${cell(r,"cash","number")}
    ${cell(r,"k8","number")}${cell(r,"k9","number")}${cell(r,"k10","number")}${cell(r,"k14","number")}${cell(r,"k18","number")}${cell(r,"k21","number")}${cell(r,"k22","number")}${cell(r,"k24","number")}
    ${cell(r,"other")}${cell(r,"notes")}<td><button class="deleteRow" data-type="gold" data-i="${i}">X</button></td>
  </tr>`).join("");

  const st = $("silverTable").querySelector("tbody");
  st.innerHTML = state.silver.map((r,i)=>`<tr data-i="${i}">
    ${cell(r,"time")}${cell(r,"receipt")}${cell(r,"cash","number")}
    ${cell(r,"s999","number")}${cell(r,"s925","number")}${cell(r,"s900","number")}${cell(r,"s800","number")}${cell(r,"s600","number")}${cell(r,"s400","number")}
    ${cell(r,"other")}${cell(r,"notes")}<td><button class="deleteRow" data-type="silver" data-i="${i}">X</button></td>
  </tr>`).join("");
  bindTableInputs();
  calc();
}

function bindTableInputs(){
  document.querySelectorAll("#goldTable tbody input").forEach(inp=>{
    inp.addEventListener("input", e=>{
      const i = e.target.closest("tr").dataset.i;
      state.gold[i][e.target.dataset.key]=e.target.value;
      calc();
    });
  });
  document.querySelectorAll("#silverTable tbody input").forEach(inp=>{
    inp.addEventListener("input", e=>{
      const i = e.target.closest("tr").dataset.i;
      state.silver[i][e.target.dataset.key]=e.target.value;
      calc();
    });
  });
  document.querySelectorAll(".deleteRow").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const type=e.target.dataset.type, i=Number(e.target.dataset.i);
      state[type].splice(i,1);
      if(state[type].length===0) state[type].push(type==="gold"?blankGold():blankSilver());
      render();
    });
  });
}

function calc(){
  const goldCash = state.gold.reduce((a,r)=>a+num(r.cash),0);
  const silverCash = state.silver.reduce((a,r)=>a+num(r.cash),0);
  const totalCashOut = num(state.totalCashOut) || (goldCash + silverCash);
  const balance = num(state.startingCash) - totalCashOut;

  $("balance").textContent = money(balance);
  $("goldCashTotal").textContent = money(goldCash);
  $("goldCash").textContent = money(goldCash);
  $("silverCashTotal").textContent = money(silverCash);

  let totalDwt = 0, pureDwt = 0;
  goldKs.forEach(k=>{
    const total = state.gold.reduce((a,r)=>a+num(r["k"+k]),0);
    $("tot"+k).textContent = total.toFixed(1);
    totalDwt += total;
    pureDwt += total * (Number(k)/24);
  });
  $("goldDwt").textContent = totalDwt.toFixed(2);
  $("pureDwt").textContent = pureDwt.toFixed(2);
  $("pureOz").textContent = (pureDwt/20).toFixed(4);

  silverCols.forEach(c=>{
    const total = state.silver.reduce((a,r)=>a+num(r["s"+c]),0);
    $("s"+c).textContent = total.toFixed(1);
  });
}

function save(){
  localStorage.setItem(storeKey(), JSON.stringify(state));
  alert("Saved for " + state.date);
}

function loadForDate(date){
  const saved = localStorage.getItem("cashout_register_" + date);
  state = saved ? JSON.parse(saved) : {date, employee:"", startingCash:"", totalCashOut:"", gold:[blankGold()], silver:[blankSilver()]};
  render();
}

function exportCSV(){
  const lines = [];
  lines.push(["Date",state.date,"Employee",state.employee,"Starting Cash",state.startingCash,"Total Cash Out",state.totalCashOut].join(","));
  lines.push("");
  lines.push("GOLD");
  lines.push(["Time","Receipt","Cash Paid","8K","9K","10K","14K","18K","21K","22K","24K","Other","Notes"].join(","));
  state.gold.forEach(r=>lines.push([r.time,r.receipt,r.cash,r.k8,r.k9,r.k10,r.k14,r.k18,r.k21,r.k22,r.k24,r.other,r.notes].map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")));
  lines.push("");
  lines.push("SILVER");
  lines.push(["Time","Receipt","Cash Paid",".999",".925",".900",".800",".600",".400","Other","Notes"].join(","));
  state.silver.forEach(r=>lines.push([r.time,r.receipt,r.cash,r.s999,r.s925,r.s900,r.s800,r.s600,r.s400,r.other,r.notes].map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")));
  const blob = new Blob([lines.join("\n")], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `cashout-register-${state.date}.csv`;
  a.click();
}

["employee","startingCash","totalCashOut"].forEach(id=>{
  $(id).addEventListener("input", e=>{ state[id]=e.target.value; calc(); });
});
$("date").addEventListener("change", e=>loadForDate(e.target.value));
$("addGoldRow").addEventListener("click", ()=>{state.gold.push(blankGold());render();});
$("addSilverRow").addEventListener("click", ()=>{state.silver.push(blankSilver());render();});
$("saveBtn").addEventListener("click", save);
$("printBtn").addEventListener("click", ()=>window.print());
$("csvBtn").addEventListener("click", exportCSV);
$("clearBtn").addEventListener("click", ()=>{ if(confirm("Clear this day?")){ localStorage.removeItem(storeKey()); loadForDate(state.date); }});

loadForDate(state.date);
