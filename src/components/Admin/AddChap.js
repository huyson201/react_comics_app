import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button, ProgressBar } from "react-bootstrap";
import chapApi from "../../api/chapApi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient from "../../api/axiosClient";
import { modalNotify } from "../../features/modal/modalSlice";
import { createChapter } from "../../features/comics/chapterSlice";
// import "./addChap.css"
const AddChap = () => {
    const [files, setFiles] = useState()
    const [chapter_name, setChapName] = useState()
    const { comicId } = useParams()
    const { token } = useSelector(state => state.user)
    const { status } = useSelector(state => state.chapter)
    const [progress, setPogress] = useState()
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setPogress(null)
        let formData = new FormData()
        formData.append('comic_id', comicId)
        formData.append('chapter_name', chapter_name)
        for (let i = 0; i < files.length; i++) {
            formData.append("chapter_imgs", files[i]);
        }
        const options = {
            headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                console.log(progressEvent);
                const { loaded, total } = progressEvent
                setPogress(Math.ceil((loaded / total) * 100))
            }
        }
        dispatch(createChapter({ formData: formData, options: options }))

    }
    console.log(progress)

    return (
        <>
            <div className="container_form_add">
                <Form onSubmit={handleSubmit}>
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
                            name="imgs"
                            required
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng chọn ảnh
                        </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup >
                        <Button
                            type="submit"
                            className="btn-primary"
                            variant="dark"
                        >
                            Thêm
                        </Button>
                    </FormGroup>
                    {status && status === "loading" && progress && < ProgressBar animated now={progress} label={`${progress < 100 ? progress : 'loading...'}`} />}
                    {status && status === "success" && progress && <ProgressBar variant="success" now={100} label="Done" />}

                </Form>
            </div>
        </>
    )
}

export default AddChap
