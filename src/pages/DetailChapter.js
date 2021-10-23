import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button } from "react-bootstrap";
import comicApi from "../api/comicApi";
import { NEXT_CHAPTER, PRE_CHAPTER } from "../constants";

const DetailChapter = () => {
  const { name, id } = useParams();
  const arrName = name.split("-");
  const idComic = arrName[arrName.length - 1];
  const [imgs, setImgs] = useState();
  const [chapters, setChapters] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const resChapter = await comicApi.getChapterByID(id);
    setImgs(resChapter.data.data.chapter_imgs.split(","));
    const resComic = await comicApi.getComicByID(idComic);
    setChapters(resComic.data.data.chapters);
  };
  console.log(chapters);

  return (
    <div className="chapter_content">
      <div className="chapter_img">
        {imgs
          ? imgs.map((e, i) => {
              return <img key={i} src={e} alt={"Error image"} />;
            })
          : ""}
      </div>
      <div className="button">
        <a type="submit" className="btn btn-nav">
          {PRE_CHAPTER}
        </a>
        <a type="submit" className="btn btn-nav">
          {NEXT_CHAPTER}
        </a>
      </div>
    </div>
  );
};

export default DetailChapter;
