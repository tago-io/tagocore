import axios from "axios";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import store from "../../../System/Store.ts";
import { EButton, EIcon, FormGroup, Input } from "../../../index.ts";
import ErrorMessage from "../../ErrorMessage/ErrorMessage.tsx";
import InputPassword from "../../InputPassword/InputPassword.tsx";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import * as Style from "./StepSignUp.style";

interface StepSignUpProps {
  onBack: () => void;
  onNext: () => void;
}

function StepSignUp(props: StepSignUpProps) {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const { onNext, onBack } = props;

  /**
   * Validates credentials for signing up.
   * @returns {boolean} true for error.
   */
  const validateSignUp = useCallback(() => {
    const err: any = {};
    let hasError = false;

    if (!data.username) {
      err.username = true;
      hasError = true;
    }
    if (!data.password) {
      err.password = true;
      err.password_confirmation = true;
      hasError = true;
    }
    if (!data.name) {
      err.name = true;
      hasError = true;
    }
    if (data.password !== data.password_confirmation) {
      err.password = true;
      err.password_confirmation = true;
      hasError = true;
    }

    setError(err);
    return hasError;
  }, [data]);

  /**
   * Creates a new account.
   */
  const signUp = useCallback(() => {
    if (validateSignUp()) {
      return;
    }

    if (!store.masterPassword) {
      setShowMasterPassword(true);
      return;
    }

    setShowMasterPassword(false);
    setLoading(true);
    setError({});

    const headers = { masterPassword: store.masterPassword };
    axios
      .post("/account", data, { headers })
      .then(() => onNext())
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err?.toString?.();
        setError({ message: errorMessage });
        setLoading(false);
      });
  }, [validateSignUp, onNext, data]);

  /**
   * Cleans up the master password after the screen ends.
   */
  useEffect(() => {
    return () => {
      store.masterPassword = "";
    };
  }, []);

  return (
    <>
      <SetupForm
        title="Create an account"
        buttons={[
          { label: "Back", onClick: onBack, disabled: loading },
          {
            label: "Create account",
            onClick: signUp,
            disabled: loading,
            type: EButton.primary,
          },
        ]}
      >
        <Style.Content>
          <div style={{ width: "60%" }}>
            <FormGroup required label="Full Name" icon={EIcon["user-alt"]}>
              <Input
                autoFocus
                disabled={loading}
                error={error?.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                value={data.name || ""}
              />
            </FormGroup>

            <FormGroup
              tooltip="This is the username that you will use to login"
              required
              label="Username"
              icon={EIcon["user-alt"]}
            >
              <Input
                disabled={loading}
                error={error?.username}
                value={data.username || ""}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                placeholder="This will be used to login"
              />
            </FormGroup>

            <FormGroup
              tooltip="The password cannot be changed later on"
              required
              label="Password"
              icon={EIcon.key}
            >
              <InputPassword
                disabled={loading}
                error={error?.password}
                value={data.password || ""}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                autoComplete="new-password"
                placeholder="Required"
              />
            </FormGroup>

            <FormGroup required label="Password Confirmation" icon={EIcon.key}>
              <InputPassword
                disabled={loading}
                error={error?.password_confirmation}
                value={data.password_confirmation || ""}
                onChange={(e) =>
                  setData({ ...data, password_confirmation: e.target.value })
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </FormGroup>

            <FormGroup label="Password Hint" icon={EIcon.lightbulb}>
              <Input
                disabled={loading}
                error={error?.password_hint}
                value={data.password_hint || ""}
                placeholder="Hint (Recommended)"
                onChange={(e) =>
                  setData({ ...data, password_hint: e.target.value })
                }
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
          </div>
        </Style.Content>
      </SetupForm>

      {showMasterPassword && (
        <ModalMasterPassword
          onClose={() => setShowMasterPassword(false)}
          onConfirm={() => signUp()}
        />
      )}
    </>
  );
}

export default observer(StepSignUp);
