from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from datetime import time

app = Flask(__name__)
CORS(app)

# 🔥 MySQL Connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="smart_campus_management",
        autocommit=True
    )

# cursor = db.cursor(dictionary=True)




# @app.route("/login", methods=["POST"])
# def login():
#     try:
#         db = get_db()
#         cursor = db.cursor(dictionary=True)
#         data = request.get_json()
#         print("DATA RECEIVED:", data)   # ✅ IMPORTANT

#         email = data.get("email")
#         password = data.get("password")

#         cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
#         user = cursor.fetchone()

#         if user:
#             stored_password = user["password"]

#             if isinstance(stored_password, str):
#                 stored_password = stored_password.encode('utf-8')

#             if bcrypt.checkpw(password.encode('utf-8'), stored_password):
#                 return jsonify({
#                     "success": True,
#                     "role": user["role"],
#                     "name": user["name"],
#                     "user_id": user["user_id"]
#                 })

#         return jsonify({"success": False})

#     except Exception as e:
#         print("❌ LOGIN ERROR:", e)
#         return jsonify({"success": False})
@app.route("/login", methods=["POST"])
def login():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        data = request.get_json()
        print("DATA RECEIVED:", data)

        email = data.get("email")
        password = data.get("password")

        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user:

            stored_password = user["password"]

            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')

            if bcrypt.checkpw(password.encode('utf-8'), stored_password):

                course_id = None
                semester = None
                faculty_id = None   # ✅ ADDED

                # ✅ ONLY FOR STUDENT
                if user["role"] == "student":

                    cursor.execute("""
                        SELECT course_id, semester
                        FROM students
                        WHERE user_id = %s
                    """, (user["user_id"],))

                    student = cursor.fetchone()

                    if student:
                        course_id = student["course_id"]
                        semester = student["semester"]

                # ✅ ONLY FOR FACULTY (ADDED)
                if user["role"] == "faculty":

                    cursor.execute("""
                        SELECT faculty_id
                        FROM faculty
                        WHERE user_id = %s
                    """, (user["user_id"],))

                    faculty = cursor.fetchone()

                    if faculty:
                        faculty_id = faculty["faculty_id"]

                return jsonify({
                    "success": True,
                    "role": user["role"],
                    "name": user["name"],
                    "user_id": user["user_id"],
                    "course_id": course_id,
                    "semester": semester,
                    "faculty_id": faculty_id   # ✅ ADDED
                })

        return jsonify({"success": False})

    except Exception as e:
        print("❌ LOGIN ERROR:", e)
        return jsonify({"success": False})
# =========================
# 📝 REGISTER API (HASH PASSWORD)
# =========================
@app.route("/api/register", methods=["POST"])
def register():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # ❌ Prevent admin registration
    if role == "admin":
        return jsonify({"success": False, "message": "Admin cannot register"})

    # 🔴 VALIDATION
    if not name or not email or not password:
        return jsonify({"success": False, "message": "All fields required ❌"})

    import re

    # email validation
    email_pattern = r'^[^@]+@[^@]+\.[^@]+$'

    if not re.match(email_pattern, email):
        return jsonify({"success": False, "message": "Invalid email ❌"})

    # password validation
    if len(password) < 6:
        return jsonify({"success": False, "message": "Password too short ❌"})

    try:
        # 🔐 HASH PASSWORD
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        query = """
        INSERT INTO users (name, email, password, role)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(query, (name, email, hashed_password, role))
        db.commit()

        return jsonify({"success": True, "message": "Registered successfully ✅"})

    except Exception as e:
        print("Register Error:", e)
        return jsonify({"success": False, "message": "Email already exists ❌"})
# =========================
# 🔑 FORGOT PASSWORD (HASH)
# =========================
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.get_json()

    email = data.get("email")
    new_password = data.get("newPassword")  # 🔥 SAME as frontend

    # ❌ Validation
    if not email or not new_password:
        return jsonify({"success": False, "message": "All fields required ❌"})

    try:
        # 🔍 Check user exists
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Email not found ❌"})

        hashed_password = bcrypt.hashpw(
            new_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        # 🔄 UPDATE PASSWORD
        cursor.execute(
            "UPDATE users SET password=%s WHERE email=%s",
            (hashed_password, email)
        )
        db.commit()

        return jsonify({"success": True, "message": "Password updated successfully ✅"})

    except Exception as e:
        print("❌ Reset Error:", e)
        return jsonify({"success": False, "message": "Reset failed ❌"})

# =========================
#  ADMIN DASHBOARD API
# =========================
@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        result = {}

        # total students
        cursor.execute("SELECT COUNT(*) AS total FROM users WHERE role='student'")
        result["students"] = cursor.fetchone()["total"]

        # total faculty
        cursor.execute("SELECT COUNT(*) AS total FROM users WHERE role='faculty'")
        result["faculty"] = cursor.fetchone()["total"]

        # total courses
        cursor.execute("SELECT COUNT(*) AS total FROM courses")
        result["courses"] = cursor.fetchone()["total"]

        # total subjects
        cursor.execute("SELECT COUNT(*) AS total FROM subjects")
        result["subjects"] = cursor.fetchone()["total"]

        # total exams
        cursor.execute("SELECT COUNT(*) AS total FROM exam_timetable")
        result["exams"] = cursor.fetchone()["total"]

        # assigned subjects
        cursor.execute("SELECT COUNT(*) AS total FROM subject_faculty")
        result["assignedSubjects"] = cursor.fetchone()["total"]

        # unassigned subjects
        cursor.execute("""
            SELECT COUNT(*) AS total 
            FROM subjects s
            LEFT JOIN subject_faculty sf ON s.subject_id = sf.subject_id
            WHERE sf.subject_id IS NULL
        """)
        result["unassignedSubjects"] = cursor.fetchone()["total"]

        return jsonify(result)

    except Exception as e:
        print("❌ DASHBOARD ERROR:", e)
        return jsonify({})

# ====================================================
# 🥧 SUBJECT ASSIGNMENT (PIE GRAPH)
# ====================================================
@app.route("/api/subject-status")
def subject_status():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # assigned subjects
        cursor.execute("SELECT COUNT(*) AS total FROM subject_faculty")
        assigned = cursor.fetchone()["total"]

        # unassigned subjects
        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM subjects s
            LEFT JOIN subject_faculty sf ON s.subject_id = sf.subject_id
            WHERE sf.subject_id IS NULL
        """)
        unassigned = cursor.fetchone()["total"]

        return jsonify({
            "labels": ["Assigned", "Unassigned"],
            "data": [assigned, unassigned]
        })

    except Exception as e:
        print("❌ SUBJECT STATUS ERROR:", e)
        return jsonify({"labels": [], "data": []})


@app.route('/api/upcoming-events')
def upcoming_events():
    db = get_db()
    cursor = db.cursor(dictionary=True)   # ✅ FIXED

    query = """
    SELECT title, event_type, start_date
    FROM academic_calendar
    WHERE start_date >= CURDATE()
    ORDER BY start_date ASC
    LIMIT 5
    """

    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)
#---------------------------------------------------------
        #admin student section 
        #display students(admin)
#---------------------------------------------------------

