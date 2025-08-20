// Run this in browser console to debug role issues
console.log('=== Detailed Role Debug ===');

// Check NextAuth session
async function debugRole() {
    try {
        // Get NextAuth session
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        console.log('NextAuth Session:', session);
        
        // Check user role from session
        const userRole = session?.user?.role;
        console.log('User role from session:', userRole);
        console.log('Role type:', typeof userRole);
        console.log('Role value (JSON):', JSON.stringify(userRole));
        
        // Check local storage for any cached role info
        console.log('Local storage keys:', Object.keys(localStorage));
        const storedRole = localStorage.getItem('userRole');
        console.log('Role from localStorage:', storedRole);
        
        // Check if role matches expected values
        const expectedRoles = ['administrator', 'admin', 'ADMIN', 'Admin'];
        expectedRoles.forEach(role => {
            console.log(`Role === "${role}":`, userRole === role);
            console.log(`Role === "${role}" (case-insensitive):`, 
                       String(userRole).toLowerCase() === role.toLowerCase());
        });
        
        // Test middleware logic
        const normalizedRole = String(userRole).toLowerCase().trim();
        const adminRole = 'administrator';
        const partnerBankRole = 'partner-bank';
        
        console.log('Normalized role:', normalizedRole);
        console.log('Admin role match:', normalizedRole === adminRole);
        console.log('Partner bank role match:', normalizedRole === partnerBankRole);
        console.log('Has merchants access:', 
                   normalizedRole === adminRole || normalizedRole === partnerBankRole);
        
        // Try to access merchants endpoint directly
        const merchantsResponse = await fetch('/api/merchants');
        console.log('Direct API call status:', merchantsResponse.status);
        
        // Check if we can see the auth token
        const token = session?.accessToken;
        console.log('Has access token:', !!token);
        if (token) {
            // Decode JWT token to see payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            console.log('Role from token:', payload.user?.role);
        }
        
    } catch (error) {
        console.error('Debug error:', error);
    }
}

debugRole();