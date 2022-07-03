import { IDevice } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import Col from "../../../Col/Col";
import FormDivision from "../../../FormDivision/FormDivision";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Button from "../../../Button/Button";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import Row from "../../../Row/Row";
import { EButton, Icon } from "../../../..";
import ModalEmptyDevice from "../../Common/ModalEmptyDevice/ModalEmptyDevice";
import { formatDataAmount } from "../../../../Helpers/formatDataAmount";

/**
 * Props.
 */
interface IMoreTabProps {
  /**
   * Form data.
   */
  data: IDevice;
  /**
   * How much data is in this bucket.
   */
  dataAmount?: number;
  /**
   * Called when the user wants to empty the bucket.
   */
  onEmptyBucket: () => Promise<void>;
}

/**
 * The bucket's `More` tab.
 */
function MoreTab(props: IMoreTabProps) {
  const [modalEmpty, setModalEmpty] = useState(false);
  const { data, onEmptyBucket, dataAmount } = props;

  /**
   * Opens the empty modal.
   */
  const activateModalEmpty = useCallback(() => {
    setModalEmpty(true);
  }, []);

  /**
   * Closes the Empty modal.
   */
  const deactivateModalEmpty = useCallback(() => {
    setModalEmpty(false);
  }, []);

  return (
    <div>
      <FormDivision icon={EIcon["plus-circle"]} title="More about this Bucket" />

      <Row>
        <Col size="6">
          <FormGroup icon={EIcon["floppy-disk"]} label="Bucket ID">
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
          <FormGroup icon={EIcon.hashtag} label="Amount of data records">
            <Input disabled readOnly value={formatDataAmount(dataAmount || 0)} />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormGroup icon={EIcon.clock} label="Last update">
            <RelativeDate useInputStyle value={data.updated_at} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col size="6" />
        <Col size="6">
          <Button
            disabled={dataAmount === 0}
            addIconMargin
            type={EButton.warning}
            onClick={activateModalEmpty}
          >
            <Icon icon={EIcon.ban} />
            <span>Empty Bucket</span>
          </Button>
        </Col>
      </Row>

      {modalEmpty && <ModalEmptyDevice onClose={deactivateModalEmpty} onConfirm={onEmptyBucket} />}
    </div>
  );
}

export default MoreTab;
