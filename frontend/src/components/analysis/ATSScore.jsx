import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function ATSScore({ score }) {
  let statusColor = "var(--danger)";
  let statusBackground = "var(--danger-bg)";
  let statusText = "var(--danger)";
  let status = "Needs Improvement";

  if (score >= 80) {
    statusColor = "var(--success)";
    statusBackground = "var(--success-bg)";
    statusText = "var(--success)";
    status = "Excellent";
  } else if (score >= 60) {
    statusColor = "var(--warning)";
    statusBackground = "var(--warning-bg)";
    statusText = "var(--warning)";
    status = "Good";
  }

  return (
    <div className="flex flex-col items-center">

      {/* Score Circle */}
      <div className="h-44 w-44">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textColor: "var(--text-primary)",
            pathColor: statusColor,
            trailColor: "var(--border-primary)",
            pathTransitionDuration: 0.8,
          })}
        />
      </div>

      {/* Label */}
      <p
        className="mt-5 text-lg font-medium"
        style={{
          color: "var(--text-primary)",
        }}
      >
        ATS Compatibility
      </p>

      {/* Status */}
      <span
        className="mt-3 rounded-full px-4 py-1 text-sm font-semibold"
        style={{
          backgroundColor: statusBackground,
          color: statusText,
        }}
      >
        {status}
      </span>

    </div>
  );
}

export default ATSScore;