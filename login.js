const container = document.getElementById('auth-container');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

if (showRegisterBtn && showLoginBtn && container) {
  showRegisterBtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  showLoginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
}

// Register Handle
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    const userData = { username, email, address, password };
    localStorage.setItem('kirana_user', JSON.stringify(userData));
    
    alert('Registration Successful! Please login now.');
    container.classList.remove('active');
    registerForm.reset();
  });
}

// Login Handle
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('login-username').value.trim();
    const inputPass = document.getElementById('login-password').value.trim();

    const savedUser = JSON.parse(localStorage.getItem('kirana_user'));

    if (savedUser && savedUser.username === inputUser && savedUser.password === inputPass) {
      alert('Login Successful! Welcome back, ' + savedUser.username);
      window.location.href = 'index.html';
    } else {
      alert('Invalid Username or Password!');
    }
  });
}