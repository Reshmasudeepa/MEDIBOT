'use client';

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, Lock } from "lucide-react";
import { HmacSHA256 } from 'crypto-js';

// PhonePe Configuration
const PHONEPE_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"; // Production URL; use sandbox for testing
const MERCHANT_ID = "M23R8YJO33CEU";
const SALT_KEY = "1cedc54d-5c48-4cc5-a60c-a8ecd88c1b11";
const SALT_INDEX = "1";

const PaymentForm = ({
  plan,
  onSuccess,
  onCancel
}: {
  plan: string,
  onSuccess: () => void,
  onCancel: () => void
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle PhonePe callback verification
  const verifyPaymentCallback = useCallback(async () => {
    const response = searchParams ? searchParams.get('response') : null;
    if (response) {
      try {
        const decodedResponse = JSON.parse(atob(response)); // Decode base64
        const xVerify = decodedResponse.checksum;
        
        // Verify checksum
        const dataToVerify = `${decodedResponse.data}${SALT_KEY}${SALT_INDEX}`;
        const generatedChecksum = HmacSHA256(dataToVerify, SALT_KEY).toString();
        
        if (xVerify === generatedChecksum && decodedResponse.code === 'PAYMENT_SUCCESS') {
          onSuccess();
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        setError('Error processing payment callback');
      }
    }
  }, [searchParams, onSuccess]);

  // Run verification if callback is present
  if (searchParams && searchParams.get('response')) {
    verifyPaymentCallback();
  }

  if (plan !== "premium") {
    return (
      <div className="space-y-4 text-center">
        <div className="text-green-600 font-semibold">Base plan is free and accessible!</div>
        <Button type="button" onClick={onCancel} className="w-full" variant="outline">
          Continue with Base Plan
        </Button>
      </div>
    );
  }

  const handlePhonePePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const merchantTransactionId = `MT${Date.now()}`;
      const userId = `MU${Date.now()}`; // Replace with actual user ID
      const amount = 9900; // ₹99.00 in paise

      const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId,
        merchantUserId: userId,
        amount,
        redirectUrl: `${window.location.origin}/payment?response={response}`,
        redirectMode: "REDIRECT",
        callbackUrl: `${window.location.origin}/payment`,
        mobileNumber: "9999999999", // Replace with actual user mobile if available
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      const payloadBase64 = btoa(JSON.stringify(payload));
      const dataToHash = `${payloadBase64}/pg/v1/pay${SALT_KEY}`;
      const checksum = HmacSHA256(dataToHash, SALT_KEY).toString() + `###${SALT_INDEX}`;

      // Optional: Try another CORS proxy for testing (NOT FOR PRODUCTION)
      // const proxyUrl = `https://proxy.cors.sh/${PHONEPE_API_URL}`;
      const response = await fetch(PHONEPE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "Accept": "application/json"
          // For cors.sh proxy, add: "x-cors-api-key": "your-cors-sh-api-key"
        },
        body: JSON.stringify({
          request: payloadBase64
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create PhonePe order: ${response.statusText}`);
      }

      const { data } = await response.json();
      const redirectUrl = data?.instrumentResponse?.redirectInfo?.url;

      if (!redirectUrl) {
        throw new Error("PhonePe did not return a redirect URL");
      }

      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Note: Direct client-side calls to PhonePe are blocked by CORS due to the 'x-verify' header. For a secure and functional integration, use a server-side Next.js API route (e.g., /api/phonepe/create-order).");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex space-x-3 pt-2">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button type="button" onClick={handlePhonePePayment} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {loading ? "Processing..." : `Pay ₹99`}
        </Button>
      </div>
    </div>
  );
};

const PaymentDialog = ({
  open,
  onOpenChange,
  plan
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  plan: string
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
      setPaymentSuccess(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-2xl font-bold">
            {paymentSuccess ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-7 w-7 text-green-500" />
                <span>Payment Successful!</span>
              </div>
            ) : (
              <>
                Upgrade to <span className="text-blue-600">{plan === "premium" ? "Premium" : "Base"} Plan</span>
                <div className="text-sm font-normal text-gray-500">
                  {plan === "premium" ? "₹99/month" : "Free"}
                </div>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {paymentSuccess
              ? "Your subscription is now active. Enjoy all the premium features."
              : <>Secured via <span className="font-medium text-blue-600">PhonePe</span>. Your data is encrypted and protected.</>}
          </DialogDescription>
        </DialogHeader>
        {paymentSuccess ? (
          <div className="flex flex-col items-center gap-6 py-6">
            <svg viewBox="0 0 200 100" className="w-full max-w-[200px]">
              <path
                d="M20,50 Q50,20 80,50 T140,50"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="0"
                className="animate-drawLine"
              />
            </svg>
            <Button onClick={() => onOpenChange(false)} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md">
              Continue to App
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            <div className="rounded-lg bg-gray-50 p-4 shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Plan</span>
                <span className="font-semibold">{plan === "premium" ? "Premium" : "Base"}</span>
              </div>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Price</span>
                <span className="font-semibold">
                  {plan === "premium" ? "₹99" : "Free"} <span className="text-xs text-gray-400">/ month</span>
                </span>
              </div>
            </div>
            <PaymentForm plan={plan} onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Payments are secure and end-to-end encrypted</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;