// app/dashboard/applicant/application-status/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Define the type for house types
type HouseType = "studio" | "1-bedroom" | "2-bedroom" | "3-bedroom" | "4-bedroom";

// Define pass marks for each house type
const passMarks: Record<HouseType, number> = {
  studio: 50,
  "1-bedroom": 60,
  "2-bedroom": 70,
  "3-bedroom": 80,
  "4-bedroom": 90,
};

export default function ApplicationStatus() {
  const [application, setApplication] = useState<any>(null);
  const [scoringQuestions, setScoringQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the logged-in user's ID from Supabase Auth
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      // Fetch the application for the logged-in user
      const { data: applicationData, error: applicationError } = await supabase
        .from("applicants")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (applicationError) {
        console.error("Error fetching application:", applicationError);
      } else {
        setApplication(applicationData);
      }

      // Fetch the scoring questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("scoring_questions")
        .select("*");

      if (questionsError) {
        console.error("Error fetching scoring questions:", questionsError);
      } else {
        setScoringQuestions(questionsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Parse the responses JSON string
  const responses = application ? JSON.parse(application.responses) : {};

  // Match responses with questions
  const responseDetails = scoringQuestions.map((question) => ({
    question: question.question,
    response: responses[question.id] || "No response",
  }));

  // Check if the applicant qualifies for the applied house type
  const houseType = application?.house_type_applied as HouseType | undefined;
  const qualifies = houseType && application?.points >= passMarks[houseType];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application Status</h1>
      {loading ? (
        <p>Loading...</p>
      ) : application ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {application.name}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>House Type Applied:</strong> {application.house_type_applied}</p>
          <p><strong>Points:</strong> {application.points}</p>
          <p><strong>Status:</strong> {qualifies ? "Qualified" : "Not Qualified"}</p>
          <div>
            <strong>Responses:</strong>
            <ul className="list-disc pl-6">
              {responseDetails.map((detail, index) => (
                <li key={index}>
                  <strong>{detail.question}:</strong> {detail.response}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No application found.</p>
      )}
    </div>
  );
}