@app.route("/students", methods=["GET"])
def get_students():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.role,
            u.status,

            s.enrollment_no,
            s.semester,
            s.year,
            s.batch,
            s.contact_no,
            s.address,
            s.parent_name,
            s.parent_contact,
            s.fees_paid,
            s.exam_form,
            s.attendance,
            s.joining_year,
            s.joining_month,

            c.course_name

        FROM users u
        LEFT JOIN students s ON u.user_id = s.user_id
        LEFT JOIN courses c ON s.course_id = c.course_id
        WHERE u.role = 'student'
        """

        cursor.execute(query)
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("Error:", e)
        return jsonify([])
#---------------------------------------------------------
# update student details(admin)
#---------------------------------------------------------

@app.route("/update-student/<int:id>", methods=["PUT"])
def update_student(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        name = data.get("name")
        semester = data.get("semester")
        enrollment = data.get("enroll")
        course = data.get("course")
        year = data.get("year")
        batch = data.get("batch")
        contact = data.get("contact_no")
        address = data.get("address")
        parent_name = data.get("parent_name")
        parent_contact = data.get("parent_contact")
        status = data.get("status") or "active"

        # 🔍 get course_id
        course_id = None
        if course:
            cursor.execute("SELECT course_id FROM courses WHERE course_name=%s", (course,))
            c = cursor.fetchone()
            if c:
                course_id = c["course_id"]

        # 🔄 update users
        cursor.execute("""
            UPDATE users 
            SET name=%s, status=%s 
            WHERE user_id=%s
        """, (name, status.lower(), id))

        # 🔍 check student exists
        cursor.execute("SELECT * FROM students WHERE user_id=%s", (id,))
        student = cursor.fetchone()

        if student:
            # ✅ UPDATE
            cursor.execute("""
                UPDATE students 
                SET enrollment_no=%s, semester=%s, course_id=%s,
                    year=%s, batch=%s, contact_no=%s,
                    address=%s, parent_name=%s, parent_contact=%s,
                    updated_at=NOW()
                WHERE user_id=%s
            """, (enrollment, semester, course_id,
                  year, batch, contact,
                  address, parent_name, parent_contact, id))
        else:
            # ✅ INSERT
            cursor.execute("""
                INSERT INTO students 
                (user_id, enrollment_no, semester, course_id,
                 year, batch, contact_no, address,
                 parent_name, parent_contact, updated_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
            """, (id, enrollment, semester, course_id,
                  year, batch, contact,
                  address, parent_name, parent_contact))

        db.commit()

        return jsonify({"success": True})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"success": False})

# =========================
# 🗑️ SOFT DELETE STUDENT(admin)
# =========================
@app.route("/delete-student/<int:id>", methods=["PUT"])
def delete_student(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            UPDATE users 
            SET status='inactive'
            WHERE user_id=%s
        """, (id,))

        db.commit()

        return jsonify({"success": True})

    except Exception as e:
        print("Delete Error:", e)
        return jsonify({"success": False})

#------------------------------------------------------
#faculty section(admin)
#display faculty(admin)
#-------------------------------------------------------

@app.route("/faculty", methods=["GET"])
def get_faculty():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.status,
            f.faculty_id,
            f.department,
            f.designation,
            f.phone,
            f.qualification,
            f.experience,
            f.skill
        FROM users u
        LEFT JOIN faculty f ON u.user_id = f.user_id
        WHERE u.role = 'faculty'
        """

        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify(data)

    except Exception as e:
        print("Error:", e)
        return jsonify([])


#--------------------------------------------------------
#update faculty details(admin)
#--------------------------------------------------------

@app.route("/update-faculty/<int:id>", methods=["PUT"])
def update_faculty(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        name = data.get("name")
        phone = data.get("phone")
        department = data.get("department")
        designation = data.get("designation")
        qualification = data.get("qualification")
        experience = data.get("experience")
        # joining = data.get("joining_date")
        skill = data.get("skill")
        status = data.get("status")

        # update user
        cursor.execute("""
            UPDATE users 
            SET name=%s, status=%s
            WHERE user_id=%s
        """, (name, status.lower(), id))

        # check faculty
        cursor.execute("SELECT * FROM faculty WHERE user_id=%s", (id,))
        f = cursor.fetchone()

        if f:
            cursor.execute("""
                UPDATE faculty 
                SET department=%s, designation=%s, phone=%s,
                    qualification=%s, experience=%s,
                     skill=%s
                WHERE user_id=%s
            """, (department, designation, phone,
                  qualification, experience,
                   skill, id))
        else:
            cursor.execute("""
                INSERT INTO faculty 
                (user_id, department, designation, phone,
                 qualification, experience, skill)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (id, department, designation, phone,
                  qualification, experience,
                   skill))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"success": False})

#------------------------------------------------------------------------------------
#soft delete faculty(admin)
#------------------------------------------------------------------------------

