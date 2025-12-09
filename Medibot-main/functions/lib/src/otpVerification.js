"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredOTPs = exports.verifyOTP = exports.sendOTP = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Create email transporter with proper error handling
const createEmailTransporter = () => {
    const emailConfig = functions.config().email;
    if (!emailConfig?.user || !emailConfig?.password) {
        console.warn('Email configuration missing. Please set email.user and email.password in Firebase Functions config.');
        // Return a mock transporter for development
        return {
            sendMail: async () => {
                console.log('Mock email send - configure email settings for production');
                return Promise.resolve();
            }
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
const transporter = createEmailTransporter();
// Hash function for OTP
const hashOTP = (otp, salt) => {
    return crypto.pbkdf2Sync(otp, salt, 10000, 64, 'sha512').toString('hex');
};
// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Generate salt for hashing
const generateSalt = () => {
    return crypto.randomBytes(32).toString('hex');
};
// Send OTP Function
exports.sendOTP = functions.https.onCall(async (data, context) => {
    try {
        const { email } = data;
        // Validate input
        if (!email || typeof email !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'Email is required and must be a string');
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email format');
        }
        // Check rate limiting - prevent spam
        const recentOTPQuery = await db.collection('otps')
            .where('email', '==', email)
            .where('createdAt', '>', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 60000))) // Last 1 minute
            .get();
        if (!recentOTPQuery.empty) {
            throw new functions.https.HttpsError('resource-exhausted', 'Please wait 1 minute before requesting another OTP');
        }
        // Generate OTP and salt with validation
        const otp = generateOTP();
        const salt = generateSalt();
        if (!otp || otp.length !== 6) {
            throw new functions.https.HttpsError('internal', 'Failed to generate valid OTP');
        }
        if (!salt || salt.length < 32) {
            throw new functions.https.HttpsError('internal', 'Failed to generate valid salt');
        }
        const hashedOTP = hashOTP(otp, salt);
        // Set expiry time (5 minutes from now)
        const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000));
        const createdAt = admin.firestore.Timestamp.now();
        // Store OTP in Firestore
        const otpDoc = {
            email,
            hashedOTP: `${salt}:${hashedOTP}`, // Store salt with hash
            createdAt,
            expiresAt,
            attempts: 0,
            maxAttempts: 3,
            verified: false,
        };
        const otpRef = await db.collection('otps').add(otpDoc);
        // Send email with proper error handling
        const emailConfig = functions.config().email;
        const mailOptions = {
            from: emailConfig?.user || 'noreply@medibot.com',
            to: email,
            subject: 'MediBot - Email Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://your-domain.com/logo.png" alt="MediBot" style="width: 120px; height: auto;">
            <h1 style="color: #2563eb; margin: 20px 0;">Email Verification</h1>
          </div>
          
          <div style="background: #f8fafc; border-radius: 10px; padding: 30px; text-align: center;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Your Verification Code</h2>
            <div style="background: white; border: 2px dashed #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #64748b; margin: 20px 0;">
              This code will expire in <strong>5 minutes</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #64748b; font-size: 14px;">
              If you didn't request this verification code, please ignore this email.
            </p>
            <p style="color: #64748b; font-size: 14px;">
              This is an automated email from MediBot. Please do not reply.
            </p>
          </div>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return {
            success: true,
            message: 'OTP sent successfully',
            otpId: otpRef.id,
        };
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to send OTP');
    }
});
// Verify OTP Function
exports.verifyOTP = functions.https.onCall(async (data, context) => {
    try {
        const { email, otp, otpId } = data;
        // Validate input
        if (!email || !otp || !otpId) {
            throw new functions.https.HttpsError('invalid-argument', 'Email, OTP, and OTP ID are required');
        }
        if (typeof otp !== 'string' || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            throw new functions.https.HttpsError('invalid-argument', 'OTP must be a 6-digit number');
        }
        // Get OTP document
        const otpDocRef = db.collection('otps').doc(otpId);
        const otpDoc = await otpDocRef.get();
        if (!otpDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'OTP not found');
        }
        const otpData = otpDoc.data();
        // Check if OTP belongs to the email
        if (otpData.email !== email) {
            throw new functions.https.HttpsError('permission-denied', 'OTP does not belong to this email');
        }
        // Check if already verified
        if (otpData.verified) {
            throw new functions.https.HttpsError('failed-precondition', 'OTP already verified');
        }
        // Check if expired
        if (admin.firestore.Timestamp.now().toMillis() > otpData.expiresAt.toMillis()) {
            await otpDocRef.delete(); // Clean up expired OTP
            throw new functions.https.HttpsError('deadline-exceeded', 'OTP has expired');
        }
        // Check max attempts
        if (otpData.attempts >= otpData.maxAttempts) {
            await otpDocRef.delete(); // Clean up after max attempts
            throw new functions.https.HttpsError('resource-exhausted', 'Maximum verification attempts exceeded');
        }
        // Verify OTP
        const hashParts = otpData.hashedOTP.split(':');
        if (hashParts.length !== 2) {
            throw new functions.https.HttpsError('internal', 'Invalid OTP hash format');
        }
        const [salt, storedHash] = hashParts;
        if (!salt || !storedHash) {
            throw new functions.https.HttpsError('internal', 'Invalid OTP hash components');
        }
        const providedHash = hashOTP(otp, salt);
        if (providedHash !== storedHash) {
            // Increment attempts
            await otpDocRef.update({
                attempts: admin.firestore.FieldValue.increment(1),
            });
            const remainingAttempts = otpData.maxAttempts - (otpData.attempts + 1);
            throw new functions.https.HttpsError('unauthenticated', `Invalid OTP. ${remainingAttempts} attempts remaining.`);
        }
        // OTP is valid - mark as verified
        await otpDocRef.update({
            verified: true,
            attempts: admin.firestore.FieldValue.increment(1),
        });
        // Update user in Firebase Auth if authenticated
        if (context.auth) {
            await admin.auth().updateUser(context.auth.uid, {
                emailVerified: true,
            });
        }
        console.log(`OTP verified successfully for ${email}`);
        // Clean up verified OTP after a delay (optional)
        setTimeout(async () => {
            try {
                await otpDocRef.delete();
            }
            catch (cleanupError) {
                console.warn('Failed to cleanup OTP document:', cleanupError);
            }
        }, 60000); // Delete after 1 minute
        return {
            success: true,
            message: 'Email verified successfully',
        };
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to verify OTP');
    }
});
// Cleanup expired OTPs (scheduled function)
exports.cleanupExpiredOTPs = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
    try {
        const now = admin.firestore.Timestamp.now();
        const expiredOTPs = await db.collection('otps')
            .where('expiresAt', '<', now)
            .get();
        const batch = db.batch();
        expiredOTPs.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Cleaned up ${expiredOTPs.size} expired OTPs`);
        return null;
    }
    catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
        return null;
    }
});
