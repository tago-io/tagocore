import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import { useTheme } from "styled-components";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName.ts";
import getDeviceList from "../../../Requests/getDeviceList.ts";
import BooleanStatus from "../../BooleanStatus/BooleanStatus.tsx";
import Button from "../../Button/Button.tsx";
import { EButton } from "../../Button/Button.types";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import ListPage from "../../ListPage/ListPage.tsx";
import RelativeDate from "../../RelativeDate/RelativeDate.tsx";
import DeviceInputOutput from "../Common/DeviceInputOutput.tsx";
import ModalAddDevice from "../Common/ModalAddDevice/ModalAddDevice.tsx";

/**
 * The device's list page.
 */
function DeviceList() {
  const [modalAdd, setModalAdd] = useState(false);
  const theme = useTheme();

  /**
   * Opens the add modal.
   */
  const activateModalAdd = useCallback(() => {
    setModalAdd(true);
  }, []);

  /**
   * Closes the add modal.
   */
  const deactivateModalAdd = useCallback(() => {
    setModalAdd(false);
  }, []);

  return (
    <>
      <ListPage<IDevice>
        color={theme.device}
        description="Devices are the link between external things and the buckets in your account."
        icon={EIcon.device}
        path="devices"
        innerNavTitle="Devices"
        documentTitle="Devices"
        onGetData={getDeviceList}
        summaryKey="device"
        columns={[
          {
            id: "name",
            label: "Name",
            onRender: (item) => item.name,
            type: "text",
          },
          {
            id: "last_input",
            label: "Last Input",
            onRender: (item) => <DeviceInputOutput value={item.last_input} />,
            type: "date",
          },
          {
            id: "last_output",
            label: "Last Output",
            onRender: (item) => <DeviceInputOutput value={item.last_output} />,
            type: "date",
          },
          {
            id: "type",
            label: "Type",
            onRender: (item) => getDeviceTypeName(item.type),
            filterDisabled: true,
            flex: "none",
            width: 250,
          },
          {
            flex: "none",
            id: "active",
            label: "Active",
            onRender: (item) => <BooleanStatus value={item.active} />,
            type: "boolean",
            width: 100,
          },
          {
            id: "created_at",
            label: "Created at",
            onRender: (item) => <RelativeDate value={item.created_at} />,
            type: "date",
          },
        ]}
      >
        <Button
          onClick={activateModalAdd}
          addIconMargin
          type={EButton.primary}
          color={theme.device}
        >
          <Icon icon={EIcon.plus} />
          <span>Add Device</span>
        </Button>
      </ListPage>

      {modalAdd && <ModalAddDevice onClose={deactivateModalAdd} />}
    </>
  );
}

export default DeviceList;
