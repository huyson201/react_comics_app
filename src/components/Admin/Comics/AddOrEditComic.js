import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  COMIC_AUTHOR,
  COMIC_CATOGORIES,
  COMIC_IMAGE,
  COMIC_NAME,
  COMIC_STATUS,
  COMIC_STATUS_COMPLETED,
  COMIC_STATUS_ONGOING,
  COMIC_STATUS_STOP,
  COMIC_SUMMARY,
  EXPIRED,
  WARN_LOGIN,
} from "../../../constants";
import AsyncSelect from "react-select/async";
import comicApi from "../../../api/comicApi";
import { convertBase64 } from "../../../utilFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  createComic,
  getComicByID,
  removeSelectedComic,
  updateComic,
} from "../../../features/comics/comicSlice";
import Loading from "../../Loading/Loading";
import { login, logout } from "../../../features/auth/userSlice";
import { toast } from "react-toastify";
import userApi from "../../../api/userApi";
import { isJwtExpired } from "jwt-check-expiration";
const AddOrEditComic = ({ id }) => {
  const dispatch = useDispatch();
  const [inputValue, setValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const [validated, setValidated] = useState(false);
  const [color, setColor] = useState(true);
  const { token, refreshToken } = useSelector((state) => state.user);
  const statusComic = useSelector((state) => state.comics.status);
  const { selectedComic, loading } = useSelector((state) => state.comics);
  const refSelect = useRef();
  const refForm = useRef();
  
  const handleInputChange = (value) => {
    setValue(value);
  };
  // handle selection
  const handleChange = (value) => {
    setColor(true);
    setSelectedCategories(value);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue !== "") {
      const res = await comicApi.getCategoriesByKey(inputValue);
      return res.data.data.rows;
    }
  };
  const changeImage = async (file) => {
    const base64 = await convertBase64(file);
    setImage(base64);
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      if (selectedCategories.length === 0) {
        setColor(false);
      }
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else if (form.checkValidity()) {
      e.preventDefault();
      setValidated(true);

      (await checkToken(token, refreshToken)) === null && resetDispatch();
      if (
        selectedCategories.length > 0 &&
        (await checkToken(token, refreshToken)) !== null
      ) {
        setColor(true);
        let arrCate = [];
        selectedCategories.forEach((e) => {
          arrCate.push(e.category_id);
        });
        let formData = new FormData();
        const file = e.target[1].files[0];
        formData.append("comic_name", name);
        formData.append("comic_desc", summary);
        formData.append("comic_author", author);
        formData.append("comic_status", refSelect.current.value);
        formData.append("comic_view", 0);
        formData.append("categories", arrCate);
        console.log(id);
        if (!id) {
          formData.append("comic_img", file);
          dispatch(
            createComic({
              data: formData,
              userToken: await checkToken(token, refreshToken),
            })
          );
          setValidated(false);
          setName("");
          setAuthor("");
          setSummary("");
          setSelectedCategories("");
          setImage("");
          setStatus("");
        } else
          dispatch(
            updateComic({
              id: id,
              data: formData,
              userToken: await checkToken(token, refreshToken),
            })
          );
      } else {
        setColor(false);
      }
    }
    // setSelectedCategories("");
  };
  const customStyles = {
    control: (_, { selectProps: { borderColor } }) => ({
      fontSize: 13,
      alignItems: "center",
      backgroundColor: "hsl(0, 0%, 100%)",
      borderColor: borderColor,
      borderRadius: 4,
      borderStyle: "solid",
      borderWidth: 1,
      cursor: "default",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      minHeight: 38,
      outline: 0,
      position: "relative",
      transition: "all 100ms",
      boxSizing: "border-box",
    }),
  };
  useEffect(() => {
    if (id) {
      dispatch(getComicByID(id));
    }
    return () => {
      dispatch(removeSelectedComic());
    };
  }, [id]);
  useEffect(() => {
    if (selectedComic !== null) {
      setName(selectedComic.comic_name);
      setAuthor(selectedComic.comic_author);
      setSummary(selectedComic.comic_desc);
      setSelectedCategories(selectedComic.categories);
      setImage(selectedComic.comic_img);
      setStatus(selectedComic.comic_status);
    } else {
      setValidated(false);
      setName("");
      setAuthor("");
      setSummary("");
      setSelectedCategories("");
      setImage("");
      setStatus("");
    }
  }, [selectedComic !== null]);

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

  //th??ng b??o login khi refreshtoken h???t h???n
  const resetDispatch = () => {
    dispatch(logout());
    if (!toast.isActive(EXPIRED)) {
      toast.warn(EXPIRED, { toastId: EXPIRED });
    }
  };

  return (
    <>
      {loading && <Loading />}
      {((statusComic === "success" && !loading) || ( statusComic === "")) && (
        <Form
          style={{ fontSize: 13 }}
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          ref={refForm}
        >
          <h3>{selectedComic ? "Ch???nh s???a truy???n" : "Th??m truy???n"}</h3>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_NAME}
            </Form.Label>
            <Col md="10">
              <Form.Control
                value={name}
                size="sm"
                required
                type="text"
                placeholder={COMIC_NAME}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {"Y??u c???u"}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_IMAGE}
            </Form.Label>
            <Col md="10">
              <Form.Control
                required={id ? false : true}
                size="sm"
                type="file"
                onChange={(e) => changeImage(e.target.files[0])}
              />

              <Form.Control.Feedback type="invalid">
                {"Y??u c???u"}
              </Form.Control.Feedback>
              {image !== "" && (
                <img
                  className="image-comic"
                  key={Date.now()}
                  src={image}
                  alt="comic"
                />
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_AUTHOR}
            </Form.Label>
            <Col md="10">
              <Form.Control
                value={author}
                size="sm"
                onChange={(e) => setAuthor(e.target.value)}
                required
                type="text"
                placeholder={COMIC_AUTHOR}
              />
              <Form.Control.Feedback type="invalid">
                {"Y??u c???u"}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_CATOGORIES}
            </Form.Label>
            <Col md="10" required>
              <AsyncSelect
                styles={customStyles}
                borderColor={color ? "hsl(0, 0%, 80%)" : "red"}
                inputValue={inputValue}
                isMulti
                cacheOptions
                defaultOptions
                getOptionLabel={(e) => e.category_name}
                getOptionValue={(e) => e.category_id}
                onInputChange={handleInputChange}
                value={selectedCategories}
                onChange={handleChange}
                placeholder={"T??m v?? ch???n th??? lo???i"}
                loadOptions={loadOptions}
              ></AsyncSelect>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {!color && "Y??u c???u"}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_SUMMARY}
            </Form.Label>
            <Col md="10">
              <Form.Control
                value={summary}
                size="sm"
                required
                onChange={(e) => setSummary(e.target.value)}
                as="textarea"
                style={{ height: "100px" }}
                placeholder={COMIC_SUMMARY}
              />
              <Form.Control.Feedback type="invalid">
                {"Y??u c???u"}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2">
              {COMIC_STATUS}
            </Form.Label>
            <Col md="10">
              <Form.Select
                ref={refSelect}
                size="sm"
                isValid={validated && status !== ""}
                required
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="">Ch???n t??nh tr???ng...</option>
                <option value={COMIC_STATUS_ONGOING}>
                  {COMIC_STATUS_ONGOING}
                </option>
                <option value={COMIC_STATUS_COMPLETED}>
                  {COMIC_STATUS_COMPLETED}
                </option>
                <option value={COMIC_STATUS_STOP}>{COMIC_STATUS_STOP}</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {"Y??u c???u"}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="2"></Form.Label>
            <Col md="10">
              <Button
                type="submit"
                style={{ float: "left", width: 150 }}
                className="btn-primary"
                variant="dark"
              >
                {!selectedComic ? "Th??m" : "Ch???nh s???a"}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </>
  );
};

export default AddOrEditComic;
