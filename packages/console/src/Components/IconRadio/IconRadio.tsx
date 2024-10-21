import Icon from "../Icon/Icon.tsx";
import type { IIconRadioOption } from "./IconRadio.types";
import * as Style from "./IconRadio.style";

/**
 * Props.
 */
interface IIconRadioProps {
  /**
   * Value currently selected.
   */
  value: string;
  /**
   * Options in the list.
   * Each option here will be rendered as a selectable input option.
   */
  options: IIconRadioOption[];
  /**
   * Called when the value changes.
   */
  onChange: (value: string) => void;
}

/**
 * This component shows a list of inputs with type="radio".
 * For each option, a big icon, a title and a description will be rendered.
 */
function IconRadio(props: IIconRadioProps) {
  const { value, onChange, options } = props;

  /**
   * Renders a single option in the list.
   */
  const renderOption = (option: IIconRadioOption) => {
    const checked = value === option.value;
    return (
      <Style.Option
        onClick={() => onChange(option.value)}
        color={option.color}
        disabled={option.disabled}
        key={option.value}
        data-testid={`option-${option.value}`}
      >
        <input value={props.value} checked={checked} readOnly type="radio" />

        <div className="content">
          <Icon icon={option.icon} size="30px" color={option.color} />
          <div className="info">
            <div className="title">{option.label}</div>
            <div className="description">{option.description}</div>
          </div>
        </div>
      </Style.Option>
    );
  };

  return <Style.Container>{options.map(renderOption)}</Style.Container>;
}

export default IconRadio;
