import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import comicApi from "../../api/comicApi";
import ListItem from "../ListComic/ListItem";
import { BsStars } from "react-icons/bs";
const Carousel = () => {
  let settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
  };
  const [comics, setComics] = useState();
  const getRecommend = async () => {
      try {
        const res = await comicApi.getRecommend(0);
        setComics(res.data.data.rows)
      } catch (error) {
      }
  };
  useEffect(() => {
    getRecommend();
  }, [])
  return (
    <>
      <div className="list-title">
        <BsStars />
        {"Truyện đề cử"}
      </div>
      <div className="slider_comic">
        <Slider {...settings}>
          {comics &&
            comics.map((e, i) => {
              return (
                <ListItem
                  index={i}
                  other={false}
                  key={i}
                  isFollow={false}
                  item={e}
                ></ListItem>
              );
            })}
        </Slider>
      </div>
    </>
  );
};

export default Carousel;
