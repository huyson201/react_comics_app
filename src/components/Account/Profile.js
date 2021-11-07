import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { isJwtExpired } from "jwt-check-expiration";
import {
  BUTTON_UPDATE,
  LABEL_EMAIL,
  LABEL_FULLNAME,
  LABEL_IMAGE,
  TITLE_ACCOUNT,
  UPDATE_SUCCESS,
  WARN_LOGIN,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setUserInfo } from "../../features/auth/userSlice";
import { modalNotify } from "../../features/modal/modalSlice";
import userApi from "../../api/userApi"
import { useHistory } from "react-router";

const Profile = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const [user_image, setImage] = useState();
  const { token, refreshToken, userInfo } = useSelector((state) => state.user);
  const history = useHistory()
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
  //effect user info
  useEffect(() => {
    if (userInfo !== null) {
      setUserName(userInfo.user_name);
      setEmail(userInfo.user_email);
      let image = userInfo.user_image + `&t=${new Date().getTime()}`
      setImage(image)
    }
  }, [userInfo]);
  //refresh token
  const updateToken = async () => {
    try {
      const resUpdate = await userApi.refreshToken(refreshToken)
      if (resUpdate.data && resUpdate.data.token && userInfo !== null) {
        dispatch_redux(
          login({
            token: resUpdate.data.token,
            refreshToken: refreshToken,
          })
        );
        dispatchUser(userInfo.user_uuid, resUpdate.data.token)
      }
    } catch (error) {
      console.log(error);
      notify(error.response.data, null)
    }
  };
  //Lưu redux user info
  const dispatchUser = async (id, token) => {
    try {
      const getInfo = await userApi.getUserById(id, token)
      if (getInfo.data.data) {
        dispatch_redux(setUserInfo(getInfo.data.data))
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
  //thông báo login khi token hết hạn
  const resetDispatch = () => {
    dispatch_redux(logout());
    notify(WARN_LOGIN, null);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }
  //Hiển thị ảnh khi user chọn ảnh từ lib
  const changeImage = async (file) => {
    const base64 = await convertBase64(file)
    setImage(base64);
  }
  //update user
  const update = async (formData) => {
    try {
      const res = await userApi.updateUserImage(token, formData, userInfo.user_uuid)
      if (res.data.data) {
        dispatchUser(userInfo.user_uuid, token)
        notify(null, UPDATE_SUCCESS)
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
  //xử lý dữ liệu khi nhấn update
  const handleSubmit = async(e) => {
    e.preventDefault();
    let formData = new FormData();
    const file = e.target[2].files[0]
    formData.append("user_name", user_name)

    if (file) {
      formData.append('user_image', file)
    }

    if (userInfo !== null) {
      if (token && isJwtExpired(token) === false) {
        update(formData)
      } else {
        if (refreshToken && isJwtExpired(refreshToken) === false) {
          await updateToken()
          update(formData)
        } else {
          resetDispatch()
        }
      }
    } else {
      console.log("Khong co user");
    }
  };

  return (
    <>
      {userInfo !== null ?
        <>
          <h3>{TITLE_ACCOUNT}</h3>
          <div className="profile">
            <div className="custom_image">
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
                    onChange={(e) => changeImage(e.target.files[0])}
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
        : history.push("/")
      }
    </>
  )
};

export default Profile;
