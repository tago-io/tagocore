import type * as React from "react";
import { useTheme } from "styled-components";
import { FormGroup } from "../../../../index.ts";

function MinimumScheduleMessage(props: any) {
  const theme = useTheme();
  const containerStyle: React.CSSProperties = {
    fontSize: "0.77rem",
    marginTop: "5px",
    textAlign: "center",
    color: props.error ? theme.errorStatus : "rgb(160, 160, 160)",
  };

  return (
    <FormGroup>
      <div style={containerStyle}>
        Note: The action can take up to 1 minute to be executed.
      </div>
    </FormGroup>
  );
}

export default MinimumScheduleMessage;
