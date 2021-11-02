import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button } from "react-bootstrap";
import "./addChap.css"
const AddChap = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("add");
    }
    const [files, setFiles] = useState()
    useEffect(() => {

    }, [files])

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
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên chương
                        </Form.Control.Feedback>
                    </FormGroup>

                    <FormGroup className="form-group">
                        <FormLabel>Ảnh chương </FormLabel>
                        <Form.Control
                            required
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
                        Thêm
                    </Button>
                </Form>
            </div>

        </>
    )
}

export default AddChap
