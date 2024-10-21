import * as Style from "./InputRadio.style";

/**
 * Props.
 */
interface IInputRadioProps {
  /**
   * Options.
   */
  options: any[];
  /**
   * Selected value.
   */
  value: string;
  /**
   * If this component should stretch with flex to fill remaining space.
   */
  stretch?: boolean;
  /**
   * Called when the user selects a new value.
   */
  onChange: (value: string) => void;
}

/**
 */
function InputRadio(props: IInputRadioProps) {
  const { options, value, stretch, onChange } = props;

  /**
   * Renders a single item.
   */
  const renderItem = (item: any) => {
    const selected = value === item.value;
    return (
      <Style.Item
        onClick={() => onChange(item.value)}
        stretch={stretch}
        key={item.value}
        className="item"
        selected={selected}
      >
        {item.label}
      </Style.Item>
    );
  };

  return <Style.Container stretch={stretch}>{options.map(renderItem)}</Style.Container>;
}

export default InputRadio;
