"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/compoments/admin/header/page";
import Navbar from "@/app/compoments/admin/navbar/page";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../../../../styles/adminExam.css";

interface Answer {
  answer: string;
  status: number;
}

interface Question {
  questionId: number;
  idExam: number;
  questionName: string;
  answerList: Answer[];
  id: string;
}

export default function QuestionPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questionsPerPage] = useState<number>(5); // Number of questions per page

  const examId = Number(params.id);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch questions from server
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/question");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
      filterQuestions(data, examId);
    } catch (error) {
      console.error("Error fetching questions:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.", "error");
    }
  };

  const filterQuestions = (questions: Question[], examId: number) => {
    const filtered = questions.filter(question => question.idExam === examId);
    setFilteredQuestions(filtered);
    setCurrentPage(1); // Reset to first page on new search or filter
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      filterQuestions(questions, examId);
    } else {
      const searchedQuestions = questions.filter((question) =>
        question.questionName.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredQuestions(searchedQuestions);
    }
  };

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate the index range for the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Calculate total pages
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Handle delete functionality
  const handleDelete = (id: string) => {
 
    
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Câu hỏi này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/question/${id}`)
          .then(() => {
            fetchQuestions();
            Swal.fire("Đã xóa!", "Câu hỏi đã bị xóa.", "success");
          })
          .catch((error) => {
            console.error("Error deleting question:", error);
            Swal.fire("Lỗi!", "Không thể xóa câu hỏi. Vui lòng thử lại.", "error");
          });
      }
    });
  };
  function getRandomFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  // Handle add functionality
  const handleAdd = () => {
    Swal.fire({
      title: "Thêm câu hỏi mới",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Tên câu hỏi">
        <input id="swal-input2" class="swal2-input" placeholder="Đáp án 1">
        <input id="swal-input3" class="swal2-input" placeholder="Đáp án 2">
        <input id="swal-input4" class="swal2-input" placeholder="Đáp án 3">
        <input id="swal-input5" class="swal2-input" placeholder="Đáp án 4">
        <select id="swal-correct-answer" class="swal2-select">
          <option value="0">Đáp án 1</option>
          <option value="1">Đáp án 2</option>
          <option value="2">Đáp án 3</option>
          <option value="3">Đáp án 4</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const questionName = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const answer1 = (document.getElementById("swal-input2") as HTMLInputElement).value;
        const answer2 = (document.getElementById("swal-input3") as HTMLInputElement).value;
        const answer3 = (document.getElementById("swal-input4") as HTMLInputElement).value;
        const answer4 = (document.getElementById("swal-input5") as HTMLInputElement).value;
        const correctAnswerIndex = (document.getElementById("swal-correct-answer") as HTMLSelectElement).value;

        if (!questionName || !answer1 || !answer2 || !answer3 || !answer4) {
          Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
        }

        return {
          questionName,
          answers: [answer1, answer2, answer3, answer4],
          correctAnswerIndex
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newQuestion = {
            questionId:getRandomFourDigitNumber() ,
          questionName: result.value.questionName,
          idExam: examId,
          answerList: result.value.answers.map((answer:Answer, index:number) => ({
            answer: answer,
            status: index === Number(result.value.correctAnswerIndex) ? 1 : 0,
          })),
        };

        axios
          .post("http://localhost:5000/question", newQuestion)
          .then(() => {
            fetchQuestions();
            Swal.fire("Thành công!", "Câu hỏi mới đã được thêm.", "success");
          })
          .catch((error) => {
            console.error("Error adding question:", error);
            Swal.fire("Lỗi!", "Không thể thêm câu hỏi. Vui lòng thử lại.", "error");
          });
      }
    });
  };


  const handleEdit = (question: Question) => {
    Swal.fire({
      title: "Chỉnh sửa câu hỏi",
      html: `
        <input id="swal-input1" class="swal2-input" value="${question.questionName}" placeholder="Tên câu hỏi">
        <input id="swal-input2" class="swal2-input" value="${question.answerList[0].answer}" placeholder="Đáp án 1">
        <input id="swal-input3" class="swal2-input" value="${question.answerList[1]?.answer || ''}" placeholder="Đáp án 2">
        <input id="swal-input4" class="swal2-input" value="${question.answerList[2]?.answer || ''}" placeholder="Đáp án 3">
        <input id="swal-input5" class="swal2-input" value="${question.answerList[3]?.answer || ''}" placeholder="Đáp án 4">
        <select id="swal-correct-answer" class="swal2-select">
          <option value="0" ${question.answerList[0].status === 1 ? 'selected' : ''}>Đáp án 1</option>
          <option value="1" ${question.answerList[1]?.status === 1 ? 'selected' : ''}>Đáp án 2</option>
          <option value="2" ${question.answerList[2]?.status === 1 ? 'selected' : ''}>Đáp án 3</option>
          <option value="3" ${question.answerList[3]?.status === 1 ? 'selected' : ''}>Đáp án 4</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const questionName = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const answer1 = (document.getElementById("swal-input2") as HTMLInputElement).value;
        const answer2 = (document.getElementById("swal-input3") as HTMLInputElement).value;
        const answer3 = (document.getElementById("swal-input4") as HTMLInputElement).value;
        const answer4 = (document.getElementById("swal-input5") as HTMLInputElement).value;
        const correctAnswerIndex = (document.getElementById("swal-correct-answer") as HTMLSelectElement).value;

        if (!questionName || !answer1 || !answer2 || !answer3 || !answer4) {
          Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
        }

        return {
          questionName,
          answers: [answer1, answer2, answer3, answer4],
          correctAnswerIndex
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedQuestion = {
          ...question,
          questionName: result.value.questionName,
          answerList: result.value.answers.map((answer:Answer, index:number) => ({
            answer: answer,
            status: index === Number(result.value.correctAnswerIndex) ? 1 : 0,
          })),
        };

        axios
          .put(`http://localhost:5000/question/${question.id}`, updatedQuestion)
          .then(() => {
            fetchQuestions();
            Swal.fire("Thành công!", "Câu hỏi đã được cập nhật.", "success");
          })
          .catch((error) => {
            console.error("Error editing question:", error);
            Swal.fire("Lỗi!", "Không thể cập nhật câu hỏi. Vui lòng thử lại.", "error");
          });
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="container-content-admin">
        <Navbar />
        <section className="attendance" style={{ width: "80%" }}>
          <div className="attendance-list">
            <h1 className="manage-title">Quản lí câu hỏi</h1>
            <button onClick={handleAdd} className="btn-add">Thêm câu hỏi</button>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi"
                value={searchTerm}
                onChange={handleSearch}
                style={{ padding: "6px 12px", borderRadius: 6 }}
              />
            </div>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Tên câu hỏi</th>
                  <th>Đáp án đúng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions.map((question) => (
                  <tr key={question.questionId}>
                    <td>{question.questionName}</td>
                    <td>{question.answerList.find(a => a.status === 1)?.answer || 'Chưa xác định'}</td>
                    <td>
                      <button onClick={() => handleEdit(question)} className="btn-edit">Sửa</button>
                      <button onClick={() => handleDelete(question.id)} className="btn-delete">Xóa</button>
           
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Trang trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`page-button ${index + 1 === currentPage ? 'active' : ''}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="page-button"
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Trang sau &raquo;
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
