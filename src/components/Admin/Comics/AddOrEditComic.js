import React, { useState } from "react";
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
} from "../../../constants";
import AsyncSelect from "react-select/async";
import comicApi from "../../../api/comicApi";
const AddOrEditComic = () => {
  const [inputValue, setValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const handleInputChange = (value) => {
    setValue(value);
  };
  // handle selection
  const handleChange = (value) => {
    setSelectedCategories(value);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue !== "") {
      const res = await comicApi.getCategoriesByKey(inputValue);
      return res.data.data.rows;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let arrCate = [];
    selectedCategories.forEach((e) => {
      arrCate.push(e.category_id);
    });
    console.log(arrCate);
    setSelectedCategories("")
  };
  return (
    <>
      <Form
        onSubmit={handleSubmit}
        noValidate
        // validated={validated}
      >
        <h3>{"Thêm truyện"}</h3>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_NAME}
          </Form.Label>
          <Col md="10">
            <Form.Control required type="text" placeholder={COMIC_NAME} 
             onChange={(e) => setName(e.target.value)}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_IMAGE}
          </Form.Label>
          <Col md="10">
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_AUTHOR}
          </Form.Label>
          <Col md="10">
            <Form.Control required type="text" placeholder={COMIC_AUTHOR} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_CATOGORIES}
          </Form.Label>
          <Col md="10">
            {/* <AsyncSelect
              inputValue={inputValue}
              isMulti
              cacheOptions
              defaultOptions
              getOptionLabel={(e) => e.category_name}
              getOptionValue={(e) => e.category_id}
              onInputChange={handleInputChange}
              value={selectedCategories}
              onChange={handleChange}
              placeholder={COMIC_CATOGORIES}
              loadOptions={loadOptions}
            ></AsyncSelect> */}
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_SUMMARY}
          </Form.Label>
          <Col md="10">
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              placeholder={COMIC_SUMMARY}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2">
            {COMIC_STATUS}
          </Form.Label>
          <Col md="10">
            <Form.Select aria-label="Default select example">
              <option value={COMIC_STATUS_ONGOING}>
                {COMIC_STATUS_ONGOING}
              </option>
              <option value={COMIC_STATUS_COMPLETED}>
                {COMIC_STATUS_COMPLETED}
              </option>
              <option value={COMIC_STATUS_STOP}>{COMIC_STATUS_STOP}</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="3"></Form.Label>
          <Col md="9">
            <Button
              type="submit"
              style={{ float: "left" }}
              className="btn-primary"
              variant="dark"
            >
              {"Thêm"}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};

export default AddOrEditComic;
