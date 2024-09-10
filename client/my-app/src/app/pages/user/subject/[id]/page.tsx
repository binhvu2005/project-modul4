"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import axios from "axios";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import "@/app/styles/Subjects.css";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  img: string;
  description: string;
}

interface Subject {
  id: string;
  idCourese: number;
  img: string;
  subject: string;
}

interface Exam {
  id: number;
  idSubject: number;
  level: number;
  name: string;
  describe: string;
  image: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const courseId = parseInt(params.id, 10);

  const examsPerPage = 2; // Number of exams per page

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get<Course[]>("http://localhost:5000/courses");
        const foundCourse = response.data.find(c => parseInt(c.id, 10) === courseId);
        setCourse(foundCourse || null);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>("http://localhost:5000/subjectList");
        const filteredSubjects = response.data.filter(subject => subject.idCourese === courseId);
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (courseId) {
      fetchSubjects();
    }
  }, [courseId]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get<Exam[]>("http://localhost:5000/examList");
        const filteredExams = response.data.filter(exam => {
          return (
            (!selectedSubject || exam.idSubject === selectedSubject) &&
            (!selectedLevel || exam.level === selectedLevel)
          );
        });
        setExams(filteredExams);
        setTotalPages(Math.ceil(filteredExams.length / examsPerPage));
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, [selectedSubject, selectedLevel]);

  const handleSubjectClick = (subjectId: number) => {
    setSelectedSubject(subjectId);
  };

  const handleLevelClick = (level: number) => {
    setSelectedLevel(level);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Compute the exams to display on the current page
  const startIndex = (currentPage - 1) * examsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + examsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <Header />
      <main className="main">
        <section className="course-header">
          {course && (
            <>
              <img className="course-img" src={course.img} alt={course.title} />
              <div className="course-details">
                <h1>{course.title}</h1>
                <p>{course.description}</p>
                <section className="content-first">
                  <div className="subjects-list">
                    {subjects.map(subject => (
                      <div
                        key={subject.id}
                        onClick={() => handleSubjectClick(parseInt(subject.id, 10))}
                        className={`subject-item ${selectedSubject === parseInt(subject.id, 10) ? "active" : ""}`}
                      >
                        <img src={subject.img} alt={subject.subject} />
                        <p>{subject.subject}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <div id="horizontal" />
                <nav className="nav-choice">
                  <h1>Độ khó</h1>
                  <ul className="ul-choice">
                    {[1, 2, 3, 4, 5].map(level => (
                      <li
                        key={level}
                        onClick={() => handleLevelClick(level)}
                        className={`li-choice ${selectedLevel === level ? "active" : ""}`}
                      >
                        Level {level}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </section>
        <hr />
        <h1 className="a1">Danh sách các đề thi</h1>
        <div id="examList" className="list-exam">
          {currentExams.length > 0 ? (
            currentExams.map(exam => (
              <Link href={`/pages/user/exam/${exam.id}`} key={exam.id} className="exam-item">
                <img src={exam.image} alt={exam.name} />
                <div>
                  <h2>{exam.name}</h2>
                  <p>{exam.describe}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No exams available for the selected subject and level.</p>
          )}
        </div>

        <section className="choose-list" style={{ marginTop: 100 }}>
          <div className="pagination">
            <button
              type="button"
              className="btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IonIcon icon={chevronBackOutline} />
              <span>Trang trước</span>
            </button>
            {pageNumbers.map(number => (
              <button
                key={number}
                type="button"
                className={`page-number ${currentPage === number ? "active" : ""}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              className="btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Trang sau</span>
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
