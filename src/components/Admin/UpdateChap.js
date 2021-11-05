import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button } from "react-bootstrap";
import { useParams } from "react-router";
import comicApi from "../../api/comicApi";
// import "./addChap.css"
const AddChap = () => {
    const [files, setFiles] = useState()
    const [name, setName] = useState()
    const { id } = useParams()
    console.log(id);
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("add");
    }

    const getChap = async () => {
        try {
            const res = await comicApi.getChapterByID(id)
            if (res.data.data) {
                setName(res.data.data.chapter_name)
                setFiles(res.data.data.chapter_imgs)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getChap()
    }, [files, name])
    console.log(files);
    console.log(name);

    return (
        <>
            <div className="container_form_add">
                <Form
                    onSubmit={handleSubmit}
                >
                    <FormGroup className="form-group">
                        <FormLabel>Tên chương</FormLabel>
                        <Form.Control
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên chương
                        </Form.Control.Feedback>
                    </FormGroup>

                    <FormGroup className="form-group">
                        <FormLabel>Ảnh chương </FormLabel>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng chọn ảnh
                        </Form.Control.Feedback>
                    </FormGroup>
                    <Button
                        type="submit"
                        className="btn-primary"
                        variant="dark"
                    >
                        Cập nhật
                    </Button>
                </Form>
            </div>

        </>
    )
}

export default AddChap
