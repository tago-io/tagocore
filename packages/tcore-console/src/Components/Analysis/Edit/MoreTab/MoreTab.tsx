import { IAnalysis } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Button from "../../../Button/Button";
import { EButton } from "../../../Button/Button.types";
import Col from "../../../Col/Col";
import FormDivision from "../../../FormDivision/FormDivision";
import FormGroup from "../../../FormGroup/FormGroup";
import Icon from "../../../Icon/Icon";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Modal from "../../../Modal/Modal";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import Row from "../../../Row/Row";

/**
 * Props.
 */
interface IMoreTabProps {
  /**
   * Analysis' form data
   */
  data: IAnalysis;
  /**
   * Called when the analysis was requested to be deleted.
   */
  onDelete: () => Promise<void>;
}

/**
 */
function MoreTab(props: IMoreTabProps) {
  const history = useHistory();
  const { data, onDelete } = props;
  const [modalDelete, setModalDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  /**
   * Confirms the delete request.
   */
  const confirmDelete = useCallback(async () => {
    await onDelete();
    setDeleted(true);
  }, [onDelete]);

  /**
   * Opens the delete modal.
   */
  const activateModalDelete = useCallback(() => {
    setModalDelete(true);
  }, []);

  /**
   * Closes the delete modal.
   */
  const deactivateModalDelete = useCallback(() => {
    setModalDelete(false);
  }, []);

  /**
   * Used to transfer the user back to the list page upon deleting the analysis.
   */
  useEffect(() => {
    if (deleted) {
      history.push("/console/analysis");
    }
  }, [history, deleted]);

  return (
    <div>
      <FormDivision icon={EIcon["plus-circle"]} title="More about this Analysis" />

      <Row>
        <Col size="6">
          <FormGroup icon={EIcon.save} label="Analysis ID">
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
          <FormGroup icon={EIcon.clock} label="Last run">
            <RelativeDate useInputStyle value={data.last_run} />
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
          <FormGroup
            icon={EIcon["exclamation-triangle"]}
            label="Once you delete an Analysis, there is no going back."
          >
            <Button onClick={activateModalDelete} addIconMargin type={EButton.danger}>
              <Icon icon={EIcon["trash-alt"]} />
              <span>Delete analysis</span>
            </Button>
          </FormGroup>
        </Col>
      </Row>

      {modalDelete && (
        <Modal
          confirmButtonText="Yes, delete this Analysis"
          confirmButtonType={EButton.danger}
          onClose={deactivateModalDelete}
          onConfirm={confirmDelete}
          title="Are you sure?"
        >
          Do you really want to delete this Analysis? there is no going back after this!
        </Modal>
      )}
    </div>
  );
}

export default MoreTab;
