"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ApplicationForm() {
  const [scoringQuestions, setScoringQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchScoringQuestions = async () => {
      try {
        const { data, error } = await supabase.from("scoring_questions").select("*");
        if (error) throw error;
        setScoringQuestions(data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to load application form. Please refresh the page.");
      }
    };

    fetchScoringQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors([]);

    try {
      // 1. Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Please login to submit the form");

      // 2. Calculate points
      const points = calculatePoints(responses);

      // 3. Prepare submission data
      const submissionData = {
        user_id: user.id,
        responses: responses,
        points: points,
        created_at: new Date().toISOString()
      };

      // 4. Insert into applicants table
      const { error } = await supabase
        .from("applicants")
        .insert([submissionData]);

      if (error) throw error;

      // 5. Success
      alert("Application submitted successfully!");
      setHasSubmitted(true);
      router.push("/dashboard/applicant/application-status");
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePoints = (responses: { [key: string]: any }) => {
    let points = 0;
    scoringQuestions.forEach((question) => {
      const response = responses[question.id];
      if (response) {
        if (question.input_type === "number") {
          points += Number(response) * (question.points || 1);
        } else if (question.input_type === "select") {
          // Custom point values for select options
          if (response === "doctor") points += 20;
          else if (response === "nurse") points += 15;
          else if (response === "researcher") points += 10;
          else points += (question.points || 1);
        } else if (["text", "date"].includes(question.input_type)) {
          points += (question.points || 1);
        }
      }
    });
    return points;
  };

  const handleInputChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  if (hasSubmitted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-lg p-6 rounded-lg text-center w-96">
          <h1 className="text-2xl font-bold text-gray-800">Application Submitted</h1>
          <p className="text-gray-600 mt-4">Your application has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Application Form</h1>
      
      {formErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Please fix these errors:</h3>
          <ul className="list-disc pl-5">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {scoringQuestions.map((question) => (
          <div key={question.id} className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              {question.question}
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            {question.input_type === "number" && (
              <input
                type="number"
                value={responses[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            
            {question.input_type === "select" && (
              <select
                value={responses[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an option</option>
                {question.options?.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {question.input_type === "text" && (
              <textarea
                value={responses[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            )}
            
            {question.input_type === "date" && (
              <input
                type="date"
                value={responses[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}