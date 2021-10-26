import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { RESET_PW_TITLE } from "../constants";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "react-loader-spinner";

const clientReCaptchaKey = "6LfKoOccAAAAAI7uwBd4rQHrMM4Dtl_CPsQZ64Ge";
const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [disable, setDisable] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [msgError, setMsgError] = useState("");

  const handlePressEmail = (e) => {
    let value = e.target.value;
    setEmail(value);
  };

  const handleChangeReCaptcha = (e) => {
    setDisable(!disable);
  };

  const handleSubmit = async (e) => {
    setShowLoader(true);
    setMsgError("");
    e.preventDefault();

    try {
      let res = await axiosClient.post("/forget-password", {
        user_email: email,
      });
      console.log(res);

      if (res.data.data) {
        setSendEmail(true);
      }

      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      setMsgError(error.response.data);
    }
  };

  let loader = <Loader type="Puff" color="#212529" height={40} width={40} />;
  if (sendEmail) {
    return (
      <>
        <div className="reset-pw-wrapper">
          <div className="alert-reset-pw">
            <Alert variant="success">
              Email đã được gởi đến {email} Vui lòng kiểm tra email để tiếp tục
              bước tiếp theo.
            </Alert>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="reset-pw-wrapper">
        <Form className="reset-pw-form" onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>{RESET_PW_TITLE}</FormLabel>
            <Form.Control
              required
              type="email"
              placeholder="Nhập email ..."
              onChange={handlePressEmail}
            />
          </FormGroup>
          {msgError !== "" && <div className="feedback">{msgError}</div>}
          <FormGroup>
            <ReCAPTCHA
              sitekey={clientReCaptchaKey}
              onChange={handleChangeReCaptcha}
              size="normal"
              badge="inline"
            />
          </FormGroup>
          {showLoader ? (
            loader
          ) : (
            <Button
              type="submit"
              className="btn"
              id="btn-confirm"
              disabled={disable}
            >
              Xác nhận
            </Button>
          )}
        </Form>
      </div>
    </>
  );
};

export default ForgotPassword;
