function SkillGapResult({ result }) {
  if (!result) return null;

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return {
        backgroundColor: "var(--danger-bg)",
        color: "var(--danger)",
      };
    }

    if (priority === "Medium") {
      return {
        backgroundColor: "var(--warning-bg)",
        color: "var(--warning)",
      };
    }

    return {
      backgroundColor: "var(--success-bg)",
      color: "var(--success)",
    };
  };

  const ListSection = ({
    title,
    subtitle,
    items,
    accent = "var(--accent)",
  }) => (
    <section
      className="rounded-2xl border p-6 lg:p-7"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
      }}
    >
      <div className="mb-6">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>

        <p
          className="mt-1 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {subtitle}
        </p>
      </div>

      <div className="space-y-3">
        {items?.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-lg border p-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
              }}
            >
              <span
                className="mt-1 text-xs"
                style={{ color: accent }}
              >
                •
              </span>

              <p
                className="text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {item}
              </p>
            </div>
          ))
        ) : (
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            No information available.
          </p>
        )}
      </div>
    </section>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <section
        className="rounded-2xl border p-7 lg:p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.14em]"
          style={{ color: "var(--accent)" }}
        >
          AI Career Intelligence
        </p>

        <h2
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl"
          style={{ color: "var(--text-primary)" }}
        >
          {result.goal}
        </h2>

        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          AI Skill Gap Assessment
        </p>
      </section>


      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Skill Match */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="flex items-center justify-between">

            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Skill Match
              </p>

              <p
                className="mt-2 text-3xl font-semibold"
                style={{ color: "var(--success)" }}
              >
                {result.skill_match}%
              </p>
            </div>

            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--success-bg)",
                color: "var(--success)",
              }}
            >
              %
            </div>

          </div>
        </div>


        {/* Estimated Time */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="flex items-center justify-between">

            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Estimated Learning Time
              </p>

              <p
                className="mt-2 text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {result.estimated_time || "Not specified"}
              </p>
            </div>

            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--bg-hover)",
                color: "var(--accent)",
              }}
            >
              ⏱
            </div>

          </div>
        </div>

      </div>


      {/* Current Strengths */}
      <ListSection
        title="Current Strengths"
        subtitle="Skills you already have that align with your target career."
        items={result.current_strengths}
        accent="var(--success)"
      />


      {/* Missing Skills */}
      <section
        className="rounded-2xl border p-6 lg:p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        <div className="mb-6">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Missing Skills
          </h3>

          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Prioritized skills that could improve your career readiness.
          </p>
        </div>

        <div className="space-y-3">

          {result.missing_skills?.length > 0 ? (
            result.missing_skills.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-primary)",
                }}
              >

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--bg-hover)",
                      color: "var(--accent)",
                    }}
                  >
                    {index + 1}
                  </div>

                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.skill}
                  </span>

                </div>

                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                  style={getPriorityStyle(item.priority)}
                >
                  {item.priority}
                </span>

              </div>
            ))
          ) : (
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No major skill gaps detected.
            </p>
          )}

        </div>

      </section>


      {/* Learning Resources */}
      <ListSection
        title="Recommended Learning Resources"
        subtitle="Resources that can help you close the identified gaps."
        items={result.learning_resources}
        accent="var(--accent)"
      />


      {/* Action Plan */}
      <section
        className="rounded-2xl border p-6 lg:p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        <div className="mb-6">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Action Plan
          </h3>

          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Follow these steps to systematically close your skill gaps.
          </p>
        </div>

        <div className="space-y-4">

          {result.action_plan?.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
              }}
            >

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                {index + 1}
              </div>

              <p
                className="text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {step}
              </p>

            </div>
          ))}

        </div>

      </section>


      {/* Career Tips */}
      <ListSection
        title="Career Tips"
        subtitle="Practical advice for improving your career readiness."
        items={result.career_tips}
        accent="var(--success)"
      />

    </div>
  );
}

export default SkillGapResult;