@app.route("/delete-faculty/<int:id>", methods=["PUT"])
def delete_faculty(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            UPDATE users 
            SET status='inactive'
            WHERE user_id=%s
        """, (id,))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("Delete Error:", e)
        return jsonify({"success": False})


#-----------------------------------------------------------------------
# subject section(admin)
#display subject(admin)
#-----------------------------------------------------------------------
@app.route("/subjects", methods=["GET"])
def get_subjects():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT 
            s.subject_id,
            s.subject_name,
            s.subject_code,
            s.semester,
            s.credits,
            s.type,
            s.status,
            c.course_name,
            u.name AS faculty_name
        FROM subjects s
        LEFT JOIN courses c ON s.course_id = c.course_id
        LEFT JOIN subject_faculty sf ON s.subject_id = sf.subject_id
        LEFT JOIN faculty f ON sf.faculty_id = f.faculty_id
        LEFT JOIN users u ON f.user_id = u.user_id
        """
        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify(data)
    except Exception as e:
        print(e)
        return jsonify([])

#-----------------------------------------------------------------
#add subject(admin)
#-----------------------------------------------------------------

@app.route("/add-subject", methods=["POST"])
def add_subject():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        name = data.get("name")
        code = data.get("code")
        course = data.get("course")
        semester = data.get("semester")
        credits = data.get("credits")
        type_ = data.get("type")

        cursor.execute("SELECT course_id FROM courses WHERE course_name=%s", (course,))
        c = cursor.fetchone()
        if not c:
            return jsonify({"success": False, "message": "Invalid course"})

        course_id = c["course_id"]

        cursor.execute("""
            INSERT INTO subjects (subject_name, subject_code, course_id, semester, credits, type)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (name, code, course_id, semester, credits, type_))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})



#------------------------------------------------------------------
#update subject(admin)
#------------------------------------------------------------------
@app.route("/update-subject/<int:id>", methods=["PUT"])
def update_subject(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        name = data.get("name")
        code = data.get("code")
        course = data.get("course")
        semester = data.get("semester")
        credits = data.get("credits")
        type_ = data.get("type")
        status = data.get("status", "active")

        cursor.execute("SELECT course_id FROM courses WHERE course_name=%s", (course,))
        c = cursor.fetchone()
        if not c:
            return jsonify({"success": False, "message": "Invalid course"})

        course_id = c["course_id"]

        cursor.execute("""
            UPDATE subjects
            SET subject_name=%s, subject_code=%s, course_id=%s,
            semester=%s, credits=%s, type=%s, status=%s
            WHERE subject_id=%s
        """, (name, code, course_id, semester, credits, type_, status.lower(), id))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})


#-------------------------------------------------------------------------
#soft delete subject(admin)
#-------------------------------------------------------------------------
@app.route("/delete-subject/<int:id>", methods=["PUT"])
def delete_subject(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("UPDATE subjects SET status='inactive' WHERE subject_id=%s", (id,))
    db.commit()
    return jsonify({"success": True})



#-------------------------------------------------------------------------
#assign faculty(admin)
#-------------------------------------------------------------------------

@app.route("/assign-faculty", methods=["POST"])
def assign_faculty():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.get_json()

    subject_id = data.get("subject_id")
    faculty_id = data.get("faculty_id")

    # remove old assignment
    cursor.execute("DELETE FROM subject_faculty WHERE subject_id=%s", (subject_id,))

    # insert new
    cursor.execute("""
        INSERT INTO subject_faculty (subject_id, faculty_id)
        VALUES (%s, %s)
    """, (subject_id, faculty_id))

    db.commit()
    return jsonify({"success": True})

#---------------------------------------------------------------------------
#faculty list(admin)
#-----------------------------------------------------------------------------
@app.route("/faculty-list", methods=["GET"])
def faculty_list():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.faculty_id, u.name 
        FROM faculty f
        JOIN users u ON f.user_id = u.user_id
        WHERE u.role='faculty'
    """)
    return jsonify(cursor.fetchall())


# #-------------------------------------------------------------
# #exam section(admin)
# #display exams(admin)
# #-------------------------------------------------------------

@app.route("/exams", methods=["GET"])
def get_exams():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT 
            e.exam_id,
            e.exam_name,
            e.exam_date,
            e.start_time,
            e.end_time,
            e.duration,
            e.exam_type,
            e.status,
            e.semester,
            c.course_name,
            s.subject_name
        FROM exam_timetable e
        JOIN courses c ON e.course_id = c.course_id
        JOIN subjects s ON e.subject_id = s.subject_id
        WHERE e.status != 'inactive'
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        exams = []
        for row in rows:
            exams.append({
                "exam_id": row["exam_id"],
                "exam_name": row["exam_name"],
                "course_name": row["course_name"],
                "semester": row["semester"],
                "subject_name": row["subject_name"],
                "exam_date": str(row["exam_date"]),   # ✅ FIX
                "start_time": str(row["start_time"]),
                "end_time": str(row["end_time"]), # ✅ FIX
                "duration": str(row["duration"]),     # ✅ FIX
                "exam_type": row["exam_type"],
                "status": row["status"]
            })

        return jsonify(exams)

    except Exception as e:
        print("ERROR:", e)
        return jsonify([])
# #-----------------------------------------------------------------------
# #add exam(admin)
# #-----------------------------------------------------------------------

# @app.route("/add-exam", methods=["POST"])
# def add_exam():
#     try:
#         db = get_db()
#         cursor = db.cursor(dictionary=True)
#         data = request.get_json()

#         cursor.execute("SELECT course_id FROM courses WHERE course_name=%s", (data["course"],))
#         course = cursor.fetchone()

#         cursor.execute("SELECT subject_id, semester FROM subjects WHERE subject_name=%s", (data["subject"],))
#         subject = cursor.fetchone()

#         if not course or not subject:
#             return jsonify({"success": False, "message": "Invalid course or subject"})

#         cursor.execute("""
#             INSERT INTO exam_timetable
#             (exam_name, course_id, subject_id, semester,
#              exam_date, start_time, end_time, duration, exam_type, status)
#             VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,'Scheduled')
#         """, (
#             data["name"],
#             course["course_id"],
#             subject["subject_id"],
#             subject["semester"],
#             data["date"],
#             data["start_time"],
#             data["end_time"],
#             data["duration"],
#             data["type"].lower()
#         ))

#         db.commit()
#         return jsonify({"success": True})

#     except Exception as e:
#         print("ERROR:", e)
#         return jsonify({"success": False})

# =========================================================
# ADD EXAM TIMETABLE
# =========================================================
# =========================================================
# ADD FULL EXAM TIMETABLE
# =========================================================

@app.route("/add-exam", methods=["POST"])
def add_exam():

    try:

        db = get_db()
        cursor = db.cursor(dictionary=True)

        data = request.get_json()

        # ================= COURSE =================

        cursor.execute(
            "SELECT course_id FROM courses WHERE course_name=%s",
            (data["course"],)
        )

        course = cursor.fetchone()

        if not course:

            return jsonify({
                "success": False,
                "message": "Course not found"
            })

        course_id = course["course_id"]

        # ================= CHECK SUBJECTS =================

        if len(data["exams"]) == 0:

            return jsonify({
                "success": False,
                "message": "Add at least one subject"
            })

        # ================= LOOP ALL SUBJECTS =================

        for exam in data["exams"]:

            # ================= SUBJECT =================

            cursor.execute(
                "SELECT subject_id FROM subjects WHERE subject_name=%s",
                (exam["subject"],)
            )

            subject = cursor.fetchone()

            if not subject:
                continue

            subject_id = subject["subject_id"]

            # ================= DUPLICATE VALIDATION =================

            cursor.execute("""
                SELECT *
                FROM exam_timetable
                WHERE course_id=%s
                AND semester=%s
                AND exam_date=%s
                AND start_time=%s
            """, (
                course_id,
                data["semester"],
                exam["date"],
                exam["start_time"]
            ))

            existing = cursor.fetchone()

            if existing:

                return jsonify({
                    "success": False,
                    "message": f"Exam already exists on {exam['date']} at {exam['start_time']}"
                })

            # ================= INSERT =================

            cursor.execute("""
                INSERT INTO exam_timetable
                (
                    exam_name,
                    course_id,
                    subject_id,
                    semester,
                    exam_date,
                    start_time,
                    end_time,
                    duration,
                    exam_type,
                    status
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                data["name"],
                course_id,
                subject_id,
                data["semester"],
                exam["date"],
                exam["start_time"],
                exam["end_time"],
                exam["duration"],
                data["type"].lower(),
                "scheduled"
            ))

        db.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("ADD EXAM ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        })
# #--------------------------------------------------------------------------------
# #update exam(admin)
# #--------------------------------------------------------------------------------
@app.route("/update-exam/<int:id>", methods=["PUT"])
def update_exam(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        # GET course_id
        cursor.execute(
            "SELECT course_id FROM courses WHERE course_name=%s",
            (data["course"],)
        )
        course = cursor.fetchone()

        # GET subject_id
        cursor.execute(
            "SELECT subject_id FROM subjects WHERE subject_name=%s",
            (data["subject"],)
        )
        subject = cursor.fetchone()

        if not course or not subject:
            return jsonify({"success": False, "message": "Course or Subject not found"})

        # ✅ UPDATED QUERY (SEMESTER FIXED)
        cursor.execute("""
            UPDATE exam_timetable
            SET exam_name=%s,
                course_id=%s,
                subject_id=%s,
                semester=%s,
                exam_date=%s,
                start_time=%s,
                end_time=%s,
                duration=%s,
                exam_type=%s
            WHERE exam_id=%s
        """, (
            data["name"],
            course["course_id"],
            subject["subject_id"],
            int(data["semester"]),   # ✅ FIXED HERE
            data["date"],
            data["start_time"],
            data["end_time"],
            data["duration"],
            data["type"].lower(),
            id
        ))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"success": False})
# #----------------------------------------------------------------------------
# #soft delete exam(admin)
# #----------------------------------------------------------------------------
@app.route("/delete-exam/<int:id>", methods=["DELETE"])
def delete_exam(id):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "DELETE FROM exam_timetable WHERE exam_id=%s",
            (id,)
        )

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})
# #------------------------------------------------------------------------------
# #update exam status (admin)
# #----------------------------------------------------------------------------- 
@app.route("/update-exam-status/<int:id>", methods=["PUT"])
def update_exam_status(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            UPDATE exam_timetable
            SET status = CASE 
                WHEN status='Scheduled' THEN 'Completed'
                ELSE 'Scheduled'
            END
            WHERE exam_id=%s
        """, (id,))

        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False})



#--------------------------------------------------------
#get courses(admin)
#--------------------------------------------------------

@app.route("/courses", methods=["GET"])
def get_courses():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM courses")
        return jsonify(cursor.fetchall())
    except Exception as e:
        print(e)
        return jsonify([])

#------------------------------------------------------------
#get subjects(admin)
#------------------------------------------------------------

@app.route("/subjects-exam", methods=["GET"])
def get_subjects_exam():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT s.subject_id, s.subject_name, s.course_id, s.semester, c.course_name
        FROM subjects s
        JOIN courses c ON s.course_id = c.course_id
        WHERE s.status = 'active'
        """

        cursor.execute(query)
        data = cursor.fetchall()

        print("SUBJECTS:", data)   # 🔥 DEBUG

        cursor.close()
        db.close()

        return jsonify(data)

    except Exception as e:
        print("ERROR SUBJECT:", e)
        return jsonify([])

#-------------------------------------------------------------------------------------
#calendar section(admin)
#-----------------------------------------------------
# GET EVENTS(admin)
#-----------------------------------------------------
@app.route("/api/calendar-events", methods=["GET"])
def get_events():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM academic_calendar")
    return jsonify(cursor.fetchall())


#-----------------------------------------------------
# ADD EVENT (MATCH FRONTEND)(admin)
#-----------------------------------------------------
@app.route("/api/add-event", methods=["POST"])
def add_event():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        data = request.get_json(force=True)
        print("ADD DATA:", data)   # DEBUG

        cursor.execute("""
            INSERT INTO academic_calendar
            (title, event_type, start_date, end_date, description, semester, course_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            data.get("title"),
            data.get("event_type"),
            data.get("start_date"),
            data.get("end_date"),
            data.get("description"),
            data.get("semester"),
            data.get("course_id")
        ))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("❌ ADD ERROR:", e)
        return jsonify({"success": False})
