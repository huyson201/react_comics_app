import React, { useEffect, useState } from "react";
import './dashboard.css'
import { Nav, Navbar, Container, NavDropdown, Breadcrumb } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import AddChap from "./AddChap";
import ChapList from "./ChapList";
import UpdateChap from "./UpdateChap";
import comicApi from "../../api/comicApi";
const Dashboard = () => {
    const history = useHistory()
    const [chapters, setChapters] = useState();
    const { id } = useParams()
    const getChapList = async () => {
        try {
            const res = await comicApi.getComicByID(1);
            if (res.data.data) {
                setChapters(res.data.data.chapters);
            }
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        getChapList();
    }, []);

    console.log(chapters);
    return (
        <>
            <div className="container_dashboard">
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Doctruyen.phake</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav>
                                <Nav.Link href="#deets">Danh sách tryện</Nav.Link>
                                <Nav.Link eventKey={2} href="/comic/chaps">Danh sách chương</Nav.Link>
                                <Nav.Link eventKey={3} href="#memes">
                                    <i className="fas fa-user-circle"><span>Kieu Oanh</span></i>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Breadcrumb>
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                        Truyện đã đăng
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >Tên truyện</Breadcrumb.Item>
                    <Breadcrumb.Item >Danh sách chap</Breadcrumb.Item>
                </Breadcrumb>
                {history.location.pathname === "/comic/chaps" ? <ChapList chapters={chapters} /> : history.location.pathname == "/comic/chaps/add" ? <AddChap /> : history.location.pathname == `/comic/chaps/${id}/update` ? <UpdateChap /> : ""}

            </div>
        </>
    )
}

export default Dashboard