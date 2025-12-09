"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredOTPs = exports.verifyOTP = exports.sendOTP = void 0;
// Export all OTP verification functions
var otpVerification_1 = require("./otpVerification");
Object.defineProperty(exports, "sendOTP", { enumerable: true, get: function () { return otpVerification_1.sendOTP; } });
Object.defineProperty(exports, "verifyOTP", { enumerable: true, get: function () { return otpVerification_1.verifyOTP; } });
Object.defineProperty(exports, "cleanupExpiredOTPs", { enumerable: true, get: function () { return otpVerification_1.cleanupExpiredOTPs; } });
