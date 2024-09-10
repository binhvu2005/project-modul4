"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import "@/app/styles/exam.css";
import ReactPaginate from 'react-paginate';
import Link from 'next/link';

export default function Page({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<any>(null);
  const [referenceExams, setReferenceExams] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Fetch thông tin đề thi và các đề thi tham khảo
    async function fetchData() {
      try {
        // Fetch data from local server
        const response = await axios.get(`http://localhost:5000/examList`);
        const exams = response.data;
        
        // Filter exams based on the current exam id
        const currentExam = exams.find((exam: any) => exam.id === params.id);
        const referenceExams = exams.filter((exam: any) => exam.id !== params.id && exam.idSubject === currentExam.idSubject);

        // Update state with current exam and reference exams
        setExam(currentExam);
        setTotalPages(Math.ceil(referenceExams.length / 2)); // Phân trang 2 đề 1 trang
        setReferenceExams(referenceExams.slice(currentPage * 2, (currentPage + 1) * 2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [params.id, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  if (!exam) {
    return <div>Loading...</div>; // Hoặc thông báo không tìm thấy
  }

  return (
    <div>
      <Header />
      <br /><br /><br /><br />
      <main className="main-backgroup">
        <div className="main-subject">
          <h1 id="title-exam">Thông tin đề thi</h1>
          <div className="perform">
            <div className="number-exam">
              <div id="number-exam">{exam.id}</div>
            </div>
            <div className="question-content">
              <div className="Info-detail">
                <img id="img-detail" src={exam.image} alt={exam.name} />
                <div className="Information-test">
                  <h2 id="nameElement">{exam.name}</h2>
                  <div className="information">
                    <div className="access">
                      <i className="fas fa-calendar-days" />
                      <span id="sequenceElement">Số lượt thi :{exam.sequence}</span>
                    </div>
                    <div className="access">
                      <i className="fa-solid fa-circle-question" />
                      <span id="numQues">Số câu hỏi: {exam.numQuestions}</span>
                    </div>
                    <div className="access">
                      <i className="fas fa-clock" />
                      <span>Thời gian làm bài:30 phút</span>
                    </div>
                  </div>
                  <div className="star">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                  </div>
                  <a id="indexElement" href="">
                    <Link href={`/pages/user/exam/${exam.id}`} className="start-exam">
                      <i className="fas fa-user-clock" />
                      <b>Bắt Đầu Làm Bài</b>
                    </Link>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <section className="list-subject">
            <h2 id="reference">Đề Thi Tham Khảo</h2>
            <div id="referenceSubject">
              {referenceExams.map((exam: any) => (
                <div key={exam.id} className="exam-item">
                  <img src={exam.image} alt={exam.name} />
                  <div>
                    <h3>{exam.name}</h3>
                    <p>{exam.describe}</p>
                    <button>Bắt Đầu</button>
                  </div>
                </div>
              ))}
            </div>
            <ReactPaginate
              previousLabel={'< Previous'}
              nextLabel={'Next >'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </section>
        </div>
      </main>

      <section className="coment">
        <div id="comment-1" className="coment1">
          <img id="imgAccount" src="" alt="" />
          <p id="nameAccount" />
        </div>
        <div id="comment-2" className="coment2">
          <textarea
            id="input-comment"
            cols={100}
            rows={5}
            placeholder="bình luận...."
            defaultValue={""}
          />
          <button id="oldComment" onClick={() => alert('Bình luận')}>
            Bình luận
          </button>
          <button id="updateComment" onClick={() => alert('Cập nhật')}>
            Cập nhật
          </button>
        </div>
        <button className="coment3" onClick={() => alert('Tất cả bình luận')}>
          <p>Tất cả bình luận</p>
        
        </button>
        <div id="displayComment" className="coment4" />
      </section>
      <Footer />
    </div>
  );
}
