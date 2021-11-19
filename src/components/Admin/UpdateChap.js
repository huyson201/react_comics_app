import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import chapApi from "../../api/chapApi";
import { getChapterByChapID, resetChap } from "../../features/comics/chapterSlice";
import { toast } from 'react-toastify';
import { UPDATE_SUCCESS, CHOOSE_IMG } from "../../constants";
import { FcOk } from "react-icons/fc";

const UpdateChap = (props) => {
    const { chap, status } = useSelector(state => state.chapter)
    const [urls, setUrls] = useState([])
    const [files, setFiles] = useState()
    const [name, setName] = useState()
    const { chapId } = useParams()
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.user)
    const [progress, setPogress] = useState([])
    const [show, setShow] = useState(false);
    const [oldImg, setOldImg] = useState();
    const [index, setIndex] = useState()


    const options = {
        headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${token}`
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

    const updateImage = async (chapId, options, formData, index) => {
        try {
            const res = await chapApi.updateImg(chapId, options, formData)
            console.log(res.data);
            if (res.data.data) {
                if (!toast.isActive(UPDATE_SUCCESS)) {
                    toast.success(UPDATE_SUCCESS, { toastId: UPDATE_SUCCESS })
                }
                setPogress([{ index: index, message: "success" }])
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setShow(false)
        // setPogress(null)

        let formData = new FormData()
        if (name) {
            formData.append("chapter_name", name)
        }

        if (urls) {
            let base64 = []
            if (urls.length === 1 && oldImg) {
                setPogress([{ index: index, message: "loading" }])
                formData.append("img", urls[0]);
                formData.append("chapter_imgs", oldImg);
                base64.push(await convertBase64(urls[0]))

                if (files.length > 1) {
                    for (let i = 0; i < files.length; i++) {
                        if (index === i) {
                            files[index] = base64[0]
                        }
                    }
                } else {
                    setFiles(base64);
                }
                updateImage(chapId, options, formData, index)
            } else if (urls.length > 1) {
                let arrProgress = []
                let strImgs = []
                for (let i = 0; i < urls.length; i++) {
                    base64.push(await convertBase64(urls[i]))
                }
                setFiles(base64);

                for (let i = 0; i < urls.length; i++) {
                    arrProgress.push({ index: i, message: "loading" })
                    setPogress([...arrProgress])
                    let formDataImg = new FormData()
                    formDataImg.append("img", urls[i])
                    try {
                        const res = await chapApi.upload(formDataImg, token)
                        if (res.data.data) {
                            console.log(res);
                            arrProgress[i] = { index: i, message: "success" }
                            setPogress([...arrProgress])
                            strImgs.push(res.data.data)
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                try {
                    const res = await chapApi.updateImgs(chapId, name, strImgs.toString(), token)
                    console.log(res.data.data);
                    if (res.data.data) {
                        if (!toast.isActive(UPDATE_SUCCESS)) {
                            toast.success(UPDATE_SUCCESS, { toastId: UPDATE_SUCCESS })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

            } else {
                if (!toast.isActive(CHOOSE_IMG)) {
                    toast.warn(CHOOSE_IMG, { toastId: CHOOSE_IMG })
                }
            }
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
    }, [chap])

    const handleClose = () => setShow(false);
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
                </Form>
            </div>
            {/* {status === "success" && */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">IMG</th>
                        <th scope="col">ACTION</th>
                        <th scope="col"></th>

                    </tr>
                </thead>
                <tbody>
                    {files && files.map((e, i) => {
                        return (<tr key={i}>
                            <th scope="row">{i}</th>
                            <td><img src={e} style={{ width: 200, height: 200 }} /></td>
                            <td><Button onClick={() => {
                                setShow(true)
                                setOldImg(e)
                                setIndex(i)
                            }}>Edit</Button>
                                <span>{" "}</span>
                                {/* <Button onClick={() => { console.log("delete") }}>Delete</Button> */}
                            </td>
                            <td>{progress.length > 0 ? progress.map((e) => {
                                if (e.index === i && e.message === "loading") {
                                    return <Spinner key={i} animation="border" />
                                } else if (e.index === i && e.message === "success") {
                                    return <FcOk key={i} style={{ fontSize: 30 }} />
                                }
                            }) : ""}</td>
                        </tr>)
                    })}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Vui lòng chọn ảnh muốn cập nhật !</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="file"
                        onChange={(e) => setUrls([e.target.files[0]])}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSubmit}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* } */}
        </>
    )
}

export default UpdateChap
