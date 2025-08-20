// JWT Token Decoder
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVXVpZCI6ImM4YmI0ZWI0LWFlOGYtNGVmNy1iZDM2LTM1ZDdiNGU4ZjZjZCIsIm1lcmNoYW50VXVpZCI6bnVsbCwibWVyY2hhbnRJZCI6bnVsbCwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJ0b2tlbklzc3VlZEF0IjoiMTc1NTA3OTE5NSIsImlhdCI6MTc1NTA3OTQwOCwiZXhwIjoxNzU1MTY1ODA4fQ.hbFyrBB569Qro4AltTfHt2EjRBc5b3e5Msq-k02vrf0';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('JWT Header:', JSON.stringify(header, null, 2));
    console.log('\nJWT Payload:', JSON.stringify(payload, null, 2));
    
    // Convert timestamps to readable dates
    if (payload.iat) {
      console.log('\nIssued At:', new Date(payload.iat * 1000).toISOString());
    }
    if (payload.exp) {
      console.log('Expires At:', new Date(payload.exp * 1000).toISOString());
      console.log('Is Expired:', new Date() > new Date(payload.exp * 1000));
    }
    if (payload.tokenIssuedAt) {
      console.log('Token Issued At (custom):', new Date(parseInt(payload.tokenIssuedAt) * 1000).toISOString());
    }
    
    return { header, payload };
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

// For Node.js environment
if (typeof atob === 'undefined') {
  global.atob = function(str) {
    return Buffer.from(str, 'base64').toString('binary');
  };
}

console.log('=== JWT TOKEN ANALYSIS ===');
decodeJWT(token);

console.log('\n=== POTENTIAL ISSUES ===');
console.log('1. Check if merchantUuid and merchantId are null - this might cause 403 for merchant-specific endpoints');
console.log('2. Check if the role "administrator" has access to wallet balance endpoints');
console.log('3. Verify if the token expiration is causing issues');
console.log('4. Check if Partner-Bank-Id header is required for wallet balance endpoints');