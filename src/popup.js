document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('newTabUrl');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Load current URL when popup opens
  chrome.storage.sync.get(['newTabUrl'], function(result) {
    if (result.newTabUrl) {
      urlInput.value = result.newTabUrl;
    }
  });

  // Save button click handler
  saveBtn.addEventListener('click', function() {
    const url = urlInput.value.trim();
    
    if (!url) {
      showStatus('Please enter a valid URL', 'error');
      setTimeout(() => {
        status.classList.remove('show');
      }, 3000);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      showStatus('Please enter a valid URL', 'error');
      setTimeout(() => {
        status.classList.remove('show');
      }, 3000);
      return;
    }

    // Start loading animation
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;

    // Save to Chrome storage
    chrome.storage.sync.set({ newTabUrl: url }, function() {
      showStatus('New tab updated successfully!', 'success');
      
      // Stop loading animation after a short delay
      setTimeout(() => {
        saveBtn.classList.remove('loading');
        saveBtn.disabled = false;
      }, 1000);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        status.classList.remove('show');
      }, 3000);
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
    status.className = `status-message ${type}`;
    status.classList.add('show');
  }
}); 