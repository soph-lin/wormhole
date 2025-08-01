document.addEventListener('DOMContentLoaded', function() {
  const redirectInfo = document.getElementById('redirectInfo');
  
  // Check if user has set a custom URL
  chrome.storage.sync.get(['newTabUrl'], function(result) {
    if (result.newTabUrl) {
      // Redirect to custom URL if set
      redirectInfo.textContent = `Redirecting to: ${result.newTabUrl}`;
      
      // Small delay for loading animation
      setTimeout(() => {
        window.location.href = result.newTabUrl;
      }, 1500);
    } else {
      // No custom URL, show default message
      redirectInfo.textContent = 'No custom URL set. Click the Wormhole extension icon to configure.';
      
      // Remove loading animation after 3 seconds
      setTimeout(() => {
        const loading = document.querySelector('.loading');
        if (loading) {
          loading.style.display = 'none';
        }
        document.querySelector('.message').textContent = 'Welcome to Wormhole!';
      }, 3000);
    }
  });
}); 