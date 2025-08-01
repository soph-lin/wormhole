const REDIRECT_DELAY = 5;

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  
  // Check if user has set a custom URL
  chrome.storage.sync.get(['newTabUrl'], function(result) {
    if (result.newTabUrl) {
      // Redirect immediately to custom URL
      setTimeout(() => {
        window.location.href = result.newTabUrl;
      }, REDIRECT_DELAY);
    } else {
      // No custom URL, dynamically load config interface
      loadingScreen.style.display = 'none';
      loadConfigInterface();
    }
  });
  
  function loadConfigInterface() {
    // Create the config interface dynamically
    const body = document.body;
    body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
      <div class="logo">🕳️ Wormhole</div>
      <div class="message">Welcome to Wormhole!</div>
      <div class="redirect-info">No custom URL set. Configure below or click the Wormhole extension icon.</div>
      
      <div class="config-section">
        <div class="config-title">Configure Custom URL</div>
        <div class="form-group">
          <input type="url" id="newTabUrl" placeholder="https://example.com" />
          <button id="saveBtn">Save</button>
        </div>
        <div class="status" id="status"></div>
      </div>
    `;
    
    body.appendChild(container);
    
    // Add event listeners
    const urlInput = document.getElementById('newTabUrl');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
    
    saveBtn.addEventListener('click', function() {
      const url = urlInput.value.trim();
      
      if (!url) {
        showStatus('Please enter a valid URL', 'error');
        return;
      }

      try {
        new URL(url);
      } catch (e) {
        showStatus('Please enter a valid URL (include http:// or https://)', 'error');
        return;
      }

      chrome.storage.sync.set({ newTabUrl: url }, function() {
        showStatus('Settings saved! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.href = url;
        }, REDIRECT_DELAY);
      });
    });

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
  }
}); 