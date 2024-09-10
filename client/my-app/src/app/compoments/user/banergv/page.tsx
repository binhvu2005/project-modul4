"use client"
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@/app/styles/home.css";

export default function Page() {
  return (
    <div>
      <section className="attend-banner">
        <h1
          className="attend-title"
          style={{
            textAlign: "center",
            backgroundColor: "gold",
            width: "max-content",
            margin: "auto",
            fontWeight: 700,
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          Học tập cùng giáo viên giỏi!
        </h1>
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://i.ytimg.com/vi/Vw6sX_a-xyM/maxresdefault.jpg"
                className="d-block w-100"
                alt="..."
                style={{ height: 600 }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h1
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "max-content",
                  }}
                >
                  Cô Vũ Thị Mai Phương
                </h1>
                <h3
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "80%",
                    position: "relative",
                    left: 100,
                  }}
                >
                  Nâng cao trình độ ngữ pháp cùng từ vựng!
                </h3>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://mshoagiaotiep.com/uploads/images/resize/900x900/2020/08/lotrinhkhtructuyen.png"
                className="d-block w-100"
                alt="..."
                style={{ height: 600 }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h1
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "max-content",
                  }}
                >
                  Cô Nguyễn Minh Hoa
                </h1>
                <h3
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "80%",
                    position: "relative",
                    left: 100,
                  }}
                >
                  Kỹ năng giao tiếp linh hoạt!
                </h3>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://i.ytimg.com/vi/3uUa9-LKfcA/maxresdefault.jpg"
                className="d-block w-100"
                alt="..."
                style={{ height: 600 }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h1
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "max-content",
                  }}
                >
                  Thầy Lưu Huy Thưởng
                </h1>
                <h3
                  style={{
                    padding: 10,
                    backgroundColor: "gold",
                    borderRadius: 10,
                    width: "80%",
                    position: "relative",
                    left: 200,
                  }}
                >
                  Đạt giải thưởng Giáo viên Quốc Tế và Tin Học Nâng Cao
                </h3>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    </div>
  );
}
