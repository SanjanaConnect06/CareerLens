import { useState } from "react";
import FeatureCard from "../common/FeatureCard";
import FeatureDemo from "./FeatureDemo";

function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      title: "AI Resume Analyzer",
      icon: "📄",
      description:
        "Analyze your resume for ATS compatibility, identify weaknesses, and get practical improvements.",
      demoDescription:
        "CareerLens analyzes your resume and provides an ATS compatibility score along with actionable recommendations.",
      highlights: [
        "ATS compatibility score",
        "Resume strengths and weaknesses",
        "Missing keywords and skills",
        "Personalized improvement suggestions",
      ],
    },

    {
      title: "Career Roadmaps",
      icon: "🗺️",
      description:
        "Build a personalized step-by-step roadmap based on your target career and current level.",
      demoDescription:
        "CareerLens creates a structured learning path based on your career goal and current experience.",
      highlights: [
        "Career-specific learning path",
        "Skills to learn in order",
        "Projects and practice recommendations",
        "Estimated learning timeline",
      ],
    },

    {
      title: "Interview Coach",
      icon: "🎯",
      description:
        "Prepare for HR, behavioral, and technical interviews with realistic AI-generated questions and answers.",
      demoDescription:
        "Practice realistic interview questions tailored to your target role and experience level.",
      highlights: [
        "HR interview questions",
        "Technical questions",
        "Behavioral questions",
        "Suggested model answers",
      ],
    },

    {
      title: "Skill Gap Analysis",
      icon: "📊",
      description:
        "Compare your current skills with your target career and discover what you need to learn next.",
      demoDescription:
        "CareerLens compares your current abilities with the skills expected for your target career.",
      highlights: [
        "Current skill assessment",
        "Missing skill identification",
        "Priority levels",
        "Personalized learning recommendations",
      ],
    },
  ];

  return (
    <>
      <section
        id="features"
        className="bg-slate-950 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-4xl font-bold text-white">
            Everything You Need To Build Your Career
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            CareerLens brings resume analysis, career planning,
            interview preparation, and skill assessment together
            in one AI-powered platform.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={() => setSelectedFeature(feature)}
              />
            ))}

          </div>

        </div>
      </section>

      <FeatureDemo
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </>
  );
}

export default Features;