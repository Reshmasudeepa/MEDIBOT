// Utility to generate encrypted strings for your configuration
// Run this to create new encrypted versions of your sensitive data

import { ConfigEncryption } from './encryption';

console.log("🔐 Encryption Utility - Generate encrypted strings for your config");
console.log("================================================");

// Example usage - replace with your own sensitive data
const exampleData = {
  creator: "Your Name Here",
  botName: "Your Bot Name", 
  description: "Your bot description here"
};

// Generate encrypted versions
console.log("Example encrypted data:");
console.log("========================");

Object.entries(exampleData).forEach(([key, value]) => {
  const encrypted = ConfigEncryption.encrypt(value);
  const decrypted = ConfigEncryption.decrypt(encrypted);
  
  console.log(`${key}:`);
  console.log(`  Original: "${value}"`);
  console.log(`  Encrypted: "${encrypted}"`);
  console.log(`  Decrypted: "${decrypted}"`);
  console.log(`  ✅ Match: ${value === decrypted ? 'YES' : 'NO'}`);
  console.log('');
});

console.log("📋 Format for your SECURE_CONFIG:");
console.log("==================================");
console.log(`const SECURE_CONFIG = {`);
Object.entries(exampleData).forEach(([key, value]) => {
  console.log(`  ${key}: "${ConfigEncryption.encrypt(value)}",`);
});
console.log(`};`);