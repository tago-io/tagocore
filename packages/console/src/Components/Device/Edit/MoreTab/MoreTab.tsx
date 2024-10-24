import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { IDevice } from "@tago-io/tcore-sdk/types";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";
import RelativeDate from "../../../RelativeDate/RelativeDate.tsx";
import Row from "../../../Row/Row.tsx";

/**
 * Props.
 */
interface IMoreTabProps {
  /**
   * Device's form data.
   */
  data: IDevice;
  /**
   * Called when the device was requested to be deleted.
   */
  onDelete: () => Promise<void>;
}

/**
 * The device's `More` tab.
 */
function MoreTab(props: IMoreTabProps) {
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);
  const [modalDevice, setModalDevice] = useState(false);
  const { data, onDelete } = props;

  /**
   * Confirms the delete request.
   */
  const confirmDelete = useCallback(async () => {
    await onDelete();
    setDeleted(true);
  }, [onDelete]);

  /**
   * Opens the delete device modal.
   */
  const activateModalDevice = useCallback(() => {
    setModalDevice(true);
  }, []);

  /**
   * Closes the delete device modal.
   */
  const deactivateModalDevice = useCallback(() => {
    setModalDevice(false);
  }, []);

  /**
   * Used to transfer the user back to the list page upon deleting the device.
   */
  useEffect(() => {
    if (deleted) {
      navigate("/console/devices");
    }
  }, [navigate, deleted]);

  return (
    <div>
      <FormDivision
        icon={EIcon["plus-circle"]}
        title="More about this Device"
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
        <Col size="6">
          <FormGroup icon={EIcon.clock} label="Last update">
            <RelativeDate useInputStyle value={data.updated_at} />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormGroup
            icon={EIcon["exclamation-triangle"]}
            label="Once you delete a Device, there is no going back."
          >
            <Button
              onClick={activateModalDevice}
              addIconMargin
              type={EButton.danger}
            >
              <Icon icon={EIcon["trash-alt"]} />
              <span>Delete Device</span>
            </Button>
          </FormGroup>
        </Col>
      </Row>

      {modalDevice && (
        <Modal
          confirmButtonText="Yes, delete this Device"
          confirmButtonType={EButton.danger}
          onClose={deactivateModalDevice}
          onConfirm={confirmDelete}
          title="Are you sure?"
        >
          Do you really want to delete this Device? there is no going back after
          this!
        </Modal>
      )}
    </div>
  );
}

export default MoreTab;
