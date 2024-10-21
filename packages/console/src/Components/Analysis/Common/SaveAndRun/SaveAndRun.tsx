import { memo } from "react";
import Button from "../../../Button/Button.tsx";
import * as Style from "./SaveAndRun.style";

/**
 * Props.
 */
interface ISaveAndRunProps {
  /**
   * If only `run` should be written in the text.
   */
  onlyRun: boolean;
  /**
   * Called when the button is clicked.
   */
  onClick: () => void;
  /**
   * If the button is disabled or not.
   */
  disabled: boolean;
}

/**
 * Button of "save and run" in the analysis edit screen.
 */
function SaveAndRun(props: ISaveAndRunProps) {
  const { onlyRun, disabled, onClick } = props;

  return (
    <Style.Container>
      {/* Temporarily removed: */}
      {/* <Button className="cog-button">
        <Icon icon={EIcon.cog} />
      </Button> */}
      <Button onClick={onClick} disabled={disabled} className="save-button">
        {onlyRun ? "Run" : "Save and Run"}
      </Button>
    </Style.Container>
  );
}

export default memo(SaveAndRun);
