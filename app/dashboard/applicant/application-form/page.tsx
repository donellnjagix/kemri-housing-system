"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ApplicationForm() {
  const [name, setName] = useState("");
  const [personalNo, setPersonalNo] = useState("");
  const [extension, setExtension] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [telephoneNo, setTelephoneNo] = useState("");
  const [annualBasicSalary, setAnnualBasicSalary] = useState("");
  const [jobGroup, setJobGroup] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [dateOfAppointment, setDateOfAppointment] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [spouseLivingWithYou, setSpouseLivingWithYou] = useState("");
  const [accommodationRequiredDate, setAccommodationRequiredDate] = useState("");
  const [preferredAccommodation, setPreferredAccommodation] = useState("");
  const [presentAccommodation, setPresentAccommodation] = useState("");
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");
  const [scoringQuestions, setScoringQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchScoringQuestions = async () => {
      const { data, error } = await supabase.from("scoring_questions").select("*");
      if (error) {
        console.error("Error fetching scoring questions:", error);
      } else {
        setScoringQuestions(data || []);
      }
    };

    fetchScoringQuestions();
  }, []);

  useEffect(() => {
    const checkApplication = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("applicants")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (data) {
        setHasSubmitted(true);
      }
    };

    checkApplication();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("You must be logged in to submit an application.");
      return;
    }

    const points = calculatePoints(responses);

    const { error } = await supabase
      .from("applicants")
      .insert([
        {
          name,
          personal_no: personalNo,
          extension,
          designation,
          department,
          postal_address: postalAddress,
          telephone_no: telephoneNo,
          annual_basic_salary: annualBasicSalary,
          job_group: jobGroup,
          terms_of_service: termsOfService,
          date_of_appointment: dateOfAppointment,
          number_of_children: numberOfChildren,
          spouse_living_with_you: spouseLivingWithYou,
          accommodation_required_date: accommodationRequiredDate,
          preferred_accommodation: preferredAccommodation,
          present_accommodation: presentAccommodation,
          signature,
          date,
          points,
          responses: JSON.stringify(responses),
          user_id: userData.user.id,
        },
      ]);

    if (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } else {
      alert("Application submitted successfully!");
      setHasSubmitted(true);
      router.push("/dashboard/applicant/application-status");
    }
    setLoading(false);
  };

  const calculatePoints = (responses: { [key: string]: any }) => {
    let points = 0;
    scoringQuestions.forEach((question) => {
      const response = responses[question.id];
      if (response) {
        if (question.input_type === "number") {
          points += response * question.points;
        } else if (question.input_type === "select") {
          if (response === "doctor") points += 20;
          else if (response === "nurse") points += 15;
          else if (response === "researcher") points += 10;
        } else if (question.input_type === "text" && response) {
          points += question.points;
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
          <h1 className="text-2xl font-bold text-gray-800">Housing Application</h1>
          <p className="text-gray-600 mt-4">You have already submitted an application. Please check your application status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">APPLICATION FOR KEMRI STAFF QUARTERS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Personal No. */}
        <div>
          <label className="block text-gray-700 font-medium">Personal No.</label>
          <input type="text" value={personalNo} onChange={(e) => setPersonalNo(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Extension */}
        <div>
          <label className="block text-gray-700 font-medium">Extension</label>
          <input type="text" value={extension} onChange={(e) => setExtension(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-gray-700 font-medium">Designation</label>
          <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Department/Centre */}
        <div>
          <label className="block text-gray-700 font-medium">Department/Centre</label>
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Postal Address */}
        <div>
          <label className="block text-gray-700 font-medium">Postal Address</label>
          <input type="text" value={postalAddress} onChange={(e) => setPostalAddress(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Telephone No. */}
        <div>
          <label className="block text-gray-700 font-medium">Telephone No.</label>
          <input type="text" value={telephoneNo} onChange={(e) => setTelephoneNo(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Annual Basic Salary */}
        <div>
          <label className="block text-gray-700 font-medium">Annual Basic Salary (Kshs)</label>
          <input type="number" value={annualBasicSalary} onChange={(e) => setAnnualBasicSalary(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Job Group */}
        <div>
          <label className="block text-gray-700 font-medium">Job Group</label>
          <input type="text" value={jobGroup} onChange={(e) => setJobGroup(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Terms of Service */}
        <div>
          <label className="block text-gray-700 font-medium">Terms of Service</label>
          <select value={termsOfService} onChange={(e) => setTermsOfService(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select</option>
            <option value="Permanent">Permanent</option>
            <option value="Probation">Probation</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>

        {/* Date of Appointment */}
        <div>
          <label className="block text-gray-700 font-medium">Date of Appointment</label>
          <input type="date" value={dateOfAppointment} onChange={(e) => setDateOfAppointment(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Number of Children */}
        <div>
          <label className="block text-gray-700 font-medium">Number of Children</label>
          <input type="number" value={numberOfChildren} onChange={(e) => setNumberOfChildren(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Spouse Living with You */}
        <div>
          <label className="block text-gray-700 font-medium">Is your spouse/family living with you?</label>
          <select value={spouseLivingWithYou} onChange={(e) => setSpouseLivingWithYou(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Accommodation Required Date */}
        <div>
          <label className="block text-gray-700 font-medium">Approximate Date Accommodation Required</label>
          <input type="date" value={accommodationRequiredDate} onChange={(e) => setAccommodationRequiredDate(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Preferred Accommodation */}
        <div>
          <label className="block text-gray-700 font-medium">Preferred Accommodation</label>
          <select value={preferredAccommodation} onChange={(e) => setPreferredAccommodation(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select</option>
            <option value="Massionette">Massionette</option>
            <option value="3 Bedroom Flat">3 Bedroom Flat</option>
            <option value="2 Bedroom Flat">2 Bedroom Flat</option>
          </select>
        </div>

        {/* Present Accommodation */}
        <div>
          <label className="block text-gray-700 font-medium">Present Accommodation</label>
          <input type="text" value={presentAccommodation} onChange={(e) => setPresentAccommodation(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Signature */}
        <div>
          <label className="block text-gray-700 font-medium">Signature</label>
          <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Scoring Questions */}
        {scoringQuestions.map((question) => (
          <div key={question.id}>
            <label className="block text-gray-700 font-medium">{question.question}</label>
            {question.input_type === "number" && <input type="number" value={responses[question.id] || ""} onChange={(e) => handleInputChange(question.id, Number(e.target.value))} className="w-full mt-2 p-3 border rounded-lg" required />}
            {question.input_type === "select" && <select value={responses[question.id] || ""} onChange={(e) => handleInputChange(question.id, e.target.value)} className="w-full mt-2 p-3 border rounded-lg" required>{question.options.map((option: string) => (<option key={option} value={option}>{option}</option>))}</select>}
            {question.input_type === "text" && <textarea value={responses[question.id] || ""} onChange={(e) => handleInputChange(question.id, e.target.value)} className="w-full mt-2 p-3 border rounded-lg"></textarea>}
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">{loading ? "Submitting..." : "Submit Application"}</button>
      </form>
    </div>
  );
}