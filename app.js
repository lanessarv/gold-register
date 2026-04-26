import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://qkpbmobfwwcygzjxehik.supabase.co',
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcGJtb2Jmd3djeWd6anhlaGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjA4MzAsImV4cCI6MjA5Mjc5NjgzMH0.C0mPGmPiO24SvrsIAMs27qTR8X5VxfOuk9cbHQ2PIkk
)

const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')

loginBtn.onclick = async () => {
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
  } else {
    location.reload()
  }
}

signupBtn.onclick = async () => {
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  const { error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    alert(error.message)
  } else {
    alert("Account created. Now login.")
  }
}
