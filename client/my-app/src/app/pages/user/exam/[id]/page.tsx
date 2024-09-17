"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "@/app/compoments/user/header/page";
import Footer from "@/app/compoments/user/footer/page";
import "@/app/styles/exam.css";
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Page({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<any>(null);
  const [referenceExams, setReferenceExams] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch exam data
        const examResponse = await axios.get('http://localhost:5000/examList');
        const exams = examResponse.data;
        const currentExam = exams.find((exam: any) => exam.id === params.id);
        const referenceExams = exams.filter((exam: any) => exam.id !== params.id && exam.idSubject === currentExam.idSubject);

        // Fetch comments data
        const commentsResponse = await axios.get('http://localhost:5000/comment');
        const commentsData = commentsResponse.data;

        // Filter comments for the specific exam
        const examComments = commentsData.filter((comment: any) => comment.idExam === params.id);

        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/userList');
        const users = userResponse.data;

        // Get current user from localStorage
        const idUserLogin = typeof window !== 'undefined' ? localStorage.getItem('keyLogin') : null;
        const currentUser = idUserLogin ? users.find((user: any) => user.id === idUserLogin) : null;

        // Enrich comments with user data
        const enrichedComments = examComments.map((comment: any) => ({
          ...comment,
          user: users.find((user: any) => user.id === comment.idUser) || { name: 'Unknown', img: '/default-avatar.png' },
        }));

        // Update state
        setExam(currentExam);
        setReferenceExams(referenceExams.slice(currentPage * 2, (currentPage + 1) * 2));
        setComments(enrichedComments);
        setCurrentUser(currentUser);
        setTotalPages(Math.ceil(referenceExams.length / 2));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [params.id, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleAddOrUpdateComment = async () => {
    if (newComment.trim() === '') return;

    try {
      if (editingCommentId) {
        // Update comment
        await axios.put(`http://localhost:5000/comment/${editingCommentId}`, { content: newComment });
        setComments(prevComments => prevComments.map(comment =>
          comment.id === editingCommentId ? { ...comment, content: newComment } : comment
        ));
        setEditingCommentId(null);
      } else {
        // Add new comment
        const response = await axios.post('http://localhost:5000/comment', {
          idExam: params.id,
          idUser: currentUser.id,
          content: newComment,
          date: new Date().toISOString()
        });
        const newCommentData = response.data;
        setComments([...comments, {
          ...newCommentData, user: currentUser
        }]);
      }
      setNewComment('');
    } catch (error) {
      console.error('Error adding/updating comment:', error);
    }
  };
  const handleDeleteComment = (commentId: string) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa bình luận?',
      text: 'Bạn sẽ không thể hoàn tác hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => { // Thêm 'async' ở đây
      if (result.isConfirmed) {
        try {
          // Thực hiện xóa bình luận nếu người dùng xác nhận
          await axios.delete(`http://localhost:5000/comment/${commentId}`);
          setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  
          Swal.fire('Đã xóa bình luận!', '', 'success');
        } catch (error) {
          console.error('Error deleting comment:', error);
          Swal.fire('Có lỗi xảy ra!', 'Bình luận chưa được xóa.', 'error');
        }
      }
    });
  };
  

  const toggleShowComments = () => {
    setShowAllComments(!showAllComments);
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  const displayedComments = showAllComments ? comments : comments.slice(0, 1);

  return (
    <div>
      <Header /> <br /><br /><br /><br /><br />
      <main className="main-background">
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
                      <span id="sequenceElement">Số lượt thi: {exam.sequence}</span>
                    </div>
                    <div className="access">
                      <i className="fa-solid fa-circle-question" />
                      <span id="numQues">Số câu hỏi: {exam.numQuestions}</span>
                    </div>
                    <div className="access">
                      <i className="fas fa-clock" />
                      <span>Thời gian làm bài: 30 phút</span>
                    </div>
                  </div>
                  <div className="star">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                  </div>
                  <Link href={`/pages/user/test/${exam.id}`} className="start-exam">
                    <i className="fas fa-user-clock" />
                    <b>Bắt Đầu Làm Bài</b>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <section className="list-subject">
            <h2 id="reference">Đề Thi Tham Khảo</h2>
            <div id="referenceSubject">
              {referenceExams.map((exam: any) => (
                <div key={exam.id} className="exam-item">
                  <img src={exam.image} alt={exam.name} style={{ width: '250px', height: '150px' }} />
                  <div>
                    <h3>{exam.name}</h3>
                    <p>Số câu hỏi: {exam.numQuestions}</p>
                    <p>Số lượt thi: {exam.sequence}</p>
                    <Link href={`/pages/user/exam/${exam.id}`} className="start-exam">Xem Chi Tiết</Link>
                  </div>
                </div>
              ))}
            </div>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={totalPages}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </section>

          <section className="list-comment">
            <h2>Đánh Giá</h2>
            {currentUser && (
              <div className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Nhập bình luận của bạn"
                />
                <button onClick={handleAddOrUpdateComment}>
                  {editingCommentId ? 'Cập Nhật Bình Luận' : 'Thêm Bình Luận'}
                </button>
              </div>
            )}
            <button onClick={toggleShowComments}>
              {showAllComments ? 'Thu gọn bình luận' : 'Hiển thị tất cả bình luận'}
            </button>

            {displayedComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <img src={comment.user.img} alt="User" />
                <div className="comment-content">
                  <h3>{comment.user.nameAccount}</h3>
                  <p>{comment.content}</p>
                  <span>{new Date(comment.date).toLocaleString()}</span>
                  {currentUser && currentUser.id === comment.idUser && (
                    <div className="comment-actions">
                      <button onClick={() => { setEditingCommentId(comment.id); setNewComment(comment.content); }}>Sửa</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>Xóa</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
