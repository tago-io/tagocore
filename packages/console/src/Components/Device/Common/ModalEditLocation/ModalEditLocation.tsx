import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import editDeviceData from "../../../../Requests/editDeviceData.ts";
import { Col, FormGroup, Input, Modal, Row } from "../../../../index.ts";
import { EIcon } from "../../../Icon/Icon.types";

interface ModalEditLocationProps {
  device: IDevice;
  data: IDeviceData;
  onClose: () => void;
}

export function ModalEditLocation(props: ModalEditLocationProps) {
  const { data, device, onClose } = props;

  const [lat, setLat] = useState(() => data.location?.coordinates?.[1] || "");
  const [lng, setLng] = useState(() => data.location?.coordinates?.[0] || "");

  const confirm = useCallback(async () => {
    data.location = {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    };
    await editDeviceData(device.id, data);
  }, [lat, lng, device?.id, data]);

  return (
    <Modal
      onClose={onClose}
      onCancel={onClose}
      onConfirm={confirm}
      title="Edit location"
      width="550px"
      isConfirmButtonDisabled={!lat || !lng}
    >
      <Row>
        <Col size="6">
          <FormGroup
            addMarginBottom={false}
            icon={EIcon.cube}
            tooltip="Insert the latitude for this data item"
            label="Latitude"
          >
            <Input
              autoFocus
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              placeholder="Enter the latitude for the data item"
            />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormGroup
            addMarginBottom={false}
            icon={EIcon.cube}
            tooltip="Insert the longitude for this data item"
            label="Longitude"
          >
            <Input
              autoFocus
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              placeholder="Enter the longitude for the data item"
            />
          </FormGroup>
        </Col>
      </Row>
    </Modal>
  );
}
