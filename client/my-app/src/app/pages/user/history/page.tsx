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

  const idUserLogin = localStorage.getItem("keyLogin");

  useEffect(() => {
    const fetchData = async () => {
      if (idUserLogin) {
        try {
          // Fetch user profile
          const userResponse = await axios.get(`http://localhost:5000/userList/${idUserLogin}`);
          setYourProfile(userResponse.data);

          // Fetch exam history
          const historyResponse = await axios.get(`http://localhost:5000/userAnswer?userId=${idUserLogin}`);
          setExamHistory(historyResponse.data);

          // Fetch exam list
          const examResponse = await axios.get<Exam[]>("http://localhost:5000/examList");
          setExamList(examResponse.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };

    fetchData();
  }, [idUserLogin]);

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

  const pageNumbers = Array.from({ length: Math.ceil(sortedHistory.length / itemsPerPage) }, (_, i) => i + 1);

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
          {examHistory.length === 0 ? (
            <p>Không có lịch sử làm bài.</p>
          ) : (
            <>
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
  {currentItems
    .filter((history) => history.idUser === idUserLogin) // Filter items based on user ID
    .map((history) => {
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
                  <button key={number} onClick={() => setCurrentPage(number)}>
                    {number}
                  </button>
                ))}
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
