import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { FiX, FiXCircle } from "react-icons/fi";
import { WARN_LOGIN } from "../../constants";
import { useData } from "../../context/Provider";
import { ACTIONS } from "../../context/Action";

const ModalNotify = (props) => {
  const { dispatch, show, error, message } = useData();
  // const [show, setShow] = useState();
  // const [message, setMessage] = useState();
  // const [error, setError] = useState();
  // const [idComic, setIdComic] = useState();
  const history = useHistory();
  let path = history.location.pathname;
  console.log(path);

  // useEffect(() => {
  //   setMessage(props.message);
  //   setShow(props.show);
  //   setError(props.error);
  //   // setIdComic(props.idComic);
  // }, [props.message, props.error, props.show]);
  console.log(message);
  const handleClose = () => {
    console.log(error);
    dispatch({
      type: ACTIONS.MODAL_NOTIFY,
      payload: {
        show: false,
        message: null,
        error: null,
      },
    });
    // setShow(false);
    // setError(null);
    // setMessage(null);
    switch (path) {
      case "/login":
        if (error) {
          history.push("/login");
        } else {
          history.push("/");
        }
        break;
      case "/register":
        if (!error) {
          history.push("/login");
        } else {
          history.push("/register");
        }
        break;
      case "/profile":
        if (error) {
          history.push("/login");
        }
        break;
      case "/changePassword":
        if (error === WARN_LOGIN) {
          history.push("/login");
        }
        break;
      case `/truyen-tranh/${props.name}`:
        if (error === WARN_LOGIN) {
          history.push("/login");
        }
        break;
      default:
        history.push("/");
        break;
    }
  };

  return (
    <Modal show={show} size="sm" dialogClassName="custom-dialog">
      <>
        <Modal.Body>
          {error ? (
            <>
              <FiXCircle className="error" />
              {error}
            </>
          ) : (
            <>
              <i className="far fa-check-circle"></i> {message}
            </>
          )}
          <FiX className="close" onClick={handleClose} />
        </Modal.Body>
      </>
    </Modal>
  );
};

export default ModalNotify;
