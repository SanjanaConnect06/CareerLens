from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from services.pdf_parser import extract_text
from services.ai_analyzer import analyze_resume
from services.roadmap_service import generate_roadmap
from services.interview_service import (
    generate_first_question,
    evaluate_answer,
    generate_final_evaluation,
    MAX_QUESTIONS,
)
from services.skill_gap_service import analyze_skill_gap

from database.database import (
    create_table,
    save_resume,
    get_history,
    create_user,
    get_user,
    save_interview,
    get_interview_count,
    save_career_goal,
    get_career_goal,
    save_skill_gap,
    get_latest_skill_match,

    save_roadmap,
    get_all_roadmaps,
    get_roadmap_by_id,
    get_current_roadmap,
    update_roadmap_progress,
    get_roadmap_progress,
    delete_roadmap,
)

import bcrypt
import jwt
import datetime
import os
import uuid


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

app.config["SECRET_KEY"] = "careerlens_ai_secret_2026"

CORS(app)

create_table()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ============================================================
# LIVE INTERVIEW SESSION STORAGE
# ============================================================

interview_sessions = {}


# ============================================================
# AUTH HELPER
# ============================================================

def get_authenticated_user():
    """
    Get user_id from JWT Authorization header.
    Returns:
        user_id, None
    """

    auth_header = request.headers.get("Authorization", "")

    if not auth_header:
        return None, "Authorization header missing"

    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None, "Invalid Authorization format. Expected: Bearer <token>"

    token = parts[1]

    try:
        data = jwt.decode(
            token,
            app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )

        return data["user_id"], None

    except jwt.ExpiredSignatureError:
        return None, "Token expired. Please login again."

    except jwt.InvalidTokenError:
        return None, "Invalid token"

    except Exception as e:
        print("AUTH ERROR:", e)
        return None, "Authentication failed."


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():
    return {
        "message": "CareerLens AI Backend Running 🚀"
    }


# ============================================================
# REGISTER
# ============================================================

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required."
        }), 400

    if get_user(email):
        return jsonify({
            "success": False,
            "message": "Email already exists."
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    create_user(
        name,
        email,
        hashed_password.decode("utf-8")
    )

    return jsonify({
        "success": True,
        "message": "Registration Successful!"
    })


# ============================================================
# LOGIN
# ============================================================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    email = data.get("email")
    password = data.get("password")

    user = get_user(email)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        return jsonify({
            "success": False,
            "message": "Incorrect password."
        }), 401

    token = jwt.encode(
        {
            "user_id": user["id"],
            "email": user["email"],
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(days=1),
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "success": True,
        "message": "Login Successful!",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        }
    })


# ============================================================
# UPLOAD RESUME
# ============================================================

@app.route("/upload", methods=["POST"])
def upload_resume():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    if "resume" not in request.files:
        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if not file.filename:
        return jsonify({
            "error": "No file selected"
        }), 400

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)

    try:
        resume_text = extract_text(filepath)

        analysis = analyze_resume(resume_text)

        save_resume(
            user_id,
            file.filename,
            analysis
        )

        return jsonify({
            "message": "Resume analyzed successfully!",
            "analysis": analysis
        })

    except Exception as e:

        print("RESUME ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# RESUME HISTORY
# ============================================================

@app.route("/history", methods=["GET"])
def history():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    history_data = get_history(user_id)

    return jsonify(history_data)


# ============================================================
# OPEN UPLOADED RESUME FROM HISTORY
# ============================================================

@app.route("/history/<int:resume_id>/file", methods=["GET"])
def open_history_resume(resume_id):
    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:
        # Get all resume history for this user
        history = get_history(user_id)

        # Find the requested resume
        resume = next(
            (
                item
                for item in history
                if int(item["id"]) == resume_id
            ),
            None
        )

        if not resume:
            return jsonify({
                "success": False,
                "message": "Resume not found."
            }), 404

        filename = resume["filename"]

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        if not os.path.isfile(filepath):
            return jsonify({
                "success": False,
                "message": "Uploaded resume file could not be found."
            }), 404

        return send_from_directory(
            UPLOAD_FOLDER,
            filename,
            as_attachment=False
        )

    except Exception as e:
        print("RESUME FILE ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to open resume."
        }), 500



