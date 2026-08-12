// Tab Switching Logic
function switchTab(tab) {
  const loginSec = document.getElementById('login-section');
  const regSec = document.getElementById('register-section');
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-reg-btn');

  if (tab === 'login') {
    loginSec.style.display = 'block';
    regSec.style.display = 'none';
    loginBtn.classList.add('active-tab');
    regBtn.classList.remove('active-tab');
  } else {
    loginSec.style.display = 'none';
    regSec.style.display = 'block';
    regBtn.classList.add('active-tab');
    loginBtn.classList.remove('active-tab');
  }
}

// Handle Registration & Address Save
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const address = document.getElementById('reg-address').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  const userData = { username, email, address, password };
  localStorage.setItem('kirana_user', JSON.stringify(userData));

  alert('Registration Successful! Your address has been saved. Please Login now.');
  document.getElementById('register-form').reset();
  switchTab('login');
});

// Handle Login & Redirect/Auto-fill
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const inputUser = document.getElementById('login-username').value.trim();
  const inputPass = document.getElementById('login-password').value.trim();

  const savedUser = JSON.parse(localStorage.getItem('kirana_user'));

  if (savedUser && savedUser.username === inputUser && savedUser.password === inputPass) {
    alert('Login Successful! Welcome, ' + savedUser.username);
    // ????? ??????? ?? ???? ?????
    window.location.href = 'index.html';
  } else {
    alert('Invalid Username or Password! Please register if you don’t have an account.');
  }
});