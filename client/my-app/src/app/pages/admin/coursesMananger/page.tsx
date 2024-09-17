"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../config/firebase"; 
import Header from "@/app/compoments/admin/header/page";
import Navbar from "@/app/compoments/admin/navbar/page";
import "../../../styles/adminSubject.css";

interface Course {
  id: string;
  title: string;
  description: string;
  img?: string;
}

interface Subject {
  id: string;
  idCourese: number;
  subject: string;
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = () => {
    fetch("http://localhost:5000/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const fetchSubjects = () => {
    fetch("http://localhost:5000/subjectList")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Điều này sẽ xóa tất cả các môn học liên quan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/courses/${id}`)
          .then(() => {
            fetchCourses();
            Swal.fire("Xóa thành công!", "Khóa học đã được xóa.", "success");
          })
          .catch((error) => {
            Swal.fire("Lỗi!", "Không thể xóa khóa học. Vui lòng thử lại.", "error");
            console.error("Error deleting course:", error);
          });
      }
    });
  };

  const handleAddOrEdit = (course: Course | null) => {
    showCourseModal(course);
  };

  const showCourseModal = (course: Course | null) => {
    Swal.fire({
      title: course ? "Sửa khóa học" : "Thêm khóa học",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Tên khóa học" value="${
          course?.title || ""
        }">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Mô tả">${
          course?.description || ""
        }</textarea>
        <input type="file" id="swal-input3" class="swal2-file">
      `,
      showCancelButton: true,
      confirmButtonText: course ? "Cập nhật" : "Thêm",
      cancelButtonText: "Hủy",
      preConfirm: async () => {
        const title = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const description = (document.getElementById("swal-input2") as HTMLTextAreaElement).value;
        const fileInput = document.getElementById("swal-input3") as HTMLInputElement;
        const file = fileInput.files ? fileInput.files[0] : null;

        if (!title || !description) {
          Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
          return false;
        }

        let img = course?.img || ""; // Retain existing image URL for edit
        if (file) {
          try {
            setUploading(true);
            const storageRef = ref(storage, `courses/${file.name}`);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            img = await getDownloadURL(uploadTask.ref);
          } catch (error) {
            console.error("Error uploading image:", error);
            Swal.showValidationMessage("Không thể tải lên ảnh");
            return false;
          } finally {
            setUploading(false);
          }
        }

        return { title, description, img };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newCourse: Course = {
          id: course ? course.id : Date.now().toString(), // Keep id for edit, create new for add
          title: result.value?.title || "",
          description: result.value?.description || "",
          img: result.value?.img || "",
        };

        if (course) {
          // Update course
          axios
            .put(`http://localhost:5000/courses/${course.id}`, newCourse)
            .then(() => {
              fetchCourses();
              Swal.fire("Cập nhật thành công!", "Khóa học đã được cập nhật.", "success");
            })
            .catch((error) => {
              Swal.fire("Lỗi!", "Không thể cập nhật khóa học. Vui lòng thử lại.", "error");
              console.error("Error updating course:", error);
            });
        } else {
          // Add new course
          axios
            .post("http://localhost:5000/courses", newCourse)
            .then(() => {
              fetchCourses();
              Swal.fire("Thêm thành công!", "Khóa học đã được thêm.", "success");
            })
            .catch((error) => {
              Swal.fire("Lỗi!", "Không thể thêm khóa học. Vui lòng thử lại.", "error");
              console.error("Error adding course:", error);
            });
        }
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
            <h1 className="manage-title">Quản lí khóa thi</h1>
            <div className="sort-items"></div>
            <button onClick={() => handleAddOrEdit(null)} className="addcourses">Thêm khóa học</button>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khóa học</th>
                  <th>Số lượng môn</th>
                  <th>Chi tiết</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>
                      {subjects.filter(
                        (subject) => subject.idCourese === Number(course.id)
                      ).length}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          router.push(`subjectMananger/${course.id}`)
                        }
                      >
                        Chi tiết
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleAddOrEdit(course)}>Sửa</button>
                      <button onClick={() => handleDelete(course.id)}>Xóa</button>
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
