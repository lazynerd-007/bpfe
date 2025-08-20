// Debug script to check current user's role and permissions
// Run this in browser console to diagnose 403 issues

(function debugUserRole() {
  console.log('=== User Role Debug ===');
  
  // Check NextAuth session
  fetch('/api/auth/session')
    .then(res => res.json())
    .then(session => {
      console.log('NextAuth Session:', session);
      if (session?.user?.role) {
        console.log('User Role:', session.user.role);
        
        // Check if role has access to merchants
        const allowedRoles = ['administrator', 'partner-bank'];
        const hasAccess = allowedRoles.includes(session.user.role);
        
        console.log('Has access to /merchants:', hasAccess);
        console.log('Expected roles for /merchants:', allowedRoles);
        
        if (!hasAccess) {
          console.warn(`User with role '${session.user.role}' cannot access /merchants`);
          console.log('Redirected to: /unauthorized');
        }
      } else {
        console.error('No user role found in session');
      }
    })
    .catch(err => console.error('Error fetching session:', err));

  // Check localStorage
  console.log('=== LocalStorage Check ===');
  console.log('auth-token:', localStorage.getItem('auth-token'));
  console.log('current-user:', JSON.parse(localStorage.getItem('current-user') || '{}'));
  console.log('partner-bank:', localStorage.getItem('partner-bank'));

  // Check API client token
  if (window.apiClient) {
    console.log('=== API Client ===');
    console.log('API Client token set:', !!window.apiClient.token);
    console.log('Token preview:', window.apiClient.token?.substring(0, 20) + '...');
  }
})();

// Quick role reference
console.log('=== Role Access Matrix ===');
console.log('ADMIN (administrator): Can access /merchants, /admin, /users, /partner-banks');
console.log('PARTNER_BANK: Can access /merchants, /partner');
console.log('MERCHANT: Can access /merchant');
console.log('SUB_MERCHANT: Can access /merchant');