#-----------------------------------------------------
# UPDATE EVENT (FIXED)(admin)
#-----------------------------------------------------
@app.route("/api/update-event/<int:id>", methods=["PUT"])
def update_event(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        data = request.get_json(force=True)
        print("UPDATE DATA:", data)

        cursor.execute("""
            UPDATE academic_calendar
            SET title=%s, event_type=%s, start_date=%s,
                end_date=%s, description=%s,
                semester=%s, course_id=%s
            WHERE calendar_object_id=%s
        """, (
            data.get("title"),
            data.get("event_type"),
            data.get("start_date"),
            data.get("end_date"),
            data.get("description"),
            data.get("semester"),
            data.get("course_id"),
            id
        ))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("❌ UPDATE ERROR:", e)
        return jsonify({"success": False})

#-----------------------------------------------------
# DELETE EVENT (FIXED)(admin)
#-----------------------------------------------------
@app.route("/api/delete-event/<int:id>", methods=["DELETE"])
def delete_event(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "DELETE FROM academic_calendar WHERE calendar_object_id=%s",
            (id,)
        )

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("❌ DELETE ERROR:", e)
        return jsonify({"success": False})

#--------------------------------------------------------------------------------------
#Course section(admin)
#display course 
#-------------------------------------------------------------------------------------
@app.route("/admin/courses", methods=["GET"])
def get_courses_admin():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM courses")
        courses = cursor.fetchall()

        result = []

        for c in courses:
            # get subjects per course
            cursor.execute("""
                SELECT css.semester, s.subject_name
                FROM course_semester_subject css
                JOIN subjects s ON css.subject_id = s.subject_id
                WHERE css.course_id = %s
                ORDER BY css.semester
            """, (c["course_id"],))

            rows = cursor.fetchall()

            subject_map = {}
            for r in rows:
                sem = r["semester"]
                if sem not in subject_map:
                    subject_map[sem] = []
                subject_map[sem].append(r["subject_name"])

            result.append({
                "course_id": c["course_id"],
                "course_name": c["course_name"],
                "course_code": c["course_code"],
                "duration": c["duration"],
                "total_sem": c["total_sem"],
                "description": c["description"],
                "status": c["status"],
                "subjects": subject_map
            })

        return jsonify(result)

    except Exception as e:
        print(e)
        return jsonify([])

#---------------------------------
#add course (admin)
#---------------------------------


@app.route("/add-course", methods=["POST"])
def add_course():
    try:
        data = request.get_json()

        db = get_db()
        cursor = db.cursor()

        cursor.execute("""
            INSERT INTO courses
            (course_name, course_code, duration, total_sem, description, status)
            VALUES (%s,%s,%s,%s,%s,'Active')
        """, (
            data["name"],
            data["code"],
            data["duration"],
            data["semesters"],
            data["description"]
        ))

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})


@app.route("/toggle-course/<int:id>", methods=["PUT"])
def toggle_course(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT status FROM courses WHERE course_id=%s", (id,))
        c = cursor.fetchone()

        new_status = "Inactive" if c["status"] == "Active" else "Active"

        cursor.execute(
            "UPDATE courses SET status=%s WHERE course_id=%s",
            (new_status, id)
        )
        db.commit()

        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})

#--------------------------------
#assign subject to course(admin)
#---------------------------------


@app.route("/map-subject", methods=["POST"])
def map_subject():
    try:
        data = request.get_json()

        course_id = data["course_id"]
        semester = data["semester"]
        subject_id = data["subject_id"]

        db = get_db()
        cursor = db.cursor()

        # check if already exists
        cursor.execute("""
            SELECT * FROM course_semester_subject
            WHERE course_id=%s AND semester=%s AND subject_id=%s
        """, (course_id, semester, subject_id))

        exists = cursor.fetchone()

        if exists:
            # remove (toggle OFF)
            cursor.execute("""
                DELETE FROM course_semester_subject
                WHERE course_id=%s AND semester=%s AND subject_id=%s
            """, (course_id, semester, subject_id))
        else:
            # add (toggle ON)
            cursor.execute("""
                INSERT INTO course_semester_subject (course_id, semester, subject_id)
                VALUES (%s,%s,%s)
            """, (course_id, semester, subject_id))

        db.commit()

        return jsonify({"success": True})

    except Exception as e:
        print(e)
        return jsonify({"success": False})

#---------------------------------
#get all subject to assign to the course(admin)
#---------------------------------

@app.route("/subjects", methods=["GET"])
def get_subjects_admin():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM subjects")
        return jsonify(cursor.fetchall())

    except:
        return jsonify([])


# =========================
# UPDATE COURSE(admin)
# =========================
@app.route("/update-course/<int:id>", methods=["PUT"])
def update_course(id):
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()

        query = """
        UPDATE courses
        SET course_name=%s,
            course_code=%s,
            duration=%s,
            total_sem=%s,
           
            description=%s
        WHERE course_id=%s
        """

        values = (
            data.get("name"),
            data.get("code"),
            data.get("duration"),
            data.get("semesters"),
            # data.get("department"),
            data.get("description"),
            id
        )

        cursor.execute(query, values)
        db.commit()

        return jsonify({"success": True})

    except Exception as e:
        print("UPDATE ERROR:", e)
        return jsonify({"success": False})


#----------------------------------------------------------------------------------
#notification section(admin)
#display notification(admin) 
#----------------------------------------------------------------------------------
#----------------------------------------------------------------------------------
# GET NOTIFICATIONS(admin)
#----------------------------------------------------------------------------------
@app.route("/notifications", methods=["GET"])
def get_notifications():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM notifications
            ORDER BY created_at DESC
        """)

        data = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(data)

    except Exception as e:
        print("GET ERROR:", e)
        return jsonify([])

#----------------------------------------------------------------------------------
# add NOTIFICATION(admin)
#----------------------------------------------------------------------------------

@app.route("/add-notification", methods=["POST"])
def add_notification():

    try:

        db = get_db()
        cursor = db.cursor(dictionary=True)

        data = request.get_json()

        print("DATA RECEIVED:", data)

        message = data.get("message", "").strip()
        type_ = data.get("type")
        target = data.get("target")
        user_id = data.get("user_id")

        # =========================
        # VALIDATION
        # =========================
        if not message or not target:

            return jsonify({
                "success": False,
                "message": "Missing fields"
            })

        # =========================
        # SINGLE USER
        # =========================
        if target == "single":

            if not user_id:

                return jsonify({
                    "success": False,
                    "message": "User ID required"
                })

            cursor.execute("""
                INSERT INTO notifications
                (user_id, message, type, status, target)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                int(user_id),
                message,
                type_,
                "unread",
                "single"
            ))

        # =========================
        # ALL / STUDENT / FACULTY
        # ONLY ONE ROW INSERT
        # =========================
        else:

            cursor.execute("""
                INSERT INTO notifications
                (user_id, message, type, status, target)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                None,
                message,
                type_,
                "unread",
                target
            ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "message": "Notification added successfully"
        })

    except Exception as e:

        print("ADD ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        })



#----------------------------------------------------------------------------------
# UPDATE NOTIFICATION(admin)
#----------------------------------------------------------------------------------
@app.route("/update-notification/<int:id>", methods=["PUT"])
def update_notification(id):
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()

        message = data.get("message")
        type_ = data.get("type")
        status = data.get("status")
        target = data.get("target")
        user_id = data.get("user_id")

        # if not single then remove user_id
        if target != "single":
            user_id = None

        cursor.execute("""
            UPDATE notifications
            SET
                message=%s,
                type=%s,
                status=%s,
                target=%s,
                user_id=%s
            WHERE notification_id=%s
        """, (
            message,
            type_,
            status,
            target,
            user_id,
            id
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "message": "Notification updated"
        })

    except Exception as e:
        print("UPDATE ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        })
#----------------------------------------------------------------------------------
# DELETE NOTIFICATION(admin)
#----------------------------------------------------------------------------------
@app.route("/delete-notification/<int:id>", methods=["DELETE"])
def delete_notification(id):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "DELETE FROM notifications WHERE notification_id=%s",
            (id,)
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({"success": True})

    except Exception as e:
        print("DELETE ERROR:", e)
        return jsonify({"success": False})

# #-----------------------------------------------------------------
# # lecture schedule (admin)
# #------------------------------------------------------------------

# =========================================================
# 📅 FACULTY DROPDOWN (ADMIN)
# =========================================================
@app.route("/admin/faculty", methods=["GET"])
def get_faculty_admin():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                f.faculty_id,
                f.user_id,
                u.name AS faculty_name
            FROM faculty f
            JOIN users u ON f.user_id = u.user_id
            WHERE u.role = 'faculty'
        """)

        return jsonify(cursor.fetchall())

    except Exception as e:
        print("FACULTY ERROR:", e)
        return jsonify([])


