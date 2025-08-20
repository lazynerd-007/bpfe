'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { ROUTES } from '@/lib/constants';
import { authService } from '@/sdk/auth';

export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'registration'; // 'registration' or 'reset'
  
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestedFor = mode === 'reset' ? 'password-reset' : 'registration';

      const email = sessionStorage.getItem(mode === 'reset' ? 'resetEmail' : 'registrationEmail');
      
      if (!email) {
        setError('Session expired. Please start the process again.');
        router.push(mode === 'reset' ? ROUTES.AUTH.FORGOT_PASSWORD : ROUTES.AUTH.REGISTER);
        return;
      }
      
      // TODO: Backend verify-otp endpoint needs to be exposed in auth.controller.ts
      await authService.verifyOtp({
        otp: value,
        requestedFor: requestedFor as any,
      });
      
      // Clear session data
      sessionStorage.removeItem(mode === 'reset' ? 'resetEmail' : 'registrationEmail');
      sessionStorage.removeItem('verificationType');

      if (mode === 'reset') {
        setError(null);
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        router.push(ROUTES.AUTH.LOGIN);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestedFor = mode === 'reset' ? 'password-reset' : 'registration';

      const email = sessionStorage.getItem(mode === 'reset' ? 'resetEmail' : 'registrationEmail');
      
      if (!email) {
        setError('Session expired. Please start the process again.');
        router.push(mode === 'reset' ? ROUTES.AUTH.FORGOT_PASSWORD : ROUTES.AUTH.REGISTER);
        return;
      }

      await authService.requestOtp(requestedFor as any);

      setValue('');

      setError(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We&apos;ve sent a verification code to your email address. Enter the code below to continue.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={loading || value.length !== 6}>
          {loading ? 'Verifying...' : 'Verify code'}
        </Button>

        <div className="flex flex-col gap-3 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={loading}
          >
            Didn&apos;t receive a code? Resend
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </div>
      </div>
    </form>
  );
}