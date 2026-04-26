import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://qkpbmobfwwcygzjxehik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcGJtb2Jmd3djeWd6anhlaGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjA4MzAsImV4cCI6MjA5Mjc5NjgzMH0.C0mPGmPiO24SvrsIAMs27qTR8X5VxfOuk9cbHQ2PIkk'
)

const loginScreen = document.getElementById('loginScreen')
const app = document.getElementById('app')

document.getElementById('signupBtn').onclick = async () => {
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  const { error } = await supabase.auth.signUp({ email, password })
  alert(error ? error.message : 'Account created. Now tap Login.')
}

document.getElementById('loginBtn').onclick = async () => {
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    alert(error.message)
    return
  }

  loginScreen.style.display = 'none'
  app.classList.remove('hidden')
  app.style.display = 'block'

  app.innerHTML = `
    <div style="padding:20px">
      <h1>Cash Out Gold & Silver Register</h1>

      <label>Date</label><br>
      <input id="date" type="date"><br><br>

      <label>Employee</label><br>
      <input id="employee" placeholder="Employee name"><br><br>

      <label>Starting Cash</label><br>
      <input id="startingCash" type="number" placeholder="0.00"><br><br>

      <label>Total Cash Out</label><br>
      <input id="totalCashOut" type="number" placeholder="0.00"><br><br>

      <h2>Balance: <span id="balance">$0.00</span></h2>

      <hr>

      <h2>Gold</h2>
      <textarea id="goldNotes" style="width:100%;height:160px" placeholder="Enter gold transactions here"></textarea>

      <h2>Silver</h2>
      <textarea id="silverNotes" style="width:100%;height:120px" placeholder="Enter silver transactions here"></textarea>

      <br><br>
      <button id="saveBtn">Save to Cloud</button>
      <button id="logoutBtn">Logout</button>
    </div>
  `

  const today = new Date().toISOString().slice(0, 10)
  document.getElementById('date').value = today

  function calcBalance() {
    const start = Number(document.getElementById('startingCash').value) || 0
    const out = Number(document.getElementById('totalCashOut').value) || 0
    document.getElementById('balance').innerText = '$' + (start - out).toFixed(2)
  }

  document.getElementById('startingCash').oninput = calcBalance
  document.getElementById('totalCashOut').oninput = calcBalance

  document.getElementById('saveBtn').onclick = async () => {
    const payload = {
      register_date: document.getElementById('date').value,
      employee: document.getElementById('employee').value,
      starting_cash: Number(document.getElementById('startingCash').value) || 0,
      total_cash_out: Number(document.getElementById('totalCashOut').value) || 0,
      gold_rows: [{ notes: document.getElementById('goldNotes').value }],
      silver_rows: [{ notes: document.getElementById('silverNotes').value }],
      updated_by: email
    }

    const { error } = await supabase
      .from('daily_registers')
      .upsert(payload, { onConflict: 'register_date' })

    alert(error ? error.message : 'Saved to cloud ✅')
  }

  document.getElementById('logoutBtn').onclick = async () => {
    await supabase.auth.signOut()
    location.reload()
  }
}
