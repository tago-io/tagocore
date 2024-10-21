import type { IAnalysis } from "@tago-io/tcore-sdk/types";
import AnalysisPicker from "../../../Analysis/Common/AnalysisPicker/AnalysisPicker.tsx";
import RowManipulator from "../../../RowManipulator/RowManipulator.tsx";

/**
 * Single item in the list.
 */
type IAnalysisItem = IAnalysis | null;

/**
 * Props.
 */
interface IMultipleAnalysis {
  /**
   * Value for the list.
   */
  data: IAnalysisItem[];
  /**
   * Called when a list item changes.
   */
  onChange: (data: IAnalysisItem[]) => void;
  /**
   * Error of the fields.
   */
  errors?: boolean[];
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

function MultipleAnalysis(props: IMultipleAnalysis) {
  const { data, errors, optionsPosition, onChange } = props;

  const addItem = () => {
    data.push(null);
    onChange([...data]);
  };

  const removeItem = (index: number) => {
    data.splice(index, 1);
    onChange([...data]);
  };

  const renderItem = (item: IAnalysisItem, index: number) => {
    return (
      <div style={{ flex: "1", marginRight: "10px" }}>
        <AnalysisPicker
          value={item as IAnalysis}
          error={errors?.[index]}
          optionsPosition={optionsPosition}
          onChange={(e: IAnalysis) => {
            data[index] = e;
            onChange([...data]);
          }}
        />
      </div>
    );
  };

  return (
    <RowManipulator
      data={data}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onRenderItem={renderItem}
    />
  );
}

export default MultipleAnalysis;
