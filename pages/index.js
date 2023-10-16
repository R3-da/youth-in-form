import { useState } from "react";
import axios from 'axios'; // Import axios library
import * as XLSX from 'xlsx';// Import xlsx library

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

  const handleExportToPDF = async () => {
    try {
      // Load the template PDF from the public directory
      const templatePdfUrl = '/form.pdf';
      const templatePdfBytes = await fetch(templatePdfUrl).then((res) => res.arrayBuffer());
  
      const pdfDoc = await PDFDocument.load(templatePdfBytes);
      const form = pdfDoc.getForm();
  
      // Define check mark coordinates based on user choices
      const checkMarkCoordinates = {
        'Option 1': { x: 350, y: 670 },
        'Option 2': { x: 1050, y: 670 },
        'Option 3': { x: 1550, y: 670 },
        'Option A': { x: 600, y: 220 },
        'Option B': { x: 1320, y: 220 },
      };
  
      // Draw check marks based on user choices
      if (question1 && checkMarkCoordinates[question1]) {
        const { x, y } = checkMarkCoordinates[question1];
        const page = pdfDoc.getPage(0); // Assuming the form is on the first page
        page.drawText('X', { x, y, font: await pdfDoc.embedFont(StandardFonts.Helvetica), size: 25, color: rgb(0, 0, 0) });
      }
  
      if (question2 && checkMarkCoordinates[question2]) {
        const { x, y } = checkMarkCoordinates[question2];
        const page = pdfDoc.getPage(0); // Assuming the form is on the first page
        page.drawText('X', { x, y, font: await pdfDoc.embedFont(StandardFonts.Helvetica), size: 25, color: rgb(0, 0, 0) });
      }
  
      // Save the filled PDF
      const filledPdfBytes = await pdfDoc.save();
  
      // Create a Blob from Uint8Array and download the filled PDF
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filled_form.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
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
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleExportToPDF}>
        Export to PDF
      </button>
    </div>
  );
}
