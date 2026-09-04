import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import { uploadResume } from "../api/resumeApi";
import ResumeAnalysis from "../components/analysis/ResumeAnalysis";

function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    setLoading(true);

    try {
      const result = await uploadResume(selectedFile);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Page Header */}
      <div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Career Intelligence
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Resume Analyzer
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Upload your resume and get AI-powered ATS compatibility
          analysis, strengths, loopholes, and practical improvements.
        </p>
      </div>


      {/* Upload Card */}
      <div
        className="mt-8 rounded-2xl border p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        {/* Upload Area */}
        <label
          htmlFor="resume-upload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition"
          style={{
            borderColor: "var(--border-secondary)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >

          {/* Icon */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            ↑
          </div>

          <h2
            className="mt-5 text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Upload your resume
          </h2>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Click to browse and upload your PDF resume
          </p>

          <p
            className="mt-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Supported format: PDF
          </p>

          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>


        {/* Selected File */}
        {selectedFile && (
          <div
            className="mt-5 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
            }}
          >

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                PDF
              </div>

              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Selected file
                </p>

                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedFile.name}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-left text-xs transition hover:underline sm:text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              Remove
            </button>

          </div>
        )}


        {/* Analyze Button */}
        <div className="mt-6 flex justify-end">

          <Button
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </Button>

        </div>

      </div>


      {/* Analysis */}
      {analysis && (
        <div className="mt-8">
          <ResumeAnalysis analysis={analysis} />
        </div>
      )}

    </DashboardLayout>
  );
}

export default ResumeAnalyzer;