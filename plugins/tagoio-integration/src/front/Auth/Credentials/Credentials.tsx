import { Button, EButton, FormGroup, Input } from "@tago-io/tcore-console";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";
// @ts-ignore
import SVGTagoIO from "../../../../assets/tagoio-logo.svg";
import * as Style from "./Credentials.style";

/**
 */
function Credentials(props: any) {
  const {
    loading,
    email,
    invalidCredentials,
    password,
    onChangeEmail,
    onChangePassword,
    onLogin,
  } = props;
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  /**
   * Tries to log in.
   */
  const login = useCallback(() => {
    if (String(emailError).length <= 3) {
      setEmailError(true);
      return;
    }
    if (String(passwordError).length <= 3) {
      setPasswordError(true);
      return;
    }

    onLogin();
    emailRef?.current?.blur();
    passwordRef?.current?.blur();
  }, [emailError, passwordError, onLogin]);

  /**
   * Called when the email input receives a keydown event.
   */
  const onEmailKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      passwordRef?.current?.focus();
    }
  }, []);

  /**
   * Called when the password input receives a keydown event.
   */
  const onPasswordKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        login();
      }
    },
    [login],
  );

  return (
    <Style.Container $loading={loading}>
      <FormGroup>
        <h3>Sign in</h3>
        <div>
          <span className="description">Enter your</span>
          <a
            className="tagoio-logo"
            target="_blank"
            href="https://admin.tago.io"
            rel="noreferrer"
          >
            <SVGTagoIO width="50px" />
          </a>
          <span className="description">credentials.</span>
        </div>
      </FormGroup>

      <FormGroup label="Email">
        <Input
          autoFocus
          onChange={(e) => onChangeEmail(e.target.value)}
          onKeyDown={onEmailKeyDown}
          error={invalidCredentials}
          ref={emailRef}
          value={email}
        />
      </FormGroup>

      <FormGroup label="Password">
        <Input
          onChange={(e) => onChangePassword(e.target.value)}
          onKeyDown={onPasswordKeyDown}
          error={invalidCredentials}
          ref={passwordRef}
          type="password"
          value={password}
        />
      </FormGroup>

      <FormGroup>
        <Button type={EButton.primary} disabled={loading} onClick={login}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </FormGroup>

      <div>
        <span>Don&apos;t have a TagoIO account? </span>
        <a target="_blank" href="https://admin.tago.io/signup" rel="noreferrer">
          Sign up
        </a>
        <span>.</span>
      </div>
    </Style.Container>
  );
}

export default Credentials;