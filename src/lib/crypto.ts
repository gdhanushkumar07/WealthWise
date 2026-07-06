/**
 * Secure cryptographic utilities using the native browser Web Crypto API.
 * Provides high-strength password hashing with salts to prevent rainbow table attacks.
 */

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  // Combine password and salt to prevent dictionary/rainbow table attacks
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateSalt(): string {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array).map(n => n.toString(16)).join('');
}
