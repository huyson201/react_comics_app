import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";
import {
  BUTTON_UPDATE,
  LABEL_EMAIL,
  LABEL_FULLNAME,
  LABEL_IMAGE,
  TITLE_ACCOUNT,
  WARN_LOGIN,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { isCheck, login } from "../../features/auth/userSlice";
import { modalNotify } from "../../features/modal/modalSlice";
import userApi from "../../api/userApi";
// import { decode as base64_decode, encode as base64_encode } from 'base-64';

const Profile = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const [user_image, setImage] = useState();
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
    console.log(userToken);
    if (userToken !== null) {
      console.log(userToken);
      setUserName(userToken.user_name);
      setEmail(userToken.user_email);
      let image = userToken.user_image + `&t=${new Date().getTime()}`
      setImage(image)
    }
    console.log(token);
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

  // const convertBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       resolve(reader.result)
  //     }
  //     reader.onerror = (error) => {
  //       reject(error)
  //     }
  //   })
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    const file = e.target[2].files[0]
    formData.append("user_name", user_name)
    formData.append('user_image', file)

    try {
      if (token && isJwtExpired(token) === false) {
        const res = await userApi.updateUserImage(token, formData)
        if (res.data.data || res.data.message) {
          if (refreshToken && isJwtExpired(refreshToken) === false) {
            updateToken();
            notify(null, res.data.message)
          }
          let newImg = user_image.split('&t=')[0] + `&t=${new Date().getTime()}`
          setImage()
        }
      } else {
        resetDispatch();
      }
    } catch (error) {
      // console.log(error.resposne);
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
          <img
            key={Date.now()}
            src={user_image}
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
