"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "@/app/styles/profile.css";
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import Link from "next/link";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKBiGGm6pwc9FU7pRiQTQ3LmSTJ7UciL8",
  authDomain: "modul4-1747b.firebaseapp.com",
  projectId: "modul4-1747b",
  storageBucket: "modul4-1747b.appspot.com",
  messagingSenderId: "784858061545",
  appId: "1:784858061545:web:27cf15a60a8f28fc72ae78",
  measurementId: "G-850N3PFX0Q",
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  address: string;
  phone: string;
  img: string;
  password: string;
  status: number;
}

const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<Account | null>(null);

  // Fetch user data from the backend based on keyLogin
  useEffect(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get(
            `http://localhost:5000/userList/${idUserLogin}`
          );
          const currentUser = response.data;
          if (currentUser) {
            setYourProfile(currentUser);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUser();
  }, []);

  const confirmProfile = () => {
    Swal.fire({
      title: "Cập nhật thông tin",
      html: `
        <label>Tên người dùng:</label>
        <input id="nameAccount" class="swal2-input" value="${
          yourProfile?.nameAccount || ""
        }"> <br />
        <label>Địa chỉ bây giờ:</label>
        <input id="address" class="swal2-input" value="${
          yourProfile?.address || ""
        }"><br />
        <label>Số điện thoại:</label>
        <input id="phone" class="swal2-input" value="${
          yourProfile?.phone || ""
        }">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      preConfirm: () => {
        const nameAccount = (
          document.getElementById("nameAccount") as HTMLInputElement
        ).value;
        const address = (document.getElementById("address") as HTMLInputElement)
          .value;
        const phone = (document.getElementById("phone") as HTMLInputElement)
          .value;

        // Validate phone number
        const phoneRegex = /^\d{10,15}$/; // Adjust the regex as needed
        if (!phoneRegex.test(phone)) {
          Swal.showValidationMessage(
            "Số điện thoại không hợp lệ! Vui lòng nhập từ 10 đến 15 chữ số."
          );
          return;
        }

        const updatedProfile = {
          id: yourProfile?.id ?? 0,
          img: yourProfile?.img ?? "",
          password: yourProfile?.password ?? "",
          status: yourProfile?.status ?? 0,
          nameAccount,
          email: yourProfile?.email, // Keep email unchanged
          address,
          phone,
        };

        setYourProfile(updatedProfile as Account); // Type assertion to Account
        return updatedProfile;
      },
    }).then((result) => {
      if (result.isConfirmed && yourProfile) {
        saveAccountToBackend(result.value);
        Swal.fire(
          "Thành công!",
          "Thông tin cá nhân đã được cập nhật.",
          "success"
        );
      }
    });
  };

  const changePass = () => {
    Swal.fire({
      title: "Đổi mật khẩu",
      html: `
        <label>Mật khẩu cũ:</label>
        <input type="password" id="oldPassword" class="swal2-input"> <br />
        <label>Mật khẩu mới:</label>
        <input type="password" id="newPassword" class="swal2-input"> <br />
        <label>Xác nhận mật khẩu mới:</label>
        <input type="password" id="confirmPassword" class="swal2-input">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Đổi mật khẩu",
      preConfirm: () => {
        const oldPassword = (
          document.getElementById("oldPassword") as HTMLInputElement
        ).value;
        const newPassword = (
          document.getElementById("newPassword") as HTMLInputElement
        ).value;
        const confirmPassword = (
          document.getElementById("confirmPassword") as HTMLInputElement
        ).value;

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Mật khẩu xác nhận không khớp!");
          return;
        }

        if (
          CryptoJS.AES.decrypt(
            yourProfile?.password || "",
            "your-secret-key"
          ).toString(CryptoJS.enc.Utf8) !== oldPassword
        ) {
          Swal.showValidationMessage("Mật khẩu cũ không đúng!");
          return;
        }

        const encryptedPassword = CryptoJS.AES.encrypt(
          newPassword,
          "your-secret-key"
        ).toString();
        return encryptedPassword;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (yourProfile) {
          const updatedProfile = { ...yourProfile, password: result.value };
          setYourProfile(updatedProfile);
          saveAccountToBackend(updatedProfile);
          Swal.fire("Thành công!", "Mật khẩu đã được đổi.", "success");
        }
      }
    });
  };

  const changeAvatar = () => {
    Swal.fire({
      title: "Chọn ảnh",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value as File;
        const storageRef = ref(storage, `profile-pictures/${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            if (yourProfile) {
              const updatedProfile = { ...yourProfile, img: downloadURL };
              setYourProfile(updatedProfile);
              saveAccountToBackend(updatedProfile);
              Swal.fire({
                title: "Ảnh của bạn",
                imageUrl: downloadURL,
                imageAlt: "Ảnh đã tải lên",
              });
            }
          });
        });
      }
    });
  };

  const saveAccountToBackend = (account: Account) => {
    axios
      .put(`http://localhost:5000/userList/${account.id}`, account)
      .then((response) => {
        console.log("Profile updated:", response.data);
        Swal.fire(
          "Thành công",
          "Thông tin cá nhân đã được cập nhật",
          "success"
        );
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Swal.fire(
          "Lỗi",
          "Có lỗi xảy ra khi cập nhật thông tin cá nhân",
          "error"
        );
      });
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="content-container">
        <div className="private-list">
          <Link href="/pages/user/profile">
            <div className="person choose-private">Thông tin cá nhân</div>
          </Link>
          <Link href="/pages/user/history">
            {" "}
            <div className="history-info choose-private">Lịch sử làm bài</div>
          </Link>
        </div>
        <div className="private-info" id="profileContent">
          {yourProfile && (
            <>
              <div className="image-container">
                <div>
                  <img
                    style={{
                      width: "100%",
                      height: "326px",
                      borderRadius: "6px",
                    }}
                    src={yourProfile.img}
                    alt=""
                  />
                </div>
                <h3
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {yourProfile.nameAccount}
                </h3>
                <div className="choose-file">
                  <button
                    id="changeAvt"
                    className="change-avatar-button"
                    onClick={changeAvatar}
                  >
                    Thay đổi ảnh
                  </button>
                </div>
                <div className="button-choose">
                  <button
                    style={{
                      padding: "10px 20px",
                      border: "transparent",
                      borderRadius: "6px",
                      backgroundColor: "greenyellow",
                    }}
                    onClick={confirmProfile}
                  >
                    Đổi thông tin
                  </button>
                  <button
                    style={{
                      padding: "10px 20px",
                      border: "transparent",
                      borderRadius: "6px",
                      backgroundColor: "greenyellow",
                    }}
                    onClick={changePass}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
              <div className="info-container">
                <div className="info-item">
                  <h5>Email:</h5>
                  <p>{yourProfile.email}</p>
                </div>
                <div className="info-item">
                  <h5>Địa chỉ:</h5>
                  <p>{yourProfile.address}</p>
                </div>
                <div className="info-item">
                  <h5>Số điện thoại:</h5>
                  <p>{yourProfile.phone}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
