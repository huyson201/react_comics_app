import React, { Component } from "react";
import "./home.css";
import { BsStars } from "react-icons/bs";
export default class Home extends Component {
  render() {
    return (
      <>
        <div className="list-title">
          <BsStars />
          Truyện mới cập nhật
        </div>
        <div className="list-comic">
          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>

          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>

          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>

          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>

          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>

          <div className="list-comic-item">
            <img className="item-img" src="https://wcomic.site/upload/poster/comicid-4386.jpg"></img>
            <div className="item-row">
              <div className="item-new-chapter">Chap 50</div>
              <div className="item-rate">5.0</div>
            </div>
            <div className="item-name">Minh nhật chi kiếp</div>
          </div>
        </div>
      </>
    );
  }
}
