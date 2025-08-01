document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('newTabUrl');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const currentUrl = document.getElementById('currentUrl');
  const currentUrlText = document.getElementById('currentUrlText');

  // Load current URL when popup opens
  chrome.storage.sync.get(['newTabUrl'], function(result) {
    if (result.newTabUrl) {
      urlInput.value = result.newTabUrl;
      currentUrl.style.display = 'block';
      currentUrlText.textContent = result.newTabUrl;
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
      showStatus('Settings saved successfully!', 'success');
      currentUrl.style.display = 'block';
      currentUrlText.textContent = url;
      
      // Clear status after 3 seconds
      setTimeout(() => {
        status.style.display = 'none';
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
    status.className = `status ${type}`;
    status.style.display = 'block';
  }
}); 