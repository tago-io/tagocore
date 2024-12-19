import type { IDeviceParameter } from "@tago-io/tcore-sdk/types";
import { useTheme } from "styled-components";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import RowManipulatorTable from "../../../RowManipulatorTable/RowManipulatorTable.tsx";
import Switch from "../../../Switch/Switch.tsx";
import { ESwitchSize } from "../../../Switch/Switch.types";

interface IConfigParametersTabProps {
  params?: IDeviceParameter[];
  errors: any;
  onChangeParams: (value: IDeviceParameter[]) => void;
}

function ConfigParametersTab(props: IConfigParametersTabProps) {
  const { errors, onChangeParams } = props;
  const params = props.params || [];
  const theme = useTheme();

  const onChangeField = (
    field: keyof IDeviceParameter,
    value: string | boolean,
    rowIndex: number,
  ) => {
    if (!params[rowIndex]) {
      params[rowIndex] = { key: "", value: "", sent: false } as any; // create the item if it doesn't exist
    }
    (params[rowIndex] as any)[field] = value;
    onChangeParams([...params]);
  };

  const renderStatusSwitch = (item: IDeviceParameter, index: number) => {
    return (
      <div>
        <Switch
          value={!!item.sent || false}
          onChange={(e) => onChangeField("sent", e, index)}
          size={ESwitchSize.big}
          selectedText="Read"
          unselectedText="Unread"
          selectedColor={theme.switchBigSelected}
          unselectedColor={theme.switchBigUnselected}
        />
      </div>
    );
  };

  const renderKeyInput = (item: IDeviceParameter, index: number) => {
    const error = errors?.parameters?.[index]?.key;
    return (
      <Input
        error={error}
        onChange={(e) => onChangeField("key", e.target.value, index)}
        placeholder="Key of the parameter (unique)"
        value={item.key || ""}
      />
    );
  };

  const renderValueInput = (item: IDeviceParameter, index: number) => {
    const error = errors?.parameters?.[index]?.value;
    return (
      <Input
        error={error}
        onChange={(e) => onChangeField("value", e.target.value, index)}
        placeholder="Value of the parameter"
        value={item.value || ""}
      />
    );
  };

  const addItem = () => {
    params.push({ key: "", value: "", sent: false } as any);
    onChangeParams([...params]);
  };

  const removeItem = (index: number) => {
    params.splice(index, 1);
    onChangeParams([...params]);
  };

  return (
    <div>
      <FormDivision
        icon={EIcon.list}
        title="Configuration Parameters"
        description="You can set parameters and retrieve them later by making a request from the device."
      />

      <RowManipulatorTable<IDeviceParameter>
        data={params}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        columns={[
          {
            label: "Status",
            flex: "none",
            width: "105px",
            onRender: renderStatusSwitch,
          },
          {
            label: "Key",
            onRender: renderKeyInput,
          },
          {
            label: "Value",
            onRender: renderValueInput,
          },
        ]}
      />
    </div>
  );
}

export default ConfigParametersTab;
