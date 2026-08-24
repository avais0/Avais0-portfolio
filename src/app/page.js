"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const [projectFilter, setProjectFilter] = useState("all");
  const [activeCertImage, setActiveCertImage] = useState(null);
  const [activeCertTitle, setActiveCertTitle] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "certifications", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ submitting: false, success: true, error: null });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setSubmitStatus((prev) => ({ ...prev, success: false }));
        }, 5000);
      } else {
        setSubmitStatus({
          submitting: false,
          success: false,
          error: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (err) {
      setSubmitStatus({
        submitting: false,
        success: false,
        error: "Network error. Please check your connection and try again.",
      });
    }
  };

  // WhatsApp connection info
  const whatsappNumber = "923278228159";
  const whatsappMessage = "Hi Avais, I visited your portfolio and would love to connect!";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // --- TYPEWRITER CAROUSEL ---
  const roles = ["Full Stack Developer", "Next.js & React Specialist", "Computer Science Student"];
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const currentFullText = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setRoleText(currentFullText.substring(0, roleText.length + 1));
        setTypingSpeed(100);

        if (roleText === currentFullText) {
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        setRoleText(currentFullText.substring(0, roleText.length - 1));
        setTypingSpeed(50);

        if (roleText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(500);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex, typingSpeed]);

  // --- THEME CUSTOMIZER ---
  const themes = [
    {
      name: "Cyber Violet",
      id: "violet",
      colors: {
        "--accent-purple": "#a855f7",
        "--accent-blue": "#3b82f6",
        "--accent-cyan": "#06b6d4",
        "--grad-primary": "linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #f43f5e 100%)",
        "--accent-rose": "#f43f5e",
        "--bg-glow-rgb": "168, 85, 247"
      }
    },
    {
      name: "Emerald Matrix",
      id: "matrix",
      colors: {
        "--accent-purple": "#10b981",
        "--accent-blue": "#059669",
        "--accent-cyan": "#34d399",
        "--grad-primary": "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
        "--accent-rose": "#6ee7b7",
        "--bg-glow-rgb": "16, 185, 129"
      }
    },
    {
      name: "Sunset Amber",
      id: "sunset",
      colors: {
        "--accent-purple": "#f59e0b",
        "--accent-blue": "#ea580c",
        "--accent-cyan": "#fbbf24",
        "--grad-primary": "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #fbbf24 100%)",
        "--accent-rose": "#fcd34d",
        "--bg-glow-rgb": "245, 158, 11"
      }
    },
    {
      name: "Crimson Rose",
      id: "rose",
      colors: {
        "--accent-purple": "#f43f5e",
        "--accent-blue": "#be123c",
        "--accent-cyan": "#fda4af",
        "--grad-primary": "linear-gradient(135deg, #be123c 0%, #f43f5e 50%, #fda4af 100%)",
        "--accent-rose": "#fda4af",
        "--bg-glow-rgb": "244, 63, 94"
      }
    }
  ];

  const [activeTheme, setActiveTheme] = useState("violet");
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  const applyTheme = (themeId) => {
    setActiveTheme(themeId);
    const selected = themes.find(t => t.id === themeId);
    if (selected) {
      Object.entries(selected.colors).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
      localStorage.setItem("portfolio_theme", themeId);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  // --- DEVELOPER TERMINAL ---
  const [termInput, setTermInput] = useState("");
  const [termLines, setTermLines] = useState([
    { text: "Avais Ahmed Mehdi - DevConsole v1.0.0", type: "system" },
    { text: "Type 'help' to see list of available commands.", type: "system" },
    { text: "", type: "empty" }
  ]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = termInput.trim().toLowerCase();
    if (!cmd) return;

    const newLines = [...termLines, { text: `visitor@portfolio:~$ ${termInput}`, type: "prompt-output" }];

    switch (cmd) {
      case "help":
        newLines.push(
          { text: "Available commands:", type: "success" },
          { text: "  about    - Brief biography of Avais", type: "success" },
          { text: "  skills   - List detailed technical stack", type: "success" },
          { text: "  projects - Show highlighted projects & links", type: "success" },
          { text: "  contact  - Show mobile and email info", type: "success" },
          { text: "  whatsapp - Start direct WhatsApp conversation", type: "success" },
          { text: "  clear    - Clear console history", type: "success" }
        );
        break;
      case "about":
        newLines.push(
          { text: "Avais Ahmed Mehdi is a computer science undergraduate student at Federal Urdu University Karachi.", type: "info" },
          { text: "Passionate about full-stack web development, building high-performance APIs, and interactive client UIs.", type: "info" }
        );
        break;
      case "skills":
        newLines.push(
          { text: "Technical Skills Profile:", type: "success" },
          { text: "  Frontend: React, Next.js, Vite, HTML5, CSS3, JavaScript, TailwindCSS", type: "info" },
          { text: "  Backend: Node.js, Express.js, Serverless Routes", type: "info" },
          { text: "  Database: MongoDB, JSON Databases", type: "info" },
          { text: "  Tools: Git, GitHub, NPM, Vercel, VS Code", type: "info" }
        );
        break;
      case "projects":
        newLines.push(
          { text: "Highlighted Projects:", type: "success" },
          { text: "  1. MaintainIQ - AI QR Asset Tracker [Live: maintainiq-frontend-smit.vercel.app]", type: "info" },
          { text: "  2. MERN E-Commerce [GitHub: MERN-Stack-Ecommerce-website]", type: "info" },
          { text: "  3. SkyFlow Weather [Live: weather-app-flame-one-42.vercel.app]", type: "info" },
          { text: "  4. Expense Tracker [Live: avais0.github.io/Bill-generator]", type: "info" }
        );
        break;
      case "contact":
        newLines.push(
          { text: "Contact Details:", type: "success" },
          { text: "  Phone/WhatsApp: +92 327 8228159", type: "info" },
          { text: "  Email: Send a message through the form below!", type: "info" },
          { text: "  Location: Karachi, Pakistan", type: "info" }
        );
        break;
      case "whatsapp":
        newLines.push({ text: "Opening direct WhatsApp link...", type: "system" });
        if (typeof window !== "undefined") {
          window.open(`https://wa.me/${whatsappNumber}?text=Hi Avais, I visited your DevConsole!`, "_blank");
        }
        break;
      case "clear":
        setTermLines([]);
        setTermInput("");
        return;
      default:
        newLines.push({ text: `Command not found: '${cmd}'. Type 'help' for suggestions.`, type: "error" });
    }

    setTermLines(newLines);
    setTermInput("");

    setTimeout(() => {
      const termBody = document.getElementById("terminal-body");
      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }, 50);
  };

  // Projects list with images
  const projects = [
    {
      title: "MERN Stack E-Commerce Website",
      type: "fullstack",
      description: "An end-to-end e-commerce application featuring a clean Next.js/React storefront, custom components, authentication, context-driven state, and a robust Node/Express/MongoDB backend database system.",
      tags: ["React", "Next.js", "Express", "Node.js", "MongoDB", "Context API"],
      github: "https://github.com/avais0/MERN-Stack-Ecommerce-website",
      live: null,
      image: "/assets/ecommerce.png"
    },
    {
      title: "MaintainIQ - AI Asset History",
      type: "fullstack",
      description: "An AI-powered QR maintenance and asset history platform designed to centralize organization assets, enable instant reportable issues via QR codes, and provide AI-driven diagnostic recommendations.",
      tags: ["React", "Express", "Node.js", "MongoDB", "QR Scanner", "AI Diagnostics"],
      github: "https://github.com/avais0",
      live: "https://maintainiq-frontend-smit.vercel.app",
      image: "/assets/maintainiq.png",
      badge: "SMIT Hackathon",
      certificate: "/assets/cert_smit_hackathon.pdf"
    },
    {
      title: "SkyFlow Weather Application",
      type: "frontend",
      description: "A highly responsive weather forecast application utilizing a weather API to display real-time conditions, wind speeds, humidity, and multi-day forecasts with visual animations.",
      tags: ["Vite", "React", "JavaScript", "Weather API", "CSS Grid/Flexbox"],
      github: "https://github.com/avais0/weather-app",
      live: "https://weather-app-flame-one-42.vercel.app/",
      image: "/assets/weather_app.png"
    },
    {
      title: "Expense Tracker (Bill Generator)",
      type: "frontend",
      description: "A functional client-side bill generator and expense tracker to log transactions, compute sums, and generate downloadable receipt summaries with instant interface updates.",
      tags: ["HTML5", "CSS3", "JavaScript", "Local Storage", "Bill PDF Generator"],
      github: "https://github.com/avais0/Bill-generator",
      live: "https://avais0.github.io/Bill-generator/",
      image: "/assets/bill_generator.png"
    },
    {
      title: "GitHub User Search UI",
      type: "frontend",
      description: "An interface to search GitHub usernames and retrieve user profiles, stats, followers, and public repositories using the GitHub REST API, featuring a responsive layout and load animations.",
      tags: ["HTML5", "CSS3", "JavaScript", "GitHub API", "Responsive Layout"],
      github: "https://github.com/avais0/Github-User-Search-UI",
      live: "https://avais0.github.io/Github-User-Search-UI/",
      image: "/assets/github_search.png"
    }
  ];

  // Certifications list
  const certifications = [
    {
      title: "Coding Night-2026 (Hackathon)",
      issuer: "Saylani Welfare International Trust (SMIT)",
      date: "February 2026",
      desc: "Awarded for successful participation in the intensive 9-hour Coding Night-2026 Hackathon under the SMIT education department.",
      id: "SMIT/2026/HACKATHON/345853",
      duration: "9 Hours",
      image: "/assets/cert_smit_hackathon.png",
      pdf: "/assets/cert_smit_hackathon.pdf"
    },
    {
      title: "Smart Professional-Web Application Development with Python",
      issuer: "Aptech Computer Education",
      date: "March 2024",
      desc: "Completed professional certification course covering advanced web application development with Python, scoring distinction grades.",
      id: "Serial No: 524523",
      duration: "Distinction Grade",
      image: "/assets/cert_aptech.jpg",
      pdf: "/assets/cert_aptech.pdf"
    },
    {
      title: "Frontend Development Virtual Internship & LOR",
      issuer: "CodeAlpha",
      date: "August 2026",
      desc: "Completed a 1-month intensive Frontend Development Virtual Internship Program at CodeAlpha, designing responsive interfaces and earning a Letter of Recommendation (LOR).",
      id: "Student ID: CA/DF1/210039",
      duration: "1 Month (Jul - Aug 2026)",
      image: "/assets/cert_codealpha.jpg",
      pdf: "/assets/cert_codealpha.pdf",
      image2: "/assets/lor_codealpha.jpg",
      pdf2: "/assets/lor_codealpha.pdf"
    }
  ];

  const filteredProjects = projects.filter(
    (p) => projectFilter === "all" || p.type === projectFilter
  );

  return (
    <>
      {/* Theme Customizer */}
      <div className="theme-customizer">
        <button 
          className="theme-toggle-btn" 
          onClick={() => setThemePanelOpen(!themePanelOpen)}
          title="Customize Theme Color"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <div className={`theme-panel ${themePanelOpen ? "open" : ""}`}>
          <div className="theme-panel-title">Choose Accent</div>
          <div className="theme-options">
            {themes.map((t) => (
              <button 
                key={t.id} 
                className={`theme-opt-btn ${activeTheme === t.id ? "active" : ""}`}
                onClick={() => applyTheme(t.id)}
              >
                <span className={`theme-dot-indicator theme-dot-${t.id}`}></span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background Orbs */}
      <div className="glow-orb glow-orb-purple"></div>
      <div className="glow-orb glow-orb-blue"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <a href="#home" className="logo">
            AVAIS MEHDI<span className="logo-dot"></span>
          </a>
          
          <ul className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <li>
              <a
                href="#home"
                className={`nav-link ${activeSection === "home" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`nav-link ${activeSection === "about" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className={`nav-link ${activeSection === "skills" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={`nav-link ${activeSection === "projects" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#certifications"
                className={`nav-link ${activeSection === "certifications" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Certifications
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`nav-link ${activeSection === "contact" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/admin"
                className="btn btn-secondary"
                style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
              >
                Admin Panel
              </a>
            </li>
          </ul>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-subtitle">Welcome to my Portfolio</div>
              <h1 className="hero-title">
                Hi, I am <span className="text-gradient-accent">Avais Ahmed Mehdi</span>
              </h1>
              <div className="hero-role-carousel" style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--accent-cyan)", margin: "0.5rem 0 1.5rem 0", minHeight: "2.25rem", display: "flex", alignItems: "center" }}>
                <span>I'm a&nbsp;</span>
                <span style={{ borderRight: "2px solid var(--accent-cyan)", paddingRight: "4px" }}>{roleText}</span>
              </div>
              <p className="hero-description">
                I am an undergraduate Computer Science student at Urdu University Karachi. 
                I specialize in full-stack web development, building responsive, interactive, 
                and premium web applications with clean architecture and modern user experiences.
              </p>
              <div className="hero-ctas">
                <a href="#projects" className="btn btn-primary">
                  View My Work
                </a>
                <a href="#contact" className="btn btn-secondary">
                  Hire Me
                </a>
                <a 
                  href="/assets/cv.pdf" 
                  className="btn btn-secondary" 
                  download="Avais_Ahmed_Mehdi_CV.pdf"
                  title="Download Resume PDF"
                  style={{ gap: "6px" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download CV
                </a>
              </div>
            </div>
            <div className="hero-img-wrapper">
              <div className="hero-img-glow"></div>
              <div className="hero-img-container">
                <Image
                  className="hero-img"
                  src="/assets/profile.jpg"
                  alt="Avais Ahmed Mehdi Profile Picture"
                  width={300}
                  height={300}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Biography</div>
            <h2 className="section-title text-gradient">About Me</h2>
          </div>
          
          <div className="about-grid">
            <div className="about-text">
              <p>
                I am a passionate B.Sc. Computer Science undergraduate student. 
                I consider myself a highly responsible, motivated, and organized individual. 
                Having started my web development journey with foundational technologies like HTML, CSS, and JavaScript, 
                I have scaled my capabilities to construct modern full-stack websites (Next.js, Node/Express, and MongoDB).
              </p>
              <p>
                I am eager to apply my analytical and technical skills in real projects, gain industry experience, 
                and grow professionally in the IT field.
              </p>
              
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <a href="mailto:qarnibaltistani@gmail.com" className="info-val" style={{ color: "var(--accent-cyan)" }}>
                    qarnibaltistani@gmail.com
                  </a>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <a href="tel:+923278228159" className="info-val">
                    +92 327 8228159
                  </a>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-val">Karachi, Pakistan</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Languages</span>
                  <span className="info-val">English, Urdu, Balti</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: "1.5rem", fontSize: "1.4rem" }}>Education Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">Current</div>
                  <h4 className="timeline-title">Urdu University Karachi</h4>
                  <div className="timeline-inst">Bachelor of Science in Computer Science (In Progress)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">2023 - 2024</div>
                  <h4 className="timeline-title">Army Public School and College</h4>
                  <div className="timeline-inst">Intermediate (Pre-Engineering / ICS) - Lahore</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">2022 - 2023</div>
                  <h4 className="timeline-title">Ba'that High School</h4>
                  <div className="timeline-inst">Matriculation Secondary Education - Faisalabad</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dev Terminal */}
          <div className="dev-terminal-container">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="term-btn red"></span>
                  <span className="term-btn yellow"></span>
                  <span className="term-btn green"></span>
                </div>
                <div className="terminal-title">devconsole@avais-mehdi: ~</div>
                <div style={{ width: "42px" }}></div>
              </div>
              <div className="terminal-body" id="terminal-body">
                <div className="term-welcome">
                  Welcome to Avais Ahmed Mehdi's Interactive Terminal.
                  Type 'help' to see list of available commands.
                </div>
                {termLines.map((line, idx) => (
                  <div key={idx} className={`term-line ${line.type}`}>
                    {line.text}
                  </div>
                ))}
                <form onSubmit={handleTerminalSubmit} className="term-line prompt">
                  <span className="term-symbol">visitor@portfolio:~$</span>
                  <div className="term-input-wrapper">
                    <input 
                      type="text" 
                      className="term-input" 
                      value={termInput} 
                      onChange={(e) => setTermInput(e.target.value)}
                      placeholder="Type a command..."
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <span className="term-cursor-blink">_</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Superpowers</div>
            <h2 className="section-title text-gradient">My Skills</h2>
          </div>

          <div className="skills-grid">
            {/* Frontend Skills */}
            <div className="glass-card">
              <h3 className="skill-category-title">
                <svg className="skill-category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>
                Frontend Development
              </h3>
              <div className="skills-list">
                <span className="skill-chip">HTML5</span>
                <span className="skill-chip">CSS3</span>
                <span className="skill-chip">JavaScript (ES6+)</span>
                <span className="skill-chip">React.js</span>
                <span className="skill-chip">Next.js</span>
                <span className="skill-chip">Responsive Web Design</span>
                <span className="skill-chip">Vite Bundler</span>
              </div>
            </div>

            {/* Backend Skills */}
            <div className="glass-card">
              <h3 className="skill-category-title">
                <svg className="skill-category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
                Backend & Database
              </h3>
              <div className="skills-list">
                <span className="skill-chip">Node.js</span>
                <span className="skill-chip">Express.js</span>
                <span className="skill-chip">REST APIs</span>
                <span className="skill-chip">MongoDB</span>
                <span className="skill-chip">JSON Storage</span>
                <span className="skill-chip">Database Management</span>
              </div>
            </div>

            {/* Tools & Professional */}
            <div className="glass-card">
              <h3 className="skill-category-title">
                <svg className="skill-category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 12 12 16 14"></polygon></svg>
                Tools & Other
              </h3>
              <div className="skills-list">
                <span className="skill-chip">Git & GitHub</span>
                <span className="skill-chip">NPM Package Manager</span>
                <span className="skill-chip">Command Line Interface</span>
                <span className="skill-chip">Slide Presentations</span>
                <span className="skill-chip">Problem Solving</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">My Creations</div>
            <h2 className="section-title text-gradient">Recent Projects</h2>
          </div>

          <div className="project-filters">
            <button
              className={`filter-btn ${projectFilter === "all" ? "active" : ""}`}
              onClick={() => setProjectFilter("all")}
            >
              All Projects
            </button>
            <button
              className={`filter-btn ${projectFilter === "frontend" ? "active" : ""}`}
              onClick={() => setProjectFilter("frontend")}
            >
              Frontend
            </button>
            <button
              className={`filter-btn ${projectFilter === "fullstack" ? "active" : ""}`}
              onClick={() => setProjectFilter("fullstack")}
            >
              Full-Stack
            </button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project, idx) => (
              <div key={idx} className="glass-card project-card" style={{ padding: "0" }}>
                {/* Project Screenshot Display */}
                <div className="project-img-wrapper">
                  {project.image ? (
                    <Image
                      className="project-img"
                      src={project.image}
                      alt={`${project.title} Screenshot`}
                      width={400}
                      height={200}
                      unoptimized
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>No UI Preview</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "0 2rem 2rem 2rem", display: "flex", flexDirection: "column", flexGrow: "1" }}>
                  <div className="project-meta">
                    <span className="project-type">
                      {project.type === "fullstack" ? "Full Stack" : "Frontend"}
                    </span>
                    {project.badge && (
                      <span className="project-badge" style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: "rgba(6, 182, 212, 0.15)",
                        color: "var(--accent-cyan)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        fontWeight: "600",
                        marginLeft: "0.5rem"
                      }}>
                        {project.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags.map((t, i) => (
                      <span key={i} className="project-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-links" style={{ marginTop: "auto" }}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      GitHub
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Live Demo
                      </a>
                    )}
                    {project.certificate && (
                      <a
                        href={project.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Credentials</div>
            <h2 className="section-title text-gradient">Certifications</h2>
          </div>

          <div className="certs-grid">
            {certifications.map((cert, idx) => (
              <div key={idx} className="glass-card cert-card" style={{ padding: "0" }}>
                <div 
                  className="cert-img-wrapper" 
                  onClick={() => {
                    setActiveCertImage(cert.image);
                    setActiveCertTitle(cert.title);
                  }}
                  title="Click to Zoom Preview"
                >
                  <Image 
                    className="cert-img" 
                    src={cert.image} 
                    alt={`${cert.title} Preview`}
                    width={400}
                    height={220}
                    unoptimized
                  />
                  <div className="cert-img-overlay">
                    <div className="cert-zoom-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </div>
                  </div>
                </div>

                <div className="cert-card-content">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <h3 className="cert-title">{cert.title}</h3>
                  <span className="cert-date">{cert.date}</span>
                  <p className="cert-desc">{cert.desc}</p>

                  <div className="cert-meta-info">
                    <div className="cert-meta-row">
                      <span className="cert-meta-label">Credential ID</span>
                      <span className="cert-meta-val">{cert.id}</span>
                    </div>
                    <div className="cert-meta-row">
                      <span className="cert-meta-label">Details</span>
                      <span className="cert-meta-val">{cert.duration}</span>
                    </div>
                  </div>

                  <div className="cert-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: "0.5rem 0.5rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                        onClick={() => {
                          setActiveCertImage(cert.image);
                          setActiveCertTitle(cert.title);
                        }}
                      >
                        {cert.image2 ? "View Certificate" : "View"}
                      </button>
                      <a 
                        href={cert.pdf} 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: "0.5rem 0.5rem", fontSize: "0.85rem", textAlign: "center", whiteSpace: "nowrap", display: "inline-block" }}
                        download
                      >
                        {cert.pdf2 ? "Download PDF" : "Download"}
                      </a>
                    </div>

                    {cert.pdf2 && (
                      <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ flex: 1, padding: "0.5rem 0.5rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                          onClick={() => {
                            setActiveCertImage(cert.image2);
                            setActiveCertTitle(cert.title + " (LOR)");
                          }}
                        >
                          View LOR
                        </button>
                        <a 
                          href={cert.pdf2} 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: "0.5rem 0.5rem", fontSize: "0.85rem", textAlign: "center", whiteSpace: "nowrap", display: "inline-block" }}
                          download
                        >
                          Download LOR
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Get In Touch</div>
            <h2 className="section-title text-gradient">Contact Me</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-card-info">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Let's discuss your next project!</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Feel free to reach out if you have a project idea, want to collaborate on open-source code, 
                or have any questions about my profile. I usually respond within 24 hours.
              </p>

              {/* Email Contact info */}
              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <div className="contact-info-title">Email Me</div>
                  <a href="mailto:qarnibaltistani@gmail.com" className="contact-info-value" style={{ color: "var(--accent-cyan)" }}>
                    qarnibaltistani@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp Contact info */}
              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper" style={{ background: "rgba(37, 211, 102, 0.1)", color: "#25d366", borderColor: "rgba(37, 211, 102, 0.2)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.883-6.972C16.634 1.912 14.159.887 11.53.887c-5.442 0-9.87 4.422-9.874 9.86-.001 1.762.463 3.483 1.347 5.014l-.995 3.636 3.72-.976zM17.47 14.39c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.38.24-.7.08-1.66-.83-2.85-1.47-3.99-3.42-.25-.43.25-.4.71-1.32.07-.13.03-.24-.02-.34-.05-.1-0.45-1.09-.62-1.49-.17-.4-.36-.34-.5-.34h-.42c-.15 0-.38.06-.58.28-.2.22-.76.75-.76 1.83 0 1.08.79 2.13.9 2.28.11.15 1.56 2.39 3.79 3.36 1.73.75 2.45.86 3.33.72.53-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.1-.26-.16-.58-.32z"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-info-title">WhatsApp Chat</div>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-info-value" style={{ color: "#25d366" }}>
                    +92 327 8228159
                  </a>
                </div>
              </div>

              {/* Call Contact info */}
              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <div className="contact-info-title">Call Me</div>
                  <a href="tel:+923278228159" className="contact-info-value">
                    +92 327 8228159
                  </a>
                </div>
              </div>

              {/* Location Contact info */}
              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <div className="contact-info-title">Location</div>
                  <div className="contact-info-value">Lines area Karachi, Pakistan</div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Subject of message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                {submitStatus.success && (
                  <div className="form-status success">
                    ✔ Message sent successfully! Thank you.
                  </div>
                )}

                {submitStatus.error && (
                  <div className="form-status error">
                    ✖ {submitStatus.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus.submitting}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  {submitStatus.submitting ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat with me on WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "2px" }}>
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.883-6.972C16.634 1.912 14.159.887 11.53.887c-5.442 0-9.87 4.422-9.874 9.86-.001 1.762.463 3.483 1.347 5.014l-.995 3.636 3.72-.976zM17.47 14.39c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.38.24-.7.08-1.66-.83-2.85-1.47-3.99-3.42-.25-.43.25-.4.71-1.32.07-.13.03-.24-.02-.34-.05-.1-0.45-1.09-.62-1.49-.17-.4-.36-.34-.5-.34h-.42c-.15 0-.38.06-.58.28-.2.22-.76.75-.76 1.83 0 1.08.79 2.13.9 2.28.11.15 1.56 2.39 3.79 3.36 1.73.75 2.45.86 3.33.72.53-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.1-.26-.16-.58-.32z"/>
        </svg>
        <span>Chat on WhatsApp</span>
      </a>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Avais Ahmed Mehdi. All rights reserved.</p>
            <p>Designed and built with Next.js & Vanilla CSS</p>
          </div>
        </div>
      </footer>

      {/* Certificate Modal Overlay */}
      {activeCertImage && (
        <div className={`cert-modal ${activeCertImage ? "open" : ""}`} onClick={() => setActiveCertImage(null)}>
          <div className="cert-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <span className="cert-modal-title">{activeCertTitle}</span>
              <button className="cert-modal-close-btn" onClick={() => setActiveCertImage(null)} aria-label="Close modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="cert-modal-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cert-modal-img" src={activeCertImage} alt="Certificate Zoomed Preview" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
