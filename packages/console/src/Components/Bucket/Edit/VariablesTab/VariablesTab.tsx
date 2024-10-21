import type { IDeviceData, IDevice } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useState } from "react";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Row from "../../../Row/Row.tsx";
import VariablesTable from "../../Common/VariablesTable/VariablesTable.tsx";
import * as Style from "./VariablesTab.style";

/**
 * Props.
 */
interface IVariablesTab {
  /**
   * Device object.
   */
  data: IDevice;
  /**
   */
  onDeleteData: (ids: string[]) => Promise<void>;
  /**
   */
  onReloadDataAmount: () => void;
  /**
   * Data amount in the device's bucket.
   */
  dataAmount: number;
}

/**
 */
function VariablesTab(props: IVariablesTab) {
  const [selectedVariables, setSelectedVariables] = useState<IDeviceData[]>([]);
  const [refetchID, setRefetchID] = useState<number>(0);
  const { data, dataAmount, onDeleteData } = props;

  /**
   * Deletes the selected data.
   */
  const deleteSelectedData = useCallback(async () => {
    const ids = selectedVariables.map((x) => x.id);
    setSelectedVariables([]);
    await onDeleteData(ids);
    setRefetchID(Date.now());
  }, [onDeleteData, selectedVariables]);

  return (
    <>
      <Row>
        <Col size="6">
          <FormDivision
            icon={EIcon.cube}
            title="Variables"
            description="View the most recent variables added to this bucket."
          />
        </Col>

        <Col size="6">
          <Style.Buttons>
            {data.type === "mutable" && (
              <Button
                disabled={selectedVariables.length === 0}
                type={EButton.danger}
                addIconMargin
                style={{ marginRight: "10px" }}
                onClick={deleteSelectedData}
              >
                <Icon icon={EIcon["trash-alt"]} />
                <span>Delete selected</span>
              </Button>
            )}
          </Style.Buttons>
        </Col>
      </Row>

      <VariablesTable
        data={data}
        dataAmount={dataAmount}
        onChangeSelected={setSelectedVariables}
        onReloadDataAmount={props.onReloadDataAmount}
        onReloadTable={() => setRefetchID(Date.now())}
        refetchID={refetchID}
      />
    </>
  );
}

export default memo(VariablesTab);
