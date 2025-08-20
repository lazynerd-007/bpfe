// Debug script to check authentication token handling

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  console.log('=== Authentication Debug Info ===');
  
  // Check localStorage for auth tokens
  const authToken = localStorage.getItem('auth-token');
  const currentUser = localStorage.getItem('current-user');
  const partnerBank = localStorage.getItem('partner-bank');
  
  console.log('Auth Token from localStorage:', authToken);
  console.log('Current User from localStorage:', currentUser);
  console.log('Partner Bank from localStorage:', partnerBank);
  
  // Check NextAuth session
  if (typeof window.next !== 'undefined') {
    console.log('NextAuth session available');
  }
  
  // Check if API client has token set
  console.log('Current API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
  
  // Make a test request to see headers
  fetch('/api/auth/session')
    .then(response => response.json())
    .then(session => {
      console.log('NextAuth Session:', session);
      
      if (session?.accessToken) {
        console.log('Session has access token:', session.accessToken.substring(0, 20) + '...');
        
        // Test API request with token
        const testApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') + '/auth/me';
        console.log('Testing API request to:', testApiUrl);
        
        fetch(testApiUrl, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('API Response Status:', response.status);
          console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
          return response.text();
        })
        .then(text => {
          console.log('API Response Body:', text);
        })
        .catch(error => {
          console.error('API Request Error:', error);
        });
      } else {
        console.log('No access token in session');
      }
    })
    .catch(error => {
      console.error('Session fetch error:', error);
    });
}

// Export for use in browser console
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debugAuth: true };
}