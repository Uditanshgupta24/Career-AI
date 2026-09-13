const COMPANY_CONFIG = {
  "Google": { role: "Software Engineer (L3/L4)", targetDsa: 400, tier: "Tier 1 Product" },
  "Microsoft": { role: "Software Development Engineer (SDE I/II)", targetDsa: 350, tier: "Tier 1 Product" },
  "Amazon": { role: "Software Development Engineer (SDE I)", targetDsa: 350, tier: "Tier 1 Product" },
  "Meta": { role: "Software Engineer (E3/E4)", targetDsa: 400, tier: "Tier 1 Product" },
  "Apple": { role: "Software Engineer (ICT2/ICT3)", targetDsa: 320, tier: "Tier 1 Product" },
  "Uber": { role: "Software Engineer II", targetDsa: 380, tier: "High Scale Product" },
  "Infosys": { role: "Specialist Programmer / DSE", targetDsa: 100, tier: "Digital Specialist" },
  "TCS": { role: "Digital / Prime Engineer", targetDsa: 90, tier: "Digital / Prime" },
  "Wipro": { role: "Turbo / Project Engineer", targetDsa: 80, tier: "Turbo / Elite" }
};

let activeTab = "pdf";
let selectedFile = null;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const compParam = urlParams.get('company');
  if (compParam && COMPANY_CONFIG[compParam]) {
    selectCompanyCard(compParam);
  } else {
    onCompanySelectDropdown();
  }
});

function selectCompanyCard(companyName) {
  const dropdown = document.getElementById("company");
  if (dropdown) {
    dropdown.value = companyName;
  }

  document.querySelectorAll('.picker-card').forEach(card => {
    const cardTitle = card.querySelector('h4');
    if (cardTitle && cardTitle.innerText.trim().toLowerCase() === companyName.toLowerCase()) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  onCompanySelectDropdown();
}

function onCompanySelectDropdown() {
  const dropdown = document.getElementById("company");
  if (!dropdown) return;

  const company = dropdown.value;
  const customGroup = document.getElementById("customCompanyGroup");

  if (company === "custom") {
    if (customGroup) customGroup.style.display = "block";
    document.getElementById("dsaBarStatus").innerText = "Target bar for custom company: 250+ problems";
    return;
  } else {
    if (customGroup) customGroup.style.display = "none";
  }

  const info = COMPANY_CONFIG[company] || { role: "Software Engineer", targetDsa: 200, tier: "Tier 1" };
  document.getElementById("dsaBarStatus").innerText = `Target bar for ${company}: ${info.targetDsa}+ problems`;

  document.querySelectorAll('.picker-card').forEach(card => {
    const cardTitle = card.querySelector('h4');
    if (cardTitle && cardTitle.innerText.trim().toLowerCase() === company.toLowerCase()) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function setRole(roleName, btn) {
  document.querySelectorAll('.role-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const roleInput = document.getElementById("targetRole");
  if (roleName === 'custom') {
    roleInput.value = "";
    roleInput.focus();
    roleInput.placeholder = "Type your custom job role here...";
  } else {
    roleInput.value = roleName;
  }
}

function setExpLevel(lvl, btn) {
  document.querySelectorAll('.exp-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById("experienceLevel").value = lvl;
}

function syncDsaFromSlider(val) {
  document.getElementById("dsaSolved").value = val;
}

function syncDsaFromInput(val) {
  const slider = document.getElementById("dsaSlider");
  if (val <= 600) {
    slider.value = val;
  }
}

function switchCvTab(tab) {
  activeTab = tab;
  document.getElementById("tabPdfBtn").classList.toggle("active", tab === "pdf");
  document.getElementById("tabTextBtn").classList.toggle("active", tab === "text");
  document.getElementById("pdfUploadContainer").classList.toggle("active", tab === "pdf");
  document.getElementById("textUploadContainer").classList.toggle("active", tab === "text");
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile = file;
    document.getElementById("dropzoneText").innerHTML = `
      <div class="selected-file-pill">
        <span>📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        <button type="button" class="remove-file-btn" onclick="removeSelectedFile(event)">✕</button>
      </div>
    `;
  }
}

function removeSelectedFile(e) {
  e.stopPropagation();
  selectedFile = null;
  document.getElementById("cvFile").value = "";
  document.getElementById("dropzoneText").innerHTML = `<strong>Click to upload</strong> or drag and drop your CV PDF here`;
}

// Drag & drop
const dropzone = document.getElementById("dropzone");
if (dropzone) {
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--google-blue)";
    dropzone.style.background = "var(--google-blue-surface)";
  });
  dropzone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#dadce0";
    dropzone.style.background = "#fafbfc";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#dadce0";
    dropzone.style.background = "#fafbfc";
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
      document.getElementById("cvFile").files = e.dataTransfer.files;
      document.getElementById("dropzoneText").innerHTML = `
        <div class="selected-file-pill">
          <span>📄 ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)</span>
          <button type="button" class="remove-file-btn" onclick="removeSelectedFile(event)">✕</button>
        </div>
      `;
    }
  });
}

