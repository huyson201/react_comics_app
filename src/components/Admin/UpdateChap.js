import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button, ProgressBar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getChapterByChapID, resetChap, updateChapter } from "../../features/comics/chapterSlice";
const UpdateChap = (props) => {
    const { chap, status } = useSelector(state => state.chapter)
    const [urls, setUrls] = useState()
    const [files, setFiles] = useState()
    const [name, setName] = useState()
    const { chapId } = useParams()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.user)
    const [progress, setPogress] = useState()

    const options = {
        headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent
            setPogress(Math.ceil((loaded / total) * 100))
        }
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setPogress(null)

        let formData = new FormData()
        if (name) {
            formData.append("chapter_name", name)
        }

        if (urls) {
            let base64 = []
            for (let i = 0; i < urls.length; i++) {
                formData.append("chapter_imgs", urls[i]);
                base64.push(await convertBase64(urls[i]))
            }
            setFiles(base64);
            console.log(formData.get("chapter_imgs"));
        }

        try {
            const res = await dispatch(updateChapter(chapId, options, formData))
            if (res.data.data) {
                alert("update thanh cong")
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        dispatch(getChapterByChapID(chapId))
        return () => {
            dispatch(resetChap());
        };
    }, [chapId])

    useEffect(() => {
        if (chap !== null) {
            setName(chap.chapter_name);
            setFiles(chap.chapter_imgs.split(','));
        }
        // return () => {
        //     dispatch(resetChap());
        // };
    }, [chap])
    console.log(status);
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
                            onChange={(e) => setUrls(e.target.files)}
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

                    {status && status === "loading" && progress && < ProgressBar animated now={progress} label={`${progress < 100 ? progress : 'loading...'}`} />}
                    {status && status === "success" && progress && <ProgressBar variant="success" now={100} label="Done" />}

                </Form>

            </div>
            {status === "success" &&
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">IMG</th>
                            {/* <th scope="col">ACTION</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {files && files.map((e, i) => {
                            return (<tr key={i}>
                                <th scope="row">{i}</th>
                                <td><img src={e} style={{ width: 200, height: 200 }} /></td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            }
        </>
    )
}

export default UpdateChap
