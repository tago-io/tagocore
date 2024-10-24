import type { IAnalysis } from "@tago-io/tcore-sdk/types";
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
import Modal from "../../../Modal/Modal.tsx";
import RelativeDate from "../../../RelativeDate/RelativeDate.tsx";
import Row from "../../../Row/Row.tsx";

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
  const navigate = useNavigate();
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
      navigate("/console/analysis");
    }
  }, [navigate, deleted]);

  return (
    <div>
      <FormDivision
        icon={EIcon["plus-circle"]}
        title="More about this Analysis"
      />

      <Row>
        <Col size="6">
          <FormGroup icon={EIcon["floppy-disk"]} label="Analysis ID">
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
            <Button
              onClick={activateModalDelete}
              addIconMargin
              type={EButton.danger}
            >
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
          Do you really want to delete this Analysis? there is no going back
          after this!
        </Modal>
      )}
    </div>
  );
}

export default MoreTab;
