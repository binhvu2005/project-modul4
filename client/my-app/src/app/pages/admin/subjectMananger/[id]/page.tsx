"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/compoments/admin/header/page";
import Navbar from "@/app/compoments/admin/navbar/page";
import Swal from "sweetalert2";
import axios from "axios";
import Link from "next/link";
import "../../../../styles/adminSubject.css";
import {  useRouter } from "next/navigation";

interface Subject {
  id: string;
  idCourese: number;
  subject: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const courseId = params.id;
  const router = useRouter();
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch subjects from server
  const fetchSubjects = () => {
    fetch("http://localhost:5000/subjectList")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        filterSubjects(data, courseId);
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  };

  const filterSubjects = (subjects: Subject[], courseId: string) => {
    const filtered = subjects.filter(
      (subject) => subject.idCourese === parseInt(courseId)
    );
    setFilteredSubjects(filtered);
  };

  // Handle sorting
  const handleSort = (type: string) => {
    const sortedSubjects = [...filteredSubjects];
    if (type === "subSmallBig") {
      sortedSubjects.sort((a, b) => a.id.localeCompare(b.id));
    } else if (type === "subBigSmall") {
      sortedSubjects.sort((a, b) => b.id.localeCompare(a.id));
    } else if (type === "AZ") {
      sortedSubjects.sort((a, b) => a.subject.localeCompare(b.subject));
    } else if (type === "ZA") {
      sortedSubjects.sort((a, b) => b.subject.localeCompare(a.subject));
    }
    setFilteredSubjects(sortedSubjects);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      filterSubjects(subjects, courseId);
    } else {
      const searchedSubjects = subjects.filter((subject) =>
        subject.subject.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredSubjects(searchedSubjects);
    }
  };

  // Handle Delete functionality
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Môn học này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/subjectList/${id}`)
          .then(() => {
            fetchSubjects();
            Swal.fire("Đã xóa!", "Môn học đã bị xóa.", "success");
          })
          .catch((error) => {
            console.error("Error deleting subject:", error);
            Swal.fire("Lỗi!", "Không thể xóa môn học. Vui lòng thử lại.", "error");
          });
      }
    });
  };

  // Handle Add functionality with SweetAlert2
  const handleAdd = () => {
    Swal.fire({
      title: "Thêm môn học mới",
      input: "text",
      inputLabel: "Tên môn học",
      inputPlaceholder: "Nhập tên môn học",
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy",
      preConfirm: (subjectName) => {
        if (!subjectName) {
          Swal.showValidationMessage("Vui lòng nhập tên môn học");
        }
        return subjectName;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newSubject = {
          idCourese: parseInt(courseId), // Assuming this course ID comes from params
          subject: result.value,
        };

        axios
          .post("http://localhost:5000/subjectList", newSubject)
          .then(() => {
            fetchSubjects(); // Refresh subjects list after adding
            Swal.fire("Thành công!", "Môn học mới đã được thêm.", "success");
          })
          .catch((error) => {
            console.error("Error adding subject:", error);
            Swal.fire("Lỗi!", "Không thể thêm môn học. Vui lòng thử lại.", "error");
          });
      }
    });
  };
// Add this handleEdit function
const handleEdit = (subject: Subject) => {
  // You can add your edit logic here, e.g., navigating to an edit page or opening a modal to edit the subject
  Swal.fire({
    title: "Chỉnh sửa môn học",
    input: "text",
    inputLabel: "Tên môn học",
    inputValue: subject.subject,
    showCancelButton: true,
    confirmButtonText: "Lưu",
    cancelButtonText: "Hủy",
    preConfirm: (newSubjectName) => {
      if (!newSubjectName) {
        Swal.showValidationMessage("Tên môn học không được để trống");
      }
      return newSubjectName;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Here you can call an API to update the subject
      axios
        .put(`http://localhost:5000/subjectList/${subject.id}`, {
          ...subject,
          subject: result.value,
        })
        .then(() => {
          fetchSubjects(); // Refresh the subject list
          Swal.fire("Đã lưu!", "Môn học đã được cập nhật.", "success");
        })
        .catch((error) => {
          console.error("Error updating subject:", error);
          Swal.fire("Lỗi!", "Không thể cập nhật môn học. Vui lòng thử lại.", "error");
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
            <h1 className="manage-title">Quản lí môn thi</h1>
            <button onClick={handleAdd} className="btn-add">Thêm môn học</button>
            <div className="sort-items">
              <h4>Sắp xếp theo:</h4>
              <select
                onChange={(e) => handleSort(e.target.value)}
                style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
              >
                <option value="subDefault">Theo mã môn</option>
                <option value="subSmallBig">Từ nhỏ - lớn</option>
                <option value="subBigSmall">Từ lớn - nhỏ</option>
              </select>
              <select
                onChange={(e) => handleSort(e.target.value)}
                style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
              >
                <option value="">Theo tên môn</option>
                <option value="AZ">Từ A - Z</option>
                <option value="ZA">Từ Z - A</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm môn học"
                value={searchTerm}
                onChange={handleSearch}
                style={{ padding: "6px 16px", borderRadius: 6 }}
              />
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Môn học</th>
                
                  <th>Chi tiết</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody id="tableSubject">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.subject}</td>
                  
                    <td>
                      <button
                        onClick={() =>
                          router.push(`/pages/admin/examMananger/${subject.id}`)
                        }
                      >
                        Chi tiết
                      </button>
                      </td>
                    <td>
                      <button onClick={() => handleEdit(subject)}>Sửa</button>
                      <button onClick={() => handleDelete(subject.id)}>Xóa</button>
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
