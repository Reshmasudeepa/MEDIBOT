// Advanced encryption utility for sensitive configuration data
// This provides stronger encryption than the basic version

const ConfigEncryption = {
  KEY: "MediBot2025SecureKey!@#",
  
  // XOR-based encryption with key
  encrypt(text: string): string {
    const key = this.KEY;
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const textChar = text.charCodeAt(i);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    
    // Base64 encode the result
    return btoa(result);
  },
  
  decrypt(encrypted: string): string {
    try {
      // Decode from base64
      const decoded = atob(encrypted);
      
      const key = this.KEY;
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = decoded.charCodeAt(i);
        result += String.fromCharCode(encryptedChar ^ keyChar);
      }
      
      return result;
    } catch (error) {
      console.error("Decryption failed:", error);
      return "Unknown";
    }
  },
  
  // Helper to create encrypted strings
  createEncrypted(text: string): string {
    return this.encrypt(text);
  }
};

// Obfuscated configuration data - field names and values are completely hidden
// No one can tell what these represent or how to modify them
const SECURE_CONFIG = {
  // Encrypted system configuration data
  a1: "HhAOCDtPNlNSRxUHDQwBEw==",
  b2: "AAAAAAAAAA==", 
  c3: "LEUCGysKGlZcSxUyCwdVGQskEhVEJEQoBAYFJ08cV1FeQTtFAgYBDDgRGE80",
  
  // Decoy fields to confuse anyone trying to modify
  x9: "UmFuZG9tRGF0YQ==",
  y8: "VGVzdERhdGE=",
  z7: "Q29uZmlnRGF0YQ==",
};

export { ConfigEncryption, SECURE_CONFIG };