# =========================================================
# 📚 COURSES (ADMIN)
# =========================================================
@app.route("/admin/courses", methods=["GET"])
def get_courses_lecture():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT course_id, course_name FROM courses")
        return jsonify(cursor.fetchall())

    except Exception as e:
        print("COURSE ERROR:", e)
        return jsonify([])


# =========================================================
# 📘 SUBJECTS (ADMIN)
# =========================================================
@app.route("/admin/subjects", methods=["GET"])
def get_subjects_lecture():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT subject_id, subject_name FROM subjects")
        return jsonify(cursor.fetchall())

    except Exception as e:
        print("SUBJECT ERROR:", e)
        return jsonify([])


# =========================================================
# ➕ ADD LECTURE(admin)
# =========================================================
# @app.route("/admin/add-lecture", methods=["POST"])
# def add_lecture():
#     db = get_db()
#     cursor = db.cursor()

#     data = request.get_json()

#     try:
#         cursor.execute("""
#             INSERT INTO lecture_timetable
#             (faculty_id, course_id, subject_id, semester, day, start_time, end_time, room)
#             VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
#         """, (
#             data["faculty_id"],
#             data["course_id"],
#             data["subject_id"],
#             data["semester"],
#             data["day"],
#             data["start_time"],
#             data["end_time"],
#             data["room"]
#         ))

#         db.commit()
#         return jsonify({"success": True})

#     except Exception as e:
#         print("ADD LECTURE ERROR:", e)
#         return jsonify({"success": False, "error": str(e)})
# =========================================================
# ➕ ADD LECTURE(admin)
# =========================================================
@app.route("/admin/add-lecture", methods=["POST"])
def add_lecture():

    db = get_db()
    cursor = db.cursor()

    data = request.get_json()

    print("ADD LECTURE DATA:", data)

    try:

        # ✅ FIX TIME FORMAT
        start_time = str(data["start_time"])[:5]
        end_time = str(data["end_time"])[:5]

        cursor.execute("""
            INSERT INTO lecture_timetable
            (
                faculty_id,
                course_id,
                subject_id,
                semester,
                day,
                start_time,
                end_time,
                room
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (

            int(data["faculty_id"]),
            int(data["course_id"]),
            int(data["subject_id"]),
            data["semester"],
            data["day"],
            start_time,
            end_time,
            data["room"]

        ))

        db.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("❌ ADD LECTURE ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        })
# =========================================================
# 📅 GET LECTURES (ADMIN VIEW)
# =========================================================
# @app.route("/admin/lectures", methods=["GET"])
# def get_lectures():
#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     try:
#         cursor.execute("""
#             SELECT 
#                 l.lecture_id,
#                 l.faculty_id,
#                 l.course_id,
#                 l.subject_id,
#                 l.semester,
#                 l.day,
#                 l.start_time,
#                 l.end_time,
#                 l.room,

#                 u.name AS faculty_name,
#                 c.course_name,
#                 s.subject_name

#             FROM lecture_timetable l
#             LEFT JOIN faculty f ON l.faculty_id = f.user_id
#             LEFT JOIN users u ON f.user_id = u.user_id
#             LEFT JOIN courses c ON l.course_id = c.course_id
#             LEFT JOIN subjects s ON l.subject_id = s.subject_id

#             ORDER BY l.day, l.start_time
#         """)

#         data = cursor.fetchall()

#         # convert time to string (avoid JSON error)
#         for row in data:
#             if row["start_time"]:
#                 row["start_time"] = str(row["start_time"])
#             if row["end_time"]:
#                 row["end_time"] = str(row["end_time"])

#         return jsonify(data)

#     except Exception as e:
#         print("LECTURE ERROR:", e)
#         return jsonify([])

# =========================================================
# 📅 GET LECTURES (ADMIN VIEW)
# =========================================================
@app.route("/admin/lectures", methods=["GET"])
def get_lectures():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT 
                l.lecture_id,
                l.faculty_id,
                l.course_id,
                l.subject_id,
                l.semester,
                l.day,
                l.start_time,
                l.end_time,
                l.room,

                u.name AS faculty_name,
                c.course_name,
                s.subject_name

            FROM lecture_timetable l

            /* ✅ FIXED JOIN */
            LEFT JOIN faculty f 
                ON l.faculty_id = f.faculty_id

            LEFT JOIN users u 
                ON f.user_id = u.user_id

            LEFT JOIN courses c 
                ON l.course_id = c.course_id

            LEFT JOIN subjects s 
                ON l.subject_id = s.subject_id

            ORDER BY 
                FIELD(
                    l.day,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ),
                l.start_time
        """)

        data = cursor.fetchall()

        # ✅ TIME FORMAT FIX
        for row in data:

            if row["start_time"]:
                row["start_time"] = str(row["start_time"])[:5]

            if row["end_time"]:
                row["end_time"] = str(row["end_time"])[:5]

        print("LECTURE DATA:", data)

        return jsonify(data)

    except Exception as e:
        print("LECTURE ERROR:", e)
        return jsonify([])


# =========================================================
# ✏️ UPDATE LECTURE(admin)
# =========================================================
# @app.route("/admin/update-lecture/<int:id>", methods=["PUT"])
# def update_lecture(id):
#     db = get_db()
#     cursor = db.cursor()

#     data = request.get_json()

#     try:
#         cursor.execute("""
#             UPDATE lecture_timetable
#             SET faculty_id=%s,
#                 course_id=%s,
#                 subject_id=%s,
#                 semester=%s,
#                 day=%s,
#                 start_time=%s,
#                 end_time=%s,
#                 room=%s
#             WHERE lecture_id=%s
#         """, (
#             data["faculty_id"],
#             data["course_id"],
#             data["subject_id"],
#             data["semester"],
#             data["day"],
#             data["start_time"],
#             data["end_time"],
#             data["room"],
#             id
#         ))

#         db.commit()
#         return jsonify({"success": True})

#     except Exception as e:
#         print("UPDATE LECTURE ERROR:", e)
#         return jsonify({"success": False})

# =========================================================
# ✏️ UPDATE LECTURE(admin)
# =========================================================
@app.route("/admin/update-lecture/<int:id>", methods=["PUT"])
def update_lecture(id):

    db = get_db()
    cursor = db.cursor()

    data = request.get_json()

    print("UPDATE DATA:", data)

    try:

        # ✅ FIX TIME FORMAT
        start_time = str(data["start_time"])[:5]
        end_time = str(data["end_time"])[:5]

        cursor.execute("""
            UPDATE lecture_timetable

            SET
                faculty_id=%s,
                course_id=%s,
                subject_id=%s,
                semester=%s,
                day=%s,
                start_time=%s,
                end_time=%s,
                room=%s

            WHERE lecture_id=%s
        """, (

            int(data["faculty_id"]),
            int(data["course_id"]),
            int(data["subject_id"]),
            data["semester"],
            data["day"],
            start_time,
            end_time,
            data["room"],
            id

        ))

        db.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("❌ UPDATE LECTURE ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        })

# =========================================================
# ❌ DELETE LECTURE(admin)
# =========================================================
@app.route("/admin/delete-lecture/<int:id>", methods=["DELETE"])
def delete_lecture(id):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("DELETE FROM lecture_timetable WHERE lecture_id=%s", (id,))
        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("DELETE LECTURE ERROR:", e)
        return jsonify({"success": False})

# =========================================
# 📊 ANALYTICS DASHBOARD API(admin)
# =========================================
@app.route("/api/analytics")
def analytics():

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        result = {}

        # =================================
        # 🔥 CARD COUNTS
        # =================================

        cursor.execute("SELECT COUNT(*) AS total FROM users WHERE role='student'")
        students = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM users WHERE role='faculty'")
        faculty = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM courses")
        courses = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM subjects")
        subjects = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM exam_timetable")
        exams = cursor.fetchone()["total"]

        result["cards"] = {
            "students": students,
            "faculty": faculty,
            "courses": courses,
            "subjects": subjects,
            "exams": exams
        }

        # =================================
        # 🔥 STUDENT LIST
        # =================================

        cursor.execute("""
            SELECT name
            FROM users
            WHERE role='student'
        """)

        result["studentsList"] = cursor.fetchall()

        # =================================
        # 🔥 FACULTY LIST
        # =================================

        cursor.execute("""
            SELECT name
            FROM users
            WHERE role='faculty'
        """)

        result["facultyList"] = cursor.fetchall()

        # =================================
        # 🔥 COURSES LIST
        # =================================

        cursor.execute("""
            SELECT course_name
            FROM courses
        """)

        result["coursesList"] = cursor.fetchall()

        # =================================
        # 🔥 SUBJECTS LIST
        # =================================

        cursor.execute("""
            SELECT subject_name
            FROM subjects
        """)

        result["subjectsList"] = cursor.fetchall()

        # =================================
        # 🔥 EXAMS LIST
        # =================================

        cursor.execute("""
            SELECT exam_name
            FROM exam_timetable
        """)

        result["examsList"] = cursor.fetchall()

        # =================================
        # 🍩 SYSTEM DISTRIBUTION GRAPH
        # =================================

        result["systemDistribution"] = [
            {
                "name": "Students",
                "value": students
            },
            {
                "name": "Faculty",
                "value": faculty
            },
            {
                "name": "Courses",
                "value": courses
            },
            {
                "name": "Subjects",
                "value": subjects
            }
        ]

        # =================================
        # 📚 ASSIGNED VS UNASSIGNED
        # =================================

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM subject_faculty
        """)

        assigned = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM subjects s
            LEFT JOIN subject_faculty sf
            ON s.subject_id = sf.subject_id
            WHERE sf.subject_id IS NULL
        """)

        unassigned = cursor.fetchone()["total"]

        result["assignedData"] = [
            {
                "name": "Assigned",
                "value": assigned
            },
            {
                "name": "Unassigned",
                "value": unassigned
            }
        ]

        # =================================
        # 👨‍🏫 FACULTY WORKLOAD GRAPH
        # =================================

        cursor.execute("""
            SELECT 
                u.name,
                COUNT(sf.subject_id) AS subjects
            FROM users u
            LEFT JOIN subject_faculty sf
            ON u.user_id = sf.faculty_id
            WHERE u.role='faculty'
            GROUP BY u.user_id
        """)

        result["workloadData"] = cursor.fetchall()

        # =================================
        # 📅 UPCOMING EVENTS
        # =================================

        cursor.execute("""
            SELECT 
                title,
                start_date
            FROM academic_calendar
            WHERE start_date >= CURDATE()
            ORDER BY start_date ASC
            LIMIT 5
        """)

        result["events"] = cursor.fetchall()

        return jsonify(result)

    except Exception as e:
        print("❌ ANALYTICS ERROR:", e)
        return jsonify({})


# # ====================================================
# # 📊 ANALYTICS - STUDENTS LIST
# # ====================================================
# @app.route("/api/students-list")
# def students_list():

#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     query = """
#     SELECT name
#     FROM users
#     WHERE role='student'
#     """

#     cursor.execute(query)

#     data = cursor.fetchall()

#     return jsonify(data)


# # ====================================================
# # 👨‍🏫 ANALYTICS - FACULTY LIST
# # ====================================================
# @app.route("/api/faculty-list")
# def faculty_list():

#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     query = """
#     SELECT name
#     FROM users
#     WHERE role='faculty'
#     """

#     cursor.execute(query)

#     data = cursor.fetchall()

#     return jsonify(data)


# # ====================================================
# # 📚 ANALYTICS - COURSES LIST
# # ====================================================
# @app.route("/api/courses-list")
# def courses_list():

#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     query = """
#     SELECT course_name
#     FROM courses
#     """

#     cursor.execute(query)

#     data = cursor.fetchall()

#     return jsonify(data)


# # ====================================================
# # 📖 ANALYTICS - SUBJECTS LIST
# # ====================================================
# @app.route("/api/subjects-list")
# def subjects_list():

#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     query = """
#     SELECT subject_name
#     FROM subjects
#     """

#     cursor.execute(query)

#     data = cursor.fetchall()

#     return jsonify(data)


# # ====================================================
# # 📝 ANALYTICS - EXAMS LIST
# # ====================================================
# @app.route("/api/exams-list")
# def exams_list():

#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     query = """
#     SELECT exam_name
#     FROM exam_timetable
#     """

#     cursor.execute(query)

#     data = cursor.fetchall()

#     return jsonify(data)


# ====================================================
# 👨‍🏫 FACULTY WORKLOAD GRAPH
# ====================================================
@app.route("/api/faculty-workload")
def faculty_workload():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
    SELECT
        u.name,
        COUNT(sf.subject_id) AS subjects
    FROM users u
    LEFT JOIN subject_faculty sf
        ON u.user_id = sf.faculty_id
    WHERE u.role = 'faculty'
    GROUP BY u.user_id, u.name
    ORDER BY subjects DESC
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)
#----------------------------------------------------------------------------------------
#faculty panel
#student section(faculty)
#----------------------------------------------------------------------------------------

