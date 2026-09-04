import { useEffect, useRef, useState } from "react";
import { submitInterviewAnswer } from "../../api/interviewApi";

function InterviewResult({ interview }) {
  const [question, setQuestion] = useState(
    interview?.question || ""
  );

  const [questionNumber, setQuestionNumber] = useState(
    interview?.question_number || 1
  );

  const [maxQuestions, setMaxQuestions] = useState(
    interview?.max_questions || 15
  );

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] =
    useState("");

  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [evaluation, setEvaluation] = useState(null);
  const [finalEvaluation, setFinalEvaluation] = useState(null);

  const recognitionRef = useRef(null);

  /*
   * Stores only confirmed/final speech.
   * This prevents interim speech from being duplicated.
   */
  const finalTranscriptRef = useRef("");

  /*
   * Tells recognition.onend whether the user
   * intentionally stopped the microphone.
   */
  const keepListeningRef = useRef(false);

  /*
   * Prevents multiple recognition instances from
   * being started at the same time.
   */
  const recognitionRunningRef = useRef(false);

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  /*
   * --------------------------------------------------
   * SPEECH RECOGNITION SETUP
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn(
        "Speech Recognition is not supported."
      );

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    /*
     * Recognition started
     */

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");

      recognitionRunningRef.current = true;

      setListening(true);
    };

    /*
     * Speech result received
     */

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (!result || !result[0]) {
          continue;
        }

        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text + " ";
        } else {
          interimText += text;
        }
      }

      /*
       * Add only FINAL speech to the permanent transcript.
       */

      if (finalText.trim()) {
        finalTranscriptRef.current =
          `${finalTranscriptRef.current} ${finalText}`
            .replace(/\s+/g, " ")
            .trim();

        setTranscript(finalTranscriptRef.current);
      }

      /*
       * Interim speech is displayed separately.
       */

      setInterimTranscript(interimText);
    };

    /*
     * Recognition errors
     */

    recognition.onerror = (event) => {
      console.error(
        "🎤 Speech recognition error:",
        event.error
      );

      /*
       * These are temporary and should NOT
       * immediately kill the microphone.
       */

      if (event.error === "no-speech") {
        console.log(
          "No speech detected. Waiting for more speech..."
        );

        return;
      }

      if (event.error === "aborted") {
        return;
      }

      /*
       * Permission denied
       */

      if (event.error === "not-allowed") {
        keepListeningRef.current = false;
        recognitionRunningRef.current = false;

        setListening(false);

        alert(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );

        return;
      }

      /*
       * Microphone unavailable
       */

      if (event.error === "audio-capture") {
        keepListeningRef.current = false;
        recognitionRunningRef.current = false;

        setListening(false);

        alert(
          "No microphone was detected. Please check your microphone and try again."
        );

        return;
      }

      /*
       * Browser/network speech service issue.
       */

      if (event.error === "network") {
        console.warn(
          "Speech recognition network error."
        );

        /*
         * Don't immediately stop.
         * onend will attempt a restart.
         */

        return;
      }
    };

    /*
     * Recognition ended.
     *
     * Chrome can stop recognition automatically even
     * while the user is still answering.
     *
     * If the user has NOT pressed stop, restart it.
     */

    recognition.onend = () => {
      console.log("🎤 Speech recognition ended");

      recognitionRunningRef.current = false;

      setInterimTranscript("");

      if (keepListeningRef.current) {
        console.log(
          "🔄 Restarting speech recognition..."
        );

        setTimeout(() => {
          if (
            !keepListeningRef.current ||
            recognitionRunningRef.current
          ) {
            return;
          }

          try {
            recognition.start();
          } catch (error) {
            console.log(
              "Recognition restart failed:",
              error
            );
          }
        }, 400);

        return;
      }

      setListening(false);
    };

    recognitionRef.current = recognition;

    /*
     * Cleanup
     */

    return () => {
      keepListeningRef.current = false;

      recognitionRunningRef.current = false;

      try {
        recognition.stop();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  /*
   * --------------------------------------------------
   * SPEAK AI QUESTION
   * --------------------------------------------------
   */

  useEffect(() => {
    if (question) {
      speakQuestion(question);
    }
  }, [question]);

  const speakQuestion = (text) => {
    if (
      !window.speechSynthesis ||
      !text
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  /*
   * --------------------------------------------------
   * START MICROPHONE
   * --------------------------------------------------
   */

  const startListening = () => {
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    const recognition =
      recognitionRef.current;

    if (!recognition) {
      alert(
        "Speech recognition could not be initialized. Please refresh the page."
      );

      return;
    }

    /*
     * If already running, don't start another
     * recognition session.
     */

    if (recognitionRunningRef.current) {
      return;
    }

    /*
     * Tell onend that we want recognition
     * to keep running.
     */

    keepListeningRef.current = true;

    /*
     * Start a completely new answer.
     */

    finalTranscriptRef.current = "";

    setTranscript("");
    setInterimTranscript("");
    setEvaluation(null);

    /*
     * Stop AI voice before user starts speaking.
     */

    window.speechSynthesis?.cancel();

    try {
      recognition.start();

      setListening(true);

      console.log(
        "🎤 Starting microphone..."
      );
    } catch (error) {
      console.error(
        "Could not start recognition:",
        error
      );

      /*
       * Sometimes recognition is technically
       * starting even though start() throws.
       * Give it a moment and try once more.
       */

      setTimeout(() => {
        if (
          !keepListeningRef.current ||
          recognitionRunningRef.current
        ) {
          return;
        }

        try {
          recognition.start();
        } catch (retryError) {
          console.error(
            "Recognition retry failed:",
            retryError
          );

          keepListeningRef.current = false;
          setListening(false);
        }
      }, 500);
    }
  };

  /*
   * --------------------------------------------------
   * STOP MICROPHONE
   * --------------------------------------------------
   */

  const stopListening = () => {
    /*
     * This is an intentional stop.
     * Therefore onend must NOT restart recognition.
     */

    keepListeningRef.current = false;

    const recognition =
      recognitionRef.current;

    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.log(error);
      }
    }

    recognitionRunningRef.current = false;

    setListening(false);
    setInterimTranscript("");

    console.log(
      "🛑 Microphone stopped"
    );
  };

  /*
   * --------------------------------------------------
   * SUBMIT ANSWER
   * --------------------------------------------------
   */

  const handleSubmitAnswer = async () => {
    const finalAnswer =
      finalTranscriptRef.current.trim();

    /*
     * If recognition is still running,
     * stop it first.
     */

    if (listening) {
      stopListening();
    }

    /*
     * We intentionally submit only FINAL speech.
     * Interim text can still be incomplete.
     */

    if (!finalAnswer) {
      alert(
        "Please answer the question using your microphone."
      );

      return;
    }

    try {
      setSubmitting(true);

      const data =
        await submitInterviewAnswer(
          interview.session_id,
          finalAnswer
        );

      /*
       * Store evaluation for current answer.
       */

      setEvaluation(
        data.evaluation || null
      );

      /*
       * Interview completed
       */

      if (data.status === "completed") {
        setFinalEvaluation(
          data.final_evaluation
        );

        window.speechSynthesis?.cancel();

        return;
      }

      /*
       * Move to next question.
       */

      if (data.question) {
        setQuestion(data.question);

        setQuestionNumber(
          data.question_number
        );

        setMaxQuestions(
          data.max_questions || 15
        );

        /*
         * Reset transcript for next question.
         */

        finalTranscriptRef.current = "";

        setTranscript("");
        setInterimTranscript("");
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to submit your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * --------------------------------------------------
   * FINAL REPORT
   * --------------------------------------------------
   */

  if (finalEvaluation) {
    return (
      <FinalEvaluation
        evaluation={finalEvaluation}
      />
    );
  }

  /*
   * Combine permanent + live speech for display.
   *
   * IMPORTANT:
   * This is ONLY for UI.
   * We submit finalTranscriptRef.current.
   */

  const displayedTranscript =
    `${transcript} ${interimTranscript}`
      .replace(/\s+/g, " ")
      .trim();

  /*
   * --------------------------------------------------
   * INTERVIEW UI
   * --------------------------------------------------
   */

  return (
    <div
      className="rounded-2xl border p-6 lg:p-8"
      style={{
        backgroundColor:
          "var(--bg-card)",
        borderColor:
          "var(--border-primary)",
      }}
    >
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{
              color: "var(--accent)",
            }}
          >
            Live AI Interview
          </p>

          <h2
            className="mt-1 text-xl font-semibold"
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            Interview Coach
          </h2>
        </div>

        <div
          className="rounded-full border px-4 py-2 text-sm font-medium"
          style={{
            borderColor:
              "var(--border-primary)",
            color:
              "var(--text-primary)",
            backgroundColor:
              "var(--bg-secondary)",
          }}
        >
          Question {questionNumber} of{" "}
          {maxQuestions}
        </div>
      </div>

      {/* PROGRESS */}

      <div className="mt-6">
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{
            backgroundColor:
              "var(--bg-secondary)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${
                (questionNumber /
                  maxQuestions) *
                100
              }%`,
              backgroundColor:
                "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* AI QUESTION */}

      <div
        className="mt-8 rounded-2xl border p-6 lg:p-8"
        style={{
          backgroundColor:
            "var(--bg-secondary)",
          borderColor:
            "var(--border-primary)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            AI Interviewer
          </span>

          <button
            type="button"
            onClick={() =>
              speakQuestion(question)
            }
            className="rounded-full border p-3 transition hover:opacity-80"
            style={{
              borderColor:
                "var(--border-primary)",
              color:
                "var(--text-primary)",
            }}
            title="Read question aloud"
          >
            🔊
          </button>
        </div>

        <h3
          className="mt-5 text-xl font-medium leading-8 lg:text-2xl"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          {question}
        </h3>
      </div>

      {/* MICROPHONE */}

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={
            listening
              ? stopListening
              : startListening
          }
          disabled={submitting}
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 text-3xl transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: listening
              ? "var(--accent)"
              : "var(--border-primary)",

            backgroundColor: listening
              ? "var(--accent)"
              : "var(--bg-secondary)",

            color: listening
              ? "#ffffff"
              : "var(--text-primary)",

            boxShadow: listening
              ? "0 0 0 10px rgba(99,102,241,0.12)"
              : "none",
          }}
          title={
            listening
              ? "Stop recording"
              : "Start speaking"
          }
        >
          🎤
        </button>

        <p
          className="mt-4 text-sm font-medium"
          style={{
            color: listening
              ? "var(--accent)"
              : "var(--text-primary)",
          }}
        >
          {listening
            ? "Listening..."
            : "Tap the microphone to answer"}
        </p>

        <p
          className="mt-1 text-xs"
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          Speak naturally as you would in a
          real interview.
        </p>
      </div>

      {/* ANSWER */}

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            Your Answer
          </span>

          {displayedTranscript && (
            <span
              className="text-xs"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              {listening
                ? "Listening to your speech..."
                : "Speech captured"}
            </span>
          )}
        </div>

        <div
          className="min-h-32 rounded-xl border p-4 text-sm leading-6"
          style={{
            backgroundColor:
              "var(--bg-secondary)",
            borderColor:
              "var(--border-primary)",
            color:
              displayedTranscript
                ? "var(--text-primary)"
                : "var(--text-secondary)",
          }}
        >
          {displayedTranscript ||
            "Your spoken answer will appear here..."}
        </div>
      </div>

      {/* SUBMIT */}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={
            handleSubmitAnswer
          }
          disabled={
            submitting ||
            !transcript.trim()
          }
          className="rounded-lg px-6 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor:
              "var(--accent)",
            color: "#ffffff",
          }}
        >
          {submitting
            ? "AI is evaluating..."
            : questionNumber ===
              maxQuestions
            ? "Finish Interview"
            : "Submit Answer"}
        </button>
      </div>

      {/* CURRENT ANSWER FEEDBACK */}

      {evaluation && (
        <div
          className="mt-8 rounded-xl border p-5"
          style={{
            backgroundColor:
              "var(--bg-secondary)",
            borderColor:
              "var(--border-primary)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold"
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              AI Feedback
            </h3>

            <span
              className="text-lg font-bold"
              style={{
                color:
                  "var(--accent)",
              }}
            >
              {evaluation.score}/10
            </span>
          </div>

          <p
            className="mt-3 text-sm leading-6"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {evaluation.feedback}
          </p>

          {evaluation.strength && (
            <div className="mt-4">
              <p
                className="text-xs font-semibold uppercase"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Strength
              </p>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                {evaluation.strength}
              </p>
            </div>
          )}

          {evaluation.improvement && (
            <div className="mt-4">
              <p
                className="text-xs font-semibold uppercase"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Improve
              </p>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                {evaluation.improvement}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/*
 * ==================================================
 * FINAL EVALUATION
 * ==================================================
 */

function FinalEvaluation({ evaluation }) {
  const scoreCards = [
    {
      label: "Technical Knowledge",
      value:
        evaluation.technical_knowledge,
    },
    {
      label: "Problem Solving",
      value:
        evaluation.problem_solving,
    },
    {
      label: "Communication",
      value:
        evaluation.communication,
    },
    {
      label: "Confidence",
      value:
        evaluation.confidence,
    },
  ];

  return (
    <div
      className="rounded-2xl border p-6 lg:p-8"
      style={{
        backgroundColor:
          "var(--bg-card)",
        borderColor:
          "var(--border-primary)",
      }}
    >
      {/* TITLE */}

      <div className="text-center">
        <div className="text-5xl">
          🎉
        </div>

        <p
          className="mt-4 text-xs font-medium uppercase tracking-wider"
          style={{
            color: "var(--accent)",
          }}
        >
          Interview Complete
        </p>

        <h2
          className="mt-2 text-3xl font-semibold"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          Your Performance Report
        </h2>

        <p
          className="mx-auto mt-3 max-w-2xl text-sm leading-6"
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          Your answers were evaluated across
          technical knowledge, problem solving,
          communication and confidence.
        </p>
      </div>

      {/* OVERALL SCORE */}

      <div className="mt-8 flex justify-center">
        <div
          className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4"
          style={{
            borderColor:
              "var(--accent)",
          }}
        >
          <span
            className="text-4xl font-bold"
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            {evaluation.overall_score}
          </span>

          <span
            className="text-xs"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* SCORE CARDS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scoreCards.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border p-5"
            style={{
              backgroundColor:
                "var(--bg-secondary)",
              borderColor:
                "var(--border-primary)",
            }}
          >
            <p
              className="text-xs"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              {item.label}
            </p>

            <p
              className="mt-2 text-2xl font-bold"
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              {item.value}
            </p>

            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full"
              style={{
                backgroundColor:
                  "var(--bg-card)",
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.value}%`,
                  backgroundColor:
                    "var(--accent)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}

      {evaluation.summary && (
        <ReportSection title="Overall Assessment">
          <p
            className="text-sm leading-7"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {evaluation.summary}
          </p>
        </ReportSection>
      )}

      {/* STRENGTHS */}

      <ReportSection title="Strengths">
        <BulletList
          items={evaluation.strengths}
        />
      </ReportSection>

      {/* WEAKNESSES */}

      <ReportSection title="Areas to Improve">
        <BulletList
          items={evaluation.weaknesses}
        />
      </ReportSection>

      {/* RECOMMENDATIONS */}

      <ReportSection title="Recommended Practice Topics">
        <BulletList
          items={
            evaluation.recommended_topics
          }
        />
      </ReportSection>

      {/* ANSWER FEEDBACK */}

      <ReportSection title="Answer-by-Answer Feedback">
        <div className="space-y-3">
          {evaluation.answer_feedback?.map(
            (item) => (
              <div
                key={
                  item.question_number
                }
                className="rounded-xl border p-4"
                style={{
                  backgroundColor:
                    "var(--bg-secondary)",
                  borderColor:
                    "var(--border-primary)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        "var(--text-primary)",
                    }}
                  >
                    Question{" "}
                    {item.question_number}
                  </span>

                  <span
                    className="font-semibold"
                    style={{
                      color:
                        "var(--accent)",
                    }}
                  >
                    {item.score}/10
                  </span>
                </div>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  {item.feedback}
                </p>
              </div>
            )
          )}
        </div>
      </ReportSection>
    </div>
  );
}

/*
 * ==================================================
 * REPORT SECTION
 * ==================================================
 */

function ReportSection({
  title,
  children,
}) {
  return (
    <section className="mt-8">
      <h3
        className="text-lg font-semibold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        {title}
      </h3>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

/*
 * ==================================================
 * BULLET LIST
 * ==================================================
 */

function BulletList({ items }) {
  if (
    !items ||
    items.length === 0
  ) {
    return (
      <p
        className="text-sm"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        No specific items were identified.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-3"
        >
          <span
            className="mt-1"
            style={{
              color: "var(--accent)",
            }}
          >
            •
          </span>

          <p
            className="text-sm leading-6"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

export default InterviewResult;