"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/styles/test.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faClock } from "@fortawesome/free-solid-svg-icons";

export default function Page({ params }: { params: { id: string } }) {
  const [login, setLogin] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [yourProfile, setYourProfile] = useState<any>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(1200); // 20 minutes countdown
  const router = useRouter();
  const idExam = params.id;

  // Fetch user data and check login
  useEffect(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get("http://localhost:5000/userList");
          const users = response.data;
          const currentUser = users.find((user: any) => user.id === idUserLogin);
          if (currentUser) {
            setUser(currentUser);
            setLogin(true);
            setYourProfile(currentUser);
          } else {
            setLogin(false);
            Swal.fire({
              title: "User not found!",
              text: "Redirecting to login...",
              icon: "error",
            }).then(() => {
              router.push("/pages/user/sign-in");
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setLogin(false);
        Swal.fire({
          title: "Bạn chưa đăng nhập!",
          text: "Vui lòng thực hiện đăng nhập",
          icon: "error",
        }).then(() => {
          router.push("/pages/user/sign-in");
        });
      }
    };

    fetchUser();
  }, [router]);

  // Fetch exam questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/question");
        const questions = response.data.filter((question: any) => question.idExam == idExam);
        const shuffled = shuffleArray(questions);
        setShuffledQuestions(shuffled);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (idExam) {
      fetchQuestions();
    }
  }, [idExam]);

  // Shuffle questions and answers
  const shuffleArray = (array: any[]) => {
    const shuffled = array.map((question) => ({
      ...question,
      answerList: question.answerList.sort(() => Math.random() - 0.5),
    }));
    return shuffled.sort(() => Math.random() - 0.5);
  };

  // Handle answer selection
  const handleAnswerChange = (index: number, answerIndex: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answerIndex.toString();
    setUserAnswers(updatedAnswers);
    localStorage.setItem("userAnswers", JSON.stringify(updatedAnswers));
  };

  // Handle exam submission
  const handleSubmit = async () => {
    Swal.fire({
      title: "Bạn có chắc chắn nộp bài không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let score = 0;
        const totalQuestions = shuffledQuestions.length;
        const correctAnswersCount = shuffledQuestions.reduce((count, question, index) => {
          if (userAnswers[index] && question.answerList[userAnswers[index]].status === 1) {
            return count + 1;
          }
          return count;
        }, 0);
  
        // Calculate score on a scale of 10
        score = (correctAnswersCount / totalQuestions) * 10;
  
        // Handle unanswered questions
        const answersWithStatus = shuffledQuestions.map((question, index) => {
          return {
            questionId: question.id,
            selectedAnswer: userAnswers[index] !== undefined ? userAnswers[index] : null,
            isCorrect: userAnswers[index] !== undefined && question.answerList[userAnswers[index]].status === 1
              ? true
              : false,
          };
        });
  
        // Tính thời gian làm bài
        const timeTaken = 1200 - countdown;
        const formattedTime = formatTime(timeTaken);
  
        // Tạo đối tượng kết quả thi
        const examResult = {
          id: Math.floor(Math.random() * 10000), 
          idExam,
          idUser: user.id,
          score,
          time: formattedTime,
          date: new Date().toLocaleString(),
          answers: answersWithStatus,
        };
  
        try {
          // Gửi kết quả thi đến API
          await axios.post("http://localhost:5000/userAnswer", examResult);
  
          // Update user profile with new result
          const updatedUser = {
            ...user,
            result: [
              ...user.result,
              {
                idTest: examResult.id,
                score,
                time: formattedTime,
                date: new Date().toLocaleString(),
              },
            ],
          };
   
          await axios.put(`http://localhost:5000/userList/${user.id}`, updatedUser);
  
          Swal.fire({
            title: "Nộp bài thành công!",
            text: `Điểm của bạn là ${score.toFixed(2)}. Thời gian làm bài: ${formattedTime}`,
            icon: "success",
          });
  
          router.push(`/pages/user/result/${examResult.id}`);
          
        } catch (error) {
          console.error("Error submitting exam:", error);
          Swal.fire({
            title: "Có lỗi xảy ra!",
            text: "Không thể nộp bài thi. Vui lòng thử lại.",
            icon: "error",
          });
        }
      }
    });
  };
  

  // Format time from seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (countdown === 0) {
      handleSubmit();
    }
  }, [countdown]);

  if (!login) return <div>Loading...</div>;
  if (!shuffledQuestions.length) return <div>Loading questions...</div>;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div>
      <div className="header-exam">
        <div className="logo-header">
          <img src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg" alt="Logo" />
          <p>OnlineTest</p>
        </div>
        <div className="header-menu">
          <button
            className="icon-button"
            style={{ fontSize: 40, backgroundColor: "#FCBA2C", border: "#FCBA2C" }}
            id="exit"
            onClick={() => router.push(`/pages/user/test/${idExam}`)}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </div>

      <section className="main-menu">
        <div className="menu-left">
          <div className="avt">
            <img src={user.img} alt="User Avatar" />
            <p>{user.nameAccount}</p>
          </div>
          <div className="time">
            <span style={{ fontSize: 60 }} className="timer-icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <div id="countdown">{formatTime(countdown)}</div>
          </div>
        </div>

        <div className="menu-mid">
          <div className="question">
            <h1>{`Câu ${currentQuestionIndex + 1}:`}</h1>
            <span>{currentQuestion.questionName}</span>
          </div>

          <form className="answer">
            {currentQuestion.answerList.map((answer: any, idx: number) => (
              <div key={idx} className="answer1">
                <input
                  name="answer"
                  type="radio"
                  checked={userAnswers[currentQuestionIndex] === idx.toString()}
                  onChange={() => handleAnswerChange(currentQuestionIndex, idx)}
                />
                <p>{answer.answer}</p>
              </div>
            ))}
          </form>

          <div className="button-menu">
            <button onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}>Câu trước</button>
            <button onClick={() => setCurrentQuestionIndex((prev) => Math.min(shuffledQuestions.length - 1, prev + 1))}>Câu sau</button>
          </div>
        </div>

        <div className="menu-right">
          {shuffledQuestions.map((_, idx) => (
            <button
              key={idx}
              className={`c ${
                userAnswers[idx] !== undefined ? "answered" : ""
              } ${currentQuestionIndex === idx ? "current" : ""}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
            </button>
          ))}
          <button className="submit-menu" onClick={handleSubmit}>Nộp bài</button>
        </div>
      </section>
    </div>
  );
}