@app.route("/api/students", methods=["GET"])
def get_students_with_progress():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            s.student_id,
            u.user_id AS id,
            u.name,
            u.email,
            c.course_name AS course,
            s.semester,

            (SELECT COUNT(*) FROM assignments) AS total_assignments,

            (SELECT COUNT(*) 
             FROM assignment_submission sub
             WHERE sub.student_id = s.student_id
             AND LOWER(sub.status) = 'submitted'
            ) AS completed_assignments

        FROM students s
        JOIN users u ON s.user_id = u.user_id
        LEFT JOIN courses c ON s.course_id = c.course_id
        """

        cursor.execute(query)
        result = cursor.fetchall()

        final_data = []

        for stu in result:
            total = stu["total_assignments"] or 0
            completed = stu["completed_assignments"] or 0

            pending = max(total - completed, 0)
            progress = round((completed / total) * 100) if total > 0 else 0

            stu["pending_assignments"] = pending
            stu["progress"] = progress

            final_data.append(stu)

        return jsonify(final_data)

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify([])



#--------------------------------
# assignment Faculty
#-------------------------------

# =====================================================
# 📚 ASSIGNMENTS MODULE (FLASK STYLE CLEAN VERSION)
# =====================================================

from flask import request, jsonify
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# =====================================================
# 📤 CREATE ASSIGNMENT (WITH FILE UPLOAD)
# =====================================================
@app.route("/api/assignments", methods=["POST"])
def create_assignment():
    try:
        faculty_id = request.form.get("faculty_id")
        subject_id = request.form.get("subject_id")
        title = request.form.get("title")
        description = request.form.get("description")
        deadline = request.form.get("deadline")
        max_marks = request.form.get("max_marks")

        file = request.files.get("file")
        file_path = None

        # ---------------- FILE SAVE ----------------
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

        db = get_db()
        cursor = db.cursor(dictionary=True)

        sql = """
            INSERT INTO assignments 
            (faculty_id, subject_id, title, description, deadline, max_marks, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            faculty_id,
            subject_id,
            title,
            description,
            deadline,
            max_marks,
            file_path
        ))

        db.commit()

        return jsonify({
            "success": True,
            "message": "Assignment uploaded successfully"
        })

    except Exception as e:
        print("CREATE ASSIGNMENT ERROR:", e)
        return jsonify({
            "success": False,
            "message": "Server error while creating assignment"
        })


