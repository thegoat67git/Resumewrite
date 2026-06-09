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
  
  // Simple authentication (in a real app, this would call a backend API)
  // For demo purposes, we accept any non-empty username and password
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