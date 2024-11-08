let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function showTab(tab) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));
  document.getElementById(tab).classList.add('active');

  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
}

function startScan() {
  document.getElementById('qr-scanner').innerHTML = '<p>QR scanner initialized...</p>';
  // Add your QR Scanner logic here. Use a library like `jsQR` to handle QR scanning.
}

function handleStaffSignup(event) {
  event.preventDefault();

  const staffName = document.getElementById('staff-name').value;
  const staffPassword = document.getElementById('staff-password').value;

  const staffId = `staff_${Date.now()}`;
  if (Object.values(users).some(user => user.name === staffName)) {
    displayError('A staff member with this name already exists.');
    return;
  }

  const newUser = {
    id: staffId,
    name: staffName,
    type: 'staff',
    password: staffPassword,
    loginHistory: [new Date().toISOString()]
  };

  users[staffId] = newUser;
  localStorage.setItem('users', JSON.stringify(users));
  currentUser = newUser;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function handleLogin(event) {
  event.preventDefault();

  const loginId = document.getElementById('login-id').value;
  const loginPassword = document.getElementById('login-password').value;

  const user = Object.values(users).find(u =>
    (u.type === 'staff' && u.name === loginId && u.password === loginPassword) ||
    (u.type === 'student' && u.id === loginId)
  );

  if (user) {
    user.loginHistory.push(new Date().toISOString());
    users[user.id] = user;
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    displayError('Invalid credentials');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  window.location.reload();
}

function displayError(message) {
  document.getElementById('error-message').textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    showTab('login');
  } else {
    showTab('signup');
  }
});
