import { Button, EButton, FormGroup, Input } from "@tago-io/tcore-console";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useState,
} from "react";
import * as Style from "./Otp.style";

/**
 * Props.
 */
interface IOtpProps {
  type: any;
  typesEnabled: any[];
  phone?: string;
  loading: boolean;
  invalidCredentials?: boolean;
  onGoToOtpTypes: () => void;
  onGoToCredentials: () => void;
  onLogin: (pinCode?: string) => void;
}

/**
 */
function Otp(props: IOtpProps) {
  const [pinCode, setPinCode] = useState("");
  const {
    type,
    invalidCredentials,
    loading,
    typesEnabled,
    onGoToCredentials,
    onLogin,
    onGoToOtpTypes,
    phone,
  } = props;

  /**
   * Renders the description of the selected type.
   */
  const renderDescription = useCallback(() => {
    if (type === "authenticator") {
      return (
        <span>
          Your <b>app</b> will display an authentication code.
        </span>
      );
    }
    if (type === "sms") {
      return (
        <span>
          We sent you a <b>SMS</b> with the authentication code to your phone
          <b>{phone}</b>. It can take up to 1 minute to arrive.
        </span>
      );
    }
    return (
      <span>
        We sent you an authentication code to your <b>email</b>, it may take a
        minute to arrive.
      </span>
    );
  }, [phone, type]);

  /**
   * Goes to the otp type selector.
   */
  const pickAnotherType = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onGoToOtpTypes();
    },
    [onGoToOtpTypes],
  );

  /**
   * Signs out.
   */
  const signOut = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onGoToCredentials();
    },
    [onGoToCredentials],
  );

  /**
   * Tries to log in.
   */
  const login = useCallback(() => {
    onLogin(pinCode);
  }, [pinCode, onLogin]);

  /**
   * Called when the input receives a keydown event.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        login();
      }
    },
    [login],
  );

  return (
    <Style.Container loading={loading}>
      <div className="title-container">
        <div>
          <h3>Two-factor Authentication</h3>
          <div>{renderDescription()}</div>
        </div>

        <span className="fake-link" onClick={signOut}>
          Sign out
        </span>
      </div>

      <FormGroup>
        <Input
          autoFocus
          error={invalidCredentials}
          onChange={(e) => setPinCode(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="6-digit code"
          value={pinCode}
        />
      </FormGroup>

      <FormGroup>
        <Button
          type={EButton.primary}
          disabled={loading || !pinCode}
          onClick={login}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </FormGroup>

      {(typesEnabled.length > 1 || type !== "authenticator") && (
        <div>
          <span>Haven&apos;t received a code? </span>
          <span className="fake-link" onClick={pickAnotherType}>
            Send one again
          </span>
          <span>.</span>
        </div>
      )}
    </Style.Container>
  );
}

export default Otp;
