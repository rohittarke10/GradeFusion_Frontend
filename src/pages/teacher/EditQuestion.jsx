// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getToken } from "../../data/Token";
// import hostURL from "../../data/URL";
// import './CreateQuestion.css';

// const EditQuestion = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState(null);
//     const [originalData, setOriginalData] = useState(null);  // Store original data
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchQuestion = async () => {
//             const token = getToken("token");
//             if (!token) {
//                 setMessage('Authentication required.');
//                 return;
//             }

//             try {
//                 const response = await fetch(`${hostURL.link}/app/teacher/fetch-question/${id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 const data = await response.json();
//                 if (response.ok) {
//                     const formattedData = {
//                         ...data,
//                         example_input: data.example_input_output?.[0]?.input || "",
//                         example_output: data.example_input_output?.[0]?.output || "",
//                         test_cases: data.test_cases || []
//                     };
//                     setFormData(formattedData);
//                     setOriginalData(formattedData);  // Save original data
//                 } else {
//                     setMessage(data.message || 'Failed to fetch question.');
//                 }
//             } catch (error) {
//                 setMessage('Error fetching question.');
//             }
//         };

//         fetchQuestion();
//     }, [id]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
        
//         setFormData(prev => {
//             if (name === "example_input" || name === "example_output") {
//                 return {
//                     ...prev,
//                     [name]: value,
//                     example_input_output: [{ 
//                         input: name === "example_input" ? value : prev.example_input_output?.[0]?.input || "",
//                         output: name === "example_output" ? value : prev.example_input_output?.[0]?.output || ""
//                     }]
//                 };
//             }
//             return {
//                 ...prev,
//                 [name]: value
//             };
//         });
//     };

//     const handleTestCaseChange = (index, field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             test_cases: prev.test_cases.map((tc, i) =>
//                 i === index ? { ...tc, [field]: value } : tc
//             )
//         }));
//     };

//     const isFormChanged = () => {
//         return JSON.stringify(formData) !== JSON.stringify(originalData);
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');

//         const token = getToken("token");
//         if (!token) {
//             setMessage('Authentication required.');
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch(`${hostURL.link}/app/teacher/update/${id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     example_input_output: [{ input: formData.example_input, output: formData.example_output }]
//                 })
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 setMessage('Question updated successfully!');
//                 navigate('/ViewQuestions');
//             } else {
//                 setMessage(data.message || 'Failed to update question.');
//             }
//         } catch (error) {
//             setMessage('Error updating question.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!formData) return <p>Loading...</p>;

//     return (
//         <div className="create-question-container">
//             <h1>Edit Question</h1>
//             {message && <p className="message">{message}</p>}

//             <form onSubmit={handleUpdate} className="question-form">
//                 <div className="form-section">
//                     <label>Question Text</label>
//                     <textarea
//                         name="question_text"
//                         value={formData.question_text}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-row">
//                     <div className="form-section">
//                         <label>Example Input</label>
//                         <textarea
//                             name="example_input"
//                             value={formData.example_input}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-section">
//                         <label>Example Output</label>
//                         <textarea
//                             name="example_output"
//                             value={formData.example_output}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="form-row">
//                     <div className="form-section">
//                         <label>Marks</label>
//                         <input
//                             type="number"
//                             name="marks"
//                             value={formData.marks}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-section">
//                         <label>Subject</label>
//                         <select
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleInputChange}
//                             required
//                         >
//                             <option value="algorithms">Algorithms</option>
//                             <option value="data-structures">Data Structures</option>
//                             <option value="programming">Programming Basics</option>
//                             <option value="database">Database</option>
//                         </select>
//                     </div>
//                 </div>

//                 <h2>Test Cases</h2>
//                 {formData.test_cases.map((tc, index) => (
//                     <div key={index} className="testcase-container">
//                         <div className="form-section">
//                             <label>Input</label>
//                             <textarea
//                                 value={tc.input}
//                                 onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-section">
//                             <label>Expected Output</label>
//                             <textarea
//                                 value={tc.expected_output}
//                                 onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
//                                 required
//                             />
//                         </div>
//                     </div>
//                 ))}

//                 <div className="form-actions">
//                     <button type="button" className="cancel-btn" onClick={() => navigate('/ViewQuestions')}>
//                         Cancel
//                     </button>
                    
//                     {isFormChanged() && (  // Only show Update button if form is changed
//                         <button type="submit" className="submit-btn" disabled={loading}>
//                             {loading ? 'Updating...' : 'Update Question'}
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditQuestion;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './EditQuestion.css';

const EditQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);  // Store original data
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
        const fetchQuestion = async () => {
            const token = getToken("token");
            if (!token) {
                setMessage('Authentication required.');
                return;
            }

            try {
                const response = await fetch(`${hostURL.link}/app/teacher/fetch-question/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    const formattedData = {
                        ...data,
                        example_input: data.example_input_output?.[0]?.input || "",
                        example_output: data.example_input_output?.[0]?.output || "",
                        test_cases: data.test_cases || []
                    };
                    setFormData(formattedData);
                    setOriginalData(formattedData);  // Save original data
                } else {
                    setMessage(data.message || 'Failed to fetch question.');
                }
            } catch (error) {
                setMessage('Error fetching question.');
            }
        };

        fetchQuestion();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            if (name === "example_input" || name === "example_output") {
                return {
                    ...prev,
                    [name]: value,
                    example_input_output: [{ 
                        input: name === "example_input" ? value : prev.example_input_output?.[0]?.input || "",
                        output: name === "example_output" ? value : prev.example_input_output?.[0]?.output || ""
                    }]
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleTestCaseChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.map((tc, i) =>
                i === index ? { ...tc, [field]: value } : tc
            )
        }));
    };

    const isFormChanged = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const token = getToken("token");
        if (!token) {
            setMessage('Authentication required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${hostURL.link}/app/teacher/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    example_input_output: [{ input: formData.example_input, output: formData.example_output }]
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Question updated successfully!');
                navigate('/ViewQuestions');
            } else {
                setMessage(data.message || 'Failed to update question.');
            }
        } catch (error) {
            setMessage('Error updating question.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (!formData) return (
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
            <div className="edit-container">
                <p>Loading...</p>
            </div>
        </>
    );

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
            
            <div className="edit-container">
                <div className="edit-content">
                    <div className="edit-header">
                        <h1>Edit Question</h1>
                        <button className="back-button" onClick={() => navigate('/ViewQuestions')}>
                            Back to Questions
                        </button>
                    </div>
                    
                    {message && <p className="message">{message}</p>}

                    <form onSubmit={handleUpdate} className="edit-form">
                        <div className="form-group">
                            <label>Question Text</label>
                            <textarea
                                name="question_text"
                                value={formData.question_text}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Example Input</label>
                                <textarea
                                    name="example_input"
                                    value={formData.example_input}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Example Output</label>
                                <textarea
                                    name="example_output"
                                    value={formData.example_output}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Marks</label>
                                <input
                                    type="number"
                                    name="marks"
                                    value={formData.marks}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="algorithms">Algorithms</option>
                                    <option value="data-structures">Data Structures</option>
                                    <option value="programming">Programming Basics</option>
                                    <option value="database">Database</option>
                                </select>
                            </div>
                        </div>

                        <h2>Test Cases</h2>
                        {formData.test_cases.map((tc, index) => (
                            <div key={index} className="form-row">
                                <div className="form-group">
                                    <label>Input</label>
                                    <textarea
                                        value={tc.input}
                                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expected Output</label>
                                    <textarea
                                        value={tc.expected_output}
                                        onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="form-actions">
                            <button type="button" className="cancel-button" onClick={() => navigate('/ViewQuestions')}>
                                Cancel
                            </button>
                            
                            {isFormChanged() && (
                                <button type="submit" className="save-button" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Question'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditQuestion;