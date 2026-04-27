const SUPABASE_URL = "https://qkpbmobfwwcygzjxehik.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY_HERE";

window.calculatePayout = function () {
  const weight = parseFloat(document.getElementById("weight").value) || 0;
  const karat = parseFloat(document.getElementById("karat").value) || 0;
  const spot = parseFloat(document.getElementById("spot").value) || 0;
  const payoutPercent = parseFloat(document.getElementById("payout").value) || 0;

  const purity = karat / 24;
  const pureGoldGrams = weight * purity;
  const pureGoldTroyOz = pureGoldGrams / 31.1035;
  const meltValue = pureGoldTroyOz * spot;
  const payout = meltValue * (payoutPercent / 100);

  document.getElementById("result").innerText = "$" + payout.toFixed(2);
};

window.saveData = async function () {
  alert("Save button works. Next we connect this to the correct Supabase table.");
};

document.getElementById("loginBtn")?.addEventListener("click", function () {
  document.getElementById("app").classList.remove("hidden");
});
