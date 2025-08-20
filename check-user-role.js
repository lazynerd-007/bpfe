// Debug script to check current user role and authentication state
// Run this in the browser console

console.log('=== Current User Role Check ===');

// Check localStorage for current user data
const authToken = localStorage.getItem('auth-token');
const currentUserStr = localStorage.getItem('current-user');

console.log('\n1. LocalStorage Data:');
console.log('Auth Token exists:', !!authToken);
if (authToken) {
  console.log('Token preview:', authToken.substring(0, 30) + '...');
}

if (currentUserStr) {
  try {
    const currentUser = JSON.parse(currentUserStr);
    console.log('Current User:', {
      email: currentUser.email,
      role: currentUser.role,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      merchantId: currentUser.merchantId,
      partnerBankId: currentUser.partnerBankId
    });
  } catch (e) {
    console.log('Current User (raw):', currentUserStr);
  }
} else {
  console.log('No current user found in localStorage');
}

// Check NextAuth session
console.log('\n2. NextAuth Session:');
fetch('/api/auth/session')
  .then(response => response.json())
  .then(session => {
    console.log('Session exists:', !!session);
    if (session && session.user) {
      console.log('Session User:', {
        email: session.user.email,
        role: session.user.role,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        merchantId: session.user.merchantId,
        partnerBankId: session.user.partnerBankId
      });
    }
    if (session && session.accessToken) {
      console.log('Access Token exists:', !!session.accessToken);
      console.log('Token preview:', session.accessToken.substring(0, 30) + '...');
    }
  })
  .catch(error => {
    console.error('Failed to fetch session:', error);
  });

// Test analytics API call
console.log('\n3. Testing Analytics API:');
const testAnalyticsAPI = async () => {
  try {
    const apiUrl = 'http://localhost:3001/api/transactions/analytics';
    const token = authToken || (await fetch('/api/auth/session').then(r => r.json()).then(s => s.accessToken));
    
    if (!token) {
      console.log('❌ No token available for API test');
      return;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Analytics API Response Status:', response.status);
    
    if (response.status === 403) {
      console.log('❌ 403 Forbidden - User does not have permission to access analytics');
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else if (response.ok) {
      console.log('✅ Analytics API call successful');
      const data = await response.json();
      console.log('Analytics data received:', !!data);
    } else {
      console.log('❌ API call failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Analytics API test failed:', error);
  }
};

setTimeout(testAnalyticsAPI, 1000); // Run after session check

console.log('\n=== End User Role Check ===');