import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import RelativeDate from "../../../RelativeDate/RelativeDate.tsx";
import Row from "../../../Row/Row.tsx";

interface ChunksTabProps {
  data: IDevice;
}

export function ChunksTab(props: ChunksTabProps) {
  const navigate = useNavigate();
  const { data } = props;

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
    </div>
  );
}