# =====================================================
# 📥 GET ASSIGNMENTS BY FACULTY
# =====================================================
@app.route("/api/assignments/<int:faculty_id>", methods=["GET"])
def get_assignments_faculty(faculty_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        sql = """
            SELECT 
                a.assignment_id,
                a.title,
                a.description,
                a.deadline,
                a.max_marks,
                a.file_path,
                s.subject_name,
                a.created_at
            FROM assignments a
            LEFT JOIN subjects s ON a.subject_id = s.subject_id
            WHERE a.faculty_id = %s
            ORDER BY a.created_at DESC
        """

        cursor.execute(sql, (faculty_id,))
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("GET ASSIGNMENTS ERROR:", e)
        return jsonify([])
#-------------------------------------------------------------------------
#exam section(faculty)
#-------------------------------------------------------------------------


# =========================================
# GET EXAM TIMETABLE (COMMON FOR ALL)(faculty)
# =========================================
@app.route("/api/faculty/exams", methods=["GET"])
def get_exams_faculty():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            e.exam_id,
            e.exam_name,
            DATE_FORMAT(e.exam_date, '%Y-%m-%d') AS exam_date,
            TIME_FORMAT(e.start_time, '%H:%i') AS start_time,
            TIME_FORMAT(e.end_time, '%H:%i') AS end_time,
            e.duration,
            e.status,
            c.course_name,
            s.subject_name,
            e.semester
        FROM exam_timetable e
        LEFT JOIN courses c ON e.course_id = c.course_id
        LEFT JOIN subjects s ON e.subject_id = s.subject_id
        ORDER BY e.exam_date ASC
        """

        cursor.execute(query)
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("ERROR IN /api/faculty/exams:", e)
        return jsonify([])

# =========================================
# GET FACULTY lecture schedule(faculty)
# =========================================
# @app.route("/api/schedule/faculty/<int:facultyId>", methods=["GET"])
# def get_faculty_schedule(facultyId):
#     try:
#         db = get_db()
#         cursor = db.cursor(dictionary=True)

#         query = """
#         SELECT 
#             lt.lecture_id,
#             lt.day,
#             lt.start_time,
#             lt.end_time,
#             lt.room,
#             s.subject_name,
#             c.course_name
#         FROM lecture_timetable lt
#         JOIN subjects s ON lt.subject_id = s.subject_id
#         JOIN courses c ON lt.course_id = c.course_id
#         WHERE lt.faculty_id = %s
#         ORDER BY 
#             FIELD(lt.day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
#             lt.start_time
#         """

#         cursor.execute(query, (facultyId,))
#         data = cursor.fetchall()

#         # ✅ FIX TIME FORMAT PROPERLY
#         for row in data:
#             if row["start_time"]:
#                 row["start_time"] = str(row["start_time"])[:5]   # HH:MM
#             if row["end_time"]:
#                 row["end_time"] = str(row["end_time"])[:5]

#         print("FINAL DATA:", data)  # debug

#         return jsonify(data)

#     except Exception as e:
#         print("❌ ERROR:", e)
#         return jsonify([])
@app.route("/api/schedule/faculty/<int:facultyId>", methods=["GET"])
def get_faculty_schedule(facultyId):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            lt.lecture_id,
            lt.day,
            lt.start_time,
            lt.end_time,
            lt.room,
            s.subject_name,
            c.course_name
        FROM lecture_timetable lt
        JOIN subjects s 
            ON lt.subject_id = s.subject_id
        JOIN courses c 
            ON lt.course_id = c.course_id
        WHERE lt.faculty_id = %s
        ORDER BY 
            FIELD(
                lt.day,
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ),
            lt.start_time
        """

        cursor.execute(query, (facultyId,))
        data = cursor.fetchall()

        # ✅ FIX TIME ERROR
        for row in data:

            # START TIME
            if row["start_time"]:
                row["start_time"] = str(row["start_time"])[:5]

            # END TIME
            if row["end_time"]:
                row["end_time"] = str(row["end_time"])[:5]

        print("✅ FINAL SCHEDULE DATA:", data)

        return jsonify(data)

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify([])
#-------------------------------------------------------------------------------------
#subject-plan section(faculty)
#get faculty subjects (faculty)
#-------------------------------------------------------------------------------------


@app.route("/api/faculty/subjects/<int:facultyId>", methods=["GET"])
def get_faculty_subjects(facultyId):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            s.subject_id,
            s.subject_name,
            s.subject_code
        FROM subject_faculty sf
        JOIN subjects s ON sf.subject_id = s.subject_id
        WHERE sf.faculty_id = %s
        """

        cursor.execute(query, (facultyId,))
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("SUBJECT ERROR:", e)
        return jsonify([])

#----------------------------------------------------------------------------
#get subject plan(faculty)
#----------------------------------------------------------------------------

@app.route("/api/subject-plan/<int:subjectId>", methods=["GET"])
def get_subject_plan(subjectId):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            id,
            subject_id,
            topic,
            DATE_FORMAT(plan_date, '%Y-%m-%d') AS plan_date
        FROM subject_plan
        WHERE subject_id = %s
        ORDER BY plan_date ASC
        """

        cursor.execute(query, (subjectId,))
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("PLAN FETCH ERROR:", e)
        return jsonify([])

#------------------------------------------------------------------------------
#add subject plan(faculty)
#--------------------------------------------------------------------------------

@app.route("/api/subject-plan", methods=["POST"])
def add_subject_plan():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()

        subject_id = data.get("subject_id")
        topic = data.get("topic")
        plan_date = data.get("plan_date")

        if not subject_id or not topic or not plan_date:
            return jsonify({"success": False, "message": "Missing fields"})

        query = """
        INSERT INTO subject_plan (subject_id, topic, plan_date)
        VALUES (%s, %s, %s)
        """

        cursor.execute(query, (subject_id, topic, plan_date))
        db.commit()

        return jsonify({"success": True, "message": "Plan added"})

    except Exception as e:
        print("PLAN INSERT ERROR:", e)
        return jsonify({"success": False})

#---------------------------------------------------------------------------
#delete subject plan(faculty)
#-------------------------------------------------------------------------
@app.route("/api/subject-plan/<int:id>", methods=["DELETE"])
def delete_subject_plan(id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "DELETE FROM subject_plan WHERE id=%s",
            (id,)
        )

        db.commit()

        return jsonify({"success": True, "message": "Deleted successfully"})

    except Exception as e:
        print("DELETE ERROR:", e)
        return jsonify({"success": False})

#----------------------------------------------------------------------------------
#Faculty notification section(faculty)
#-----------------------------------------------------------------------------------


# =========================
# FACULTY GET NOTIFICATIONS
# =========================
@app.route("/faculty/notifications", methods=["GET"])
def faculty_get_notifications():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT * 
            FROM notifications
            WHERE target IN ('all', 'faculty')
            ORDER BY created_at DESC
        """)

        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("ERROR:", e)
        return jsonify([])

#-------------------------------------------------------------------------------------
# student dashboard 
#----------------------------------------------------------------------------------------

# =====================================================
# ✅ GET EXAM TIMETABLE (student)
# =====================================================


@app.route("/api/exams", methods=["GET"])
def get_exam_timetable():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        course_id = request.args.get("course_id")
        semester = request.args.get("semester")

        query = """
        SELECT 
            s.subject_name AS subject,
            c.course_name AS course,
            CONCAT('Sem ', e.semester) AS sem,
            DATE_FORMAT(e.exam_date, '%Y-%m-%d') AS date,
            CONCAT(
                TIME_FORMAT(e.start_time, '%h:%i %p'),
                ' - ',
                TIME_FORMAT(e.end_time, '%h:%i %p')
            ) AS time,
            CONCAT(e.duration, ' Hours') AS duration

        FROM exam_timetable e
        JOIN subjects s ON e.subject_id = s.subject_id
        JOIN courses c ON e.course_id = c.course_id
        WHERE e.status != 'inactive'
        """

        values = []

        # ✅ FILTER (IMPORTANT)
        if course_id and semester:
            query += " AND e.course_id = %s AND e.semester = %s"
            values.extend([course_id, semester])

        query += " ORDER BY e.exam_date ASC"

        cursor.execute(query, values)
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("❌ EXAM ERROR:", e)
        return jsonify([])
# =====================================================
# ✅ GET LECTURE TIMETABLE (student)
# =====================================================

@app.route("/api/lectures", methods=["GET"])
def get_lecture_timetable():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        course_id = request.args.get("course_id")
        semester = request.args.get("semester")

        query = """
        SELECT 
            l.lecture_id,
            s.subject_name AS subject,
            c.course_name AS course,
            l.semester AS sem,
            l.day,

            CONCAT(
                TIME_FORMAT(l.start_time, '%h:%i %p'),
                ' - ',
                TIME_FORMAT(l.end_time, '%h:%i %p')
            ) AS time,

            l.room,

            COALESCE(u.name, 'Not Assigned') AS faculty

        FROM lecture_timetable l
        JOIN subjects s ON l.subject_id = s.subject_id
        JOIN courses c ON l.course_id = c.course_id
        LEFT JOIN faculty f ON l.faculty_id = f.faculty_id
        LEFT JOIN users u ON f.user_id = u.user_id
        WHERE 1=1
        """

        values = []

        if course_id and course_id != "undefined":
            query += " AND l.course_id = %s"
            values.append(course_id)

        if semester and semester != "undefined":
            query += " AND l.semester = %s"
            values.append(semester)

        query += """
        ORDER BY FIELD(l.day,
            'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
        )
        """

        cursor.execute(query, values)
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("❌ LECTURE ERROR:", e)
        return jsonify([])
