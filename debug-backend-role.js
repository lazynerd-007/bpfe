// Run this in browser console to debug backend role response
console.log('=== Backend Role Debug ===');

// Debug login response and backend role
async function debugBackendRole() {
    try {
        // Check current auth state
        console.log('=== Current Auth State ===');
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();
        console.log('Current session:', session);
        
        // If not logged in, try to login and see role
        if (!session?.user) {
            console.log('No active session found');
            return;
        }
        
        // Check the role from session
        const currentRole = session.user?.role;
        console.log('Role from session:', currentRole);
        console.log('Expected role:', 'administrator');
        console.log('Role match:', currentRole === 'administrator');
        
        // Check if role is in correct case
        console.log('Role lowercase:', String(currentRole).toLowerCase());
        console.log('Expected lowercase:', 'administrator');
        console.log('Lowercase match:', String(currentRole).toLowerCase() === 'administrator');
        
        // Check if there are any spaces or extra characters
        console.log('Role trimmed:', String(currentRole).trim());
        console.log('Role length:', String(currentRole).length);
        console.log('Expected length:', 'administrator'.length);
        
        // Try to access merchants page directly
        console.log('=== Testing Merchants Access ===');
        const merchantsPageResponse = await fetch('/merchants');
        console.log('Merchants page status:', merchantsPageResponse.status);
        console.log('Merchants page redirected:', merchantsPageResponse.redirected);
        
        // Try to access merchants API directly
        const merchantsApiResponse = await fetch('/api/merchants');
        console.log('Merchants API status:', merchantsApiResponse.status);
        
        // Check if middleware is working
        console.log('=== Middleware Check ===');
        console.log('Current pathname:', window.location.pathname);
        console.log('User role from session:', session.user?.role);
        console.log('Should have access:', session.user?.role === 'administrator' || session.user?.role === 'partner-bank');
        
        // Check local storage for any cached data
        console.log('=== Local Storage Check ===');
        const cachedUser = localStorage.getItem('user-data');
        if (cachedUser) {
            const userData = JSON.parse(cachedUser);
            console.log('Cached user role:', userData.role);
        }
        
        // Check auth token payload
        if (session.accessToken) {
            try {
                const payload = JSON.parse(atob(session.accessToken.split('.')[1]));
                console.log('Token payload role:', payload.user?.role);
            } catch (e) {
                console.log('Could not decode token:', e);
            }
        }
        
    } catch (error) {
        console.error('Debug error:', error);
    }
}

debugBackendRole();