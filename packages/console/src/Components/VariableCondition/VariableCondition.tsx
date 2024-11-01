/* eslint-disable id-denylist */
import Input from "../Input/Input.tsx";
import RowManipulator from "../RowManipulator/RowManipulator.tsx";
import Select from "../Select/Select.tsx";
import Tooltip from "../Tooltip/Tooltip.tsx";
import * as Style from "./VariableCondition.style";

/**
 * Props.
 */
interface ICondition {
  variable?: string;
  value?: string;
  second_value?: string;
  is?: "<" | ">" | "=" | "!" | "><" | "*";
  value_type?: "string" | "number" | "boolean";
}

/**
 * Props.
 */
interface IVariableCondition {
  data: ICondition[];
  name?: string;
  errors?: any;
  onChange: (data: ICondition[]) => void;
}

/**
 * Renders the conditions of variables.
 */
function VariableCondition(props: IVariableCondition) {
  const { errors, data, onChange } = props;

  /**
   * Changes a condition's value.
   */
  const onChangeItem = (
    item: ICondition,
    field: keyof ICondition,
    value: any,
  ) => {
    item[field] = value;
    onChange([...data]);
  };

  /**
   * Adds a condition.
   */
  const addItem = () => {
    data.push({});
    props.onChange([...data]);
  };

  /**
   * Removes a condition.
   */
  const removeItem = (index: number) => {
    data.splice(index, 1);
    props.onChange([...data]);
  };

  /**
   */
  const renderInput = (item: ICondition, index: number) => {
    item.variable = item.variable || "";
    const error = errors?.[index];
    return (
      <Input
        value={item.variable}
        onChange={(e) => onChangeItem(item, "variable", e.target.value)}
        placeholder="type the variable here"
        error={error?.variable}
      />
    );
  };

  /**
   * Renders a value field (value or second value)
   */
  const renderValue = (
    item: ICondition,
    field: keyof ICondition,
    error: any,
  ) => {
    return (
      <Input
        value={item[field] || ""}
        onChange={(e) => onChangeItem(item, field, e.target.value)}
        error={error?.[field]}
      />
    );
  };

  /**
   * Renders the select for the condition.
   */
  const renderCondition = (item: ICondition, index: number) => {
    item.is = item.is || "<";
    item.value = item.value || "";
    const error = errors?.[index];
    return (
      <Select
        value={item.is}
        onChange={(e) => onChangeItem(item, "is", e.target.value)}
        error={error?.is}
        options={[
          { label: "Less than", value: "<" },
          { label: "Greater than", value: ">" },
          { label: "Equal to", value: "=" },
          { label: "Different from", value: "!" },
          { label: "Between", value: "><" },
          { label: "Anything", value: "*" },
        ]}
      />
    );
  };

  /**
   * Changes the value type of the condition.
   */
  const onClickFieldType = (item: ICondition) => {
    if (item.value_type === "boolean") {
      onChangeItem(item, "value_type", "string");
    } else if (item.value_type === "string") {
      onChangeItem(item, "value_type", "number");
    } else if (item.value_type === "number") {
      onChangeItem(item, "value_type", "boolean");
    }
  };

  /**
   * Renders the value type.
   */
  const renderValueType = (item: ICondition) => {
    const fieldTypeNames = {
      string: "str",
      number: "num",
      boolean: "bool",
    };
    const fieldTypeColors = {
      string: "#1f828c",
      number: "#c031da",
      boolean: "green",
    };

    item.value_type = item.value_type || "string";

    const text = fieldTypeNames[item.value_type as keyof typeof fieldTypeNames];
    const color =
      fieldTypeColors[item.value_type as keyof typeof fieldTypeNames];

    return (
      <Tooltip text={`This row will be compared as a ${item.value_type}`}>
        <Style.FieldType color={color} onClick={() => onClickFieldType(item)}>
          {text}
        </Style.FieldType>
      </Tooltip>
    );
  };

  /**
   * Renders the whole line.
   */
  const renderItem = (item: ICondition, index: number) => {
    return (
      <>
        <div className="input-container">{renderInput(item, index)}</div>
        <div className="space" />
        <span className="text">is</span>
        <div className="space" />
        <div className="condition-container">
          {renderCondition(item, index)}
          {item.is !== "*" && renderValue(item, "value", errors?.[index])}
          {item.is === "><" && (
            <>
              <div className="space" />
              <span className="text">and</span>
              <div className="space" />
              {renderValue(item, "second_value", errors?.[index])}
            </>
          )}
          {item.is !== "*" && renderValueType(item)}
        </div>
        <div className="space" />
      </>
    );
  };

  return (
    <Style.Container>
      <RowManipulator
        onAddItem={addItem}
        onRemoveItem={removeItem}
        data={data}
        onRenderItem={renderItem}
      />
    </Style.Container>
  );
}

export default VariableCondition;
