var displayState = {};

function hideShow(elementId) {
  var element = document.getElementById(elementId);
  if (!displayState[elementId]) {
    displayState[elementId] = false;
  }
  if (displayState[elementId]) {
    element.style.display = 'block';
    displayState[elementId] = false;
  } else {
    element.style.display = 'none';
    displayState[elementId] = true;
  }
}

// Login functionality
function handleLogin(event) {
  event.preventDefault();
  
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var rememberMe = document.getElementById('rememberMe').checked;
  
  // Reset errors
  document.getElementById('usernameError').style.display = 'none';
  document.getElementById('passwordError').style.display = 'none';
  
  var isValid = true;
  
  // Validation
  if (!username) {
    document.getElementById('usernameError').style.display = 'block';
    isValid = false;
  }
  
  if (!password) {
    document.getElementById('passwordError').style.display = 'block';
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Check credentials against registered users
  var users = JSON.parse(localStorage.getItem('resumewrite_users') || '{}');
  var user = users[username];
  
  if (!user) {
    document.getElementById('usernameError').style.display = 'block';
    document.getElementById('usernameError').textContent = 'Username not found';
    return;
  }
  
  if (user.password !== password) {
    document.getElementById('passwordError').style.display = 'block';
    document.getElementById('passwordError').textContent = 'Incorrect password';
    return;
  }
  
  // Successfully authenticated
  if (username && password) {
    // Store login info in localStorage
    localStorage.setItem('resumewrite_username', username);
    localStorage.setItem('resumewrite_loggedIn', 'true');
    
    if (rememberMe) {
      localStorage.setItem('resumewrite_remember', 'true');
    } else {
      localStorage.removeItem('resumewrite_remember');
    }
    
    // Redirect to Resume Writer page
    alert('Login successful! Welcome, ' + username);
    window.location.href = 'Resumewriter.html';
  }
}

// Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', function() {
  var isLoggedIn = localStorage.getItem('resumewrite_loggedIn');
  var loginForm = document.getElementById('loginForm');
  
  if (isLoggedIn === 'true' && loginForm) {
    // Auto-fill if "Remember me" was checked
    var username = localStorage.getItem('resumewrite_username');
    if (username) {
      document.getElementById('username').value = username;
      document.getElementById('rememberMe').checked = localStorage.getItem('resumewrite_remember') === 'true';
    }
  }
});

// Logout function (can be used on other pages)
function logout() {
  localStorage.removeItem('resumewrite_loggedIn');
  localStorage.removeItem('resumewrite_username');
  localStorage.removeItem('resumewrite_remember');
  window.location.href = 'index.html';
}

// Registration functionality
function handleRegister(event) {
  event.preventDefault();
  
  var newUsername = document.getElementById('newUsername').value.trim();
  var newPassword = document.getElementById('newPassword').value.trim();
  var confirmPassword = document.getElementById('confirmPassword').value.trim();
  
  // Reset errors
  document.getElementById('usernameError').style.display = 'none';
  document.getElementById('usernameTakenError').style.display = 'none';
  document.getElementById('passwordError').style.display = 'none';
  document.getElementById('passwordWeakError').style.display = 'none';
  document.getElementById('confirmError').style.display = 'none';
  document.getElementById('successMessage').style.display = 'none';
  
  var isValid = true;
  
  // Validation
  if (!newUsername) {
    document.getElementById('usernameError').style.display = 'block';
    isValid = false;
  }
  
  if (!newPassword) {
    document.getElementById('passwordError').style.display = 'block';
    isValid = false;
  }
  
  if (newPassword.length < 6) {
    document.getElementById('passwordWeakError').style.display = 'block';
    isValid = false;
  }
  
  if (newPassword !== confirmPassword) {
    document.getElementById('confirmError').style.display = 'block';
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Check if username already exists in localStorage
  var users = JSON.parse(localStorage.getItem('resumewrite_users') || '{}');
  
  if (users[newUsername]) {
    document.getElementById('usernameTakenError').style.display = 'block';
    return;
  }
  
  // Store new user account
  users[newUsername] = {
    password: newPassword,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('resumewrite_users', JSON.stringify(users));
  
  // Show success message and redirect
  document.getElementById('successMessage').style.display = 'block';
  setTimeout(function() {
    window.location.href = 'login.html';
  }, 2000);
}