# ============================================================
# GENERATE + SAVE NEW ROADMAP
# ============================================================

@app.route("/roadmap", methods=["POST"])
def roadmap():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    goal = data.get("goal")
    level = data.get("level")
    industry = data.get("industry")

    if not goal or not goal.strip():
        return jsonify({
            "success": False,
            "message": "Career goal is required"
        }), 400

    try:

        # Generate AI roadmap
        generated_roadmap = generate_roadmap(
            goal,
            level,
            industry
        )

        # Save career goal
        save_career_goal(
            user_id,
            goal
        )

        # Save this roadmap as a NEW roadmap
        roadmap_id = save_roadmap(
            user_id,
            goal,
            generated_roadmap
        )

        # Add ID information to response
        generated_roadmap["roadmap_id"] = roadmap_id
        generated_roadmap["id"] = roadmap_id

        return jsonify(generated_roadmap)

    except Exception as e:

        print("ROADMAP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ALL ROADMAPS
# ============================================================

@app.route("/roadmaps", methods=["GET"])
def all_roadmaps():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:

        roadmaps = get_all_roadmaps(user_id)

        return jsonify({
            "success": True,
            "roadmaps": roadmaps
        })

    except Exception as e:

        print("GET ROADMAPS ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ONE ROADMAP BY ID
# ============================================================

@app.route("/roadmap/<int:roadmap_id>", methods=["GET"])
def get_single_roadmap(roadmap_id):

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:

        roadmap = get_roadmap_by_id(
            user_id,
            roadmap_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found."
            }), 404

        return jsonify({
            "success": True,
            **roadmap
        })

    except Exception as e:

        print("GET ROADMAP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET CURRENT / LATEST ROADMAP
# ============================================================

@app.route("/roadmap/current", methods=["GET"])
def current_roadmap():
    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:
        roadmap = get_current_roadmap(user_id)

        if not roadmap:
            return jsonify({
                "success": True,
                "roadmap": None,
                "roadmap_id": None,
                "completed_phases": []
            })

        return jsonify({
            "success": True,
            "id": roadmap["id"],
            "roadmap_id": roadmap["id"],
            "goal": roadmap["goal"],
            "roadmap": roadmap["roadmap"],
            "completed_phases": roadmap["completed_phases"],
            "created_at": roadmap["created_at"]
        })

    except Exception as e:
        print("CURRENT ROADMAP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# GET ROADMAP PROGRESS
#
# Usage:
# GET /roadmap/1/progress
# ============================================================

@app.route("/roadmap/<int:roadmap_id>/progress", methods=["GET"])
def roadmap_progress_by_id(roadmap_id):

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:

        roadmap = get_roadmap_by_id(
            user_id,
            roadmap_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found."
            }), 404

        completed_phases = get_roadmap_progress(
            user_id,
            roadmap_id
        )

        return jsonify({
            "success": True,
            "roadmap_id": roadmap_id,
            "completed_phases": completed_phases
        })

    except Exception as e:

        print("ROADMAP PROGRESS ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# OLD PROGRESS ENDPOINT
#
# Kept for compatibility with current frontend.
#
# If roadmap_id is supplied:
#   /roadmap/progress?roadmap_id=1
#
# Otherwise it uses the latest roadmap.
# ============================================================

@app.route("/roadmap/progress", methods=["GET"])
def roadmap_progress():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    try:

        roadmap_id = request.args.get(
            "roadmap_id",
            type=int
        )

        if roadmap_id is None:

            roadmaps = get_all_roadmaps(user_id)

            if not roadmaps:
                return jsonify({
                    "success": True,
                    "roadmap_id": None,
                    "completed_phases": []
                })

            roadmap_id = roadmaps[0]["id"]

        roadmap = get_roadmap_by_id(
            user_id,
            roadmap_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found."
            }), 404

        completed_phases = get_roadmap_progress(
            user_id,
            roadmap_id
        )

        return jsonify({
            "success": True,
            "roadmap_id": roadmap_id,
            "completed_phases": completed_phases
        })

    except Exception as e:

        print("ROADMAP PROGRESS ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# SAVE ROADMAP PROGRESS
#
# Preferred:
# POST /roadmap/1/progress
#
# Body:
# {
#     "completed_phases": [0, 1, 2]
# }
# ============================================================

@app.route("/roadmap/<int:roadmap_id>/progress", methods=["POST"])
def save_roadmap_progress_by_id(roadmap_id):

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    completed_phases = data.get(
        "completed_phases",
        []
    )

    if not isinstance(completed_phases, list):
        return jsonify({
            "success": False,
            "message": "completed_phases must be a list"
        }), 400

    try:

        roadmap = get_roadmap_by_id(
            user_id,
            roadmap_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found."
            }), 404

        update_roadmap_progress(
            user_id,
            roadmap_id,
            completed_phases
        )

        return jsonify({
            "success": True,
            "roadmap_id": roadmap_id,
            "completed_phases": completed_phases
        })

    except Exception as e:

        print("SAVE ROADMAP PROGRESS ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# OLD SAVE PROGRESS ENDPOINT
#
# Kept compatible with current frontend.
# If roadmap_id is supplied in the body, use it.
# Otherwise latest roadmap is used.
# ============================================================

@app.route("/roadmap/progress", methods=["POST"])
def save_roadmap_progress():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    completed_phases = data.get(
        "completed_phases",
        []
    )

    roadmap_id = data.get(
        "roadmap_id"
    )

    if not isinstance(completed_phases, list):
        return jsonify({
            "success": False,
            "message": "completed_phases must be a list"
        }), 400

    try:

        # If frontend doesn't provide an ID,
        # update the latest roadmap.
        if roadmap_id is None:

            roadmaps = get_all_roadmaps(user_id)

            if not roadmaps:
                return jsonify({
                    "success": False,
                    "message": "No roadmap found."
                }), 404

            roadmap_id = roadmaps[0]["id"]

        roadmap = get_roadmap_by_id(
            user_id,
            roadmap_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found."
            }), 404

        update_roadmap_progress(
            user_id,
            roadmap_id,
            completed_phases
        )

        return jsonify({
            "success": True,
            "roadmap_id": roadmap_id,
            "completed_phases": completed_phases
        })

    except Exception as e:

        print("SAVE ROADMAP PROGRESS ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# LIVE AI INTERVIEW
# ============================================================


@app.route("/interview/start", methods=["POST"])
def start_interview():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    role = data.get("role")
    level = data.get("level")

    if not role or not role.strip():
        return jsonify({
            "success": False,
            "message": "Role is required"
        }), 400

    if not level:
        level = "College Student"

    try:

        # Generate first AI question
        first_question = generate_first_question(
            role,
            level
        )

        session_id = str(uuid.uuid4())

        interview_sessions[session_id] = {
            "user_id": user_id,
            "role": role.strip(),
            "level": level,
            "current_question": first_question["question"],
            "current_question_number": 1,
            "history": []
        }

        return jsonify({
            "success": True,
            "session_id": session_id,
            "role": role,
            "level": level,
            "question": first_question["question"],
            "question_number": 1,
            "max_questions": MAX_QUESTIONS,
            "status": "in_progress"
        })

    except Exception as e:

        print("START INTERVIEW ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/interview/answer", methods=["POST"])
def answer_interview():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    session_id = data.get("session_id")
    answer = data.get("answer")

    if not session_id:
        return jsonify({
            "success": False,
            "message": "Session ID is required"
        }), 400

    if not answer or not answer.strip():
        return jsonify({
            "success": False,
            "message": "Answer is required"
        }), 400

    session = interview_sessions.get(session_id)

    if not session:
        return jsonify({
            "success": False,
            "message": "Interview session not found or expired."
        }), 404

    # Make sure another user cannot access this session
    if session["user_id"] != user_id:
        return jsonify({
            "success": False,
            "message": "Unauthorized interview session."
        }), 403

    try:

        current_question_number = session["current_question_number"]
        current_question = session["current_question"]

        # Evaluate current answer
        evaluation = evaluate_answer(
            session["role"],
            session["level"],
            current_question_number,
            current_question,
            answer.strip(),
            session["history"]
        )

        interview_record = {
            "question_number": current_question_number,
            "question": current_question,
            "answer": answer.strip(),
            "score": evaluation.get("score", 0),
            "technical_knowledge": evaluation.get(
                "technical_knowledge",
                0
            ),
            "problem_solving": evaluation.get(
                "problem_solving",
                0
            ),
            "communication": evaluation.get(
                "communication",
                0
            ),
            "confidence": evaluation.get(
                "confidence",
                0
            ),
            "feedback": evaluation.get(
                "feedback",
                ""
            ),
            "strength": evaluation.get(
                "strength",
                ""
            ),
            "improvement": evaluation.get(
                "improvement",
                ""
            )
        }

        session["history"].append(interview_record)

        # ----------------------------------------------------
        # FINAL QUESTION
        # ----------------------------------------------------

        if current_question_number >= MAX_QUESTIONS:

            final_evaluation = generate_final_evaluation(
                session["role"],
                session["level"],
                session["history"]
            )

            # Save completed interview
            save_interview(
                user_id,
                session["role"],
                session["level"]
            )

            # Remove completed session
            del interview_sessions[session_id]

            return jsonify({
                "success": True,
                "status": "completed",
                "question_number": current_question_number,
                "max_questions": MAX_QUESTIONS,
                "evaluation": interview_record,
                "final_evaluation": final_evaluation
            })

        # ----------------------------------------------------
        # NEXT QUESTION
        # ----------------------------------------------------

        next_question = evaluation.get("next_question", "").strip()

        if not next_question:
            next_question = (
                "Can you explain your previous answer "
                "in more detail?"
            )

        session["current_question_number"] += 1
        session["current_question"] = next_question

        return jsonify({
            "success": True,
            "status": "in_progress",
            "question_number": session["current_question_number"],
            "max_questions": MAX_QUESTIONS,
            "question": next_question,
            "evaluation": interview_record
        })

    except Exception as e:

        print("ANSWER INTERVIEW ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# ============================================================
# INTERVIEW COUNT
# ============================================================

@app.route("/interview/count", methods=["GET"])
def interview_count():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    count = get_interview_count(user_id)

    return jsonify({
        "count": count
    })


# ============================================================
# SKILL GAP
# ============================================================

@app.route("/skill-gap", methods=["POST"])
def skill_gap():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is missing"
        }), 400

    goal = data.get("goal")
    skills = data.get("skills")

    try:

        result = analyze_skill_gap(
            goal,
            skills
        )

        save_skill_gap(
            user_id,
            goal,
            result
        )

        return jsonify(result)

    except Exception as e:

        print("SKILL GAP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# LATEST SKILL GAP
# ============================================================

@app.route("/skill-gap/latest", methods=["GET"])
def latest_skill_gap():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    skill_match = get_latest_skill_match(user_id)

    return jsonify({
        "skill_match": skill_match
    })


# ============================================================
# CAREER GOAL
# ============================================================

@app.route("/career-goal", methods=["GET"])
def career_goal():

    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "message": error
        }), 401

    goal = get_career_goal(user_id)

    return jsonify({
        "career_goal": goal
    })



@app.route("/career-goal", methods=["POST"])
def save_user_career_goal():
    user_id, error = get_authenticated_user()

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing"
        }), 400

    goal = data.get("career_goal")

    if not goal or not goal.strip():
        return jsonify({
            "success": False,
            "message": "Career goal is required"
        }), 400

    goal = goal.strip()

    try:
        save_career_goal(
            user_id,
            goal
        )

        return jsonify({
            "success": True,
            "career_goal": goal,
            "message": "Career goal saved successfully."
        })

    except Exception as e:
        print("CAREER GOAL ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/roadmap/<int:roadmap_id>", methods=["DELETE"])
def delete_saved_roadmap(roadmap_id):

    token = request.headers.get("Authorization")

    if not token:
        return jsonify({
            "message": "Token missing"
        }), 401

    try:
        token = token.split(" ")[1]

        data_token = jwt.decode(
            token,
            app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )

    except Exception:
        return jsonify({
            "message": "Invalid token"
        }), 401

    user_id = data_token["user_id"]

    deleted = delete_roadmap(
        user_id,
        roadmap_id
    )

    if not deleted:
        return jsonify({
            "success": False,
            "message": "Roadmap not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Roadmap deleted successfully."
    })




# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)