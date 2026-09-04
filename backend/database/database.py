import sqlite3
import json

DATABASE = "careerlens.db"


def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = get_connection()

    # Users table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            career_goal TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Resume history table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS resume_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            ats_score INTEGER,
            summary TEXT,
            analysis TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Interview history table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS interview_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            level TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Skill gap history table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS skill_gap_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            goal TEXT NOT NULL,
            skill_match INTEGER,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)


    # Roadmap table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS roadmap_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            goal TEXT NOT NULL,
            roadmap TEXT NOT NULL,
            completed_phases TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()


# -----------------------------
# USER FUNCTIONS
# -----------------------------

def create_user(name, email, password):
    conn = get_connection()

    conn.execute(
        """
        INSERT INTO users(name, email, password)
        VALUES(?,?,?)
        """,
        (name, email, password),
    )

    conn.commit()
    conn.close()


def get_user(email):
    conn = get_connection()

    user = conn.execute(
        """
        SELECT *
        FROM users
        WHERE email=?
        """,
        (email,),
    ).fetchone()

    conn.close()

    return dict(user) if user else None


# -----------------------------
# RESUME FUNCTIONS
# -----------------------------

def save_resume(user_id, filename, analysis):
    conn = get_connection()

    conn.execute(
        """
        INSERT INTO resume_history
        (user_id, filename, ats_score, summary, analysis)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            filename,
            analysis["ats_score"],
            analysis["summary"],
            json.dumps(analysis),
        ),
    )

    conn.commit()
    conn.close()


def get_history(user_id):
    conn = get_connection()

    rows = conn.execute(
        """
        SELECT
            id,
            filename,
            ats_score,
            summary,
            created_at
        FROM resume_history
        WHERE user_id=?
        ORDER BY created_at DESC
        """,
        (user_id,),
    ).fetchall()

    conn.close()

    return [dict(row) for row in rows]


# -----------------------------
# INTERVIEW FUNCTIONS
# -----------------------------

def save_interview(user_id, role, level):
    conn = get_connection()

    conn.execute(
        """
        INSERT INTO interview_history
        (user_id, role, level)
        VALUES (?, ?, ?)
        """,
        (user_id, role, level),
    )

    conn.commit()
    conn.close()


def get_interview_count(user_id):
    conn = get_connection()

    result = conn.execute(
        """
        SELECT COUNT(*) AS count
        FROM interview_history
        WHERE user_id=?
        """,
        (user_id,),
    ).fetchone()

    conn.close()

    return result["count"]


# -----------------------------
# CAREER GOAL FUNCTIONS
# -----------------------------

def save_career_goal(user_id, goal):
    conn = get_connection()

    conn.execute(
        """
        UPDATE users
        SET career_goal=?
        WHERE id=?
        """,
        (goal, user_id),
    )

    conn.commit()
    conn.close()


def get_career_goal(user_id):
    conn = get_connection()

    result = conn.execute(
        """
        SELECT career_goal
        FROM users
        WHERE id=?
        """,
        (user_id,),
    ).fetchone()

    conn.close()

    if result:
        return result["career_goal"]

    return None


# -----------------------------
# SKILL GAP FUNCTIONS
# -----------------------------

def save_skill_gap(user_id, goal, result):
    conn = get_connection()

    conn.execute(
        """
        INSERT INTO skill_gap_history
        (user_id, goal, skill_match, result)
        VALUES (?, ?, ?, ?)
        """,
        (
            user_id,
            goal,
            result["skill_match"],
            json.dumps(result),
        ),
    )

    conn.commit()
    conn.close()


def get_latest_skill_match(user_id):
    conn = get_connection()

    result = conn.execute(
        """
        SELECT skill_match
        FROM skill_gap_history
        WHERE user_id=?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()

    conn.close()

    if result:
        return result["skill_match"]

    return None


  # -----------------------------
# ROADMAP FUNCTIONS
# -----------------------------

def save_roadmap(user_id, goal, roadmap):
    conn = get_connection()

    cursor = conn.execute(
        """
        INSERT INTO roadmap_history
        (user_id, goal, roadmap, completed_phases)
        VALUES (?, ?, ?, ?)
        """,
        (
            user_id,
            goal,
            json.dumps(roadmap),
            json.dumps([]),
        ),
    )

    roadmap_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return roadmap_id


def get_all_roadmaps(user_id):
    conn = get_connection()

    rows = conn.execute(
        """
        SELECT
            id,
            goal,
            completed_phases,
            created_at
        FROM roadmap_history
        WHERE user_id=?
        ORDER BY created_at DESC
        """,
        (user_id,),
    ).fetchall()

    conn.close()

    roadmaps = []

    for row in rows:
        roadmaps.append({
            "id": row["id"],
            "goal": row["goal"],
            "completed_phases": json.loads(
                row["completed_phases"]
            ),
            "created_at": row["created_at"],
        })

    return roadmaps


def get_roadmap_by_id(user_id, roadmap_id):
    conn = get_connection()

    result = conn.execute(
        """
        SELECT
            id,
            goal,
            roadmap,
            completed_phases,
            created_at
        FROM roadmap_history
        WHERE id=? AND user_id=?
        """,
        (roadmap_id, user_id),
    ).fetchone()

    conn.close()

    if not result:
        return None

    return {
        "id": result["id"],
        "goal": result["goal"],
        "roadmap": json.loads(result["roadmap"]),
        "completed_phases": json.loads(
            result["completed_phases"]
        ),
        "created_at": result["created_at"],
    }


def delete_roadmap(user_id, roadmap_id):
    conn = get_connection()

    cursor = conn.execute(
        """
        DELETE FROM roadmap_history
        WHERE id=? AND user_id=?
        """,
        (roadmap_id, user_id),
    )

    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()

    return deleted


def update_roadmap_progress(user_id, roadmap_id, completed_phases):
    conn = get_connection()

    conn.execute(
        """
        UPDATE roadmap_history
        SET completed_phases = ?
        WHERE id = ? AND user_id = ?
        """,
        (
            json.dumps(completed_phases),
            roadmap_id,
            user_id,
        ),
    )

    conn.commit()
    conn.close()


def get_roadmap_progress(user_id, roadmap_id):
    conn = get_connection()

    row = conn.execute(
        """
        SELECT completed_phases
        FROM roadmap_history
        WHERE id = ? AND user_id = ?
        """,
        (
            roadmap_id,
            user_id,
        ),
    ).fetchone()

    conn.close()

    if not row:
        return []

    try:
        return json.loads(row["completed_phases"] or "[]")
    except (json.JSONDecodeError, TypeError):
        return []




def get_current_roadmap(user_id):
    conn = get_connection()

    result = conn.execute(
        """
        SELECT
            id,
            user_id,
            goal,
            roadmap,
            completed_phases,
            created_at
        FROM roadmap_history
        WHERE user_id=?
        ORDER BY created_at DESC, id DESC
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()

    conn.close()

    if not result:
        return None

    try:
        return {
            "id": result["id"],
            "user_id": result["user_id"],
            "goal": result["goal"],
            "roadmap": json.loads(result["roadmap"]),
            "completed_phases": json.loads(
                result["completed_phases"] or "[]"
            ),
            "created_at": result["created_at"],
        }
    except (json.JSONDecodeError, TypeError):
        return None