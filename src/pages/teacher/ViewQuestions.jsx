// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getToken } from "../../data/Token";
// import hostURL from "../../data/URL";
// import './ViewQuestions.css';

// const ViewQuestions = () => {
//     const navigate = useNavigate();
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const token = getToken("token");
//                 if (!token) {
//                     throw new Error("Authentication required");
//                 }

//                 const response = await fetch(`${hostURL.link}/app/teacher/fetch-questions`, {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch questions");
//                 }

//                 const data = await response.json();
//                 setQuestions(data.questions);
//             } catch (err) {
//                 setError(err.message || 'Error fetching questions');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     const formatDate = (dateString) => {
//         const parts = dateString.split(" :: "); // Split date and time
//         if (parts.length < 2) return "Invalid Date";

//         const [day, month, year] = parts[0].split("/"); // Split DD/MM/YYYY
//         const time = parts[1]; // Get time

//         return `${year}-${month}-${day} ${time}`; // Convert to YYYY-MM-DD HH:MM:SS
//     };


//     const handleEdit = (id) => {
//         navigate(`/edit-question/${id}`);
//     };

//     const handleView = (id) => {
//         navigate(`/view-question/${id}`);
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this question?")) return;

//         try {
//             const token = getToken("token");
//             await fetch(`${hostURL.link}/app/teacher/delete/${id}`, {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             setQuestions(questions.filter((q) => q._id !== id));
//         } catch (err) {
//             alert("Error deleting question");
//         }
//     };

//     return (
//         <div className="questions-container">
//             <header className="questions-header">
//                 <h1>Coding Questions</h1>
//                 <button className="create-button" onClick={() => navigate('/CreateQuestion')}>
//                     <span className="button-icon">+</span> Create New Question
//                 </button>
//             </header>

//             {loading ? (
//                 <p className="loading-text">Loading questions...</p>
//             ) : error ? (
//                 <p className="error-message">{error}</p>
//             ) : questions.length === 0 ? (
//                 <p className="no-questions">No questions found.</p>
//             ) : (
//                 <div className="questions-grid">
//                     {questions.map((question) => (
//                         <div key={question._id} className="question-card">
//                             <div className="question-header">
//                                 <h2>{question.question_text}</h2> {/* Display question text */}
//                             </div>
//                             <div className="question-details">
//                                 <span className="category">{question.subject}</span> {/* Use 'subject' instead of category */}
//                                 <span className="date">
//                                     Created: {formatDate(question.created_at)}
//                                 </span>
//                             </div>
//                             <div className="question-actions">
//                                 <button className="action-button edit" onClick={() => handleEdit(question._id)}>
//                                     Edit
//                                 </button>
//                                 <button className="action-button view" onClick={() => handleView(question._id)}>View</button>
//                                 <button className="action-button delete" onClick={() => handleDelete(question._id)}>Delete</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//             )}
//         </div>
//     );
// };

// export default ViewQuestions; 

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './ViewQuestions.css';

const ViewQuestions = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Add this function to handle logout
   const handleLogout = () => {
    // Delete the token from cookies
    deleteToken("token");
    // Redirect to home page
    navigate('/');
};


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/teacher/fetch-questions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }

                const data = await response.json();
                setQuestions(data.questions);
            } catch (err) {
                setError(err.message || 'Error fetching questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const formatDate = (dateString) => {
        const parts = dateString.split(" :: "); // Split date and time
        if (parts.length < 2) return "Invalid Date";

        const [day, month, year] = parts[0].split("/"); // Split DD/MM/YYYY
        const time = parts[1]; // Get time

        return `${year}-${month}-${day} ${time}`; // Convert to YYYY-MM-DD HH:MM:SS
    };

    const handleEdit = (id) => {
        navigate(`/edit-question/${id}`);
    };

    const handleView = (id) => {
        navigate(`/view-question/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            const token = getToken("token");
            await fetch(`${hostURL.link}/app/teacher/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setQuestions(questions.filter((q) => q._id !== id));
        } catch (err) {
            alert("Error deleting question");
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
                    </div>
                    <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
            
            <div className="questions-container">
                <header className="questions-header">
                    <h1>Coding Questions</h1>
                    <button className="create-button" onClick={() => navigate('/CreateQuestion')}>
                        <span className="button-icon">+</span> Create New Question
                    </button>
                </header>

                {loading ? (
                    <p className="loading-text">Loading questions...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : questions.length === 0 ? (
                    <p className="no-questions">No questions found.</p>
                ) : (
                    <div className="questions-grid">
                        {questions.map((question) => (
                            <div key={question._id} className="question-card">
                                <div className="question-header">
                                    <h2>{question.question_text}</h2>
                                </div>
                                <div className="question-details">
                                    <span className="category">{question.subject}</span>
                                    <span className="date">
                                        Created: {formatDate(question.created_at)}
                                    </span>
                                </div>
                                <div className="question-actions">
                                    <button className="action-button edit" onClick={() => handleEdit(question._id)}>
                                        Edit
                                    </button>
                                    <button className="action-button view" onClick={() => handleView(question._id)}>View</button>
                                    <button className="action-button delete" onClick={() => handleDelete(question._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ViewQuestions;