import { type ChangeEvent, type ReactNode, memo } from "react";
import * as Style from "./Checkbox.style";

interface ICheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

/**
 */
function Checkbox(props: ICheckboxProps) {
  const { checked, onChange, children } = props;

  return (
    <Style.Container>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {children && <div>{children}</div>}
    </Style.Container>
  );
}

export default memo(Checkbox);
