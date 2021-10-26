import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Form, FormLabel, FormGroup, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router";
import axiosClient from "../api/axiosClient";
import Loader from "react-loader-spinner";
import { set } from "js-cookie";

const ResetPassword = () => {
  const { token } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errorPasswword, setErrorPasswword] = useState("");
  const [errorConfirm, setErrConfirm] = useState("");
  const [redirectLogin, setRedirectLogin] = useState(false);
  useEffect(() => {
    axiosClient
      .post("/forget-password/confirm", { reset_password_token: token })
      .then((res) => {
        console.log(res);
        if (res.data.data && res.data.code === 200) {
          setShowForm(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        setRedirect(true);
      });
  }, [token]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorPasswword("");
    setErrConfirm("");
    setShowLoader(true);
    if (formData.newPassword.length < 6) {
      setErrorPasswword("new password require length > 6");
      setShowLoader(false);
      return;
    }

    if (formData.confirmPassword !== formData.newPassword) {
      setErrConfirm("Confirm password not math");
      setShowLoader(false);
      return;
    }

    try {
      let res = await axiosClient.post(
        "/reset-password",
        {
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.data && res.data.code === 200) {
        setShowLoader(false);
        setRedirectLogin(true);
      }
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };

  let loader = <Loader type="Puff" color="#212529" height={40} width={40} />;

  if (redirect) return <Redirect to="/forgot-password" />;
  if (redirectLogin) return <Redirect to="/login" />;
  return (
    <>
      <div className="reset-pw-wrapper">
        <Form className="reset-pw-form" onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Mật khẩu mới</FormLabel>
            <Form.Control
              required
              type="password"
              placeholder="Nhập mật khẩu mới ..."
              name="newPassword"
              onChange={handleInput}
            />
          </FormGroup>
          {errorPasswword !== "" && (
            <div className="feedback">{errorPasswword}</div>
          )}
          <FormGroup>
            <FormLabel>Nhập lại mật khẩu</FormLabel>
            <Form.Control
              required
              type="password"
              placeholder="Nhập mật khẩu mới ..."
              name="confirmPassword"
              onChange={handleInput}
            />
          </FormGroup>
          {errorConfirm !== "" && (
            <div className="feedback">{errorConfirm}</div>
          )}
          {showLoader ? (
            loader
          ) : (
            <Button type="submit" className="btn" id="btn-confirm">
              Đổi mật khẩu
            </Button>
          )}
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
