// Add a normal browser link for the Google redirect.
(function addGoogleLoginLink() {
  const info = document.querySelector('.swagger-ui .information-container');

  if (!info) {
    setTimeout(addGoogleLoginLink, 200);
    return;
  }

  const link = document.createElement('a');
  link.href = '/auth/google';
  link.textContent = 'Login with Google';
  link.style.display = 'inline-block';
  link.style.margin = '12px 0';
  link.style.padding = '10px 16px';
  link.style.backgroundColor = '#4f46e5';
  link.style.color = 'white';
  link.style.borderRadius = '4px';
  link.style.textDecoration = 'none';
  link.style.fontWeight = 'bold';

  info.appendChild(link);
})();
