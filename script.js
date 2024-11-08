// Mock user storage (localStorage)
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Utility functions to save users and currentUser to localStorage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Error message display
function showError(message) {
  document.getElementById('error-msg').textContent = message;
}

// Start student signup by QR scan
function startStudentSignup() {
  QrScanner.scanImage({ facingMode: 'environment' })
    .then(result => {
      if (users[result]) {
        showError('User with this ID already exists.');
        return;
      }
      const newUser = {
        id: result,
        name: `Student ${result}`,
        type: 'student',
        loginHistory: [new Date().toISOString()],
        usageCount: 0
      };
      users[result] = newUser;
      currentUser = newUser;
      saveUsers();
      saveCurrentUser();
      showStudentHome();
    })
    .catch(() => showError('Failed to scan QR code.'));
}

// Staff signup handler
function handleStaffSignup(event) {
  event.preventDefault();
  const name = document.getElementById('staffName').value;
  const password = document.getElementById('staffPassword').value;
  if (Object.values(users).some(user => user.name === name)) {
    showError('Staff with this name already exists.');
    return;
  }
  const newUser = {
    id: `staff_${Date.now()}`,
    name,
    type: 'staff',
    password,
    loginHistory: [new Date().toISOString()]
  };
  users[newUser.id] = newUser;
  currentUser = newUser;
  saveUsers();
  saveCurrentUser();
  showStaffHome();
}

// Login handler
function handleLogin(event) {
  event.preventDefault();
  const id = document.getElementById('loginId').value;
  const password = document.getElementById('loginPassword').value;
  const user = Object.values(users).find(u =>
    (u.type === 'staff' && u.name === id && u.password === password) ||
    (u.type === 'student' && u.id === id)
  );
  if (user) {
    currentUser = user;
    saveCurrentUser();
    user.type === 'student' ? showStudentHome() : showStaffHome();
  } else {
    showError('Invalid credentials.');
  }
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  location.reload();
}

// Show student home
function showStudentHome() {
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('student-home').classList.remove('hidden');
  document.getElementById('student-name').textContent = currentUser.name;
  document.getElementById('usage-count').textContent = currentUser.usageCount;
}

// Show staff home
function showStaffHome() {
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('staff-home').classList.remove('hidden');
  document.getElementById('staff-name-display').textContent = currentUser.name;
}

// Initialize the page
if (currentUser) {
  currentUser.type === 'student' ? showStudentHome() : showStaffHome();
}
