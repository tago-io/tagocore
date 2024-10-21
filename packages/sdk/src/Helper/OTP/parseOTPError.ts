type OTPOptions = "email" | "authenticator" | "sms";

interface OTPError {
  otp_enabled: OTPOptions[];
  otp_autosend: OTPOptions;
  phone?: string;
}

function parseOTPError(error: string) {
  try {
    if (!error?.includes("otp_enabled")) {
      return null;
    }

    const otp = JSON.parse(error);

    return otp as OTPError;
  } catch {
    return null;
  }
}

export { parseOTPError };
export type { OTPError };
