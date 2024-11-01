import type { ITag } from "@tago-io/tcore-sdk/types";
import Accordion from "../Accordion/Accordion.tsx";
import type { EIcon } from "../Icon/Icon.types";
import RowManipulator from "../RowManipulator/RowManipulator.tsx";
import Select, { type ISelectOption } from "../Select/Select.tsx";

/**
 * Props.
 */
interface IOptionList {
  title?: string;
  description?: string;
  icon?: EIcon;
  value: ITag[];
  optionsKey: ISelectOption[];
  optionsValue: ISelectOption[];
  onChange: (value: ITag[]) => void;
  errors?: any;
}

/**
 * A Row manipulator of options.
 */
function OptionList(props: IOptionList) {
  const { title, description, icon, value, errors, onChange } = props;

  /**
   * Called when an item changes.
   */
  const onChangeItem = (index: number, type: string, e: string) => {
    value[index] = {
      ...value[index],
      [type]: e,
    };
    onChange([...value]);
  };

  /**
   * Adds a row.
   */
  const addItem = () => {
    value.push({ key: "", value: "" });
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
      <>
        <Select
          onChange={(e) => onChangeItem(index, "key", e.target.value)}
          value={item?.key}
          style={{ marginRight: "5px" }}
          error={errors?.[index]?.key}
          options={[
            { label: "Select an option", value: "", disabled: true },
            ...props.optionsKey,
          ]}
        />
        <Select
          onChange={(e) => onChangeItem(index, "value", e.target.value)}
          value={item?.value}
          style={{ marginRight: "5px" }}
          error={errors?.[index]?.value}
          options={[
            { label: "Select an option", value: "", disabled: true },
            ...props.optionsValue,
          ]}
        />
      </>
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
    <Accordion
      isAlwaysOpen
      icon={icon}
      description={description}
      title={title}
      open
    >
      {content}
    </Accordion>
  );
}

export default OptionList;
