"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredOTPs = exports.verifyOTP = exports.sendOTP = void 0;
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
var db = admin.firestore();
// Create email transporter with proper error handling
var createEmailTransporter = function () {
    var emailConfig = functions.config().email;
    if (!(emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.user) || !(emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.password)) {
        console.warn('Email configuration missing. Please set email.user and email.password in Firebase Functions config.');
        // Return a mock transporter for development
        return {
            sendMail: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('Mock email send - configure email settings for production');
                    return [2 /*return*/, Promise.resolve()];
                });
            }); }
        };
    }
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailConfig.user,
            pass: emailConfig.password,
        },
    });
};
// Initialize email transporter
var transporter = createEmailTransporter();
// Hash function for OTP
var hashOTP = function (otp, salt) {
    return crypto.pbkdf2Sync(otp, salt, 10000, 64, 'sha512').toString('hex');
};
// Generate random 6-digit OTP
var generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Generate salt for hashing
var generateSalt = function () {
    return crypto.randomBytes(32).toString('hex');
};
// Send OTP Function
exports.sendOTP = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var email, emailRegex, recentOTPQuery, otp, salt, hashedOTP, expiresAt, createdAt, otpDoc, otpRef, emailConfig, mailOptions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = data.email;
                // Validate input
                if (!email || typeof email !== 'string') {
                    throw new functions.https.HttpsError('invalid-argument', 'Email is required and must be a string');
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new functions.https.HttpsError('invalid-argument', 'Invalid email format');
                }
                return [4 /*yield*/, db.collection('otps')
                        .where('email', '==', email)
                        .where('createdAt', '>', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 60000))) // Last 1 minute
                        .get()];
            case 1:
                recentOTPQuery = _a.sent();
                if (!recentOTPQuery.empty) {
                    throw new functions.https.HttpsError('resource-exhausted', 'Please wait 1 minute before requesting another OTP');
                }
                otp = generateOTP();
                salt = generateSalt();
                if (!otp || otp.length !== 6) {
                    throw new functions.https.HttpsError('internal', 'Failed to generate valid OTP');
                }
                if (!salt || salt.length < 32) {
                    throw new functions.https.HttpsError('internal', 'Failed to generate valid salt');
                }
                hashedOTP = hashOTP(otp, salt);
                expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000));
                createdAt = admin.firestore.Timestamp.now();
                otpDoc = {
                    email: email,
                    hashedOTP: "".concat(salt, ":").concat(hashedOTP), // Store salt with hash
                    createdAt: createdAt,
                    expiresAt: expiresAt,
                    attempts: 0,
                    maxAttempts: 3,
                    verified: false,
                };
                return [4 /*yield*/, db.collection('otps').add(otpDoc)];
            case 2:
                otpRef = _a.sent();
                emailConfig = functions.config().email;
                mailOptions = {
                    from: (emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.user) || 'noreply@medibot.com',
                    to: email,
                    subject: 'MediBot - Email Verification Code',
                    html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n          <div style=\"text-align: center; margin-bottom: 30px;\">\n            <img src=\"https://your-domain.com/logo.png\" alt=\"MediBot\" style=\"width: 120px; height: auto;\">\n            <h1 style=\"color: #2563eb; margin: 20px 0;\">Email Verification</h1>\n          </div>\n          \n          <div style=\"background: #f8fafc; border-radius: 10px; padding: 30px; text-align: center;\">\n            <h2 style=\"color: #1e293b; margin-bottom: 20px;\">Your Verification Code</h2>\n            <div style=\"background: white; border: 2px dashed #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0;\">\n              <span style=\"font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;\">".concat(otp, "</span>\n            </div>\n            <p style=\"color: #64748b; margin: 20px 0;\">\n              This code will expire in <strong>5 minutes</strong>\n            </p>\n          </div>\n          \n          <div style=\"margin-top: 30px; text-align: center;\">\n            <p style=\"color: #64748b; font-size: 14px;\">\n              If you didn't request this verification code, please ignore this email.\n            </p>\n            <p style=\"color: #64748b; font-size: 14px;\">\n              This is an automated email from MediBot. Please do not reply.\n            </p>\n          </div>\n        </div>\n      "),
                };
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 3:
                _a.sent();
                console.log("OTP sent successfully to ".concat(email));
                return [2 /*return*/, {
                        success: true,
                        message: 'OTP sent successfully',
                        otpId: otpRef.id,
                    }];
            case 4:
                error_1 = _a.sent();
                console.error('Error sending OTP:', error_1);
                if (error_1 instanceof functions.https.HttpsError) {
                    throw error_1;
                }
                throw new functions.https.HttpsError('internal', 'Failed to send OTP');
            case 5: return [2 /*return*/];
        }
    });
}); });
// Verify OTP Function
exports.verifyOTP = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var email, otp, otpId, otpDocRef_1, otpDoc, otpData, hashParts, salt, storedHash, providedHash, remainingAttempts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                email = data.email, otp = data.otp, otpId = data.otpId;
                // Validate input
                if (!email || !otp || !otpId) {
                    throw new functions.https.HttpsError('invalid-argument', 'Email, OTP, and OTP ID are required');
                }
                if (typeof otp !== 'string' || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
                    throw new functions.https.HttpsError('invalid-argument', 'OTP must be a 6-digit number');
                }
                otpDocRef_1 = db.collection('otps').doc(otpId);
                return [4 /*yield*/, otpDocRef_1.get()];
            case 1:
                otpDoc = _a.sent();
                if (!otpDoc.exists) {
                    throw new functions.https.HttpsError('not-found', 'OTP not found');
                }
                otpData = otpDoc.data();
                // Check if OTP belongs to the email
                if (otpData.email !== email) {
                    throw new functions.https.HttpsError('permission-denied', 'OTP does not belong to this email');
                }
                // Check if already verified
                if (otpData.verified) {
                    throw new functions.https.HttpsError('failed-precondition', 'OTP already verified');
                }
                if (!(admin.firestore.Timestamp.now().toMillis() > otpData.expiresAt.toMillis())) return [3 /*break*/, 3];
                return [4 /*yield*/, otpDocRef_1.delete()];
            case 2:
                _a.sent(); // Clean up expired OTP
                throw new functions.https.HttpsError('deadline-exceeded', 'OTP has expired');
            case 3:
                if (!(otpData.attempts >= otpData.maxAttempts)) return [3 /*break*/, 5];
                return [4 /*yield*/, otpDocRef_1.delete()];
            case 4:
                _a.sent(); // Clean up after max attempts
                throw new functions.https.HttpsError('resource-exhausted', 'Maximum verification attempts exceeded');
            case 5:
                hashParts = otpData.hashedOTP.split(':');
                if (hashParts.length !== 2) {
                    throw new functions.https.HttpsError('internal', 'Invalid OTP hash format');
                }
                salt = hashParts[0], storedHash = hashParts[1];
                if (!salt || !storedHash) {
                    throw new functions.https.HttpsError('internal', 'Invalid OTP hash components');
                }
                providedHash = hashOTP(otp, salt);
                if (!(providedHash !== storedHash)) return [3 /*break*/, 7];
                // Increment attempts
                return [4 /*yield*/, otpDocRef_1.update({
                        attempts: admin.firestore.FieldValue.increment(1),
                    })];
            case 6:
                // Increment attempts
                _a.sent();
                remainingAttempts = otpData.maxAttempts - (otpData.attempts + 1);
                throw new functions.https.HttpsError('unauthenticated', "Invalid OTP. ".concat(remainingAttempts, " attempts remaining."));
            case 7: 
            // OTP is valid - mark as verified
            return [4 /*yield*/, otpDocRef_1.update({
                    verified: true,
                    attempts: admin.firestore.FieldValue.increment(1),
                })];
            case 8:
                // OTP is valid - mark as verified
                _a.sent();
                if (!context.auth) return [3 /*break*/, 10];
                return [4 /*yield*/, admin.auth().updateUser(context.auth.uid, {
                        emailVerified: true,
                    })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                console.log("OTP verified successfully for ".concat(email));
                // Clean up verified OTP after a delay (optional)
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var cleanupError_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, otpDocRef_1.delete()];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                cleanupError_1 = _a.sent();
                                console.warn('Failed to cleanup OTP document:', cleanupError_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, 60000); // Delete after 1 minute
                return [2 /*return*/, {
                        success: true,
                        message: 'Email verified successfully',
                    }];
            case 11:
                error_2 = _a.sent();
                console.error('Error verifying OTP:', error_2);
                if (error_2 instanceof functions.https.HttpsError) {
                    throw error_2;
                }
                throw new functions.https.HttpsError('internal', 'Failed to verify OTP');
            case 12: return [2 /*return*/];
        }
    });
}); });
// Cleanup expired OTPs (scheduled function)
exports.cleanupExpiredOTPs = functions.pubsub.schedule('every 1 hours').onRun(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var now, expiredOTPs, batch_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                now = admin.firestore.Timestamp.now();
                return [4 /*yield*/, db.collection('otps')
                        .where('expiresAt', '<', now)
                        .get()];
            case 1:
                expiredOTPs = _a.sent();
                batch_1 = db.batch();
                expiredOTPs.docs.forEach(function (doc) {
                    batch_1.delete(doc.ref);
                });
                return [4 /*yield*/, batch_1.commit()];
            case 2:
                _a.sent();
                console.log("Cleaned up ".concat(expiredOTPs.size, " expired OTPs"));
                return [2 /*return*/, null];
            case 3:
                error_3 = _a.sent();
                console.error('Error cleaning up expired OTPs:', error_3);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); });
