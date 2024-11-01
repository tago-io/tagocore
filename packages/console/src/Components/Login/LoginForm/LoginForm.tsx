import { type KeyboardEvent, useCallback, useRef } from "react";
import { Button, EIcon, FormGroup, Input } from "../../../index.ts";
import ErrorMessage from "../../ErrorMessage/ErrorMessage.tsx";
import InputPassword from "../../InputPassword/InputPassword.tsx";
import * as Style from "./LoginForm.style";

/**
 * Props.
 */
interface ILoginFormProps {
  loading?: boolean;
  data: any;
  error: any;
  onSignIn: () => void;
  onChangeData: (newData: any) => void;
}

/**
 */
function LoginForm(props: ILoginFormProps) {
  const { data, error, loading, onSignIn, onChangeData } = props;
  const passwordRef = useRef<HTMLInputElement>(null);

  /**
   * Called when the username input receives a keydown event.
   */
  const onUsernameKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        passwordRef?.current?.focus();
      }
    },
    [],
  );

  /**
   * Called when the password input receives a keydown event.
   */
  const onPasswordKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSignIn();
      }
    },
    [onSignIn],
  );

  /**
   */
  const renderSignIn = () => {
    return (
      <>
        <h1>Sign in</h1>

        <div style={{ width: "60%" }}>
          <FormGroup label="Username" icon={EIcon["user-alt"]}>
            <Input
              autoFocus
              disabled={loading}
              error={error?.username}
              onChange={(e) =>
                onChangeData({ ...data, username: e.target.value })
              }
              value={data.username || ""}
              onKeyDown={onUsernameKeyDown}
            />
          </FormGroup>

          <FormGroup label="Password" icon={EIcon.eye}>
            <InputPassword
              disabled={loading}
              error={error?.password}
              onChange={(e) =>
                onChangeData({ ...data, password: e.target.value })
              }
              value={data.password || ""}
              onKeyDown={onPasswordKeyDown}
              inputRef={passwordRef}
            />
          </FormGroup>

          {error?.message && (
            <FormGroup>
              <ErrorMessage
                style={{ textAlign: "left", display: "flex", marginTop: 0 }}
              >
                {error?.message}
              </ErrorMessage>
            </FormGroup>
          )}

          <FormGroup addMarginBottom={false}>
            <Button disabled={loading} onClick={onSignIn} color="black">
              Sign in
            </Button>
          </FormGroup>
        </div>
      </>
    );
  };

  return <Style.Container className="form">{renderSignIn()}</Style.Container>;
}

export default LoginForm;
