import axios from 'axios';
import React, { useEffect } from 'react'

export default function page({ params }: { params: { id: string } }) {
    const idExam = params.id
    useEffect(() => {
        const fetchSubjects = async () => {
          try {
            const response = await axios.get<[]>("http://localhost:5000/subjectList");
            const filteredSubjects = response.data.filter(subject => subject.idCourese === );
            (filteredSubjects);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          }
        };
    
        if (idExam) {
          fetchSubjects();
        }
      }, [idExam]);
  return (
    <div>
      
    </div>
  )
}
