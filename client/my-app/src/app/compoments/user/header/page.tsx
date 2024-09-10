"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import "@/app/styles/home.css"
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [login, setLogin] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get('http://localhost:5000/userList');
          const users = response.data;
          const currentUser = users.find((user: any) => user.id === idUserLogin);
          if (currentUser) {
            setUser(currentUser);
            setLogin(true);
          } else {
            setLogin(false);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setLogin(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("keyLogin");
    router.push('/pages/user/sign-in');
    setLogin(false);
    setUser(null);
  };

  return (
    <div>
      <header className="header">
        <div className="ipad-header-top">
          <div className="header-left">
            <a href="">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg"
                alt=""
                className="logo"
              />
            </a>
            <p>OnlineTest</p>
          </div>
          <div className="container1">
            <form action="" id="form-input">
              <input type="search" id="myInput" placeholder="tìm kiếm đề" />
              <ul id="myUL"></ul>
            </form>
          </div>
        </div>
        <div className="header-right">
          <nav className="header-nav">
            <Link href="/pages/user/home" className="nav-item">
              Trang chủ
            </Link>
            <Link href="/pages/subjects" className="nav-item">
              Trang môn
            </Link>
            <Link href="/pages/user/contact" className="nav-item">
              Liên hệ
            </Link>
          </nav>
          <div id="loginOut">
            {!login ? (
              <div className='btnlogin'>
                <Link href="/pages/user/sign-in" className="nav-item">
                  Đăng nhập
                </Link>
                <Link href="/pages/user/sign-up" className="nav-item">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="user-info">
                <img
                  src={user?.img}
                  alt="User Avatar"
                  className="user-avatar"
                  onClick={() => window.location.href = '/pages/user/profile'}
                />
                <span>hi,{user?.nameAccount}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
