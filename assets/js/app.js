/* ============================== Application state ============================== */

(() => {
  "use strict";

  const data = window.RESUME_DATA;
  if (!data) return;

  let currentLanguage = data.defaultLanguage || "fa";
  let activeProjectFilter = "all";

  const byId = (id) => document.getElementById(id);
  const text = (value) => typeof value === "string" ? value : (value?.[currentLanguage] ?? "");
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  /* ============================== Content rendering ============================== */

  function renderStaticLabels() {
    const labels = data.ui;
    const labelMap = {
      "profile-window-title": labels.title,
      "profile-eyebrow": labels.eyebrow,
      "courses-heading": labels.courses,
      "certificates-heading": labels.certificates,
      "summary-heading": labels.summary,
      "education-heading": labels.education,
      "languages-heading": labels.languages,
      "projects-heading": labels.projects,
      "experience-heading": labels.experience,
      "skills-heading": labels.skills,
      "portfolio-heading": labels.projects,
      "print-label": labels.print
    };

    Object.entries(labelMap).forEach(([id, value]) => {
      const element = byId(id);
      if (element) element.textContent = text(value);
    });

    byId("profile-heading").textContent = text(data.personal.name);
    byId("profile-role").textContent = text(data.personal.role);
    byId("summary-text").textContent = text(data.summary);
    byId("language-toggle").textContent = currentLanguage === "fa" ? "EN" : "فا";
    byId("language-toggle").setAttribute("aria-label", currentLanguage === "fa" ? "Switch to English" : "تغییر زبان به فارسی");
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "fa" ? "rtl" : "ltr";
    document.documentElement.dataset.lang = currentLanguage;
    document.title = `${text(data.personal.name)} | ${text(labels.title)}`;
    document.querySelector('meta[name="description"]').content = currentLanguage === "fa"
      ? `رزومه ${text(data.personal.name)}، ${text(data.personal.role)}`
      : `Resume of ${text(data.personal.name)}, ${text(data.personal.role)}`;
  }

  function renderContact() {
    const labels = data.ui;
    const rows = [
      { icon: "☎", label: labels.contactPhone, href: `tel:${data.personal.phone}`, value: text(data.personal.phoneDisplay) },
      { icon: "✉", label: labels.contactEmail, href: `mailto:${data.personal.email}`, value: data.personal.email },
      { icon: "◎", label: labels.contactGithub, href: data.personal.github, value: "Alin-kakaei", external: true }
    ];

    byId("contact-list").innerHTML = rows.map((item) => `
      <a class="contact-item" href="${escapeHTML(item.href)}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="contact-icon" aria-hidden="true">${item.icon}</span>
        <span class="contact-copy"><span class="contact-label">${escapeHTML(text(item.label))}</span><span class="contact-value" dir="ltr">${escapeHTML(item.value)}</span></span>
        <span class="contact-arrow" aria-hidden="true">↗</span>
      </a>
    `).join("");
  }

  function renderExperience() {
    byId("experience-list").innerHTML = data.experience.map((item) => `
      <article class="simple-entry">
        <h3>${escapeHTML(text(item.title))}</h3>
        <p class="entry-subtitle">${escapeHTML(text(item.organization))}</p>
        <p>${escapeHTML(text(item.description))}</p>
      </article>
    `).join("");
  }

  function renderEducation() {
    byId("education-list").innerHTML = data.education.map((item) => `
      <article class="simple-entry">
        <h3>${escapeHTML(text(item.institution))}</h3>
        <p class="entry-subtitle">${escapeHTML(text(item.degree))}</p>
        <div class="entry-meta"><span>${escapeHTML(text(item.status))}</span><strong>${escapeHTML(text(item.grade))}</strong></div>
      </article>
    `).join("");
  }

  function renderCourses() {
    byId("courses-list").innerHTML = data.courses.map((item) => `
      <article class="simple-entry">
        <div class="entry-heading-row"><h3>${escapeHTML(text(item.title))}</h3>${item.date[currentLanguage] !== "—" ? `<span class="entry-date">${escapeHTML(text(item.date))}</span>` : ""}</div>
        <p>${escapeHTML(text(item.description))}</p>
      </article>
    `).join("");
  }

  function renderLanguages() {
    byId("languages-list").innerHTML = data.languages.map((item) => `
      <div class="language-entry">
        <span class="language-dot" aria-hidden="true"></span>
        <div><h3>${escapeHTML(text(item.name))}</h3><p>${escapeHTML(text(data.ui.level))}: ${escapeHTML(text(item.level))}</p></div>
      </div>
    `).join("");
  }

  function renderSkills() {
    byId("skills-list").innerHTML = data.skills.map((group) => `
      <section class="skill-group">
        <h3>${escapeHTML(text(group.title))}</h3>
        <ul class="skill-list">${group.items.map((item) => `<li>${escapeHTML(text(item))}</li>`).join("")}</ul>
      </section>
    `).join("");
  }

  function renderCertificates() {
    byId("certificates-list").innerHTML = data.certificates.map((item) => `
      <article class="certificate-entry">
        <span class="certificate-symbol" aria-hidden="true">✦</span>
        <div><h3>${escapeHTML(text(item.title))}</h3><p>${escapeHTML(text(item.description))}</p></div>
      </article>
    `).join("");
  }

  function projectMarkup(project) {
    const detailsId = `details-${project.id}`;
    const filterData = project.categories.join(" ");
    return `
      <article class="project-card" data-project-card data-categories="${escapeHTML(filterData)}">
        <button class="project-toggle" type="button" aria-expanded="false" aria-controls="${detailsId}">
          <span class="project-cursor" aria-hidden="true">↗</span>
          <span class="project-heading-wrap"><span class="project-title">${escapeHTML(text(project.title))}</span><span class="project-date">${escapeHTML(text(project.date))}</span></span>
          <span class="project-plus" aria-hidden="true">+</span>
        </button>
        <div class="project-details" id="${detailsId}" hidden>
          <p>${escapeHTML(text(project.description))}</p>
          <div class="tag-list">${project.tags.map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
          ${project.link ? `<a class="project-link" href="${escapeHTML(project.link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(text(project.linkLabel))}<span aria-hidden="true">↗</span></a>` : ""}
        </div>
      </article>
    `;
  }

  function renderProjects() {
    byId("main-project-list").innerHTML = data.projects.filter((project) => project.group === "main").map(projectMarkup).join("");
    byId("portfolio-project-list").innerHTML = data.projects.filter((project) => project.group === "portfolio").map(projectMarkup).join("");
    renderProjectFilters();
    applyProjectFilter();
  }

  function renderProjectFilters() {
    byId("project-filters").innerHTML = data.filters.map((filter) => `
      <button class="filter-button" type="button" data-filter="${escapeHTML(filter.id)}" aria-pressed="${filter.id === activeProjectFilter}">${escapeHTML(text(filter.label))}</button>
    `).join("");
  }

  function applyProjectFilter() {
    document.querySelectorAll("[data-project-card]").forEach((card) => {
      const categories = card.dataset.categories.split(" ");
      card.hidden = activeProjectFilter !== "all" && !categories.includes(activeProjectFilter);
    });
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activeProjectFilter));
    });
  }

  function renderPrintResume() {
    const labels = data.ui;
    const printText = (value) => escapeHTML(text(value));
    const contactItems = [
      { label: labels.contactPhone, value: text(data.personal.phoneDisplay), href: `tel:${data.personal.phone}` },
      { label: labels.contactEmail, value: data.personal.email, href: `mailto:${data.personal.email}` },
      { label: labels.contactGithub, value: "Alin-kakaei", href: data.personal.github }
    ];

    const renderEntry = (title, subtitle, description, meta = "") => `
      <article class="print-entry">
        <div class="print-entry-heading"><h3>${printText(title)}</h3>${meta ? `<span class="print-meta">${escapeHTML(meta)}</span>` : ""}</div>
        ${subtitle ? `<p class="print-entry-subtitle">${printText(subtitle)}</p>` : ""}
        ${description ? `<p class="print-entry-description">${printText(description)}</p>` : ""}
      </article>
    `;

    const experience = data.experience.map((item) => renderEntry(item.title, item.organization, item.description)).join("");
    const education = data.education.map((item) => `
      <article class="print-entry">
        <div class="print-entry-heading"><h3>${printText(item.institution)}</h3><span class="print-meta">${printText(item.grade)}</span></div>
        <p class="print-entry-subtitle">${printText(item.degree)}</p>
        <p class="print-entry-description">${printText(item.status)}</p>
      </article>
    `).join("");
    const courses = data.courses.map((item) => renderEntry(item.title, "", item.description, item.date[currentLanguage] === "—" ? "" : text(item.date))).join("");
    const certificates = data.certificates.map((item) => renderEntry(item.title, "", item.description)).join("");
    const skills = data.skills.map((group) => `
      <section class="print-skill-group">
        <h3>${printText(group.title)}</h3>
        <p>${group.items.map((item) => printText(item)).join(" · ")}</p>
      </section>
    `).join("");
    const languages = data.languages.map((item) => `
      <div class="print-language-entry"><strong>${printText(item.name)}</strong><span>${printText(item.level)}</span></div>
    `).join("");
    const projects = data.projects.map((item) => `
      <tr class="print-project-row"><td>
        <article class="print-project-card">
          <div class="print-project-heading"><h3>${printText(item.title)}</h3><span class="print-meta">${printText(item.date)}</span></div>
          <p class="print-entry-description">${printText(item.description)}</p>
          <p class="print-project-tags">${item.tags.map((tag) => escapeHTML(tag)).join(" · ")}</p>
          ${item.link ? `<a class="print-project-link" href="${escapeHTML(item.link)}">${printText(item.linkLabel || item.link)}</a>` : ""}
        </article>
      </td></tr>
    `).join("");

    byId("print-resume").innerHTML = `
      <article class="print-page print-overview-page">
        <header class="print-header">
          <div class="print-header-title">
            <p class="print-kicker">${printText(labels.eyebrow)}</p>
            <h1>${printText(data.personal.name)}</h1>
            <p class="print-role">${printText(data.personal.role)}</p>
          </div>
          <div class="print-contact-list">
            ${contactItems.map((item) => `<a class="print-contact-item" href="${escapeHTML(item.href)}"><span>${printText(item.label)}</span><strong>${escapeHTML(item.value)}</strong></a>`).join("")}
          </div>
        </header>

        <section class="print-summary print-section">
          <h2>${printText(labels.summary)}</h2>
          <p>${printText(data.summary)}</p>
        </section>

        <div class="print-overview-grid">
          <div class="print-primary-column">
            <section class="print-section"><h2>${printText(labels.experience)}</h2>${experience || `<p class="print-empty">—</p>`}</section>
            <section class="print-section"><h2>${printText(labels.education)}</h2>${education || `<p class="print-empty">—</p>`}</section>
            <section class="print-section"><h2>${printText(labels.courses)}</h2>${courses || `<p class="print-empty">—</p>`}</section>
            <section class="print-section"><h2>${printText(labels.certificates)}</h2>${certificates || `<p class="print-empty">—</p>`}</section>
          </div>
          <aside class="print-sidebar-column">
            <section class="print-section"><h2>${printText(labels.skills)}</h2>${skills || `<p class="print-empty">—</p>`}</section>
            <section class="print-section"><h2>${printText(labels.languages)}</h2>${languages || `<p class="print-empty">—</p>`}</section>
          </aside>
        </div>
      </article>

      <article class="print-page print-projects-page">
        <table class="print-project-table">
          <thead><tr><th>
            <header class="print-page-heading">
              <div><p class="print-kicker">${printText(data.personal.name)}</p><h2>${printText(labels.projects)}</h2></div>
              <span class="print-page-mark">02</span>
            </header>
          </th></tr></thead>
          <tbody>${projects || `<tr><td><p class="print-empty">—</p></td></tr>`}</tbody>
        </table>
      </article>
    `;
  }

  function renderAll() {
    renderStaticLabels();
    renderContact();
    renderExperience();
    renderEducation();
    renderCourses();
    renderLanguages();
    renderSkills();
    renderCertificates();
    renderProjects();
    renderPrintResume();
    refreshRevealObserver();
  }

  /* ============================== Interaction handlers ============================== */

  function setLanguage(language) {
    currentLanguage = language;
    renderAll();
  }

  function handleProjectClick(event) {
    const toggle = event.target.closest(".project-toggle");
    if (toggle) {
      const details = byId(toggle.getAttribute("aria-controls"));
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      details.hidden = isExpanded;
      toggle.querySelector(".project-plus").textContent = isExpanded ? "+" : "−";
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      activeProjectFilter = filterButton.dataset.filter;
      applyProjectFilter();
    }
  }

  function handleLanguageClick() {
    setLanguage(currentLanguage === "fa" ? "en" : "fa");
  }

  function handlePrint() {
    window.print();
  }

  /* ============================== Reveal animations ============================== */

  let revealObserver;

  function refreshRevealObserver() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });

    revealItems.forEach((item) => {
      item.classList.remove("is-visible");
      revealObserver.observe(item);
    });
  }

  /* ============================== Initialization ============================== */

  function initialize() {
    document.body.classList.add("js-enabled");
    byId("language-toggle").addEventListener("click", handleLanguageClick);
    byId("print-button").addEventListener("click", handlePrint);
    byId("main-column").addEventListener("click", handleProjectClick);
    byId("work-column").addEventListener("click", handleProjectClick);
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", initialize, { once: true });
})();
