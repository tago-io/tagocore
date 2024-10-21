import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTheme } from "styled-components";
import { type IDevice, zDeviceCreate } from "@tago-io/tcore-sdk/types";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";
import BucketTypePicker from "../DeviceTypePicker/DeviceTypePicker.tsx";
import createDevice from "../../../../Requests/createDevice.ts";
import DataRetention from "../../../Bucket/Common/DataRetention/DataRetention.tsx";
import buildZodError from "../../../../Validation/buildZodError.ts";

/**
 * Props.
 */
interface IModalAddDeviceProps {
  onClose: () => void;
}

/**
 * The device's wizard modal.
 */
function ModalAddDevice(props: IModalAddDeviceProps) {
  const [data, setData] = useState<any>({
    name: "",
    type: "immutable",
    chunk_retention: "",
    chunk_period: "",
  });
  const [newID, setNewID] = useState("");
  const [errors, setErrors] = useState<any>({});
  const history = useHistory();
  const theme = useTheme();

  const { onClose } = props;

  /**
   */
  const onChange = useCallback(
    (field: keyof IDevice, value: IDevice[keyof IDevice]) => {
      setData({ ...data, [field]: value });
    },
    [data]
  );

  /**
   * Validates the data of the device.
   */
  const validate = useCallback(async () => {
    try {
      const formatted = {
        ...data,
        type: data.type?.id || data.type,
      };

      if (!formatted.type) {
        setErrors({ type: true });
        return;
      }

      if (formatted.type !== "immutable") {
        formatted.chunk_period = undefined;
        formatted.chunk_retention = undefined;
      }

      await zDeviceCreate.parseAsync(formatted);
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      setErrors(err);
      return false;
    }

    return true;
  }, [data]);

  /**
   * Creates the device.
   */
  const doRequest = useCallback(async () => {
    const formatted = {
      ...data,
      type: data.type?.id || data.type,
    };

    if (formatted.type !== "immutable") {
      formatted.chunk_period = undefined;
      formatted.chunk_retention = undefined;
    }

    const response = await createDevice(formatted);
    setNewID(response.device_id);
  }, [data]);

  /**
   * Called when the confirm button is pressed.
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      if (await validate()) {
        await doRequest();
      }
      e?.preventDefault();
    },
    [doRequest, validate]
  );

  /**
   * Used to transfer the user to the newly created device.
   */
  useEffect(() => {
    if (newID) {
      history.push(`/console/devices/${newID}`);
    }
  }, [history, newID]);

  return (
    <Modal
      color={theme.device}
      icon={EIcon.device}
      onClose={onClose}
      onConfirm={confirm}
      title="Add Device"
      width="650px"
    >
      <FormGroup label="Name" icon={EIcon.device}>
        <Input
          autoFocus
          error={errors?.name}
          errorMessage="This field requires at least 3 characters"
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter a name for this device"
          value={data.name}
        />
      </FormGroup>

      <FormGroup label="Type" icon={EIcon.cog}>
        <BucketTypePicker
          onChange={(e) => onChange("type", e)}
          value={data.type}
          error={errors?.type}
        />
      </FormGroup>

      <DataRetention
        type="create"
        error={errors?.chunk_retention || errors?.chunk_period}
        data={{ ...data, type: data.type?.id || data.type }}
        onChange={onChange}
      />
    </Modal>
  );
}

export default ModalAddDevice;
