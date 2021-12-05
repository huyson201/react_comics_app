import React, { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  Button,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import chapApi from "../../../api/chapApi";
import { FcOk } from "react-icons/fc";
import { toast } from "react-toastify";
import { ADD_CHAP, EXPIRED, WARN_LOGIN } from "../../../constants";
import { isJwtExpired } from "jwt-check-expiration";
import userApi from "../../../api/userApi";
import { login, logout } from "../../../features/auth/userSlice";

const AddChap = () => {
  const [files, setFiles] = useState();
  const [chapter_name, setChapName] = useState();
  const { comicId } = useParams();
  const { token, refreshToken } = useSelector((state) => state.user);
  const [progress, setPogress] = useState([]);
  const [img, setImg] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    chapter_name.trim() === "" &&
      !toast.isActive("chapName") &&
      toast.warn("Vui lòng nhập tên chương", { toastId: "chapName" });

    (await checkToken(token, refreshToken)) === null && resetDispatch();

    if (
      chapter_name.trim() !== "" &&
      files.length > 0 &&
      (await checkToken(token, refreshToken)) !== null
    ) {
      let base64 = [];
      for (let i = 0; i < files.length; i++) {
        base64.push(await convertBase64(files[i]));
      }
      setImg(base64);

      let arrProgress = [];
      let strImgs = [];
      for (let i = 0; i < files.length; i++) {
        arrProgress.push({ index: i, message: "loading" });
        setPogress([...arrProgress]);
        let formDataImg = new FormData();
        formDataImg.append("img", files[i]);
        try {
          const res = await chapApi.upload(
            formDataImg,
            await checkToken(token, refreshToken)
          );
          if (res.data.data) {
            arrProgress[i] = { index: i, message: "success" };
            setPogress([...arrProgress]);
            strImgs.push(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const res = await chapApi.create(
          comicId,
          chapter_name,
          strImgs.toString(),
          await checkToken(token, refreshToken)
        );
        if (res.data.data) {
          if (!toast.isActive(ADD_CHAP)) {
            toast.success(ADD_CHAP, { toastId: ADD_CHAP });
          }
          e.target[0].value = null;
          e.target[1].value = null;
          setImg([]);
        }
        // console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkToken = async (token, refreshToken) => {
    let temp = null;
    if (token && isJwtExpired(token) === false) {
      temp = token;
    } else {
      if (refreshToken && isJwtExpired(refreshToken) === false) {
        const resUpdate = await userApi.refreshToken(refreshToken);
        if (resUpdate.data && resUpdate.data.token) {
          temp = resUpdate.data.token;
          dispatch(
            login({
              token: resUpdate.data.token,
              refreshToken: refreshToken,
            })
          );
        }
      }
    }
    return temp;
  };

  //thông báo login khi refreshtoken hết hạn
  const resetDispatch = () => {
    dispatch(logout());
    if (!toast.isActive(EXPIRED)) {
      toast.warn(EXPIRED, { toastId: EXPIRED });
    }
  };

  return (
    <>
      <div className="container_form_add">
        <Form onSubmit={handleSubmit} id="form">
          <FormGroup>
            <FormLabel>Tên chương</FormLabel>
            <Form.Control
              required
              type="text"
              onChange={(e) => setChapName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập tên chương
            </Form.Control.Feedback>
          </FormGroup>
          <FormGroup>
            <FormLabel>Ảnh chương </FormLabel>
            <Form.Control
              required
              multiple
              type="file"
              onChange={(e) => setFiles(e.target.files)}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng chọn ảnh
            </Form.Control.Feedback>
          </FormGroup>
          <FormGroup>
            <Button type="submit" className="btn-primary" variant="dark">
              Thêm
            </Button>
            <Button
              className="btn-primary btn_chap_list"
              style={{
                backgroundColor: "green",
                borderColor: "green",
                boxShadow: "none",
                float: "right",
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              Xem danh sách chap
            </Button>
          </FormGroup>
        </Form>
      </div>
      {img.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">IMG</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {img &&
              img.map((e, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i}</th>
                    <td>
                      <img src={e} style={{ width: 200, height: 200 }} />
                    </td>
                    <td>
                      {progress.length > 0
                        ? progress.map((e) => {
                            if (e.index === i && e.message === "loading") {
                              return <Spinner key={i} animation="border" />;
                            } else if (
                              e.index === i &&
                              e.message === "success"
                            ) {
                              return <FcOk key={i} style={{ fontSize: 30 }} />;
                            }
                          })
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AddChap;
