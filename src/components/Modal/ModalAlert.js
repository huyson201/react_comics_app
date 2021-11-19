import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import './model.css'

const ModalAlert = ({ handleSubmit, checkShow, handleClose }) => {
  return (
    <>
      <Modal show={checkShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bạn có chắc chắc muốn xóa ?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>You will not be able to recover this item!</Modal.Body> */}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAlert;
