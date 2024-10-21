import type { IPluginClassListItem } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useState } from "react";
import Modal from "../../../Modal/Modal.tsx";
import * as Style from "./ModalAddEncoder.style";

/**
 * Props.
 */
interface IModalAddEncoder {
  /**
   * List of options that will be rendered.
   */
  list: IPluginClassListItem[];
  /**
   * Called to close this modal.
   */
  onClose: () => void;
  /**
   * Called when the confirm is pressed, the parameter will contain an
   * array of `pluginID:setupID` for each selected option in the list.
   */
  onConfirm: (selectedIDs: string[]) => void;
}

/**
 * Modal to select encoder modules.
 */
function ModalAddEncoder(props: IModalAddEncoder) {
  const [items, setItems] = useState<string[]>([]);
  const { list, onClose, onConfirm } = props;

  /**
   * Confirms the choices and exits out of the modal.
   */
  const confirm = () => {
    onConfirm(items);
  };

  /**
   * Toggles the checkbox/selected status of an item.
   */
  const toggle = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (items.includes(id)) {
        const index = items.indexOf(id);
        items.splice(index, 1);
      } else {
        items.push(id);
      }
      setItems([...items]);
    },
    [items]
  );

  /**
   * Renders a single item.
   */
  const renderItem = useCallback(
    (item: IPluginClassListItem, i: number) => {
      const id = `${item.pluginID}:${item.setupID}`;
      return (
        <Style.Item key={id} onClick={(e) => toggle(e, id)}>
          <div className="icon-container">
            <input type="checkbox" checked={items.includes(id)} readOnly />
          </div>

          <span className="data">
            <span className="index">{i + 1}. </span>
            <div className="texts">
              <div className="title">{item?.setupName}</div>
              <span className="description">{item?.pluginName}</span>
            </div>
          </span>
        </Style.Item>
      );
    },
    [toggle, items]
  );

  return (
    <Modal onClose={onClose} onConfirm={confirm} width="500px" title="Add Encoder to Stack">
      <Style.Container>{list.map(renderItem)}</Style.Container>
    </Modal>
  );
}

export default memo(ModalAddEncoder);
