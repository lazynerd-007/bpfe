// Test script to verify bearer token parsing improvements
// Run this in the browser console after logging in

console.log('=== Bearer Token Parsing Test ===');

// Check localStorage for tokens
const authToken = localStorage.getItem('auth-token');
const currentUser = localStorage.getItem('current-user');
const partnerBank = localStorage.getItem('partner-bank');

console.log('\n1. LocalStorage Check:');
console.log('Auth Token exists:', !!authToken);
if (authToken) {
  console.log('Token type:', typeof authToken);
  console.log('Token length:', authToken.length);
  console.log('Token preview:', authToken.substring(0, 20) + '...');
  console.log('Token starts with Bearer:', authToken.startsWith('Bearer '));
}
console.log('Current User exists:', !!currentUser);
console.log('Partner Bank:', partnerBank || 'none');

// Check NextAuth session
console.log('\n2. NextAuth Session Check:');
fetch('/api/auth/session')
  .then(response => response.json())
  .then(session => {
    console.log('Session exists:', !!session);
    console.log('Session has accessToken:', !!session?.accessToken);
    if (session?.accessToken) {
      console.log('Session token type:', typeof session.accessToken);
      console.log('Session token length:', session.accessToken.length);
      console.log('Session token preview:', session.accessToken.substring(0, 20) + '...');
      console.log('Session token starts with Bearer:', session.accessToken.startsWith('Bearer '));
    }
    console.log('Session user:', session?.user?.email || 'none');
    console.log('Session partnerBank:', session?.partnerBank || 'none');
  })
  .catch(error => {
    console.error('Failed to fetch session:', error);
  });

// Test API request with current token
console.log('\n3. API Request Test:');
if (authToken) {
  const apiUrl = 'http://localhost:3001/api/auth/me';
  const bearerToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  
  console.log('Testing API request to:', apiUrl);
  console.log('Using bearer token:', bearerToken.substring(0, 27) + '...');
  
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': bearerToken,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);
    return response.text();
  })
  .then(text => {
    console.log('API Response Body:', text);
    if (text.includes('Forbidden') || text.includes('Unauthorized')) {
      console.error('❌ Token validation failed - check token format');
    } else {
      console.log('✅ Token validation successful');
    }
  })
  .catch(error => {
    console.error('API Request Error:', error);
  });
} else {
  console.warn('No token available for API test');
}

// Test transactions endpoint
console.log('\n4. Transactions API Test:');
if (authToken) {
  const transactionsUrl = 'http://localhost:3001/api/transactions?page=1&limit=5';
  const bearerToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  
  console.log('Testing transactions API:', transactionsUrl);
  
  fetch(transactionsUrl, {
    method: 'GET',
    headers: {
      'Authorization': bearerToken,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Transactions API Status:', response.status);
    console.log('Transactions API OK:', response.ok);
    return response.text();
  })
  .then(text => {
    console.log('Transactions API Response:', text.substring(0, 200) + '...');
    if (text.includes('Forbidden') || text.includes('Unauthorized')) {
      console.error('❌ Transactions API failed - check token or permissions');
    } else if (text.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
      console.error('❌ HTTP/2 Protocol Error - network issue');
    } else {
      console.log('✅ Transactions API successful');
    }
  })
  .catch(error => {
    console.error('Transactions API Error:', error);
  });
}

console.log('\n=== Test Complete ===');
console.log('Check the logs above for any token parsing issues.');
console.log('Look for enhanced logging from [API Client], [Auth Provider], and [NextAuth] in the console.');