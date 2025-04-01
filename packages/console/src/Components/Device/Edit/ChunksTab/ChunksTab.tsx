import type { IDevice } from "@tago-io/tcore-sdk/types";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import RelativeDate from "../../../RelativeDate/RelativeDate.tsx";
import Row from "../../../Row/Row.tsx";
import DataRetention from "../../Common/DataRetention/DataRetention.tsx";

interface ChunksTabProps {
  data: IDevice;
  errors: any;
  onChange: (field: keyof IDevice, value: IDevice[keyof IDevice]) => void;
}

export function ChunksTab(props: ChunksTabProps) {
  const { data, errors, onChange } = props;

  return (
    <div>
      <FormDivision
        icon={EIcon["plus-circle"]}
        title="Chunks"
        description="Data is stored in chunks according to period in Immutable Devices."
      />

      <Row>
        <Col size="6">
          <FormGroup icon={EIcon["floppy-disk"]} label="Device ID">
            <Input disabled readOnly value={data.id} />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormGroup icon={EIcon.clock} label="Registered at">
            <RelativeDate useInputStyle value={data.created_at} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col size="12">
          {data.type === "immutable" && data.chunk_period && (
            <DataRetention
              type="edit"
              disablePeriod
              data={data}
              error={errors?.chunk_retention}
              onChange={onChange}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
