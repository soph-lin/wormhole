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
      <img src="assets/wormhole.svg" alt="logo" style="width: 100px; height: 100px;"/>
      <div class="message">Welcome to Wormhole!</div>
      <div class="redirect-info">No custom URL set. Configure below or click the Wormhole extension icon.</div>

      <div class="config-section">
        <div class="form-group">
          <div class="input-container">
            <input type="url" id="newTabUrl" placeholder="https://example.com" />
            <button id="saveBtn" class="wormhole-btn">
              <img src="assets/wormhole.svg" alt="Wormhole" />
            </button>
          </div>
        </div>
        <div class="status-container">
          <div class="status-message" id="status"></div>
        </div>
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
        setTimeout(() => {
          status.classList.remove('show');
        }, 3000);
        return;
      }

      try {
        new URL(url);
      } catch (e) {
        showStatus('Please enter a valid URL (include http:// or https://)', 'error');
        setTimeout(() => {
          status.classList.remove('show');
        }, 3000);
        return;
      }

      // Start loading animation
      saveBtn.classList.add('loading');
      saveBtn.disabled = true;

      chrome.storage.sync.set({ newTabUrl: url }, function() {
        showStatus('New tab configured! Redirecting...', 'success');
        
        // The success message will fade out when redirecting
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
      status.className = `status-message ${type}`;
      status.classList.add('show');
    }
  }
}); 