import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";

/**
 * Props.
 */
interface IBooleanStatusProps {
  value?: boolean;
}

/**
 * Renders a ball and a text by its side.
 * - If `value` is true then the ball will be green and the text will say Yes.
 * - If `value` is false, then the ball will be red and the text will say No.
 */
function BooleanStatus(props: IBooleanStatusProps) {
  const { value } = props;
  return (
    <>
      <Icon icon={EIcon.circle} size="10px" color={value ? "green" : "red"} />
      <span>&nbsp;{value ? "Yes" : "No"}</span>
    </>
  );
}

export default BooleanStatus;
