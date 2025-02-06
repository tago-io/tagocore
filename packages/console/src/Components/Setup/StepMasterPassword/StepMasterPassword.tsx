import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";

import store from "../../../System/Store.ts";
import { EButton, EIcon, FormGroup, Icon } from "../../../index.ts";
import ErrorMessage from "../../ErrorMessage/ErrorMessage.tsx";
import InputPassword from "../../InputPassword/InputPassword.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import * as Style from "./StepMasterPassword.style";

interface StepMasterPasswordProps {
  onBack: () => void;
  onNext: () => void;
}

function StepMasterPassword(props: StepMasterPasswordProps) {
  const { onBack, onNext } = props;

  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isPending, setIsPending] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (form: { value: string; confirmation: string }) => {
      if (!form.value || !form.confirmation) {
        return {
          message: "Password and confirmation are required",
          focusElement: !form.value
            ? passwordRef.current
            : confirmationRef.current,
        };
      }

      if (form.value !== form.confirmation) {
        return {
          message: "Passwords do not match",
          focusElement: confirmationRef.current,
        };
      }

      if (form.value.length < 6) {
        return {
          message: "Password must have at least 6 characters",
          focusElement: passwordRef.current,
        };
      }

      return null;
    },
    [],
  );

  const next = useCallback(async () => {
    const error = validate({ value, confirmation });
    if (error) {
      setErrorMsg(error.message);
      error.focusElement?.focus();
      return;
    }
    setErrorMsg("");

    try {
      setIsPending(true);
      await axios.post("/settings/master/password", { password: value });

      runInAction(() => {
        store.masterPasswordConfigured = true;
        store.masterPassword = value;
      });

      onNext();
    } catch {
      setIsPending(false);
    }
  }, [validate, onNext, value, confirmation]);

  const onPasswordKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        confirmationRef?.current?.focus();
      }
    },
    [],
  );

  const onConfirmationKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        next();
      }
    },
    [next],
  );

  return (
    <SetupForm
      title="Set a Master Password"
      description={`Add a layer of security to your ${getSystemName()}`}
      buttons={[
        { label: "Back", onClick: onBack },
        {
          label: "Next",
          onClick: next,
          disabled: isPending,
          type: EButton.primary,
        },
      ]}
    >
      <Style.Content>
        <Icon icon={EIcon.lock} size="50px" color="rgba(0, 0, 0, 0.2)" />

        <span className="info">
          To perform sensitive actions, such as resetting to factory settings or
          creating new accounts, you will need to provide the master password
          defined here.
        </span>

        <FormGroup label="Master Password" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            autoFocus
            inputRef={passwordRef}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onPasswordKeyDown}
            value={value}
            error={!!errorMsg}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup label="Master Password Confirmation" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            inputRef={confirmationRef}
            onChange={(e) => setConfirmation(e.target.value)}
            onKeyDown={onConfirmationKeyDown}
            value={confirmation}
            error={!!errorMsg}
            disabled={isPending}
          />
        </FormGroup>

        {errorMsg && (
          <FormGroup>
            <ErrorMessage
              style={{ textAlign: "left", display: "flex", marginTop: 0 }}
            >
              {errorMsg}
            </ErrorMessage>
          </FormGroup>
        )}
      </Style.Content>
    </SetupForm>
  );
}

export default observer(StepMasterPassword);
