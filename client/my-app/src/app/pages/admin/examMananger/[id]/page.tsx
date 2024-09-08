"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/compoments/admin/header/page";
import Navbar from "@/app/compoments/admin/navbar/page";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../../../../styles/adminExam.css";

interface Exam {
  id: string;
  name: string;
  level: number;
  sequence: number;
  idSubject: number;
  image: string;
  describe: string;
}

export default function ExamPage({ params }: { params: { id: string } }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const courseId = params.id;
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch exams from server
  const fetchExams = () => {
    fetch("http://localhost:5000/examList")
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
        filterExams(data, courseId);
      })
      .catch((error) => console.error("Error fetching exams:", error));
  };

  const filterExams = (exams: Exam[], courseId: string) => {
    const filtered = exams.filter(exam => exam.idSubject.toString() === courseId);
    setFilteredExams(filtered);
  };

  // Handle sorting
  const handleSort = (type: string) => {
    const sortedExams = [...filteredExams];
    if (type === "most") {
      sortedExams.sort((a, b) => b.sequence - a.sequence);
    } else if (type === "least") {
      sortedExams.sort((a, b) => a.sequence - b.sequence);
    } else if (type === "maxLevel") {
      sortedExams.sort((a, b) => b.level - a.level);
    } else if (type === "minLevel") {
      sortedExams.sort((a, b) => a.level - b.level);
    }
    setFilteredExams(sortedExams);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      filterExams(exams, courseId);
    } else {
      const searchedExams = exams.filter((exam) =>
        exam.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredExams(searchedExams);
    }
  };

  // Handle delete functionality
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Đề thi này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/examList/${id}`)
          .then(() => {
            fetchExams();
            Swal.fire("Đã xóa!", "Đề thi đã bị xóa.", "success");
          })
          .catch((error) => {
            console.error("Error deleting exam:", error);
            Swal.fire("Lỗi!", "Không thể xóa đề thi. Vui lòng thử lại.", "error");
          });
      }
    });
  };

  // Handle add functionality
  const handleAdd = () => {
    Swal.fire({
      title: "Thêm đề thi mới",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Tên đề thi">
        <input id="swal-input2" class="swal2-input" placeholder="Cấp độ" type="number">
        <input id="swal-input3" class="swal2-input" placeholder="Ảnh URL">
        <textarea id="swal-input4" class="swal2-textarea" placeholder="Mô tả"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const level = Number((document.getElementById("swal-input2") as HTMLInputElement).value);
        const image = (document.getElementById("swal-input3") as HTMLInputElement).value;
        const describe = (document.getElementById("swal-input4") as HTMLTextAreaElement).value;

        if (!name || !level || !image || !describe) {
          Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
        }
        return { name, level, image, describe };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newExam = {
          name: result.value.name,
          level: result.value.level,
          sequence: 0, // Default value, adjust as needed
          idSubject: Number(courseId), // Ensure courseId is a number
          image: result.value.image,
          describe: result.value.describe,
        };

        axios
          .post("http://localhost:5000/examList", newExam)
          .then(() => {
            fetchExams();
            Swal.fire("Thành công!", "Đề thi mới đã được thêm.", "success");
          })
          .catch((error) => {
            console.error("Error adding exam:", error);
            Swal.fire("Lỗi!", "Không thể thêm đề thi. Vui lòng thử lại.", "error");
          });
      }
    });
  };

  // Handle edit functionality
  const handleEdit = (exam: Exam) => {
    Swal.fire({
      title: "Chỉnh sửa đề thi",
      html: `
        <input id="swal-input1" class="swal2-input" value="${exam.name}" placeholder="Tên đề thi">
        <input id="swal-input2" class="swal2-input" value="${exam.level}" placeholder="Cấp độ" type="number">
        <input id="swal-input3" class="swal2-input" value="${exam.image}" placeholder="Ảnh URL">
        <textarea id="swal-input4" class="swal2-textarea" placeholder="Mô tả">${exam.describe}</textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const level = Number((document.getElementById("swal-input2") as HTMLInputElement).value);
        const image = (document.getElementById("swal-input3") as HTMLInputElement).value;
        const describe = (document.getElementById("swal-input4") as HTMLTextAreaElement).value;

        if (!name || !level || !image || !describe) {
          Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
        }
        return { name, level, image, describe };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/examList/${exam.id}`, {
            ...exam,
            name: result.value.name,
            level: result.value.level,
            image: result.value.image,
            describe: result.value.describe,
          })
          .then(() => {
            fetchExams();
            Swal.fire("Đã lưu!", "Đề thi đã được cập nhật.", "success");
          })
          .catch((error) => {
            console.error("Error updating exam:", error);
            Swal.fire("Lỗi!", "Không thể cập nhật đề thi. Vui lòng thử lại.", "error");
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
            <h1 className="manage-title">Quản lí đề thi</h1>
            <button onClick={handleAdd} className="btn-add">Thêm đề thi</button>
            <div className="sort-items">
              <h4>Sắp xếp theo:</h4>
              <select
                onChange={(e) => handleSort(e.target.value)}
                style={{
                  padding: "6px 16px",
                  backgroundColor: "lightgrey",
                  borderRadius: 6,
                }}
              >
                <option value="">Lượt thi</option>
                <option value="most">Nhiều nhất</option>
                <option value="least">Ít nhất</option>
              </select>
              <select
                onChange={(e) => handleSort(e.target.value)}
                style={{
                  padding: "6px 16px",
                  backgroundColor: "lightgrey",
                  borderRadius: 6,
                }}
              >
                <option value="">Cấp độ</option>
                <option value="maxLevel">Cao nhất</option>
                <option value="minLevel">Thấp nhất</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm đề thi"
                value={searchTerm}
                onChange={handleSearch}
                style={{ padding: "6px 12px", borderRadius: 6 }}
              />
            </div>
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Cấp độ</th>
                  <th>Ảnh</th>
                  <th>Mô tả</th>
                  <th>Lượt thi</th>
                  <td>Chi tiết</td>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.name}</td>
                    <td>{exam.level}</td>
                    <td>
                      <img
                        src={exam.image}
                        alt={exam.name}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    </td>
                    <td>{exam.describe}</td>
                    <td>{exam.sequence}</td>
                    <td>
                      <button
                        onClick={() =>
                          router.push(`/pages/admin/questionMananger/${exam.id}`)
                        }
                      >
                        Chi tiết
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(exam)}>Chỉnh sửa</button>
                      <button onClick={() => handleDelete(exam.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
