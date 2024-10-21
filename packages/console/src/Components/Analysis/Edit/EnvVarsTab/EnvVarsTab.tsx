import type { IAnalysis, IAnalysisVariable } from "@tago-io/tcore-sdk/types";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import RowManipulatorTable from "../../../RowManipulatorTable/RowManipulatorTable.tsx";

/**
 * Props.
 */
interface IEnvVarsTabProps {
  data: IAnalysis;
  onChange: (field: keyof IAnalysis, value: IAnalysisVariable[]) => void;
}

/**
 * The analysis' `Environment Variables` tab.
 */
function EnvVarsTab(props: IEnvVarsTabProps) {
  const { data, onChange } = props;
  const parameters = data.variables || [];

  /**
   * Called when a field gets modified.
   */
  const onChangeField = (field: keyof IAnalysisVariable, value: string, rowIndex: number) => {
    if (!parameters[rowIndex]) {
      parameters[rowIndex] = { key: "", value: "" }; // create the item if it doesn't exist
    }
    parameters[rowIndex][field] = value;
    onChange("variables", [...parameters]);
  };

  /**
   * Renders the key of the variable.
   */
  const renderKey = (item: IAnalysisVariable, index: number) => {
    return (
      <Input
        value={item.key || ""}
        onChange={(e) => onChangeField("key", e.target.value, index)}
        placeholder="Enter the variable key (unique)"
      />
    );
  };

  /**
   * Renders the value input.
   */
  const renderValue = (item: IAnalysisVariable, index: number) => {
    return (
      <Input
        value={item.value || ""}
        onChange={(e) => onChangeField("value", e.target.value, index)}
        placeholder="Enter the variable value"
      />
    );
  };

  /**
   * Adds a single row.
   */
  const addItem = () => {
    parameters.push({ key: "", value: "" });
    onChange("variables", [...parameters]);
  };

  /**
   * Removes a single row.
   */
  const removeItem = (index: number) => {
    parameters.splice(index, 1);
    onChange("variables", [...parameters]);
  };

  return (
    <div>
      <FormDivision
        icon={EIcon.list}
        title="Environment Variables"
        description="Use environment variables to change how your code behaves. You can access them using the context.environment global variable."
      />

      <RowManipulatorTable<IAnalysisVariable>
        data={parameters}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        columns={[
          {
            label: "Key",
            tooltip: "The variable identifier",
            onRender: renderKey,
          },
          {
            label: "Value",
            tooltip: "The value of the variable",
            onRender: renderValue,
          },
        ]}
      />
    </div>
  );
}

export default EnvVarsTab;
