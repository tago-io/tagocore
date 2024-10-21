import Accordion from "../Accordion/Accordion.tsx";
import type { EIcon } from "../Icon/Icon.types";
import Input from "../Input/Input.tsx";
import RowManipulator from "../RowManipulator/RowManipulator.tsx";

/**
 * Props.
 */
interface IInputList {
  title?: string;
  description?: string;
  icon?: EIcon;
  value: string[];
  onChange: (value: string[]) => void;
  errors?: any;
  placeholder?: string;
}

/**
 * A Row manipulator of inputs.
 */
function InputList(props: IInputList) {
  const { title, description, placeholder, icon, value, errors, onChange } = props;

  /**
   * Called when an item changes.
   */
  const onChangeItem = (index: number, e: string) => {
    value[index] = e;
    onChange([...value]);
  };

  /**
   * Adds a row.
   */
  const addItem = () => {
    value.push("");
    onChange([...value]);
  };

  /**
   * Removes a row.
   */
  const removeItem = (index: number) => {
    value.splice(index, 1);
    onChange([...value]);
  };

  /**
   * Renders the input.
   */
  const renderInput = (item: any, index: number) => {
    return (
      <Input
        onChange={(e) => onChangeItem(index, e.target.value)}
        placeholder={placeholder || "enter the value for this row"}
        value={item}
        style={{ marginRight: "5px" }}
        error={errors?.[index]}
      />
    );
  };

  // main content, may or may not be encapsulated by an accordion.
  const content = (
    <RowManipulator
      data={value}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onRenderItem={renderInput}
    />
  );

  if (!title) {
    return content;
  }

  return (
    <Accordion isAlwaysOpen icon={icon} description={description} title={title} open>
      {content}
    </Accordion>
  );
}

export default InputList;
