import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import chapApi from "../../api/chapApi";
import comicApi from "../../api/comicApi";
import { getChapterByChapID, resetChap } from "../../features/comics/chapterSlice";
import Table from "../Table/Table";
const UpdateChap = (props) => {
    const [files, setFiles] = useState()
    const [name, setName] = useState()
    const [file, setFile] = useState()
    const { chapId } = useParams()
    const [oldfiles, setOldFiles] = useState()
    const dispatch = useDispatch()
    const { chapName, chapImgs, status } = useSelector(state => state.chapter)
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("add");
    }

    const changeFile = () => {
        console.log(file);
        if (file) {
            let formData = new FormData()
            formData.append("chapter_img", file)
            console.log(formData.get("chapter_img"));
        }
    }

    useEffect(() => {
        dispatch(getChapterByChapID(chapId))
        changeFile()
    }, [file])

    const columns = [
        {
            Header: "IMG",
            Cell: ({ cell }) => (
                <img src={cell.row.original} alt={"Error image"} style={{ width: 200, height: 200 }} />
            )
        },
        {
            Header: "Action",
            sort: false,
            Cell: ({ cell }) => (
                <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            ),
        },
    ];

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
                            value={chapName && chapName}
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
            {status === "success" &&
                <Table data={chapImgs && chapImgs} columns={columns}></Table>
            }
            {/* {files && files.map((e, i) => {
                return (
                    <div style={{ display: "flex", margin: 10 }}>
                        <img key={i} src={e} alt={"Error image"} style={{ width: 300, height: 300 }} />
                        <input type="file" style={{ float: "right" }}
                            onChange={(e) => setFiles(e.target.files[0])}></input>
                    </div>
                )
            })} */}
        </>
    )
}

export default UpdateChap
