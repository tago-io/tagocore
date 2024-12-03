import { EIcon, FormGroup, Icon } from "@tago-io/tcore-console";
import { type MouseEvent, useCallback } from "react";
import * as Style from "./OtpPicker.style";

/**
 * Props.
 */
interface IOtpPickerProps {
  types: any[];
  onPick: (value: any) => void;
  onGoBack: () => void;
}

/**
 */
function OtpPicker(props: IOtpPickerProps) {
  const { types, onPick, onGoBack } = props;

  /**
   */
  const renderType = useCallback(
    (type: any) => {
      let icon = EIcon.lock;
      let text = "";

      if (type === "authenticator") {
        icon = EIcon.key;
        text = "Authenticator";
      } else if (type === "sms") {
        icon = EIcon.key;
        text = "SMS";
      } else if (type === "email") {
        icon = EIcon.envelope;
        text = "Email";
      }

      return (
        <Style.Item key={type} onClick={() => onPick(type)}>
          <div className="data">
            <div className="icon-container">
              <Icon icon={icon} size="15px" />
            </div>
            <span>{text}</span>
          </div>

          <Icon icon={EIcon["chevron-right"]} size="10px" />
        </Style.Item>
      );
    },
    [onPick],
  );

  /**
   * Goes back to the OTP page.
   */
  const goBack = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onGoBack();
    },
    [onGoBack],
  );

  return (
    <Style.Container>
      <div className="title-container">
        <h3>Request a new code</h3>
      </div>

      <FormGroup>{types.map(renderType)}</FormGroup>

      <div>
        <span>Or </span>
        <span className="fake-link" onClick={goBack}>
          type the code again
        </span>
        <span>.</span>
      </div>
    </Style.Container>
  );
}

export default OtpPicker;
