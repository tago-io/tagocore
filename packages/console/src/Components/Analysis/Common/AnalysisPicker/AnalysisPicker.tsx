import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import getAnalysisInfo from "../../../../Requests/getAnalysisInfo.ts";
import getAnalysisList from "../../../../Requests/getAnalysisList.ts";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker.tsx";

interface IAnalysisPicker {
  /** Selected Analysis object. */
  value: IAnalysis | undefined;
  /**
   * Position of the options container.
   *
   * @default "bottom"
   */
  optionsPosition?: "top" | "bottom";
  error?: boolean;
  onChange: (value: IAnalysis) => void;
}

function AnalysisPicker(props: IAnalysisPicker) {
  const { error, optionsPosition } = props;

  const onGetOptions = useCallback(async (query: string, page: number) => {
    const result = await getAnalysisList(page, 20, { name: `*${query}*` });
    return result;
  }, []);

  const resolveOptionByID = useCallback(async (id: string | number) => {
    const analysis = await getAnalysisInfo(id as TGenericID);
    return analysis;
  }, []);

  const renderOption = useCallback((analysis: IAnalysis) => {
    return analysis.name;
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
