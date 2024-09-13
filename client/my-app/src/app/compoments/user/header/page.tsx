"use client";
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@/app/styles/home.css'; // Update with your actual CSS file path

interface User {
  id: string;
  nameAccount: string;
  img: string;
}

interface Exam {
  id: string;
  name: string;
}

export default function Page() {
  const [login, setLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State để lưu giá trị input
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const userResponse = await axios.get('http://localhost:5000/userList');
          const users = userResponse.data;
          const currentUser = users.find((user: User) => user.id === idUserLogin);
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

      try {
        const subjectResponse = await axios.get('http://localhost:5000/subjectList');
        setSubjectList(subjectResponse.data);
        
        const examResponse = await axios.get('http://localhost:5000/examList');
        setExamList(examResponse.data);
        setFilteredExams(examResponse.data); // Initialize filtered exams
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("keyLogin");
    router.push('/pages/user/sign-in');
    setLogin(false);
    setUser(null);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query); // Lưu giá trị tìm kiếm vào state
    const filter = query.toUpperCase();
    const filtered = examList.filter((exam) =>
      exam.name.toUpperCase().includes(filter)
    );
    setFilteredExams(filtered);
  };
  return (
    <div>
      <header className="header">
        <div className="ipad-header-top">
          <div className="header-left">
            <a href="">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg"
                alt="Logo"
                className="logo"
              />
            </a>
            <p>OnlineTest</p>
          </div>
          <div className="container1">
      <form id="form-input">
        <input
          type="search"
          placeholder="Tìm kiếm đề"
          onChange={handleSearch}
          className="search-input"
        />
        {searchQuery && ( // Chỉ hiển thị danh sách nếu có giá trị trong ô input
          <ul className="myUL">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <li key={exam.id} className="search-results">
                  <Link href={`/pages/Products.html?id=${exam.id}`}>
                    {exam.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="search-results">Không có kết quả phù hợp</li>
            )}
          </ul>
        )}
      </form>
    </div>
        </div>
        <div className="header-right">
          <nav className="header-nav">
            <Link href="/pages/user/home" className="nav-item">Trang chủ</Link>
            <Link href="/pages/user/courses" className="nav-item">Trang khóa thi</Link>
            <Link href="/pages/user/contact" className="nav-item">Liên hệ</Link>
          </nav>
          <div id="loginOut">
            {!login ? (
              <div className="btn-login">
                <Link href="/pages/user/sign-in" className="nav-item">Đăng nhập</Link>
                <Link href="/pages/user/sign-up" className="nav-item">Đăng ký</Link>
              </div>
            ) : (
              <div className="user-info">
                <img
                  src={user?.img || ''}
                  alt="User Avatar"
                  className="user-avatar"
                  onClick={() => router.push('/pages/user/profile')}
                />
                <span>Hi, {user?.nameAccount}</span>
                <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
