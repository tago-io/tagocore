import { observer } from "mobx-react";
import { useState, useCallback } from "react";
import { Button, EButton, EIcon, Icon } from "../../../index.ts";
import * as Style from "./SuccessMessage.style";

/**
 * Props.
 */
interface ISuccessMessageProps {
  onClick?: () => void;
  title?: string;
  description?: string;
}

/**
 */
function SuccessMessage(props: ISuccessMessageProps) {
  const [disabled, setDisabled] = useState(false);
  const { onClick, title, description } = props;

  /**
   * Disables the button and calls the prop.
   */
  const click = useCallback(() => {
    setDisabled(true);
    onClick?.();
  }, [onClick]);

  return (
    <Style.Container>
      <div className="inner">
        <div className="icon-container">
          <Icon color="white" icon={EIcon.check} size="20px" />
        </div>

        <div className="texts">
          <h1>{title}</h1>
          <span>{description}</span>
        </div>

        <Button disabled={disabled} onClick={click} type={EButton.primary}>
          Continue
        </Button>
      </div>
    </Style.Container>
  );
}

export default observer(SuccessMessage);
