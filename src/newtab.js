const REDIRECT_DELAY = 5;

document.addEventListener('DOMContentLoaded', function() {
  const redirectInfo = document.getElementById('redirectInfo');
  const configSection = document.getElementById('configSection');
  const urlInput = document.getElementById('newTabUrl');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  
  // Check if user has set a custom URL
  chrome.storage.sync.get(['newTabUrl'], function(result) {
    if (result.newTabUrl) {
      // Redirect to custom URL if set
      redirectInfo.textContent = `Redirecting to: ${result.newTabUrl}`;
      
      // Minimal delay for user to see the redirect message
      setTimeout(() => {
        window.location.href = result.newTabUrl;
      }, REDIRECT_DELAY);
    } else {
      // No custom URL, show configuration option
      redirectInfo.textContent = 'No custom URL set. Configure below or click the Wormhole extension icon.';
      
      // Quick transition to show config
      setTimeout(() => {
        const loading = document.querySelector('.loading');
        if (loading) {
          loading.style.display = 'none';
        }
        document.querySelector('.message').textContent = 'Welcome to Wormhole!';
        configSection.style.display = 'block';
      }, 800);
    }
  });
  
  // Save button click handler
  saveBtn.addEventListener('click', function() {
    const url = urlInput.value.trim();
    
    if (!url) {
      showStatus('Please enter a valid URL', 'error');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      showStatus('Please enter a valid URL (include http:// or https://)', 'error');
      return;
    }

    // Save to Chrome storage
    chrome.storage.sync.set({ newTabUrl: url }, function() {
      showStatus('Settings saved! Redirecting...', 'success');
      
      // Quick redirect after saving
      setTimeout(() => {
        window.location.href = url;
      }, REDIRECT_DELAY);
    });
  });

  // Enter key handler
  urlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
  }
}); 