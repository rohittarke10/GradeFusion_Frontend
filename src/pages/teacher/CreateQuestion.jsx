import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreateQuestion.css';
import { useNavigate } from "react-router-dom";
import { getToken, deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";

const CreateQuestion = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        question_text: '',
        example_input_1: '', // Add new field
        example_output_1: '', // Add new field
        example_input_2: '', // Add new field
        example_output_2: '', // Add new field
        marks: '',
        subject: '',
        test_cases: Array(6).fill({ input: '', output: '' }) // Increase to 6 test cases
    });


    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_GEMINI_API_URL;

    const navigate = useNavigate();
    // Add this function to handle logout
    const handleLogout = () => {
        // Delete the token from cookies
        deleteToken("token");
        // Redirect to home page
        navigate('/');
    };


    // Handle scroll event for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
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

    const fetchGeneratedTestCases = async () => {
        if (!formData.question_text || !formData.example_input_1 || !formData.example_output_1 || !formData.example_input_2 || !formData.example_output_2) {
            setMessage("Please fill in the Question Text, Example Input, and Example Output before generating test cases.");
            return;
        }

        setLoading(true); // Show loading overlay

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze the question text and both example input-output pairs. Generate exactly 6 test cases in the following format:
                            {
                                "test_cases": [
                                    { "input": "testcase1 input", "output": "testcase1 output" },
                                    { "input": "testcase2 input", "output": "testcase2 output" },
                                    { "input": "testcase3 input", "output": "testcase3 output" },
                                    { "input": "testcase4 input", "output": "testcase4 output" },
                                    { "input": "testcase5 input", "output": "testcase5 output" },
                                    { "input": "testcase6 input", "output": "testcase6 output" }
                                ]
                            }
                
                            - The first test case **must be one of the provided example test cases**.
                            - The second and third test cases should be **easy**.
                            - The fourth and fifth test cases should be **edge cases**.
                            - The sixth test case should be **hard**.
                
                            Question: ${formData.question_text}
                            Example 1 Input: ${formData.example_input_1}
                            Example 1 Output: ${formData.example_output_1}
                            Example 2 Input: ${formData.example_input_2}
                            Example 2 Output: ${formData.example_output_2}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                try {
                    // Extract JSON from API response
                    const jsonResponse = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

                    // Check if response contains valid test cases
                    if (jsonResponse.test_cases && Array.isArray(jsonResponse.test_cases)) {
                        setFormData(prev => ({
                            ...prev,
                            test_cases: jsonResponse.test_cases
                        }));
                    } else {
                        setMessage("Invalid test case format received from API.");
                    }
                } catch (parseError) {
                    setMessage("Error parsing test cases from API response.");
                }
            } else {
                setMessage("No test cases received from API.");
            }
        } catch (error) {
            setMessage("Error fetching generated test cases.");
            console.error("Error:", error);
        } finally {
            setLoading(false); // Hide loading overlay
        }
    };


    // Remove test case
    const removeTestCase = (index) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.filter((_, i) => i !== index)
        }));
    };

    // Update test case values
    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = formData.test_cases.map((testcase, i) =>
            i === index ? { ...testcase, [field]: value } : testcase
        );

        setFormData(prev => ({
            ...prev,
            test_cases: updatedTestCases
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const payload = {
            question_text: formData.question_text,
            example_input_output: [
                { input: formData.example_input_1, output: formData.example_output_1 },
                { input: formData.example_input_2, output: formData.example_output_2 }
            ],
            marks: formData.marks,
            subject: formData.subject,
            test_cases: formData.test_cases.map(tc => ({
                input: tc.input,
                expected_output: tc.output
            }))
        };

        const token = getToken("token");
        if (!token) {
            setMessage('Authentication required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${hostURL.link}/app/teacher/create-question`, {  // Fixed template literal
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Question created successfully!');
                setFormData({
                    question_text: '',
                    example_input: '',
                    example_output: '',
                    marks: '',
                    subject: '',
                    test_cases: [{ input: '', output: '' }]
                });
            } else {
                setMessage(data.message || 'Failed to create question.');
            }
        } catch (error) {
            setMessage('Error creating question.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Generating test cases, please wait...</p>
                </div>
            )}

            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </nav>

            <div className="create-question-container">
                <div className="form-header">
                    <h1>Create New Question</h1>
                    <p>Design your coding challenge</p>
                </div>

                {message && <p className="message">{message}</p>}

                <form onSubmit={handleSubmit} className="question-form">
                    <div className="form-section">
                        <label htmlFor="question_text">Question Text</label>
                        <textarea
                            id="question_text"
                            value={formData.question_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                            placeholder="Enter the question description..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-section">
                            <label htmlFor="example_input_1">Example Input 1</label>
                            <textarea
                                id="example_input_1"
                                value={formData.example_input_1}
                                onChange={(e) => setFormData(prev => ({ ...prev, example_input_1: e.target.value }))}
                                placeholder="Enter first example input..."
                                required
                            />
                        </div>

                        <div className="form-section">
                            <label htmlFor="example_output_1">Example Output 1</label>
                            <textarea
                                id="example_output_1"
                                value={formData.example_output_1}
                                onChange={(e) => setFormData(prev => ({ ...prev, example_output_1: e.target.value }))}
                                placeholder="Enter first example output..."
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-section">
                            <label htmlFor="example_input_2">Example Input 2</label>
                            <textarea
                                id="example_input_2"
                                value={formData.example_input_2}
                                onChange={(e) => setFormData(prev => ({ ...prev, example_input_2: e.target.value }))}
                                placeholder="Enter second example input..."
                                required
                            />
                        </div>

                        <div className="form-section">
                            <label htmlFor="example_output_2">Example Output 2</label>
                            <textarea
                                id="example_output_2"
                                value={formData.example_output_2}
                                onChange={(e) => setFormData(prev => ({ ...prev, example_output_2: e.target.value }))}
                                placeholder="Enter second example output..."
                                required
                            />
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-section">
                            <label htmlFor="marks">Marks</label>
                            <input
                                type="number"
                                id="marks"
                                value={formData.marks}
                                onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                                placeholder="Enter marks..."
                                required
                            />
                        </div>

                        <div className="form-section">
                            <label htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                required
                            >
                                <option value="">Select Subject</option>
                                <option value="algorithms">Algorithms</option>
                                <option value="data-structures">Data Structures</option>
                                <option value="programming">Programming Basics</option>
                                <option value="database">Database</option>
                            </select>
                        </div>
                    </div>

                    <div className="testcases-section">
                        <div className="testcases-header">
                            <h2>Test Cases</h2>
                            <button type="button" onClick={fetchGeneratedTestCases} className="add-testcase-btn" disabled={loading}>
                                {loading ? 'Generating...' : 'Generate Test Cases'}
                            </button>
                            <button type="button" onClick={() => setFormData(prev => ({
                                ...prev,
                                test_cases: [...prev.test_cases, { input: '', output: '' }]
                            }))} className="add-testcase-btn">
                                + Add Test Case
                            </button>
                        </div>


                        {formData.test_cases.map((testcase, index) => (
                            <div key={index} className="testcase-container">
                                <div className="testcase-header">
                                    <h3>Test Case {index + 1}</h3>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTestCase(index)}
                                            className="remove-testcase-btn"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="testcase-inputs">
                                    <div className="form-section">
                                        <label>Input</label>
                                        <textarea
                                            value={testcase.input}
                                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                            placeholder="Enter test case input..."
                                            required
                                        />
                                    </div>
                                    <div className="form-section">
                                        <label>Expected Output</label>
                                        <textarea
                                            value={testcase.output}
                                            onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                            placeholder="Enter expected output..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn">Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Question'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateQuestion;