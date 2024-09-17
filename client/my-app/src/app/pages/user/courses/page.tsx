"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import '@/app/styles/courses.css';
import Link from 'next/link';

// Define the Course interface
interface Course {
  id: string;
  title: string;
  img: string;
  description: string;
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]); // Define the type for the courses state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2;

  useEffect(() => {
    axios.get('http://localhost:5000/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Header />
      <br /><br /><br /><br /><br /><br />
      <div className="container">
        <h1 className='content'>Danh sách Khóa học</h1>
        
        {/* Introduction Section */}
        <div className="introduction">
          <p>Chào mừng bạn đến với danh sách các khóa học của chúng tôi. Chúng tôi cung cấp các khóa học luyện thi từ tiểu học đến trung học phổ thông để giúp bạn đạt được thành tích cao trong các kỳ thi.</p>
        </div>
<br /><br />
        <div className="courses-grid">
          {currentCourses.map((course) => (
            <Link className="course-card" key={course.id} href={`/pages/user/subject/${course.id}`}>
              <img src={course.img} alt={course.title} className="course-image" />
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </Link>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="pagination" >
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-button">
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
