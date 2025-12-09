import * as functions from 'firebase-functions';
export declare const sendOTP: functions.HttpsFunction & functions.Runnable<any>;
export declare const verifyOTP: functions.HttpsFunction & functions.Runnable<any>;
export declare const cleanupExpiredOTPs: functions.CloudFunction<unknown>;
