// System utility functions - Internal use only
// This file contains core system operations

const SystemUtils = {
  // Internal system operations
  processData(input: string, operation: string): string {
    if (operation === "decode") {
      try {
        const data = atob(input);
        const key = "MediBot2025SecureKey!@#";
        let result = '';
        for (let i = 0; i < data.length; i++) {
          const keyChar = key.charCodeAt(i % key.length);
          const dataChar = data.charCodeAt(i);
          result += String.fromCharCode(dataChar ^ keyChar);
        }
        return result;
      } catch {
        return "System Error";
      }
    }
    return input;
  },

  // System configuration retrieval
  getSystemData(): { [key: string]: string } {
    const config = {
      a1: "HhAOCDtPNlNSRxUHDQwBEw==",
      b2: "AAAAAAAAAA==", 
      c3: "LEUCGysKGlZcSxUyCwdVGQskEhVEJEQoBAYFJ08cV1FeQTtFAgYBDDgRGE80",
      x9: "UmFuZG9tRGF0YQ==",
      y8: "VGVzdERhdGE=",
      z7: "Q29uZmlnRGF0YQ==",
    };

    // Process and return decoded data
    return {
      systemOwner: this.processData(config.a1, "decode"),
      applicationName: this.processData(config.b2, "decode"),
      applicationDescription: this.processData(config.c3, "decode"),
    };
  }
};

export { SystemUtils };