"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ApplicationDetails() {
  const params = useParams();
  const applicationId = params.id as string;
  const [application, setApplication] = useState<any>(null);
  const [houseDetails, setHouseDetails] = useState<any>(null);
  const [scoringQuestions, setScoringQuestions] = useState<any[]>([]);
  const [allocationDetails, setAllocationDetails] = useState<any>(null);
  const [waitlistDetails, setWaitlistDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const printRef = useRef(null);

  useEffect(() => {
    if (!applicationId) return;

    const fetchApplicationDetails = async () => {
      try {
        const { data: applicationData, error: applicationError } = await supabase
          .from("applicants")
          .select("*")
          .eq("id", applicationId)
          .single();

        if (applicationError) throw applicationError;
        setApplication(applicationData);

        if (applicationData.house_type_applied) {
          const { data: houseData } = await supabase
            .from("houses")
            .select("*")
            .eq("type", applicationData.house_type_applied)
            .single();
          setHouseDetails(houseData);
        }

        const { data: questionsData } = await supabase
          .from("scoring_questions")
          .select("*");
        setScoringQuestions(questionsData ?? []);

        const { data: allocationData } = await supabase
          .from("allocations")
          .select("*")
          .eq("applicant_id", applicationId)
          .single();
        setAllocationDetails(allocationData);

        const { data: waitlistData } = await supabase
          .from("waitlist")
          .select("*")
          .eq("applicant_id", applicationId)
          .single();
        setWaitlistDetails(waitlistData);
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!application) return <p className="text-center text-red-500">Application not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Application Details</h1>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Print / Download</button>
      </div>
      <button onClick={() => router.back()} className="mb-6 text-blue-600 hover:underline">
        &larr; Back to Applications
      </button>
      <div ref={printRef} className="grid gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Applicant Information</h2>
          <p><strong>Name:</strong> {application.name}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>House Type Applied:</strong> {application.house_type_applied}</p>
          <p><strong>Points:</strong> {application.points}</p>
          <p><strong>Status:</strong> {application.status}</p>
        </div>

        {houseDetails && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">House Details</h2>
            <p><strong>Type:</strong> {houseDetails.type}</p>
            <p><strong>Availability:</strong> {houseDetails.available ? "Available" : "Not Available"}</p>
            <p><strong>Allocated To:</strong> {houseDetails.allocated_to ? `Applicant ID: ${houseDetails.allocated_to}` : "Not Allocated"}</p>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Scoring Questions</h2>
          {scoringQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="font-medium text-gray-600">{question.question}</p>
              <p className="text-gray-800">Response: {application.responses?.[question.id] || "No response"}</p>
            </div>
          ))}
        </div>

        {allocationDetails && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Allocation Details</h2>
            <p><strong>House ID:</strong> {allocationDetails.house_id}</p>
            <p><strong>Allocated At:</strong> {new Date(allocationDetails.allocated_at).toLocaleString()}</p>
          </div>
        )}

        {waitlistDetails && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Waitlist Details</h2>
            <p><strong>Added At:</strong> {new Date(waitlistDetails.added_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
