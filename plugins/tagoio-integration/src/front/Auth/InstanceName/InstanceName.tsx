import { Button, EButton, FormGroup, Input } from "@tago-io/tcore-console";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";
import * as Style from "./InstanceName.style";

/**
 */
function InstanceName(props: any) {
  const [error, setError] = useState(false);
  const { name, onChangeName, onStart, onSignOut, loading } = props;
  const ref = useRef<HTMLInputElement>();

  /**
   * Called to start the integration.
   */
  const start = useCallback(() => {
    if (loading) {
      return;
    }
    if (String(name).length < 3) {
      setError(true);
      return;
    }

    ref?.current?.blur();
    setError(false);
    onStart().catch(() => setError(true));
  }, [name, loading, onStart]);

  /**
   * Called when the input receives a keydown event.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        start();
      }
    },
    [start],
  );

  return (
    <Style.Container loading={loading}>
      <div className="title-container">
        <h3>Instance name</h3>
        <span className="fake-link" onClick={onSignOut}>
          Sign out
        </span>
      </div>

      <FormGroup>
        <Input
          autoFocus
          error={error}
          onChange={(e) => onChangeName(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. tcore-gateway-1"
          ref={ref}
          value={name}
        />
      </FormGroup>

      <Button type={EButton.primary} disabled={loading} onClick={start}>
        {loading ? "Starting... " : "Start integration"}
      </Button>
    </Style.Container>
  );
}

export default InstanceName;
