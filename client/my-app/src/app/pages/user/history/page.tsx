"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "@/app/styles/profile.css";
import "@/app/styles/examHistory.css";

import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import Link from "next/link";

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

export interface Exam {
  id: string;
  idSubject: number;
  level: number;
  name: string;
  image: string;
  sequence: number;
  describe: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

interface ExamHistory {
  id: number;
  idExam: string;
  idUser: string;
  score: number;
  time: string;
  date: string;
  answers: Answer[];
}

const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<Account | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOption, setSortOption] = useState<{ type: string; order: string }>({ type: "date", order: "asc" });

  useEffect(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get(`http://localhost:5000/userList/${idUserLogin}`);
          const currentUser = response.data;
          if (currentUser) {
            setYourProfile(currentUser);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    const fetchExamHistory = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get(`http://localhost:5000/userAnswer?userId=${idUserLogin}`);
          const history = response.data;
          if (history) {
            setExamHistory(history);
          }
        } catch (err) {
          console.error("Error fetching exam history:", err);
        }
      }
    };

    const fetchExamList = async () => {
      try {
        const response = await axios.get<Exam[]>("http://localhost:5000/examList");
        setExamList(response.data);
      } catch (error) {
        console.error("Error fetching exam list:", error);
      }
    };

    fetchUser();
    fetchExamHistory();
    fetchExamList();
  }, []);

  const sortedHistory = [...examHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOption.type === "date") {
      return sortOption.order === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortOption.type === "score") {
      return sortOption.order === "asc" ? a.score - b.score : b.score - a.score;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedHistory.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedHistory.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <br /><br /><br /><br /> <br />
      <div className="content-container">
        <div className="private-list">
          <Link href="/pages/user/profile">
            <div className="person choose-private">Thông tin cá nhân</div>
          </Link>
          <Link href="/pages/user/history">
            <div className="history-info choose-private">Lịch sử làm bài</div>
          </Link>
        </div>
        <div className="history-container">
          <h1 className="manage-title">Lịch sử làm bài</h1>
          <div className="sort-items">
            <h4>Sắp xếp theo:</h4>
            <select
              name="dateSort"
              value={sortOption.type === "date" ? sortOption.order : ""}
              onChange={(e) => setSortOption({ type: "date", order: e.target.value })}
              style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
            >
              <option value="asc">Mới nhất</option>
              <option value="desc">Cũ nhất</option>
            </select>
            <select
              name="scoreSort"
              value={sortOption.type === "score" ? sortOption.order : ""}
              onChange={(e) => setSortOption({ type: "score", order: e.target.value })}
              style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
            >
              <option value="asc">Cao - Thấp</option>
              <option value="desc">Thấp - Cao</option>
            </select>
          </div>
          <table className="tablex">
            <thead>
              <tr>
                <th>Mã đề</th>
                <th>Tên đề</th>
                <th>Điểm</th>
                <th>Thời gian</th>
                <th>Ngày làm</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((history) => {
                const exam = examList.find((e) => e.id === history.idExam);
                return (
                  <tr key={history.id}>
                    <td>{history.idExam}</td>
                    <td><Link href={`/pages/user/result/${history.id}`}>{exam ? exam.name : "Loading..."}</Link></td>
                    <td>{history.score}</td>
                    <td>{history.time}</td>
                    <td>{new Date(history.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            {pageNumbers.map((number) => (
              <button key={number} onClick={() => paginate(number)}>
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
