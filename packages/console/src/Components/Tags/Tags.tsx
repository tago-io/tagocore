import type { ITag } from "@tago-io/tcore-sdk/types";
import Input from "../Input/Input.tsx";
import RowManipulatorTable from "../RowManipulatorTable/RowManipulatorTable.tsx";

export interface ITags {
  data: ITag[];
  errors?: any;
  onChange: (newData: ITag[]) => void;
  disabled?: boolean;
}

function Tags(props: ITags) {
  const { data, disabled, errors } = props;

  const onChange = (field: keyof ITag, value: string, rowIndex: number) => {
    if (!data[rowIndex]) {
      data[rowIndex] = { key: "", value: "" }; // create the item if it doesn't exist
    }
    data[rowIndex][field] = value;
    props.onChange([...data]);
  };

  const renderKey = (item: ITag, index: number) => {
    const error = errors?.[index]?.key;
    return (
      <Input
        error={error}
        onChange={(e) => onChange("key", e.target.value, index)}
        placeholder="Enter the tag key (unique)"
        value={item.key || ""}
        disabled={disabled}
      />
    );
  };

  const renderValue = (item: ITag, index: number) => {
    const error = errors?.[index]?.value;
    return (
      <Input
        onChange={(e) => onChange("value", e.target.value, index)}
        placeholder="Enter the tag value"
        value={item.value || ""}
        error={error}
        disabled={disabled}
      />
    );
  };

  const addItem = () => {
    props.data.push({ key: "", value: "" });
    props.onChange([...props.data]);
  };

  const removeItem = (index: number) => {
    props.data.splice(index, 1);
    props.onChange([...props.data]);
  };

  return (
    <RowManipulatorTable<ITag>
      data={props.data}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      disabled={disabled}
      columns={[
        {
          label: "Key",
          tooltip: "The tag identifier",
          onRender: renderKey,
        },
        {
          label: "Value",
          tooltip: "The value of the tag",
          onRender: renderValue,
        },
      ]}
    />
  );
}

export default Tags;
