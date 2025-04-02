import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useState } from "react";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Row from "../../../Row/Row.tsx";
import { VariablesTable } from "../../Common/VariablesTable/VariablesTable.tsx";
import { DataOptionsButton } from "./DataOptionsButton/DataOptionsButton.tsx";
import * as Style from "./DataTab.style";

interface DataTabProps {
  data: IDevice;
  onDeleteData: (ids: string[]) => Promise<void>;
  onReloadDataAmount: () => void;
  dataAmount: number;
}

function DataTab(props: DataTabProps) {
  const [selectedVariables, setSelectedVariables] = useState<IDeviceData[]>([]);
  const [refetchID, setRefetchID] = useState<number>(0);
  const { data, dataAmount, onDeleteData } = props;

  const deleteSelectedData = useCallback(async () => {
    const ids = selectedVariables.map((x) => x.id);
    setSelectedVariables([]);
    await onDeleteData(ids);
    setRefetchID(Date.now());
  }, [onDeleteData, selectedVariables]);

  const refreshData = useCallback(() => {
    setRefetchID(Date.now());
  }, []);

  return (
    <>
      <Row>
        <Col size="6">
          <FormDivision
            icon={EIcon.cube}
            title="Variables"
            description="View the data records stored in this device's bucket."
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

            <DataOptionsButton device={data} onRefreshData={refreshData} />
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

export default memo(DataTab);
