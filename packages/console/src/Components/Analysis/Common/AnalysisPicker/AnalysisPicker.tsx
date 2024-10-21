import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import getAnalysisInfo from "../../../../Requests/getAnalysisInfo.ts";
import getAnalysisList from "../../../../Requests/getAnalysisList.ts";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker.tsx";

/**
 * Props.
 */
interface IAnalysisPicker {
  /**
   * Device object.
   */
  value: IAnalysis | undefined;
  /**
   * Called when a new device gets picked.
   */
  onChange: (value: IAnalysis) => void;
  /**
   * Indicates if the this field has an error.
   */
  error?: boolean;
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 */
function AnalysisPicker(props: IAnalysisPicker) {
  const { error, optionsPosition } = props;

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback(async (query: string, page: number) => {
    const result = await getAnalysisList(page, 20, { name: `*${query}*` });
    return result;
  }, []);

  /**
   * Resolves an option by an ID.
   * This transforms the ID into an object.
   */
  const resolveOptionByID = useCallback(async (id: string | number) => {
    const analysis = await getAnalysisInfo(id as TGenericID);
    return analysis;
  }, []);

  /**
   * Renders a single option row.
   */
  const renderOption = useCallback((i) => {
    return i.name;
  }, []);

  return (
    <OptionsPicker<IAnalysis>
      doesRequest
      error={error}
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      placeholder="Select an analysis"
      optionsPosition={optionsPosition}
      value={props.value}
    />
  );
}

export default AnalysisPicker;
