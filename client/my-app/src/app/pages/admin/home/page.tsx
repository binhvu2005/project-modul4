"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/app/compoments/admin/header/page';
import Navbar from '@/app/compoments/admin/navbar/page';
import "../../../styles/adminHome.css";

// Define the type for exam
interface Exam {
  subject: string;
  name: string;
  level: string;
}

interface User {
  id: string;
  nameAccount: string;
  status: number;
  result: any[]; // You can replace `any[]` with the actual type of results if known
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    // Fetch users from external API
    axios.get('http://localhost:5000/userList')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    // Fetch exams from external API
    axios.get('http://localhost:5000/examList')
      .then((response) => {
        const examData: Exam[] = [];
        response.data.forEach((exam: { name: string; level: string }) => {
            examData.push({
              subject: 'Toán', // Replace with actual subject name
              name: exam.name,
              level: exam.level,
            });
          });
    
        setExams(examData);
      })
      .catch((error) => {
        console.error('Error fetching exam data:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="container-content-admin">
        <Navbar />
        <div className="main-body" style={{ width: "100%" }}>
          <h2>Bảng điều khiển</h2>
          <div className="promo_card">
            <h1>Chào mừng trở lại!</h1>
            <span>Group 3 - Trao tri thức, nhận niềm tin!</span>
            <a href="/Pages/contact.html">
              <button>Tìm hiểu thêm</button>
            </a>
          </div>
          <div className="rank-list">
            <div className="list1">
              <div className="row">
                <h4>Bảng xếp hạng</h4>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>id</th>
                    <th>Họ và tên</th>
                    <th>Status</th>
                    <th>Số bài hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.nameAccount}</td>
                      <td>{user.status === 1 ? 'On' : 'Off'}</td>
                      <td>{user.result?.length || 0}</td> {/* Use optional chaining and default value */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="list2">
              <div className="row">
                <h4>Đề thi tiêu biểu</h4>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Môn</th>
                    <th>Tiêu đề</th>
                    <th>Độ khó</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.slice(0, 4).map((exam, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{exam.subject}</td>
                      <td>{exam.name}</td>
                      <td>{exam.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
