"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "@/app/styles/home.css";
import Banner from "@/app/compoments/user/banner/page";
import Banner2 from "@/app/compoments/user/banergv/page";
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import Link from 'next/link';

interface Exam {
  id: string;
  name: string;
  image: string;
  sequence: number;
  idSubject: number;
  describe: string;
}

export default function Page() {
  const [topExams, setTopExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/examList');
        const sortedExams = response.data.sort(
          (a: Exam, b: Exam) => b.sequence - a.sequence // Sắp xếp giảm dần theo sequence
        );
        setTopExams(sortedExams.slice(0, 4)); // Lấy 4 đề thi có lượt thi cao nhất
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div>
      <Header />
      <br /><br /><br />
      <Banner />
      <br />
      <Banner2 />
      <section className="attend-exam">
        <h1 style={{ textAlign: "center" }}>Đề thi tiêu biểu</h1>
        <div id="attendSubject" className="attend-list">
          {topExams.map((exam) => (
            <Link key={exam.id} href={`/pages/user/exam/${exam.id}`} >
              <div className="card" style={{ width: "18rem", padding: 10 }}>
                <img
                  src={exam.image}
                  className="card-img-top"
                  alt={exam.name}
                  style={{ height: "15rem" }}
                />
                <div className="card-body">
                  <h4>{exam.name}</h4>
                  <span id="sequence">Lượt thi: {exam.sequence}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