// 1-Click Sample Profiles
function loadSampleProfile(type) {
  if (type === 'google_sde') {
    selectCompanyCard('Google');
    document.getElementById("targetRole").value = "Software Engineer (SDE)";
    document.getElementById("dsaSolved").value = 410;
    document.getElementById("dsaSlider").value = 410;
    document.getElementById("githubUrl").value = "https://github.com/alex-google-dev";
    document.getElementById("linkedinUrl").value = "https://linkedin.com/in/alex-engineer";
    document.getElementById("leetcodeUrl").value = "https://leetcode.com/alex_coder";
    document.getElementById("portfolioUrl").value = "https://alexdev.io";
    
    switchCvTab('text');
    document.getElementById("cvText").value = `Alex Sharma | Software Engineer Candidate
Education: B.Tech in Computer Science (CGPA: 9.1/10)
Core Competencies: C++, Java, Python, DSA, Dynamic Programming, Graphs, Trees, System Design, Operating Systems, DBMS, SQL, Computer Networks, Git.
Projects:
1. Distributed Key-Value Store: Built distributed caching in C++ with consistent hashing, handling 25,000 req/sec.
2. Scalable Cloud Service: Architected Python FastAPI backend with Docker and Redis caching.`;

  } else if (type === 'meta_frontend') {
    selectCompanyCard('Meta');
    document.getElementById("targetRole").value = "Frontend Engineer / React Developer";
    document.getElementById("dsaSolved").value = 320;
    document.getElementById("dsaSlider").value = 320;
    document.getElementById("githubUrl").value = "https://github.com/priya-frontend";
    document.getElementById("linkedinUrl").value = "https://linkedin.com/in/priya-frontend-dev";
    document.getElementById("leetcodeUrl").value = "https://leetcode.com/priya_codes";
    document.getElementById("portfolioUrl").value = "https://priyaui.dev";

    switchCvTab('text');
    document.getElementById("cvText").value = `Priya Patel | Senior Frontend Engineer
Core Competencies: JavaScript, TypeScript, React, Next.js, Redux, Tailwind, HTML, CSS, Web Performance, REST API, Git, DSA.
Projects:
1. Real-Time Collaborative Canvas: Built React + TypeScript canvas app handling 60fps renders with WebSocket synchronization.
2. E-Commerce Next.js Storefront: Engineered sub-second Core Web Vitals (LCP < 1.2s) with server-side rendering and CDN caching.`;

  } else if (type === 'amazon_backend') {
    selectCompanyCard('Amazon');
    document.getElementById("targetRole").value = "Backend Engineer";
    document.getElementById("dsaSolved").value = 360;
    document.getElementById("dsaSlider").value = 360;
    document.getElementById("githubUrl").value = "https://github.com/rahul-backend";
    document.getElementById("linkedinUrl").value = "https://linkedin.com/in/rahul-cloud";
    document.getElementById("leetcodeUrl").value = "https://leetcode.com/rahul_aws";
    document.getElementById("portfolioUrl").value = "";

    switchCvTab('text');
    document.getElementById("cvText").value = `Rahul Varma | Backend & Cloud Systems
Technical Skills: Java, Python, AWS, SQL, DBMS, REST API, System Design, Docker, Redis, Microservices, OOP, Git, DSA.
Projects:
1. High-Throughput Payment Gateway: Java Spring Boot microservice handling 10k transactions/min with Kafka event streams and MySQL replication.`;

  } else if (type === 'tcs_fresher') {
    selectCompanyCard('TCS');
    document.getElementById("targetRole").value = "Digital / Prime Engineer";
    document.getElementById("dsaSolved").value = 95;
    document.getElementById("dsaSlider").value = 95;
    document.getElementById("githubUrl").value = "https://github.com/ananya-tech";
    document.getElementById("linkedinUrl").value = "https://linkedin.com/in/ananya-tcs";
    document.getElementById("leetcodeUrl").value = "";
    document.getElementById("portfolioUrl").value = "";

    switchCvTab('text');
    document.getElementById("cvText").value = `Ananya Sen | College Graduate
Education: B.Tech (CGPA: 8.4/10)
Technical Skills: C, C++, Java, Python, SQL, DBMS, OOP, HTML, CSS, JavaScript, Git, Data Structures Basics.
Projects:
1. Student Result Processing System: Web-based portal with Java & MySQL database.`;
  }
}

