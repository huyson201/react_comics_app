import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import comicApi from "../api/comicApi";
import { NEXT_CHAPTER, PRE_CHAPTER } from "../constants";
import {
  IoIosListBox,
  IoIosInformationCircle,
  IoMdSend,
  IoMdArrowRoundUp,
} from "react-icons/io";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { xoaDau } from "../utilFunction";
import ModalChapters from "../components/Modal/ModalChapters";
import { BsStars } from "react-icons/bs";
import { modalChapter } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading/Loading";
import { chapterSelectors, getChapsByComicId } from "../features/comics/chapterSlice";

const DetailChapter = () => {
  const history = useHistory();
  const { name, id } = useParams();
  const arrName = name.split("-");
  const idComic = arrName[arrName.length - 1];
  const [imgs, setImgs] = useState(null);
  const [chapterName, setChapterName] = useState(null);
  const [comicName, setComicName] = useState();
  const [state, setState] = useState({
    scrollPos: 0,
    show: false,
    percent: 3,
  });
  const dispatch_redux = useDispatch();
  const { showChapter } = useSelector((state) => state.modal);
  const chapter = useSelector(chapterSelectors.selectAll)
  //tính phần trăm khi user scroll
  const handleScroll = () => {
    let cal =
      ((-1 * document.body.getBoundingClientRect().top) /
        document.body.getBoundingClientRect().height) *
      100;
    console.log(document.body.getBoundingClientRect().top);
    setState({
      scrollPos: document.body.getBoundingClientRect().top,
      show: document.body.getBoundingClientRect().top < -100,
      percent: Math.ceil(cal),
    });
  }
  //get imgs chap, get chaps
  const getComic = async () => {
    try {
      const resComic = await comicApi.getComicByID(idComic);
      const resChapter = await comicApi.getChapterByID(id);
      if (resComic.data.data && resChapter.data.data) {
        setComicName(resComic.data.data.comic_name);
        setChapterName(resChapter.data.data.chapter_name)
        setImgs(resChapter.data.data.chapter_imgs.split(","));
        dispatch_redux(getChapsByComicId(idComic))
        // dispatch_redux(setChapters(resComic.data.data.chapters))
      }
    } catch (error) {
      console.log(error);
    }
  }
  //get next chapId
  const nextId = (id, arr) => {
    let flag = false
    arr.map((e) => {
      console.log(e.chapter_id);
      if (e.chapter_id > id && flag === false) {
        id = e.chapter_id;
        flag = true
      }
    });
    return id;
  }
  //get previou chapId
  const preId = (id, arr) => {
    let flag = false
    arr.map((e) => {
      console.log(e.chapter_id);
      if (e.chapter_id < id && flag === false) {
        id = e.chapter_id;
        flag = true
      }
    });
    return id;
  }

  const checkChapter = (idPre, idNext) => {
    if (idPre === idNext) {
      return 0;
    } else if (idPre < idNext) {
      return 1;
    }
    return -1;
  }

  const handleClickNextChap = async () => {
    const nId = await nextId(id, chapter);
    if (checkChapter(id, nId) === 0) {
      alert("Khong con chuong tiep theo");
    } else {
      const resChapter = await comicApi.getChapterByID(nId);
      history.push(
        `/${xoaDau(resChapter.data.data.chapter_name)}/${resChapter.data.data.chapter_id
        }/truyen-tranh/${name}`
      );
    }
  };

  const handleClickPreChap = async () => {
    let tempChap = [...chapter];
    tempChap.sort((a, b) => (b.chapter_id > a.chapter_id ? 1 : -1))
    const pId = await preId(id, tempChap);
    if (checkChapter(id, pId) === 0) {
      alert("khong co chuong truoc");
    } else {
      const resChapter = await comicApi.getChapterByID(pId);
      history.push(
        `/${xoaDau(resChapter.data.data.chapter_name)}/${resChapter.data.data.chapter_id
        }/truyen-tranh/${name}`
      );
    }
  };

  const handleInfo = () => {
    history.push(`/truyen-tranh/${name}`);
  };

  const handleList = () => {
    dispatch_redux(
      modalChapter({
        showChapter: true,
      })
    );
  };

  useEffect(() => {
    setImgs(null);
    getComic();
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);
    return window.removeEventListener("scroll", () => handleScroll);
  }, [id]);


  return (
    <>
      {imgs === null ? (
        <Loading />
      ) : (
        <>
          <ModalChapters list={chapter} id={id} show={showChapter} name={name} />
          <div className="chapter_content">
            <div
              className={`nav_top ${state.show === true ? "nav_fixed" : ""}`}
            >
              <div>
                <div>{chapterName}</div>
                {state.show === true ? (
                  <>
                    <div>{`( ${state.percent}% )`}</div>
                    <IoMdArrowRoundUp
                      className="icon icon_scroll_to_top"
                      onClick={() => window.scrollTo(0, 0)}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="icon_content">
                <IoIosListBox className="icon" onClick={handleList} />
                <IoIosInformationCircle className="icon" onClick={handleInfo} />
                <IoMdSend className="icon" onClick={handleClickNextChap} />
              </div>
            </div>

            <div className="width">
              <div className="chapter_img">
                {imgs
                  ? imgs.map((e, i) => {
                    return <img key={i} src={e} alt={"Error image"} />;
                  })
                  : ""}
              </div>
              <div className="button">
                <button className="btn-nav" onClick={handleClickPreChap}>
                  <FaAngleLeft />
                  {PRE_CHAPTER}
                </button>
                <button className="btn-nav" onClick={handleClickNextChap}>
                  {NEXT_CHAPTER}
                  <FaAngleRight />
                </button>
              </div>
            </div>
            <div className="comic_title">
              <BsStars />
              {comicName ? comicName : ""}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DetailChapter;