# =====================================================
# ✅ GET ASSIGNMENTS (student)
# =====================================================
@app.route("/api/assignments", methods=["GET"])
def get_assignments():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT 
            a.assignment_id,
            s.subject_name AS subject,
            a.title,
            DATE_FORMAT(a.created_at, '%Y-%m-%d') AS dueDate,
            a.file_path AS classroomLink,

            CASE 
                WHEN sub.submission_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS submitted,

            sub.file_path AS file,
            sub.remarks

        FROM assignments a

        LEFT JOIN subjects s 
            ON a.subject_id = s.subject_id

        LEFT JOIN assignment_submission sub 
            ON a.assignment_id = sub.assignment_id

        ORDER BY a.created_at DESC
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        # ✅ Convert TRUE/FALSE properly for JSON
        result = []
        for r in rows:
            result.append({
                "assignment_id": r["assignment_id"],
                "subject": r["subject"],
                "title": r["title"],
                "dueDate": r["dueDate"],
                "classroomLink": r["classroomLink"],
                "submitted": bool(r["submitted"]),   # 🔥 IMPORTANT
                "file": r["file"],
                "remarks": r["remarks"]
            })

        print("🔥 DATA:", result)  # DEBUG

        return jsonify(result)

    except Exception as e:
        print("❌ ASSIGNMENT ERROR:", e)
        return jsonify([])


# ===================================================
# 📚 GET SUBJECT → TOPICS → MATERIALS
# ===================================================

@app.route("/api/performance/<int:studentId>", methods=["GET"])
def get_performance(studentId):

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT
            s.subject_name,
            t.topic_name,
            m.material_id,
            m.material_title,
            m.material_type,
            m.file_path,

            CASE
                WHEN mp.status = 'completed' THEN 100
                ELSE 0
            END AS progress

        FROM subjects s

        JOIN topic t
            ON s.subject_id = t.subject_id

        JOIN material m
            ON t.topic_id = m.topic_id

        LEFT JOIN material_progress mp
            ON mp.material_id = m.material_id
            AND mp.student_id = %s

        ORDER BY s.subject_name, t.topic_name
        """

        cursor.execute(query, (studentId,))
        rows = cursor.fetchall()

        data = []

        for row in rows:

            # SUBJECT
            subject = next(
                (
                    s for s in data
                    if s["subject"] == row["subject_name"]
                ),
                None
            )

            if not subject:
                subject = {
                    "subject": row["subject_name"],
                    "topics": []
                }

                data.append(subject)

            # TOPIC
            topic = next(
                (
                    t for t in subject["topics"]
                    if t["name"] == row["topic_name"]
                ),
                None
            )

            if not topic:
                topic = {
                    "name": row["topic_name"],
                    "materials": []
                }

                subject["topics"].append(topic)

            # MATERIAL
            topic["materials"].append({
                "id": row["material_id"],
                "title": row["material_title"],
                "link": row["file_path"],
                "type": row["material_type"],
                "progress": int(row["progress"])
            })

        cursor.close()
        db.close()

        return jsonify(data)

    except Exception as e:
        print("❌ PERFORMANCE ERROR:", e)
        return jsonify([])


# ===================================================
# 🔄 UPDATE MATERIAL PROGRESS
# ===================================================

@app.route("/api/material/<int:materialId>", methods=["PUT"])
def update_material(materialId):

    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()

        student_id = data.get("student_id")

        # CHECK ALREADY COMPLETED
        check_query = """
        SELECT * FROM material_progress
        WHERE student_id = %s
        AND material_id = %s
        """

        cursor.execute(check_query, (student_id, materialId))
        existing = cursor.fetchone()

        if existing:

            update_query = """
            UPDATE material_progress
            SET status = 'completed',
                completed_at = NOW()
            WHERE student_id = %s
            AND material_id = %s
            """

            cursor.execute(update_query, (student_id, materialId))

        else:

            insert_query = """
            INSERT INTO material_progress
            (
                student_id,
                material_id,
                status,
                completed_at
            )
            VALUES
            (
                %s,
                %s,
                'completed',
                NOW()
            )
            """

            cursor.execute(insert_query, (student_id, materialId))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True
        })

    except Exception as e:
        print("❌ UPDATE ERROR:", e)

        return jsonify({
            "success": False
        })

#------------------
#notification(student)
#---------------------

# -------------------------------------------------
# 🔔 STUDENT NOTIFICATIONS API
# -------------------------------------------------

@app.route("/api/student/notifications", methods=["GET"])
def get_notifications_student():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT 
                notification_id,
                user_id,
                message,
                type,
                status,
                created_at,
                target
            FROM notifications
            WHERE target IN ('student', 'all')
            ORDER BY created_at DESC
        """

        cursor.execute(query)
        data = cursor.fetchall()

        return jsonify(data)

    except Exception as e:
        print("Error:", e)
        return jsonify([])

#------------------------------------

#faculty dashboard backend 

#------------------------------------

@app.route("/dashboard", methods=["GET"])
def faculty_dashboard():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        result = {}

        # 🔹 students count
        cursor.execute("SELECT COUNT(*) AS total FROM students")
        result["students"] = cursor.fetchone()["total"]

        # 🔹 exams count
        cursor.execute("SELECT COUNT(*) AS total FROM exam_timetable WHERE status != 'inactive'")
        result["exams"] = cursor.fetchone()["total"]

        return jsonify(result)

    except Exception as e:
        print("DASHBOARD ERROR:", e)
        return jsonify({"students": 0, "exams": 0})


@app.route("/api/facultydashboard/notifications", methods=["GET"])
def get_notifications_facultydashboard():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT notification_id, message, type, status, created_at
            FROM notifications
            ORDER BY created_at DESC
            LIMIT 10
        """)

        return jsonify(cursor.fetchall())

    except Exception as e:
        print("NOTIFICATION ERROR:", e)
        return jsonify([])

@app.route("/api/schedule/faculty/<int:faculty_id>", methods=["GET"])
def faculty_schedule(faculty_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                l.lecture_id,
                l.day,
                l.start_time,
                l.end_time,
                l.room,
                s.subject_name,
                c.course_name
            FROM lecture_timetable l
            JOIN subjects s ON l.subject_id = s.subject_id
            JOIN courses c ON l.course_id = c.course_id
            WHERE l.faculty_id = %s
            ORDER BY FIELD(l.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
                     l.start_time
        """, (faculty_id,))

        data = cursor.fetchall()

        # fix time format
        for row in data:
            if row["start_time"]:
                row["start_time"] = str(row["start_time"])[:5]
            if row["end_time"]:
                row["end_time"] = str(row["end_time"])[:5]

        return jsonify(data)

    except Exception as e:
        print("SCHEDULE ERROR:", e)
        return jsonify([])


@app.route("/api/faculty/assignments/<int:faculty_id>", methods=["GET"])
def faculty_assignments(faculty_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                a.assignment_id,
                a.title,
                a.deadline,
                s.subject_name
            FROM assignments a
            JOIN subjects s ON a.subject_id = s.subject_id
            WHERE a.faculty_id = %s
        """, (faculty_id,))

        return jsonify(cursor.fetchall())

    except Exception as e:
        print("ASSIGNMENT ERROR:", e)
        return jsonify([])

@app.route("/api/faculty/stats/<int:faculty_id>", methods=["GET"])
def faculty_stats(faculty_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # lectures per subject
        cursor.execute("""
            SELECT s.subject_name, COUNT(l.lecture_id) AS total
            FROM lecture_timetable l
            JOIN subjects s ON l.subject_id = s.subject_id
            WHERE l.faculty_id = %s
            GROUP BY l.subject_id
        """, (faculty_id,))

        data = cursor.fetchall()

        labels = []
        values = []

        for row in data:
            labels.append(row["subject_name"])
            values.append(row["total"])

        return jsonify({
            "labels": labels,
            "data": values
        })

    except Exception as e:
        print("STATS ERROR:", e)
        return jsonify({"labels": [], "data": []})

# =========================
# 🚀 RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True, port=5000)