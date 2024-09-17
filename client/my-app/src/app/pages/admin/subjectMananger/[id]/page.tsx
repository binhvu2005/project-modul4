"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/compoments/admin/header/page";
import Navbar from "@/app/compoments/admin/navbar/page";
import Swal from 'sweetalert2';

import axios from "axios";
import { useRouter } from "next/navigation";
import "../../../../styles/adminSubject.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../../config/firebase";

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

  const handleAdd = () => {
    Swal.fire({
      title: "Thêm môn học mới",
      html: `
        <input type="text" id="subjectName" class="swal2-input" placeholder="Tên môn học">
        <input type="file" id="subjectImage" class="swal2-input">
      `,
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const subjectNameInput = Swal.getPopup()?.querySelector("#subjectName") as HTMLInputElement;
        const subjectImageInput = Swal.getPopup()?.querySelector("#subjectImage") as HTMLInputElement;
        if (!subjectNameInput?.value) {
          Swal.showValidationMessage("Vui lòng nhập tên môn học");
        }
        const subjectName = subjectNameInput.value;
        const subjectImageFile = subjectImageInput?.files?.[0];
        return { subjectName, subjectImageFile };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { subjectName, subjectImageFile } = result.value;

        if (subjectImageFile) {
          const storageRef = ref(storage, `subjects/${subjectImageFile.name}`);
          uploadBytes(storageRef, subjectImageFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              const newSubject = {
                idCourese: parseInt(courseId),
                subject: subjectName,
                img: downloadURL,
              };

              axios
                .post("http://localhost:5000/subjectList", newSubject)
                .then(() => {
                  fetchSubjects();
                  Swal.fire("Thành công!", "Môn học mới đã được thêm.", "success");
                })
                .catch((error) => {
                  console.error("Error adding subject:", error);
                  Swal.fire("Lỗi!", "Không thể thêm môn học. Vui lòng thử lại.", "error");
                });
            });
          });
        }
      }
    });
  };

  const handleEdit = (subject: Subject) => {
    Swal.fire({
      title: "Chỉnh sửa môn học",
      html: `
        <input type="text" id="subjectName" class="swal2-input" value="${subject.subject}">
        <input type="file" id="subjectImage" class="swal2-input">
      `,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const subjectNameInput = Swal.getPopup()?.querySelector("#subjectName") as HTMLInputElement;
        const subjectImageInput = Swal.getPopup()?.querySelector("#subjectImage") as HTMLInputElement;
        if (!subjectNameInput?.value) {
          Swal.showValidationMessage("Tên môn học không được để trống");
        }
        const newSubjectName = subjectNameInput.value;
        const newSubjectImageFile = subjectImageInput?.files?.[0];
        return { newSubjectName, newSubjectImageFile };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { newSubjectName, newSubjectImageFile } = result.value;

        if (newSubjectImageFile) {
          const storageRef = ref(storage, `subjects/${newSubjectImageFile.name}`);
          uploadBytes(storageRef, newSubjectImageFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              const updatedSubject = {
                ...subject,
                subject: newSubjectName,
                img: downloadURL,
              };

              axios
                .put(`http://localhost:5000/subjectList/${subject.id}`, updatedSubject)
                .then(() => {
                  fetchSubjects();
                  Swal.fire("Đã lưu!", "Môn học đã được cập nhật.", "success");
                })
                .catch((error) => {
                  console.error("Error updating subject:", error);
                  Swal.fire("Lỗi!", "Không thể cập nhật môn học. Vui lòng thử lại.", "error");
                });
            });
          });
        } else {
          const updatedSubject = {
            ...subject,
            subject: newSubjectName,
          };

          axios
            .put(`http://localhost:5000/subjectList/${subject.id}`, updatedSubject)
            .then(() => {
              fetchSubjects();
              Swal.fire("Đã lưu!", "Môn học đã được cập nhật.", "success");
            })
            .catch((error) => {
              console.error("Error updating subject:", error);
              Swal.fire("Lỗi!", "Không thể cập nhật môn học. Vui lòng thử lại.", "error");
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
            <h1 className="manage-title">Quản lí môn thi</h1>
            <button onClick={handleAdd} className="btn-add">Thêm môn học</button>
            <div className="sort-items">
              <h4>Sắp xếp theo:</h4>
              <select
                onChange={(e) => handleSort(e.target.value)}
                style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
              >
                <option value="subDefault">Theo mã môn</option>
                <option value="subSmallBig">Mã môn nhỏ đến lớn</option>
                <option value="subBigSmall">Mã môn lớn đến nhỏ</option>
                <option value="AZ">A-Z</option>
                <option value="ZA">Z-A</option>
              </select>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm môn học"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Môn học</th>
                  <th>Chi tiết</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.subject}</td>
                    <td> <button
                        onClick={() =>
                          router.push(`/pages/admin/examMananger/${subject.id}`)
                        }
                      >
                        Chi tiết
                      </button></td>
                    <td>
                      <button onClick={() => handleEdit(subject)} className="btn-edit">Sửa</button>
                      <button onClick={() => handleDelete(subject.id)} className="btn-delete">Xóa</button>
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
