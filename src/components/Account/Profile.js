import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";
import axiosClient from "../../api/axiosClient";
import { useData } from "../../context/Provider";
import { ACTIONS } from "../../context/Action";
import ModalNotify from "../Modal/ModalNotify";
import {
  BUTTON_UPDATE,
  LABEL_EMAIL,
  LABEL_FULLNAME,
  LABEL_IMAGE,
  LOGIN_SUCCESS,
  TITLE_ACCOUNT,
  WARN_LOGIN,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { isCheck, login, logout } from "../../features/auth/userSlice";
import { modalNotify } from "../../features/modal/modalSlice";
import userApi from "../../api/userApi";

const Profile = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const { dispatch, show, error, message } = useData();
  const { token, refreshToken } = useSelector((state) => state.user);
  const dispatch_redux = useDispatch();

  const notify = (error, message) => {
    dispatch_redux(
      modalNotify({
        show: true,
        message: message,
        error: error,
      })
    );
  };

  useEffect(() => {
    const userToken = token ? jwt_decode(token) : null;
    if (userToken != null) {
      setUserName(userToken.user_name);
      setEmail(userToken.user_email);
    }



  }, [token, refreshToken]);

  const updateToken = async () => {
    try {
      const resUpdate = await userApi.refreshToken(refreshToken)
      dispatch_redux(
        login({
          token: resUpdate.data.token,
          refreshToken: refreshToken,
        })
      );
    } catch (error) {
      console.log(error);
      notify(error.response.data, null)
    }
  };

  const resetDispatch = () => {
    dispatch_redux(isCheck(true));
    notify(WARN_LOGIN, null)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_name', e.target[0].value)
    formData.append('user_image', e.target[2].value)
    console.log(formData.get('image'));

    try {
      if (token && isJwtExpired(token) === false) {
        const res = await userApi.updateUserImage(token, formData)
        if (res.data.data || res.data.message) {
          if (refreshToken && isJwtExpired(refreshToken) === false) {
            updateToken();
            notify(null, res.data.message)
          }
        }
      } else {
        resetDispatch();
      }
    } catch (error) {
      console.log(error.response);
      notify(error.response.data, null)
      // dispatch_redux(logout());
      // resetDispatch()
    }
  };

  return (
    <>
      <h3>{TITLE_ACCOUNT}</h3>
      <div className="profile">
        <div>
          <img src={"https://mpng.subpng.com/20180420/sdw/kisspng-computer-icons-user-profile-login-avatar-description-5ada41a3affa18.5037201115242530917208.jpg"}
            alt="account" />
        </div>
        <div>
          <Form className="form-profile" onSubmit={handleSubmit}>
            <FormGroup className="form-group">
              <FormLabel>{LABEL_FULLNAME}</FormLabel>
              <Form.Control
                className="input-text"
                required
                type="text"
                value={user_name ? user_name : ""}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <FormLabel>{LABEL_EMAIL} </FormLabel>
              <Form.Control
                readOnly
                className="input-text"
                required
                type="email"
                value={user_email ? user_email : ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup className="form-group">
              <FormLabel>{LABEL_IMAGE} </FormLabel>
              <Form.Control
                type="file"
              // onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <Button
              type="submit"
              className="btn btn-primary btn-block"
              variant="dark"
            >
              {BUTTON_UPDATE}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Profile;