function clearForm() {
  document.getElementById("evaluationForm").reset();
  removeSelectedFile({ stopPropagation: () => {} });
  onCompanySelectDropdown();
}

async function handleEvaluate(event) {
  event.preventDefault();

  let company = document.getElementById("company").value;
  if (company === "custom") {
    const customComp = document.getElementById("customCompany").value.trim();
    if (!customComp) {
      alert("Please enter your custom company name.");
      return;
    }
    company = customComp;
  }

  const targetRole = document.getElementById("targetRole").value.trim() || "Software Engineer";
  const expLevel = document.getElementById("experienceLevel").value || "fresher";
  const dsaSolved = parseInt(document.getElementById("dsaSolved").value) || 0;
  const githubUrl = document.getElementById("githubUrl").value.trim();
  const linkedinUrl = document.getElementById("linkedinUrl").value.trim();
  const leetcodeUrl = document.getElementById("leetcodeUrl").value.trim();
  const portfolioUrl = document.getElementById("portfolioUrl").value.trim();
  const cvText = document.getElementById("cvText").value.trim();

  if (activeTab === "pdf" && !selectedFile && !cvText) {
    alert("Please upload your CV PDF or click '✍️ Paste Resume Text' to continue.");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");

  submitBtn.disabled = true;
  btnText.innerText = `Analyzing Profile for ${targetRole}...`;
  btnSpinner.style.display = "inline-block";

  try {
    const formData = new FormData();
    formData.append("company_name", company);
    formData.append("target_role", targetRole);
    formData.append("experience_level", expLevel);
    formData.append("dsa_solved", dsaSolved);
    formData.append("github_url", githubUrl);
    formData.append("linkedin_url", linkedinUrl);
    formData.append("leetcode_url", leetcodeUrl);
    formData.append("portfolio_url", portfolioUrl);
    formData.append("cv_text", cvText);

    if (activeTab === "pdf" && selectedFile) {
      formData.append("cv_file", selectedFile);
    }

    const response = await fetch("http://127.0.0.1:8000/evaluate-upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Server error during evaluation");
    }

    const data = await response.json();
    renderResults(data);

    const resultEl = document.getElementById("resultContainer");
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (err) {
    console.warn("Backend API unavailable, using high-precision Standalone Client Engine:", err);
    const clientResult = evaluateClientSide(company, targetRole, expLevel, dsaSolved, cvText, githubUrl, linkedinUrl, leetcodeUrl, portfolioUrl);
    renderResults(clientResult);
    const resultEl = document.getElementById("resultContainer");
    if (resultEl) resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } finally {
    submitBtn.disabled = false;
    btnText.innerText = "Evaluate Readiness & Generate Roadmap";
    btnSpinner.style.display = "none";
  }
}

function renderResults(data) {
  const container = document.getElementById("resultContainer");
  container.style.display = "block";

  const matchedHtml = data.matched_skills.length > 0 
    ? data.matched_skills.map(s => `<span class="chip matched">✓ ${s}</span>`).join("")
    : `<span style="color:var(--text-secondary); font-size:13px;">No explicit matched skills found</span>`;

  const missingHtml = data.missing_skills.length > 0
    ? data.missing_skills.map(s => `<span class="chip missing">⚠ ${s}</span>`).join("")
    : `<span class="chip matched">✓ All role skills covered!</span>`;

  const questionsHtml = data.interview_questions.map((q, idx) => `
    <div class="question-item">
      <div class="question-text">${idx + 1}. ${q.q}</div>
      <span class="question-type-badge">${q.type}</span>
    </div>
  `).join("");

  const roadmapHtml = data.roadmap.map((phase, pIdx) => `
    <div class="timeline-phase-block">
      <div class="timeline-node"></div>
      <div class="timeline-phase-header">
        <span class="phase-pill">${phase.phase}</span>
        <span class="phase-time">⏱ ${phase.duration}</span>
      </div>
      <div class="phase-heading">${phase.title}</div>
      <ul class="interactive-checklist">
        ${phase.steps.map((step, sIdx) => `
          <li>
            <input type="checkbox" class="step-checkbox" id="step_${pIdx}_${sIdx}">
            <label for="step_${pIdx}_${sIdx}">${step}</label>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");

  container.innerHTML = `
    <!-- Top Card: Company Verdict, Salary Insights & Circular Score Gauge -->
    <div class="result-header-card">
      <div>
        <span class="company-badge-pill">${data.tier}</span>
        <span class="salary-tag-chip">💰 Est. CTC: ${data.salary_range}</span>
        <h2 class="result-company-name">${data.company}</h2>
        <div class="result-role-name">Targeting: <strong>${data.role}</strong> (${data.experience_level})</div>
        <div class="verdict-callout">
          <strong>Readiness Verdict:</strong> ${data.verdict}
        </div>
      </div>

      <div class="score-gauge-box">
        <div class="score-circle ${data.status_type}">
          ${data.eligibility_percentage}%
        </div>
        <div class="status-badge ${data.status_type}">
          ${data.status_label}
        </div>
      </div>
    </div>

    <!-- 4 Metrics Breakdown -->
    <div class="breakdown-row">
      <div class="metric-card">
        <h5>DSA Problem Bar</h5>
        <div class="metric-num">${data.score_breakdown.dsa.score}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${data.score_breakdown.dsa.percentage}%;"></div>
        </div>
        <div class="metric-sub">${data.score_breakdown.dsa.user_solved} / ${data.score_breakdown.dsa.target_solved} solved (${data.score_breakdown.dsa.percentage}%)</div>
      </div>

      <div class="metric-card">
        <h5>${data.role.split('/')[0]} Tech Stack</h5>
        <div class="metric-num">${data.score_breakdown.skills.score}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${data.score_breakdown.skills.percentage}%;"></div>
        </div>
        <div class="metric-sub">${data.score_breakdown.skills.matched_count} of ${data.score_breakdown.skills.total_required} required skills</div>
      </div>

      <div class="metric-card">
        <h5>GitHub & Projects</h5>
        <div class="metric-num">${data.score_breakdown.github_projects.score}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${data.score_breakdown.github_projects.percentage}%;"></div>
        </div>
        <div class="metric-sub">${data.score_breakdown.github_projects.has_github ? "✓ GitHub Linked" : "✗ GitHub Missing"}</div>
      </div>

      <div class="metric-card">
        <h5>Presence & LeetCode</h5>
        <div class="metric-num">${data.score_breakdown.profile_presence.score}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${data.score_breakdown.profile_presence.percentage}%;"></div>
        </div>
        <div class="metric-sub">${data.score_breakdown.profile_presence.has_leetcode ? "✓ LeetCode" : "✗ LeetCode"} | ${data.score_breakdown.profile_presence.has_linkedin ? "✓ LinkedIn" : "✗ LinkedIn"}</div>
      </div>
    </div>

    <!-- Skills Comparison -->
    <div class="skills-comparison-card">
      <h3>Tech Stack Analysis for ${data.role} at ${data.company}</h3>
      <div class="skills-split">
        <div class="skill-bucket">
          <h4 style="color:var(--google-green);">Matched Strengths (${data.matched_skills.length})</h4>
          <div class="skill-chips">${matchedHtml}</div>
        </div>
        <div class="skill-bucket">
          <h4 style="color:#b06000;">Gaps & Recommended Focus (${data.missing_skills.length})</h4>
          <div class="skill-chips">${missingHtml}</div>
        </div>
      </div>
    </div>

    <!-- Top 5 Real Interview Questions -->
    <div class="questions-card">
      <h3>Top 5 Expected Interview Questions for ${data.role} at ${data.company}</h3>
      <div class="questions-list">
        ${questionsHtml}
      </div>
    </div>

    <!-- Actionable Roadmap with Interactive Checkboxes -->
    <div class="roadmap-card">
      <div class="roadmap-top-bar">
        <div>
          <h3>Your 12-Week ${data.company} Preparation Plan</h3>
          <p>Check off milestones as you complete them to track your journey.</p>
        </div>
        <button class="action-btn-secondary" onclick="window.print()">
          🖨️ Print / Save Roadmap
        </button>
      </div>

      <div class="timeline">
        ${roadmapHtml}
      </div>
    </div>
  `;
}

// ==========================================
// STANDALONE CLIENT-SIDE EVALUATION ENGINE
// (Enables seamless functionality on GitHub Pages without local backend)
// ==========================================
function evaluateClientSide(company, targetRole, expLevel, dsaSolved, cvText, githubUrl, linkedinUrl, leetcodeUrl, portfolioUrl) {
  const companyInfo = COMPANY_CONFIG[company] || { role: targetRole || "Software Engineer", targetDsa: 250, tier: "Tech Company" };
  const targetDsa = companyInfo.targetDsa;
  
  // Weights by experience
  let dsaMax = 35.0, skillsMax = 30.0, projMax = 20.0, presenceMax = 15.0;
  if (expLevel === 'mid') {
    dsaMax = 25.0; skillsMax = 35.0; projMax = 25.0; presenceMax = 15.0;
  } else if (expLevel === 'senior') {
    dsaMax = 20.0; skillsMax = 40.0; projMax = 25.0; presenceMax = 15.0;
  }

  // DSA Score
  const dsaRatio = Math.min(Math.max(0, dsaSolved) / targetDsa, 1.0);
  const dsaScore = Math.round(dsaRatio * dsaMax * 10) / 10;

  // Skills matching
  const knownSkills = [
    "c++", "java", "python", "javascript", "typescript", "react", "nextjs", "html", "css", 
    "sql", "dbms", "system design", "docker", "redis", "dsa", "git", "aws", "azure", "cloud",
    "linux", "microservices", "rest api", "oop", "operating systems", "computer networks"
  ];
  
  const textLower = " " + (cvText || "").toLowerCase() + " ";
  const matchedSkills = knownSkills.filter(s => textLower.includes(s));
  const missingSkills = knownSkills.filter(s => !matchedSkills.includes(s)).slice(0, 5);

  const skillScore = Math.round(Math.min((matchedSkills.length / 8), 1.0) * skillsMax * 10) / 10;

  // GitHub & Projects
  let githubScore = 0.0;
  const hasGithub = Boolean(githubUrl && githubUrl.toLowerCase().includes("github.com"));
  if (hasGithub) githubScore += 10.0;
  else if (githubUrl) githubScore += 5.0;

  const projectKeywords = ["project", "developed", "built", "full stack", "api", "database", "microservice", "react", "deployed"];
  const hits = projectKeywords.filter(kw => textLower.includes(kw)).length;
  githubScore += Math.min(hits * 1.5, projMax - 10.0);
  githubScore = Math.round(Math.min(githubScore, projMax) * 10) / 10;

  // Online Presence
  let presenceScore = 0.0;
  const hasLinkedin = Boolean(linkedinUrl && linkedinUrl.toLowerCase().includes("linkedin.com"));
  if (hasLinkedin) presenceScore += 6.0;

  const hasPortfolio = Boolean(portfolioUrl && portfolioUrl.includes("."));
  if (hasPortfolio) presenceScore += 5.0;

  const hasLeetcode = Boolean(leetcodeUrl && (leetcodeUrl.includes("leetcode.com") || leetcodeUrl.includes("codeforces.com") || leetcodeUrl.includes("geeksforgeeks.org")));
  if (hasLeetcode) presenceScore += 4.0;
  presenceScore = Math.round(Math.min(presenceScore, presenceMax) * 10) / 10;

  // Total Percentage
  let totalPercentage = Math.round(dsaScore + skillScore + githubScore + presenceScore);
  totalPercentage = Math.min(Math.max(totalPercentage, 10), 98);

  let statusLabel = "Preparation Needed", statusType = "low";
  if (totalPercentage >= 80) {
    statusLabel = "Interview Ready / High Eligibility";
    statusType = "high";
  } else if (totalPercentage >= 60) {
    statusLabel = "Competitive Contender";
    statusType = "medium";
  } else if (totalPercentage >= 40) {
    statusLabel = "Developing Candidate";
    statusType = "moderate";
  }

  const salaries = {
    "Google": "₹25 - 45 LPA",
    "Microsoft": "₹22 - 42 LPA",
    "Amazon": "₹24 - 44 LPA",
    "Meta": "₹28 - 50 LPA",
    "Apple": "₹22 - 40 LPA",
    "Uber": "₹26 - 48 LPA",
    "Infosys": "₹6.5 - 9.5 LPA",
    "TCS": "₹7 - 9 LPA",
    "Wipro": "₹6.5 - 8.5 LPA"
  };

  const questions = [
    { q: `Solve: How would you optimize tree and graph traversals for ${company} scale?`, type: "DSA" },
    { q: `Design an LRU Cache with O(1) get and put operations in your preferred language.`, type: "Coding & LLD" },
    { q: `How would you architect a distributed rate-limiter or caching layer for ${targetRole}?`, type: "System Design" },
    { q: `Explain database indexing, ACID transactions, and query optimization.`, type: "Database" },
    { q: `Tell me about a time you handled a severe production issue under tight deadline.`, type: "Behavioral" }
  ];

  const dsaGap = Math.max(0, targetDsa - dsaSolved);

  return {
    company: company,
    tier: companyInfo.tier || "Tier 1 Product",
    role: targetRole,
    experience_level: expLevel.charAt(0).toUpperCase() + expLevel.slice(1),
    salary_range: salaries[company] || "₹18 - 35 LPA",
    eligibility_percentage: totalPercentage,
    status_label: statusLabel,
    status_type: statusType,
    verdict: `Evaluated for ${targetRole} at ${company}. Profile shows ${statusLabel.toLowerCase()} alignment with target hiring bar.`,
    score_breakdown: {
      dsa: { score: `${dsaScore}/${Math.round(dsaMax)}`, user_solved: dsaSolved, target_solved: targetDsa, percentage: Math.round((dsaScore / dsaMax) * 100) },
      skills: { score: `${skillScore}/${Math.round(skillsMax)}`, matched_count: matchedSkills.length, total_required: 8, percentage: Math.round((skillScore / skillsMax) * 100) },
      github_projects: { score: `${githubScore}/${Math.round(projMax)}`, has_github: hasGithub, percentage: Math.round((githubScore / projMax) * 100) },
      profile_presence: { score: `${presenceScore}/${Math.round(presenceMax)}`, has_linkedin: hasLinkedin, has_portfolio: hasPortfolio, has_leetcode: hasLeetcode, percentage: Math.round((presenceScore / presenceMax) * 100) }
    },
    matched_skills: matchedSkills.map(s => s.toUpperCase()),
    missing_skills: missingSkills.map(s => s.toUpperCase()),
    interview_questions: questions,
    roadmap: [
      {
        phase: "Phase 1",
        title: `Coding Bar & Core Algorithms (${dsaSolved}/${targetDsa} solved)`,
        duration: "Weeks 1 - 4",
        steps: [
          `Target: Solve at least ${dsaGap} more high-yield questions on LeetCode/GFG.`,
          `Focus on patterns vital for ${targetRole} (HashMaps, Trees, Graphs, Two Pointers).`,
          `Practice explaining time/space complexities out loud in under 25 minutes.`
        ]
      },
      {
        phase: "Phase 2",
        title: `${targetRole} Tech Stack & Architecture`,
        duration: "Weeks 5 - 8",
        steps: [
          `Master Missing Core Skills: ${missingSkills.join(", ")}.`,
          `Design Patterns & System Architecture: Scalability, API design, and Database optimization.`,
          `Review Operating Systems, Database indexing, and Network protocols.`
        ]
      },
      {
        phase: "Phase 3",
        title: "Production-Grade Projects & Portfolio Branding",
        duration: "Weeks 9 - 10",
        steps: [
          `Build or polish a flagship project tailored for ${targetRole} with clean Git commits and live deployment.`,
          `Add automated unit tests and architectural documentation to your GitHub repositories.`,
          `Update LinkedIn and Portfolio highlighting measurable impact metrics.`
        ]
      },
      {
        phase: "Phase 4",
        title: `${company} Interview Sprints & Mock Rounds`,
        duration: "Weeks 11 - 12",
        steps: [
          `Practice online assessment formats and time-pressured coding rounds.`,
          `Conduct 3+ peer mock interviews simulating live coding pressure.`,
          `Master behavioral questions using the STAR framework tailored for company leadership principles.`
        ]
      }
    ]
  };
}
