import { useState } from "react";
import axios from 'axios'; // Import axios library
import * as XLSX from 'xlsx';// Import xlsx library

export default function Home() {
  const [question1, setQuestion1] = useState(null); // Change to null initially to indicate no option is selected
  const [question2, setQuestion2] = useState(null); // Change to null initially to indicate no option is selected

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/submitForm', {
        question1,
        question2,
      });
      console.log(response.data.message); // Log success message
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleExportToExcel = () => {
    const data = [
      ["Question 1", "Question 2"],
      [question1, question2]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Form Responses');
    XLSX.writeFile(wb, 'form_responses.xlsx');
  };

  return (
    <div className="container mx-auto mt-10 p-10">
      {/* ... (same as before) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Question 1</h2>
        <label className="block mb-2">
          <input
            type="radio"
            name="question1" // Set the name attribute to group radio inputs
            checked={question1 === "Option 1"}
            onChange={() => setQuestion1("Option 1")}
          />
          Option 1
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            name="question1"
            checked={question1 === "Option 2"}
            onChange={() => setQuestion1("Option 2")}
          />
          Option 2
        </label>
        <label className="block">
          <input
            type="radio"
            name="question1"
            checked={question1 === "Option 3"}
            onChange={() => setQuestion1("Option 3")}
          />
          Option 3
        </label>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Question 2</h2>
        <label className="block mb-2">
          <input
            type="radio"
            name="question2"
            checked={question2 === "Option A"}
            onChange={() => setQuestion2("Option A")}
          />
          Option A
        </label>
        <label className="block">
          <input
            type="radio"
            name="question2"
            checked={question2 === "Option B"}
            onChange={() => setQuestion2("Option B")}
          />
          Option B
        </label>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSubmit}>
        Submit
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleExportToExcel}>
        Export to Excel
      </button>
    </div>
  );
}
