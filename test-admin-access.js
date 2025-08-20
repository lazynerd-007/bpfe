// Test script to debug admin access issues
// Run this in browser console while logged in as admin

(async function testAdminAccess() {
  console.log('=== Admin Access Debug ===');
  
  // 1. Check NextAuth session role
  const sessionResponse = await fetch('/api/auth/session');
  const session = await sessionResponse.json();
  
  console.log('1. NextAuth Session:');
  console.log('   Role:', session?.user?.role);
  console.log('   Role type:', typeof session?.user?.role);
  console.log('   Expected:', 'administrator');
  
  // 2. Check middleware role check
  const pathname = '/merchants';
  const userRole = session?.user?.role;
  const allowedRoles = ['administrator', 'partner-bank'];
  
  console.log('2. Middleware Check:');
  console.log('   Path:', pathname);
  console.log('   User role:', userRole);
  console.log('   Allowed roles:', allowedRoles);
  console.log('   Has access:', allowedRoles.includes(userRole));
  
  // 3. Check if middleware early return is working
  console.log('3. Early Return Check:');
  console.log('   Role === "administrator":', userRole === 'administrator');
  console.log('   Should bypass all checks:', userRole === 'administrator');
  
  // 4. Test actual navigation
  console.log('4. Navigation Test:');
  console.log('   Current URL:', window.location.href);
  console.log('   Attempting to navigate to /merchants...');
  
  // 5. Check localStorage for role
  const storedUser = localStorage.getItem('current-user');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    console.log('5. Stored user role:', userData?.role);
  }
  
  // 6. Force check by making direct request
  try {
    const merchantsResponse = await fetch('/merchants');
    console.log('6. Direct /merchants response:', merchantsResponse.status);
    if (merchantsResponse.status === 403) {
      console.log('   403 Forbidden - Role issue confirmed');
    } else if (merchantsResponse.status === 200) {
      console.log('   200 OK - Access granted');
    }
  } catch (error) {
    console.error('   Error accessing /merchants:', error);
  }
})();