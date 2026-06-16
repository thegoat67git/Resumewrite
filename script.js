var displayState = {};

// Global auth helper for consistent checks across pages
window.isLoggedIn = function() {
  return localStorage.getItem('resumewrite_loggedIn') === 'true';
};

// Render auth status in nav: "Hello, <name>" and Logout link
window.renderAuthStatus = function() {
  try {
    var navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    var existing = navMenu.querySelector('.auth-status');
    if (existing) existing.remove();

    var li = document.createElement('li');
    li.className = 'auth-status';

    if (window.isLoggedIn()) {
      var username = localStorage.getItem('resumewrite_username') || 'User';
      li.innerHTML = `<span style="color: #fff; margin-right:8px;">Hello, ${username}</span> <a href="#" id="logoutBtn" style="color:#ff6b6b; font-weight:600;">Logout</a>`;
      navMenu.appendChild(li);

      // hide any visible login links
      var loginLink = navMenu.querySelector('a[href="login.html"]');
      if (loginLink) {
        var p = loginLink.closest('li'); if (p) p.style.display = 'none';
      }

      var btn = document.getElementById('logoutBtn');
      if (btn) btn.addEventListener('click', function(e){ e.preventDefault(); logout(); });
    } else {
      // show login link if present
      var loginLi = navMenu.querySelector('a[href="login.html"]');
      if (loginLi) { var p = loginLi.closest('li'); if (p) p.style.display = ''; }
    }
  } catch (err) {
    console.error('renderAuthStatus error', err);
  }
};

// Ensure nav auth is rendered on DOM load
window.addEventListener('DOMContentLoaded', function(){ window.renderAuthStatus(); });

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
  console.log('handleRegister called');
  if (event) event.preventDefault();
  console.log('Event prevented');
  
  var newUsername = document.getElementById('newUsername').value.trim();
  var newPassword = document.getElementById('newPassword').value.trim();
  var confirmPassword = document.getElementById('confirmPassword').value.trim();
  
  console.log('Form values:', { newUsername, newPassword, confirmPassword });
  
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
  
  console.log('Validation result:', isValid);
  
  if (!isValid) {
    console.log('Validation failed');
    return;
  }
  
  // Check if username already exists in localStorage
  var users = JSON.parse(localStorage.getItem('resumewrite_users') || '{}');
  
  if (users[newUsername]) {
    document.getElementById('usernameTakenError').style.display = 'block';
    console.log('Username already taken');
    return;
  }
  
  // Store new user account
  users[newUsername] = {
    password: newPassword,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('resumewrite_users', JSON.stringify(users));
  console.log('User registered successfully');
  
  // Show success message and redirect
  document.getElementById('successMessage').style.display = 'block';
  setTimeout(function() {
    console.log('Redirecting to login');
    window.location.href = 'login.html';
  }, 2000);
}