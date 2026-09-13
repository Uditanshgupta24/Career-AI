from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import io
import re
from pypdf import PdfReader

app = FastAPI(title="Career AI API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extended Company Database
COMPANIES_DB = {
    "Google": {
        "tier": "Tier 1 Product",
        "default_role": "Software Engineer (L3/L4)",
        "target_dsa": 400,
        "salary_range": {
            "fresher": "₹25 - 45 LPA (Base + Stocks + Bonus)",
            "mid": "₹45 - 85 LPA",
            "senior": "₹85 - 1.5 Cr+"
        },
        "required_skills": [
            "c++", "java", "python", "dsa", "dynamic programming", "graphs",
            "trees", "system design", "operating systems", "dbms", "computer networks", "git"
        ],
        "interview_rounds": [
            "Online Coding Assessment (2 Hard DSA Questions)",
            "3-4 Technical Problem Solving Rounds (DSA & Optimization)",
            "System Design / Architecture Round (LLD/HLD)",
            "Googliness & Cultural Fit Round"
        ]
    },
    "Microsoft": {
        "tier": "Tier 1 Product",
        "default_role": "Software Development Engineer (SDE I/II)",
        "target_dsa": 350,
        "salary_range": {
            "fresher": "₹22 - 42 LPA",
            "mid": "₹42 - 75 LPA",
            "senior": "₹75 - 1.2 Cr+"
        },
        "required_skills": [
            "c++", "c#", "java", "python", "dsa", "oop", "system design",
            "dbms", "sql", "operating systems", "azure", "cloud", "git"
        ],
        "interview_rounds": [
            "Codility Online Assessment (3 Coding Tasks)",
            "Technical Round 1: DSA & Data Structure Optimization",
            "Technical Round 2: Low Level Design & OOP Patterns",
            "As Appropriate (AA) Round: System Design + Culture"
        ]
    },
    "Amazon": {
        "tier": "Tier 1 Product",
        "default_role": "Software Development Engineer (SDE I)",
        "target_dsa": 350,
        "salary_range": {
            "fresher": "₹24 - 44 LPA",
            "mid": "₹44 - 78 LPA",
            "senior": "₹78 - 1.3 Cr+"
        },
        "required_skills": [
            "java", "c++", "python", "dsa", "oop", "system design",
            "aws", "cloud", "dbms", "sql", "operating systems", "git"
        ],
        "interview_rounds": [
            "Amazon Online Assessment (Debugging + 2 Coding Problems + Work Simulation)",
            "Technical Round 1: DSA (Arrays, Trees, Graphs, HashMaps)",
            "Technical Round 2: DSA & Object Oriented Low Level Design",
            "Bar Raiser Round: High focus on Amazon 16 Leadership Principles"
        ]
    },
    "Meta": {
        "tier": "Tier 1 Product",
        "default_role": "Software Engineer (E3/E4)",
        "target_dsa": 400,
        "salary_range": {
            "fresher": "₹28 - 50 LPA",
            "mid": "₹55 - 95 LPA",
            "senior": "₹95 - 1.8 Cr+"
        },
        "required_skills": [
            "python", "c++", "java", "javascript", "react", "dsa",
            "graphs", "dynamic programming", "system design", "distributed systems", "git"
        ],
        "interview_rounds": [
            "Technical Screening (2 LeetCode Medium/Hard in 45 min)",
            "Coding Round 1: Data Structures & Fast Implementation",
            "Coding Round 2: Algorithms & Tree/Graph Traversal",
            "System Design / Product Architecture Round"
        ]
    },
    "Apple": {
        "tier": "Tier 1 Product",
        "default_role": "Software Engineer (ICT2/ICT3)",
        "target_dsa": 320,
        "salary_range": {
            "fresher": "₹22 - 40 LPA",
            "mid": "₹40 - 75 LPA",
            "senior": "₹75 - 1.3 Cr+"
        },
        "required_skills": [
            "c++", "swift", "python", "c", "dsa", "operating systems",
            "memory management", "concurrency", "git"
        ],
        "interview_rounds": [
            "Technical Phone Screen (Coding & Computer Architecture)",
            "Domain Depth Round (Language Internals & Memory)",
            "Coding & Data Structures Round",
            "Team Fit & Architectural Review"
        ]
    },
    "Uber": {
        "tier": "Tier 1 Product",
        "default_role": "Software Engineer II",
        "target_dsa": 380,
        "salary_range": {
            "fresher": "₹26 - 48 LPA",
            "mid": "₹48 - 85 LPA",
            "senior": "₹85 - 1.4 Cr+"
        },
        "required_skills": [
            "go", "java", "python", "dsa", "system design", "distributed systems",
            "kafka", "redis", "microservices", "git"
        ],
        "interview_rounds": [
            "Online Coding Assessment (Hard DSA)",
            "Live Technical Problem Solving (2 Rounds)",
            "High Level System Design (Real-time geo-distributed systems)",
            "Hiring Manager & Values Round"
        ]
    },
    "Infosys": {
        "tier": "Tier 2 Service / Digital Specialist",
        "default_role": "Specialist Programmer (SP) / DSE",
        "target_dsa": 100,
        "salary_range": {
            "fresher": "₹6.5 - 9.5 LPA (Digital/SP) / ₹3.6 LPA (System Engineer)",
            "mid": "₹10 - 16 LPA",
            "senior": "₹16 - 25 LPA"
        },
        "required_skills": [
            "java", "python", "c++", "sql", "dbms", "oop",
            "dsa", "html", "css", "javascript", "git"
        ],
        "interview_rounds": [
            "HackWithInfy / InfyTQ Qualifier / National Test",
            "Technical Interview (Core CS: OOP, SQL queries, Basic DSA, Project Deep Dive)",
            "HR Round (Communication & Cultural Fit)"
        ]
    },
    "TCS": {
        "tier": "Tier 2 Service (Prime / Digital / Ninja)",
        "default_role": "Digital / Prime Engineer",
        "target_dsa": 90,
        "salary_range": {
            "fresher": "₹7 - 9 LPA (Prime) / ₹3.36 LPA (Ninja)",
            "mid": "₹9 - 15 LPA",
            "senior": "₹15 - 24 LPA"
        },
        "required_skills": [
            "c", "c++", "java", "python", "sql", "dbms", "oop",
            "dsa", "computer networks", "web basics", "git"
        ],
        "interview_rounds": [
            "TCS NQT (Cognitive Aptitude + Advanced Coding Section)",
            "Technical Round (Language syntax, OOP concepts, DBMS joins, Project walkthrough)",
            "Managerial & HR Interview"
        ]
    },
    "Wipro": {
        "tier": "Tier 2 Service (Turbo / Elite)",
        "default_role": "Project Engineer / Turbo Developer",
        "target_dsa": 80,
        "salary_range": {
            "fresher": "₹6.5 - 8.5 LPA (Turbo) / ₹3.5 LPA (Elite)",
            "mid": "₹8.5 - 14 LPA",
            "senior": "₹14 - 22 LPA"
        },
        "required_skills": [
            "c++", "java", "python", "sql", "dbms", "oop",
            "dsa", "operating systems", "git"
        ],
        "interview_rounds": [
            "Wipro NLTH (Aptitude, Written English, Coding Round)",
            "Technical Interview (OOP, basic algorithms, data structures, SQL)",
            "HR & Discussion Round"
        ]
    }
}

# Role-specific skills templates
ROLE_SKILLS_CATALOG = {
    "frontend": [
        "javascript", "typescript", "react", "html", "css", "nextjs",
        "tailwind", "redux", "web performance", "rest api", "git", "dsa"
    ],
    "backend": [
        "python", "java", "go", "sql", "dbms", "rest api", "system design",
        "docker", "redis", "microservices", "oop", "git", "dsa"
    ],
    "fullstack": [
        "javascript", "typescript", "react", "python", "java", "sql",
        "dbms", "rest api", "system design", "docker", "git", "dsa"
    ],
    "ai_ml": [
        "python", "machine learning", "deep learning", "sql", "pandas",
        "numpy", "pytorch", "tensorflow", "statistics", "git", "dsa"
    ],
    "devops_cloud": [
        "linux", "docker", "kubernetes", "aws", "azure", "cloud",
        "ci/cd", "terraform", "python", "networking", "git"
    ],
    "mobile": [
        "swift", "kotlin", "flutter", "react native", "rest api",
        "oop", "sqlite", "git", "dsa"
    ],
    "sde": [
        "c++", "java", "python", "dsa", "system design", "oop",
        "operating systems", "dbms", "sql", "computer networks", "git"
    ]
}

SKILL_MAP = {
    "c++": "c++", "cpp": "c++", "c plus plus": "c++",
    "c": "c",
    "c#": "c#", "csharp": "c#",
    "java": "java", "core java": "java",
    "python": "python", "python3": "python",
    "javascript": "javascript", "js": "javascript", "es6": "javascript",
    "typescript": "typescript", "ts": "typescript",
    "dsa": "dsa", "data structures": "dsa", "data structures and algorithms": "dsa", "algorithms": "dsa",
    "dynamic programming": "dynamic programming", "dp": "dynamic programming",
    "graphs": "graphs", "graph": "graphs", "trees": "trees", "tree": "trees",
    "system design": "system design", "lld": "system design", "hld": "system design",
    "sql": "sql", "mysql": "sql", "postgresql": "sql", "postgres": "sql",
    "dbms": "dbms", "database": "dbms", "mongodb": "dbms",
    "oop": "oop", "oops": "oop", "object oriented programming": "oop",
    "operating systems": "operating systems", "os": "operating systems",
    "computer networks": "computer networks", "networking": "computer networks",
    "git": "git", "github": "git",
    "aws": "aws", "azure": "azure", "cloud": "cloud", "docker": "docker", "kubernetes": "kubernetes",
    "terraform": "terraform", "ci/cd": "ci/cd", "linux": "linux",
    "html": "html", "css": "css", "react": "react", "nextjs": "nextjs", "tailwind": "tailwind",
    "redux": "redux", "web performance": "web performance", "rest api": "rest api", "microservices": "microservices",
    "redis": "redis", "kafka": "kafka", "go": "go", "golang": "go", "swift": "swift", "kotlin": "kotlin",
    "flutter": "flutter", "machine learning": "machine learning", "deep learning": "deep learning",
    "pandas": "pandas", "numpy": "numpy", "pytorch": "pytorch", "tensorflow": "tensorflow"
}

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = " " + text.lower() + " "
    found_skills = set()
    for raw_skill, normalized in SKILL_MAP.items():
        pattern = r'(?:\b|(?<=[^a-zA-Z0-9]))' + re.escape(raw_skill) + r'(?:\b|(?=[^a-zA-Z0-9]))'
        if re.search(pattern, text_lower):
            found_skills.add(normalized)
    return sorted(list(found_skills))

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted.append(t)
        return "\n".join(extracted)
    except Exception:
        return ""

def validate_url(url: Optional[str], domain: str) -> bool:
    if not url:
        return False
    clean = url.strip().lower()
    return domain in clean and ("http://" in clean or "https://" in clean or domain in clean)

def get_role_skills(role_name: str, company_skills: List[str]) -> List[str]:
    r_lower = role_name.lower()
    if "front" in r_lower or "react" in r_lower or "ui" in r_lower:
        return ROLE_SKILLS_CATALOG["frontend"]
    elif "back" in r_lower or "api" in r_lower or "node" in r_lower:
        return ROLE_SKILLS_CATALOG["backend"]
    elif "full" in r_lower or "stack" in r_lower:
        return ROLE_SKILLS_CATALOG["fullstack"]
    elif "data" in r_lower or "ai" in r_lower or "ml" in r_lower or "machine" in r_lower:
        return ROLE_SKILLS_CATALOG["ai_ml"]
    elif "devops" in r_lower or "cloud" in r_lower or "sre" in r_lower or "infra" in r_lower:
        return ROLE_SKILLS_CATALOG["devops_cloud"]
    elif "mobile" in r_lower or "android" in r_lower or "ios" in r_lower:
        return ROLE_SKILLS_CATALOG["mobile"]
    else:
        # Blend SDE catalog with company specifics
        return sorted(list(set(ROLE_SKILLS_CATALOG["sde"] + company_skills)))

def get_top_interview_questions(company: str, role: str) -> List[Dict]:
    r_lower = role.lower()
    if "front" in r_lower:
        return [
            {"q": "How does React Virtual DOM reconciliation (Fiber) work, and how do you optimize re-renders?", "type": "Technical"},
            {"q": "Explain event bubbling, event delegation, and closures with real-world DOM scenarios.", "type": "Technical"},
            {"q": "How would you design a high-performance infinite scroll component handling 100,000 items?", "type": "Architecture"},
            {"q": f"How do you implement critical rendering path optimizations (LCP, CLS, FID) at {company}?", "type": "Performance"},
            {"q": "Tell me about a time you resolved a major cross-browser UI/UX bug under tight deadline.", "type": "Behavioral"}
        ]
    elif "back" in r_lower or "devops" in r_lower:
        return [
            {"q": "How do you handle database concurrency and avoid race conditions in distributed microservices?", "type": "System Design"},
            {"q": "Explain indexing strategies (B-Tree vs Hash) and how you diagnose slow SQL queries using EXPLAIN.", "type": "Database"},
            {"q": "How would you design a rate limiter handling 100k requests/second using Redis?", "type": "System Design"},
            {"q": "What is the difference between TCP and UDP, and when would you use gRPC over REST?", "type": "Networking"},
            {"q": "Describe a production outage you encountered and how you performed root cause analysis.", "type": "Behavioral"}
        ]
    elif "ai" in r_lower or "data" in r_lower:
        return [
            {"q": "Explain the bias-variance tradeoff and how you prevent overfitting in deep learning.", "type": "ML Theory"},
            {"q": "How would you design a real-time recommendation engine for millions of active users?", "type": "System Design"},
            {"q": "Explain the mechanics of self-attention in Transformer architectures.", "type": "Deep Learning"},
            {"q": "How do you handle severe class imbalance in production classification datasets?", "type": "Data Modeling"},
            {"q": "Describe a scenario where a machine learning model performed poorly in production vs offline test.", "type": "Behavioral"}
        ]
    else:
        return [
            {"q": f"Solve: Find the longest path in a directed acyclic graph (DAG) with edge weights in O(V+E).", "type": "DSA"},
            {"q": "Design an LRU Cache with O(1) get and put operations using Doubly Linked List & HashMap.", "type": "Coding & LLD"},
            {"q": f"How would you design a distributed URL shortening service (e.g. TinyURL) for {company} scale?", "type": "System Design"},
            {"q": "Explain Deadlock prevention conditions and virtual memory paging in Operating Systems.", "type": "Core CS"},
            {"q": f"Why do you specifically want to join {company}, and tell me about your most technically challenging project?", "type": "Behavioral"}
        ]

@app.get("/")
def home():
    return {
        "message": "Career AI API v3.0 - Role Freedom & Platform Intelligence",
        "companies": list(COMPANIES_DB.keys())
    }

@app.get("/companies")
def get_companies():
    return COMPANIES_DB

class EvaluateRequest(BaseModel):
    company_name: str
    target_role: Optional[str] = "Software Engineer"
    experience_level: Optional[str] = "fresher"
    dsa_solved: int
    cv_text: Optional[str] = ""
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    portfolio_url: Optional[str] = ""
    leetcode_url: Optional[str] = ""

def compute_eligibility(
    company_name: str,
    target_role: str,
    experience_level: str,
    dsa_solved: int,
    cv_text: str,
    github_url: Optional[str] = None,
    linkedin_url: Optional[str] = None,
    portfolio_url: Optional[str] = None,
    leetcode_url: Optional[str] = None
) -> dict:
    # Company fallback if custom company typed
    if company_name in COMPANIES_DB:
        company = COMPANIES_DB[company_name]
    else:
        # Default Tier 1 / High Growth fallback for custom company
        company = {
            "tier": "Tech Company",
            "default_role": target_role or "Software Engineer",
            "target_dsa": 250,
            "salary_range": {
                "fresher": "₹12 - 25 LPA",
                "mid": "₹25 - 45 LPA",
                "senior": "₹45 - 75 LPA"
            },
            "required_skills": [
                "python", "java", "javascript", "dsa", "sql", "dbms", "oop", "system design", "git"
            ],
            "interview_rounds": [
                "Coding Assessment / Take Home Task",
                "Technical Interview 1 (DSA & Problem Solving)",
                "Technical Interview 2 (System Architecture & Frameworks)",
                "Culture & Leadership Round"
            ]
        }

    role_to_use = target_role if target_role and target_role.strip() else company["default_role"]
    exp_to_use = experience_level if experience_level in ["fresher", "mid", "senior"] else "fresher"

    # Get tailored skills according to role
    required_skills = get_role_skills(role_to_use, company["required_skills"])
    target_dsa = company["target_dsa"]

    # Adjust weights by experience
    if exp_to_use == "fresher":
        dsa_max = 35.0
        skills_max = 30.0
        proj_max = 20.0
        presence_max = 15.0
    elif exp_to_use == "mid":
        dsa_max = 25.0
        skills_max = 35.0
        proj_max = 25.0
        presence_max = 15.0
    else: # senior
        dsa_max = 20.0
        skills_max = 40.0
        proj_max = 25.0
        presence_max = 15.0

    # 1. Skills Extraction
    extracted_skills = extract_skills_from_text(cv_text)
    matched_skills = [s for s in required_skills if s in extracted_skills]
    missing_skills = [s for s in required_skills if s not in extracted_skills]

    # 2. DSA Score
    dsa_ratio = min(max(0, dsa_solved) / target_dsa, 1.0)
    dsa_score = round(dsa_ratio * dsa_max, 1)

    # 3. Skills Score
    skill_ratio = len(matched_skills) / len(required_skills) if required_skills else 1.0
    skill_score = round(skill_ratio * skills_max, 1)

    # 4. GitHub & Projects
    github_score = 0.0
    has_valid_github = validate_url(github_url, "github.com")
    if has_valid_github:
        github_score += 10.0
    elif github_url and github_url.strip():
        github_score += 5.0

    cv_lower = cv_text.lower()
    project_keywords = ["project", "developed", "built", "full stack", "api", "database", "microservice", "react", "deployed", "scaled"]
    proj_keyword_hits = sum(1 for kw in project_keywords if kw in cv_lower)
    github_score += min(proj_keyword_hits * 1.5, proj_max - 10.0)
    github_score = round(min(github_score, proj_max), 1)

    # 5. Online Presence & Coding Profiles
    presence_score = 0.0
    has_valid_linkedin = validate_url(linkedin_url, "linkedin.com")
    if has_valid_linkedin:
        presence_score += 6.0
    elif linkedin_url and linkedin_url.strip():
        presence_score += 3.0

    has_valid_portfolio = validate_url(portfolio_url, ".")
    if has_valid_portfolio:
        presence_score += 5.0
    elif portfolio_url and portfolio_url.strip():
        presence_score += 2.0

    has_valid_leetcode = validate_url(leetcode_url, "leetcode.com") or validate_url(leetcode_url, "codeforces.com") or validate_url(leetcode_url, "geeksforgeeks.org")
    if has_valid_leetcode:
        presence_score += 4.0
    elif leetcode_url and leetcode_url.strip():
        presence_score += 2.0
    presence_score = round(min(presence_score, presence_max), 1)

    total_percentage = round(dsa_score + skill_score + github_score + presence_score)
    total_percentage = min(max(total_percentage, 8), 98)

    if total_percentage >= 80:
        status_label = "Interview Ready / High Eligibility"
        status_type = "high"
        verdict = f"Your profile is exceptionally well-aligned for {role_to_use} at {company_name}. Strong interview conversion probability!"
    elif total_percentage >= 60:
        status_label = "Competitive Contender"
        status_type = "medium"
        verdict = f"Solid foundation for {role_to_use} at {company_name}. Bridging key skill and project gaps will position you in top percentiles."
    elif total_percentage >= 40:
        status_label = "Developing Candidate"
        status_type = "moderate"
        verdict = f"Promising baseline for {role_to_use}. Focus on the targeted 12-week roadmap below to reach {company_name}'s standard bar."
    else:
        status_label = "Preparation Needed"
        status_type = "low"
        verdict = f"Fundamental gaps identified for {role_to_use} at {company_name}. Begin dedicated practice across DSA and core projects."

    # Dynamic 4-Phase Roadmap
    is_product = "Product" in company["tier"]
    dsa_gap = max(0, target_dsa - dsa_solved)
    
    roadmap = [
        {
            "phase": "Phase 1",
            "title": f"Coding Bar & Core Algorithms ({dsa_solved}/{target_dsa} solved)",
            "duration": "Weeks 1 - 4",
            "steps": [
                f"Target: Solve at least {dsa_gap} more high-yield questions on LeetCode/GFG.",
                f"Focus on patterns vital for {role_to_use} (HashMaps, Trees, Graphs, Two Pointers).",
                f"Practice explaining time/space complexities out loud in under 25 minutes."
            ]
        },
        {
            "phase": "Phase 2",
            "title": f"{role_to_use} Tech Stack & Architecture",
            "duration": "Weeks 5 - 8",
            "steps": [
                f"Master Missing Core Skills: {', '.join([s.title() for s in missing_skills[:4]]) if missing_skills else 'Advanced optimization and caching'}.",
                "Design Patterns & System Architecture: Scalability, API design, and Database optimization.",
                "Review Operating Systems, Database indexing, and Network protocols."
            ]
        },
        {
            "phase": "Phase 3",
            "title": "Production-Grade Projects & Portfolio Branding",
            "duration": "Weeks 9 - 10",
            "steps": [
                f"Build or polish a flagship project tailored for {role_to_use} with clean Git commits and live deployment.",
                "Add automated unit tests and architectural documentation to your GitHub repositories.",
                "Update LinkedIn and Portfolio highlighting measurable impact metrics."
            ]
        },
        {
            "phase": "Phase 4",
            "title": f"{company_name} Interview Sprints & Mock Rounds",
            "duration": "Weeks 11 - 12",
            "steps": [
                f"Practice round formats: {company['interview_rounds'][0] if company['interview_rounds'] else 'Technical assessment'}.",
                "Conduct 3+ peer mock interviews simulating live coding pressure.",
                "Master behavioral questions using the STAR framework tailored for company leadership principles."
            ]
        }
    ]

    salary_display = company["salary_range"].get(exp_to_use, company["salary_range"]["fresher"])
    interview_questions = get_top_interview_questions(company_name, role_to_use)

    return {
        "company": company_name,
        "tier": company["tier"],
        "role": role_to_use,
        "experience_level": exp_to_use.title(),
        "salary_range": salary_display,
        "eligibility_percentage": total_percentage,
        "status_label": status_label,
        "status_type": status_type,
        "verdict": verdict,
        "score_breakdown": {
            "dsa": {
                "score": f"{dsa_score}/{int(dsa_max)}",
                "user_solved": dsa_solved,
                "target_solved": target_dsa,
                "percentage": round((dsa_score / dsa_max) * 100)
            },
            "skills": {
                "score": f"{skill_score}/{int(skills_max)}",
                "matched_count": len(matched_skills),
                "total_required": len(required_skills),
                "percentage": round((skill_score / skills_max) * 100)
            },
            "github_projects": {
                "score": f"{github_score}/{int(proj_max)}",
                "has_github": has_valid_github,
                "percentage": round((github_score / proj_max) * 100)
            },
            "profile_presence": {
                "score": f"{presence_score}/{int(presence_max)}",
                "has_linkedin": has_valid_linkedin,
                "has_portfolio": has_valid_portfolio,
                "has_leetcode": has_valid_leetcode,
                "percentage": round((presence_score / presence_max) * 100)
            }
        },
        "matched_skills": [s.upper() if len(s) <= 4 else s.title() for s in matched_skills],
        "missing_skills": [s.upper() if len(s) <= 4 else s.title() for s in missing_skills],
        "interview_questions": interview_questions,
        "roadmap": roadmap
    }

@app.post("/evaluate")
def evaluate_json(req: EvaluateRequest):
    return compute_eligibility(
        company_name=req.company_name,
        target_role=req.target_role or "Software Engineer",
        experience_level=req.experience_level or "fresher",
        dsa_solved=req.dsa_solved,
        cv_text=req.cv_text or "",
        github_url=req.github_url,
        linkedin_url=req.linkedin_url,
        portfolio_url=req.portfolio_url,
        leetcode_url=req.leetcode_url
    )

@app.post("/evaluate-upload")
async def evaluate_upload(
    company_name: str = Form(...),
    target_role: Optional[str] = Form("Software Engineer"),
    experience_level: Optional[str] = Form("fresher"),
    dsa_solved: int = Form(...),
    cv_text: Optional[str] = Form(""),
    github_url: Optional[str] = Form(""),
    linkedin_url: Optional[str] = Form(""),
    portfolio_url: Optional[str] = Form(""),
    leetcode_url: Optional[str] = Form(""),
    cv_file: Optional[UploadFile] = File(None)
):
    combined_cv_text = cv_text or ""
    if cv_file and hasattr(cv_file, "read") and getattr(cv_file, "filename", None):
        file_bytes = await cv_file.read()
        if cv_file.filename.lower().endswith(".pdf"):
            extracted_pdf_text = extract_text_from_pdf(file_bytes)
            combined_cv_text = combined_cv_text + "\n" + extracted_pdf_text
        else:
            try:
                combined_cv_text = combined_cv_text + "\n" + file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                pass

    return compute_eligibility(
        company_name=company_name,
        target_role=target_role or "Software Engineer",
        experience_level=experience_level or "fresher",
        dsa_solved=dsa_solved,
        cv_text=combined_cv_text,
        github_url=github_url,
        linkedin_url=linkedin_url,
        portfolio_url=portfolio_url,
        leetcode_url=leetcode_url
    )
