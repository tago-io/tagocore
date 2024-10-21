import { Tooltip } from "../../../../../index.ts";
import * as Style from "./WeekdayButton.style";

/**
 * Props.
 */
interface IWeekdayButton {
  onChange: (newPressed: boolean) => void;
  pressed: boolean;
  text: string;
}

/**
 * A single weekday button. This component shows the first letter of a
 * weekday and it can be toggled by clicking on it.
 */
function WeekdayButton(props: IWeekdayButton) {
  const { pressed, text, onChange } = props;
  return (
    <Tooltip text={text}>
      <Style.Container pressed={pressed} onClick={() => onChange(!pressed)}>
        {text[0]}
      </Style.Container>
    </Tooltip>
  );
}

export default WeekdayButton;
