const SUPABASE_URL = "https://qkpbmobfwwcygzjxehik.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcGJtb2Jmd3djeWd6anhlaGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjA4MzAsImV4cCI6MjA5Mjc5NjgzMH0.C0mPGmPiO24SvrsIAMs27qTR8X5VxfOuk9cbHQ2PIkk";

async function saveData() {
  const date = document.querySelector("input[type='date']")?.value || new Date().toISOString();
  const employee = document.querySelector("input[placeholder='Employee name']")?.value;
  const starting_cash = document.querySelector("input[placeholder='0.00']")?.value;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/registers`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      date,
      employee,
      starting_cash
    })
  });

  if (response.ok) {
    alert("✅ Saved to cloud!");
  } else {
    alert("❌ Error saving");
    console.log(await response.text());
  }
}
