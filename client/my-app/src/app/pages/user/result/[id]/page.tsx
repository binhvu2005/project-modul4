"use client"
import React, { useEffect, useState } from 'react';
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import "@/app/styles/test-result.css";
import axios from 'axios';

export interface UserAnswer {
  id: number;
  idExam: string;
  idUser: string;
  score: number;
  time: string;
  date: string;
  answers: {
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean;
  }[];
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

export interface Answer {
  answer: string;
  status: number; // Assuming 1 is correct and 0 is incorrect
}

export interface Question {
  questionId: string; // Ensure it matches API data
  idExam: string; // Ensure it matches API data
  questionName: string;
  answerList: Answer[];
  explanation?: string; 
}

export default function Page({ params }: { params: { id: string } }) {
  const idTest = +params.id;
  const [result, setResult] = useState<UserAnswer | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 2;

  // Fetch test result
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get<UserAnswer[]>("http://localhost:5000/userAnswer");
        const resultData = response.data.find((r) => r.id === idTest);
        setResult(resultData || null);
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };
    fetchResult();
  }, [idTest]);

  // Fetch exam details
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get<Exam[]>("http://localhost:5000/examList");
        const examData = response.data.find((e) => e.id === result?.idExam);
        setExam(examData || null);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };
    if (result) {
      fetchExam();
    }
  }, [result]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Question[]>("http://localhost:5000/question");
        const questionsData = response.data.filter((q) => q.idExam == result?.idExam);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    if (result) {
      fetchQuestions();
    }
  }, [result]);

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!result || !exam || questions.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <br /><br /><br />
      <section className="section">
        <div className="left-container">
          <div className="result">
            <div className="mark" id="mark">{result.score?.toFixed(2) || "N/A"}</div>
            <div className="info" id="infoExem">
              <h1>{exam.name || "Exam Title"}</h1>
              <div className="quantity">
                <div className="exam-turn">
                  <i className="fa-regular fa-calendar-check"></i>
                  <span>{exam.sequence} lượt thi</span>
                </div>
                <div className="questions">
                  <i className="fa-regular fa-circle-question"></i>
                  <span>{questions.length} câu hỏi</span>
                </div>
                <div className="time">
                  <i className="fa-regular fa-clock"></i>
                  <span>{exam.describe || 0} phút</span>
                </div>
              </div>
              <div className="button">
                <a href={`/pages/user/test/${idTest}`}>
                  <button>Thi lại <i className="fa-solid fa-rotate-left"></i></button>
                </a>
                <a href="/pages/user/subjects">
                  <button>Bài tiếp theo <i className="fa-solid fa-forward"></i></button>
                </a>
              </div>
              <div className="next-test">
                <p>
                  Bài tương tự:
                  <a href="/pages/user/test/another-example">Đề thi thử TNTHPTQG môn Vật Lý năm 2023 (đề 1)</a>
                </p>
              </div>
            </div>
          </div>

        </div>
          <div className="right-container">
            {questions.map((question, index) => {
              const isCorrect = result.answers[index]?.isCorrect;
              return (
                <div
                  key={index}
                  className={`number ${isCorrect ? 'correct' : 'incorrect'}`} // Apply color based on correctness
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
      </section>
        <br />
        <hr />
        <br />
        <div className="num-questions">
  {currentQuestions.map((question, index) => {
    // Tìm câu trả lời đúng
    const correctAnswer = question.answerList.find(answer => answer.status === 1);

    return (
      <div key={index} className="question" id={`question${index}`}>
        <b>{index + 1}</b>
        <p>{question.questionName}</p>
        <form className="radio" id={`answerForm${index}`}>
          {question.answerList.map((option, optIndex) => (
            <div key={optIndex}>
              <input
                type="radio"
                id={`answer${optIndex}`}
                name={`question${index}`}
                value={optIndex}
                checked={option.status === 1}
                readOnly
              />
              <label htmlFor={`answer${optIndex}`}>{option.answer}</label>
            </div>
          ))}
        </form>
        <div className="reason">
          <p>GIẢI THÍCH</p>
          <p>Đáp án đúng: {correctAnswer?.answer || "Không có đáp án đúng"}</p>
        </div>
      </div>
    );
  })}
</div>

        {/* Pagination Buttons */}
        <div className="pagination">
  <button 
    onClick={() => paginate(currentPage - 1)} 
    disabled={currentPage === 1}
    className="prev-next"
  >
    Previous
  </button>
  
  {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }).map((_, pageIndex) => (
    <button
      key={pageIndex}
      onClick={() => paginate(pageIndex + 1)}
      className={currentPage === pageIndex + 1 ? "active" : ""}
    >
      {pageIndex + 1}
    </button>
  ))}
  
  <button 
    onClick={() => paginate(currentPage + 1)} 
    disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}
    className="prev-next"
  >
    Next
  </button>
</div>

      <Footer />
    </div>
  );
}
