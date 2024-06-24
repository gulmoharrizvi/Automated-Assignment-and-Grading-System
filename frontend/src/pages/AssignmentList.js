import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '../components/createPages/AssignmentCard';
import './AssignmentList.css';

function AssignmentList() {
  const [assignments,setAssignments] = useState([
    // { id: 1, name: 'Assignment 1', dueDate: '2023-04-14', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    // { id: 2, name: 'Assignment 2', dueDate: '2023-04-20', description: 'Suspendisse sodales nunc ut enim fringilla rutrum.' },
    // { id: 3, name: 'Assignment 3', dueDate: '2023-04-25', description: 'Curabitur quis sollicitudin tortor.' },
  ]);
  const [roll_no, setRollNo] = useState(0);
  const [role, setRole] = useState(0);
  const [fullName,setFN] = useState("");
  const [dept,setDept] = useState("");
  const [email,setEmail] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate(); 
  
    useEffect(() => {
      

      async function fetchData() {
        const user = localStorage.getItem('user');
        // Make sure to parse the user if it's a JSON string
        const parsedUser = JSON.parse(user);
        
        if (!parsedUser || !parsedUser.rollNumber) {
          navigate("/login");
          return;
        }
        console.log(parsedUser);
        setRole(Number(parsedUser.role));
        setRollNo(Number(parsedUser.rollNumber));
        console.log(role);
        console.log(roll_no);
        try {
          console.log(parsedUser);
          const response = await fetch('http://localhost:8080/user/findUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "roll_no": parsedUser.rollNumber,
                "role" : parsedUser.role
            })
          });
          
          if (!response.ok) {
            // Handle non-OK responses by throwing an error
            const errorText = await response.text();
            throw new Error(errorText || 'Error fetching data');
          }
          
          // console.log(response.json())
          const data = await response.json();
          console.log(data);
          setAssignments(data.ass);
          setFN(data.user_details.fullName);
          setDept(data.user_details.department);
          setEmail(data.user_details.email);
          // console.log(data)
          //  Navigate based on success if needed
        } catch (error) {
          console.error('Error:', error);
          alert('Error Fetching assignment');
        }
      }
  
      fetchData();
    }, []);



  
    





  






// Changed from useHistory to useNavigate

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  navigate(`/Assignment/${assignment.id}`);  // Navigate to the assignment detail page

  };


  const handleCreateNewAssignment = () => {
    navigate(`/createAssignment`); // Changed method call from history.push to navigate
  };
  const handleLogOut = () => {
    localStorage.removeItem('user');
    navigate(`/login`); // Changed method call from history.push to navigate
  };

  
  

  return (
    <div>
        <div className="header">
            {role === 1 && (
                <button className="create-assignment-btn" onClick={handleCreateNewAssignment}>
                    Create New Assignment
                </button>
              )}  
            <h1 className="assignment-head">Assignments</h1>
            <button className="logout-btn" onClick={handleLogOut}>
                Log Out
            </button>
            
        </div>
        <div className='assignment-list'>
          <div className='assignment-userData'>
            <p>Roll_No: {roll_no}</p>
            <p>Full Name: {fullName}</p>
            <p>Email: {email}</p>
            <p>Department: {dept}</p>
            <p>Role: {(role==0)?"Student":"Instructor"}</p>
          </div>
          <div className="assignments-container">
              {assignments.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} onClick={handleAssignmentClick} />
              ))}
          </div>
        </div>
    </div>
);

}

export default AssignmentList;
