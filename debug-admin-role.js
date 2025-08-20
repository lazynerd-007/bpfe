// Debug script to check admin role issues
// Run this in browser console while logged in as admin

(async function debugAdminRole() {
  console.log('=== Admin Role Debug ===');
  
  try {
    // Check NextAuth session
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    
    console.log('Current session:', session);
    console.log('User role from session:', session?.user?.role);
    console.log('Role type:', typeof session?.user?.role);
    
    // Check against expected values
    const expectedRoles = ['administrator', 'admin', 'ADMIN'];
    const actualRole = session?.user?.role;
    
    console.log('Role comparison:');
    expectedRoles.forEach(role => {
      console.log(`  '${actualRole}' === '${role}': ${actualRole === role}`);
      console.log(`  '${actualRole}' === '${role}' (case-insensitive): ${actualRole?.toLowerCase() === role.toLowerCase()}`);
    });
    
    // Check localStorage
    console.log('=== LocalStorage Check ===');
    const storedUser = localStorage.getItem('current-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('Stored user role:', userData?.role);
    }
    
    // Test middleware logic
    console.log('=== Middleware Logic Test ===');
    const pathname = '/merchants';
    const userRole = session?.user?.role;
    
    console.log('Testing /merchants access:');
    console.log('User role:', userRole);
    console.log('Expected roles: ["administrator", "partner-bank"]');
    console.log('Has access:', ['administrator', 'partner-bank'].includes(userRole));
    
    // Check if there's a redirect happening
    console.log('=== Current Page Check ===');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
  } catch (error) {
    console.error('Debug error:', error);
  }
})();