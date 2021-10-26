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

const DetailChapter = () => {
  const history = useHistory();
  const { name, id } = useParams();
  const arrName = name.split("-");
  const idComic = arrName[arrName.length - 1];
  const [imgs, setImgs] = useState(null);
  const [comicName, setComicName] = useState();
  const [chapters, setChapters] = useState();
  const [state, setState] = useState({
    scrollPos: 0,
    show: false,
    percent: 3,
  });
  const dispatch_redux = useDispatch();
  const { showChapter } = useSelector((state) => state.modal);

  useEffect(() => {
    setImgs(null);
    getComic();
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);
    return window.removeEventListener("scroll", () => handleScroll);
  }, [id]);

  function handleScroll() {
    let cal =
      ((-1 * document.body.getBoundingClientRect().top) /
        document.body.getBoundingClientRect().height) *
      100;
    setState({
      scrollPos: document.body.getBoundingClientRect().top,
      show: document.body.getBoundingClientRect().top < -100,
      percent: Math.ceil(cal),
    });
  }

  async function getComic() {
    const resComic = await comicApi.getComicByID(idComic);
    setChapters(resComic.data.data.chapters);
    setComicName(resComic.data.data.comic_name);
    const resChapter = await comicApi.getChapterByID(id);
    setImgs(resChapter.data.data.chapter_imgs.split(","));
  }

  function nextId(id, arr) {
    let count = 0;
    arr.map((e) => {
      if (count < 1) {
        if (e.chapter_id > id) {
          id = e.chapter_id;
          count++;
        }
      }
    });
    return id;
  }

  function preId(id, arr) {
    let count = 0;
    arr.map((e) => {
      if (count < 1) {
        if (e.chapter_id < id) {
          id = e.chapter_id;
          count++;
        }
      }
    });
    return id;
  }

  function checkChapter(idPre, idNext) {
    if (idPre == idNext) {
      return 0;
    } else if (idPre < idNext) {
      return 1;
    }
    return -1;
  }

  const handleClickNextChap = async () => {
    const nId = await nextId(id, chapters);
    if (checkChapter(id, nId) === 0) {
      alert("Khong con chuong tiep theo");
    } else {
      const resChapter = await comicApi.getChapterByID(nId);
      history.push(
        `/${xoaDau(resChapter.data.data.chapter_name)}/${
          resChapter.data.data.chapter_id
        }/truyen-tranh/${name}`
      );
    }
  };

  const handleClickPreChap = async () => {
    const pId = await preId(id, chapters);
    if (checkChapter(id, pId) === 0) {
      alert("khong co chuong truoc");
    } else {
      const resChapter = await comicApi.getChapterByID(pId);
      history.push(
        `/${xoaDau(resChapter.data.data.chapter_name)}/${
          resChapter.data.data.chapter_id
        }/truyen-tranh/${name}`
      );
    }
  };

  const handleInfo = () => {
    history.push(`/truyen-tranh/${name}-${idComic}`);
  };

  const handleList = () => {
    dispatch_redux(
      modalChapter({
        showChapter: true,
      })
    );
  };
  return (
    <>
      {imgs === null ? (
        <Loading />
      ) : (
        <>
          <ModalChapters list={chapters} id={id} show={showChapter} name={name} />
          <div className="chapter_content">
            <div
              className={`nav_top ${state.show === true ? "nav_fixed" : ""}`}
            >
              <div>
                <div>Chapter 66</div>
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
