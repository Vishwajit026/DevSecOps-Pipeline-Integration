# 🛡️ Automated DevSecOps CI/CD Security Pipeline Integration

---

### 📋 CODTECH IT SOLUTIONS — INTERNSHIP SUBMISSION DETAILS

* **INTERN ID**: **CIS102**
* **FULL NAME**: **Vishwajit Rawlo**
* **DOMAIN**: Cyber Security & Ethical Hacking
* **DURATION / NO. OF WEEKS**: 4 Weeks
* **PROJECT NAME**: **DEVSECOPS PIPELINE INTEGRATION**
* **MENTOR / GUIDANCE**: CodTech IT Solutions Assessment Board

---

## 📌 Project Overview & Scope

The **DevSecOps Pipeline Integration** project implements an enterprise-grade automated "Security-as-Code" quality gate within a continuous integration and continuous deployment (CI/CD) workflow using **GitHub Actions**.

In modern agile development, manual security reviews cause deployment bottlenecks, while unvetted commits risk introducing credential leaks, insecure libraries, or vulnerable container configurations into production environments. This project solves this challenge by shifting security leftward ("Shift-Left Security"), embedding automated vulnerability scanning directly into the developer git lifecycle.

Every `git push` or `pull_request` triggers a multi-stage automated security gauntlet that evaluates:
1. **Secret Detection**: Preventing API keys, tokens, and private certificates from leaking into git history.
2. **Static Application Security Testing (SAST)**: Scanning source code patterns against the OWASP Top 10 vulnerabilities (SQL injection, XSS, unsafe deserialization).
3. **Software Composition Analysis (SCA)**: Auditing external dependencies in `package.json` against known National Vulnerability Database (NVD) CVE entries.
4. **Container & Infrastructure-as-Code (IaC) Hardening**: Linting Dockerfiles against CIS Docker Benchmarks and scanning final container images for OS-level vulnerabilities.
5. **Automated Quality Gate Compliance Summary**: Generating centralized audit artifacts directly within the pipeline telemetry dashboard.

---

## 🏗️ Architecture & Pipeline Flow

```text
[ Developer Git Push / PR to Main ]
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🔑 STAGE 1: Secret Scanning (TruffleHog OSS)               │
│ Checks commit tree for leaked API keys, tokens & credentials│
└──────────────────────────────┬──────────────────────────────┘
                               │ (Pass)
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                  PARALLEL SECURITY GATES                    │
├──────────────────────────────┬──────────────────────────────┤
│ 🛡️ STAGE 2: SAST (Semgrep)    │ 📦 STAGE 3: SCA (Aqua Trivy) │
│ - OWASP Top 10 Ruleset       │ - Analyzes npm dependencies  │
│ - Security Audit Rules       │ - Cross-references CVE DB    │
│ - Exports SARIF artifact     │ - Enforces High/Crit SLA     │
└──────────────────────────────┴──────────────────────────────┘
                               │ (Pass)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🐳 STAGE 4: Container & Dockerfile Hardening                │
│ - Hadolint: Lints Dockerfile for CIS benchmarks & non-root  │
│ - Docker Build: Builds hardened multi-stage image           │
│ - Trivy Image Scan: Validates base OS layer integrity       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Pass)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 📊 STAGE 5: Security Compliance Audit Summary               │
│ Generates executive markdown summary in GitHub Step Summary │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧰 Security Tooling Matrix

| Stage | Security Capability | Tool / Engine | Purpose & Policy Baseline |
| :---: | :--- | :--- | :--- |
| **1** | **Secret Detection** | **TruffleHog OSS** | High-entropy regex and verified secret scanning across entire Git history. |
| **2** | **SAST Code Audit** | **Semgrep Engine** | Semantic code analysis evaluating against OWASP Top 10 and CWE standards. |
| **3** | **SCA Dependency Audit**| **Aqua Security Trivy** | Detects known vulnerabilities in third-party runtime dependencies. |
| **4** | **Dockerfile Linting** | **Hadolint** | Enforces Dockerfile best practices (no root user, explicit pin tags). |
| **5** | **Container Image Scan**| **Trivy Image Scanner** | Deep layer inspection of Alpine Linux base libraries for CVEs. |
| **6** | **Quality Gate Audit** | **GitHub Step Summary** | Centralized pass/fail audit report for compliance tracking. |

---

## 📂 Project Directory Structure

```text
devsecops-pipeline-integration/
├── .github/
│   └── workflows/
│       └── devsecops-pipeline.yml   # Multi-stage automated GitHub Actions workflow
├── src/
│   ├── app.js                       # Express microservice with Helmet & Rate Limiting
│   └── server.js                    # Server startup and graceful termination
├── tests/
│   └── app.test.js                  # Native automated health & validation unit tests
├── Dockerfile                       # Multi-stage, non-root hardened containerfile
├── .dockerignore                    # Excludes secrets & non-essential files from build
├── .gitignore                       # Prevents local artifacts from entering Git
├── package.json                     # Dependency manifests & script definitions
├── trivy.yaml                       # Aqua Trivy scanner policy & severity configuration
└── README.md                        # CodTech project documentation & audit guide
```

---

## 💻 Microservice Security Architecture

The companion Node.js microservice (`src/app.js`) is constructed following **Defense-in-Depth** principles:
* **HTTP Security Headers**: Enforced via `helmet` including strict Content-Security-Policy (CSP), HSTS (`max-age=31536000`), and `X-Frame-Options: DENY`.
* **Rate Limiting**: Distributed IP throttling (`express-rate-limit`) preventing brute-force password spraying and API denial-of-service.
* **Payload Size Constraints**: JSON parser limited to 10kb to prevent heap exhaustion.
* **Non-Root Execution**: Docker container drops root privileges, running strictly as unprivileged user `node` (UID 1000).
* **Safe Parameterized Patterns**: Eliminates dynamic SQL concatenation or unvalidated shell exec patterns.

---

## ⚡ How to Run Locally

### 1. Run Unit Tests & Security Audit
```bash
# Navigate to project directory
cd devsecops-pipeline-integration

# Install dependencies
npm install

# Run automated tests
npm test

# Run local dependency security audit
npm run security:audit
```

### 2. Build & Verify Docker Container Security
```bash
# Build the hardened container image
docker build -t devsecops-microservice .

# Run the container locally
docker run -d -p 3000:3000 --name devsecops-app devsecops-microservice

# Verify health endpoint
curl http://localhost:3000/health
```

---

## 📈 CI/CD Pipeline Execution Evidence

When pushed to GitHub, the workflow automatically executes all 5 stages in sequence:
* **TruffleHog**: Scans the git diff; verified clean (0 credentials found).
* **Semgrep**: Scans AST syntax; certified compliant with OWASP Top 10 rules.
* **Trivy**: Scans `package-lock.json`; 0 High/Critical unpatched vulnerabilities.
* **Hadolint & Docker**: Passes containerfile rules, enforces non-root execution.
* **Summary**: Step Summary generates certification table for audit logs.
