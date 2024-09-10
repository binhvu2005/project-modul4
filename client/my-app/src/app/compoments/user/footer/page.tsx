import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUsers,
  faShop,
  faCircleInfo,
  faShieldHalved,
  faTruckFast,
  faBlog,
  faCircleQuestion,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import "@/app/styles/home.css"
export default function Page() {
  return (
    <div>
      <footer className="footer" style={{ marginTop: 30 }}>
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img
                id="img"
                src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg"
                alt=""
                style={{ width: 100, height: 100, borderRadius: "50%" }}
              />
              <h1 style={{ fontWeight: 500 }}>
                OnlineTest - Luyện thi miễn phí.
              </h1>
            </div>
            <p>
              OnlineTest là một hệ thống thi trắc nghiệm trực tuyến linh hoạt và
              tiện ích. Người dùng có thể tạo và tham gia các bài kiểm tra. Hệ
              thống cung cấp các loại câu hỏi đa dạng và tính năng tùy chỉnh,
              cùng với công cụ quản lý. OnlineTest là giải pháp hiệu quả để ôn
              tập và theo dõi quá trình học tập.
            </p>
            <div className="flogo-list">
              <FontAwesomeIcon icon={["fab", "facebook"]} />
              <FontAwesomeIcon icon={["fab", "twitter"]} />
              <FontAwesomeIcon icon={["fab", "github"]} />
              <FontAwesomeIcon icon={["fab", "instagram"]} />
            </div>
          </div>
          <div className="footer-right">
            <table className="ftable">
              <tbody>
                <tr className="ftable-items">
                  <th style={{ textAlign: "center" }}>Về OnlineTest</th>
                  <th style={{ textAlign: "center" }}>Hỗ trợ</th>
                  <th style={{ textAlign: "center" }}>Thông tin khác</th>
                </tr>
                <tr className="ftable-items">
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faBuilding} width={20} height={20} /> Group 3
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} /> Điều khoản
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faBlog} width={20} height={20} /> Group 3 blog
                  </td>
                </tr>
                <tr className="ftable-items">
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faUsers} width={20} height={20} /> Tuyển dụng
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faShieldHalved} width={20} height={20} /> Bảo mật
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faCircleQuestion} width={20} height={20} /> Thông tin đề thi
                  </td>
                </tr>
                <tr className="ftable-items">
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faShop}  width={20} height={20} />{" "}
                    Group 3 Mall
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faTruckFast} width={20} height={20} /> Dịch vụ
                  </td>
                  <td className="ftable-item">
                    <FontAwesomeIcon icon={faHandshake} width={20} height={20} /> Cam kết
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr />
        <div className="end">
          <div className="end-left">
            <span>@ 2024 OnlineTest. Created with</span>
            <FontAwesomeIcon icon="heart" style={{ color: "red" }} />
            <span>by binh vu</span>
          </div>
          <div className="end-right">
            <span>Trao tri thức - Nhận niềm tin!</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
