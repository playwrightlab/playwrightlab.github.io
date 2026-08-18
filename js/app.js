/* =============================================
   PlayLab — Main Application JavaScript
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".section-header, .card").forEach((el) => observer.observe(el));

  // ===== NAVBAR =====
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a[href^="#"], .dropdown-menu a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Explore tour — scrolls through each section every 3 seconds
  let tourInterval = null;
  const exploreTourBtn = document.getElementById("exploreTourBtn");

  function stopTour() {
    if (tourInterval) {
      clearInterval(tourInterval);
      tourInterval = null;
      exploreTourBtn.innerHTML = '<ion-icon name="rocket-outline"></ion-icon> Explore';
    }
  }

  exploreTourBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const sections = document.querySelectorAll("section.section");
    let idx = 0;
    if (tourInterval) {
      stopTour();
      return;
    }
    exploreTourBtn.innerHTML = '<ion-icon name="stop"></ion-icon> Stop Tour';
    sections[idx].scrollIntoView({ behavior: "smooth" });
    idx++;
    tourInterval = setInterval(() => {
      if (idx >= sections.length) {
        stopTour();
        return;
      }
      sections[idx].scrollIntoView({ behavior: "smooth" });
      idx++;
    }, 3000);
  });

  document.addEventListener("click", () => {
    stopTour();
  });
  window.addEventListener(
    "wheel",
    () => {
      stopTour();
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    () => {
      stopTour();
    },
    { passive: true },
  );

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const savedTheme = localStorage.getItem("playlab-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeIcon.innerHTML = savedTheme === "dark" ? '<ion-icon name="sunny-outline"></ion-icon>' : '<ion-icon name="moon-outline"></ion-icon>';

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("playlab-theme", next);
    themeIcon.innerHTML = next === "dark" ? '<ion-icon name="sunny-outline"></ion-icon>' : '<ion-icon name="moon-outline"></ion-icon>';
  });

  // ===== HERO STATS ANIMATION =====
  function animateCounter(el, target) {
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 30);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(document.getElementById("statSections"), 19);
        animateCounter(document.getElementById("statElements"), 200);
        animateCounter(document.getElementById("statPatterns"), 65);
        statsObserver.disconnect();
      }
    });
  });
  statsObserver.observe(document.querySelector(".hero-stats"));

  // ===== REGISTRATION FORM =====
  const regForm = document.getElementById("registrationForm");
  const formSuccess = document.getElementById("formSuccess");

  // Password toggle
  document.querySelector(".toggle-password").addEventListener("click", () => {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
  });

  // Password strength
  document.getElementById("password").addEventListener("input", (e) => {
    const val = e.target.value;
    const bar = document.getElementById("strengthBar");
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    const colors = ["#ef4444", "#f59e0b", "#06b6d4", "#10b981"];
    const widths = ["25%", "50%", "75%", "100%"];
    bar.style.width = val.length === 0 ? "0" : widths[strength - 1] || "25%";
    bar.style.background = colors[strength - 1] || "#ef4444";
  });

  // Character count
  document.getElementById("bio").addEventListener("input", (e) => {
    const count = e.target.value.length;
    document.querySelector('[data-testid="char-count"]').textContent = `${count}/200`;
  });

  // Form validation
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const terms = document.getElementById("terms");

    // Clear errors
    document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));

    if (!name.value.trim()) {
      document.querySelector('[data-testid="error-fullname"]').textContent = "Name is required";
      name.classList.add("error");
      valid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.querySelector('[data-testid="error-email"]').textContent = "Valid email is required";
      email.classList.add("error");
      valid = false;
    }

    if (password.value.length < 8) {
      document.querySelector('[data-testid="error-password"]').textContent = "Password must be at least 8 characters";
      password.classList.add("error");
      valid = false;
    }

    if (!terms.checked) {
      document.querySelector('[data-testid="error-terms"]').textContent = "You must accept the terms";
      valid = false;
    }

    if (valid) {
      regForm.classList.add("hidden");
      formSuccess.classList.remove("hidden");
    }
  });

  regForm.addEventListener("reset", () => {
    document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
    document.getElementById("strengthBar").style.width = "0";
    document.querySelector('[data-testid="char-count"]').textContent = "0/200";
    formSuccess.classList.add("hidden");
    regForm.classList.remove("hidden");
  });

  // ===== SLIDERS =====
  document.getElementById("volumeSlider").addEventListener("input", (e) => {
    document.getElementById("volumeValue").textContent = e.target.value;
  });

  document.getElementById("priceRange").addEventListener("input", (e) => {
    document.getElementById("priceValue").textContent = e.target.value;
  });

  document.getElementById("colorPicker").addEventListener("input", (e) => {
    document.getElementById("colorDisplay").textContent = e.target.value;
  });

  // ===== FILE UPLOAD =====
  const uploadZone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      const item = document.createElement("div");
      item.className = "file-item";
      item.setAttribute("data-testid", `file-item-${file.name}`);
      const sizeKB = (file.size / 1024).toFixed(1);
      item.innerHTML = `
                <span><ion-icon name="document-outline"></ion-icon> ${sanitize(file.name)} (${sizeKB} KB)</span>
                <button class="file-remove" data-testid="remove-${file.name}" aria-label="Remove file">&times;</button>
            `;
      item.querySelector(".file-remove").addEventListener("click", () => item.remove());
      fileList.appendChild(item);
    });
  }

  // ===== AUTO-SUGGEST (suggestions removed from DOM on blur, needs "Emulate focused page" to inspect) =====
  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Dart", "R", "Perl", "Haskell", "Elixir", "Clojure", "Lua"];
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.getElementById("autocompleteList");
  const selectedTags = document.getElementById("selectedTags");
  const selectedLangs = new Set();

  function renderSuggestions() {
    autocompleteList.innerHTML = "";
    const query = searchInput.value.toLowerCase();
    if (!query) return;
    const matches = languages.filter((l) => l.toLowerCase().includes(query) && !selectedLangs.has(l));
    matches.forEach((lang) => {
      const item = document.createElement("div");
      item.className = "autocomplete-option";
      item.setAttribute("role", "option");
      item.setAttribute("data-testid", `autocomplete-option-${lang.toLowerCase()}`);
      item.textContent = lang;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selectedLangs.add(lang);
        searchInput.value = "";
        renderTags();
        renderSuggestions();
      });
      autocompleteList.appendChild(item);
    });
    if (matches.length === 0) {
      const noRes = document.createElement("div");
      noRes.className = "autocomplete-no-results";
      noRes.textContent = "No results found";
      autocompleteList.appendChild(noRes);
    }
  }

  searchInput.addEventListener("focus", () => {
    renderSuggestions();
  });

  searchInput.addEventListener("input", () => {
    renderSuggestions();
  });

  searchInput.addEventListener("blur", () => {
    autocompleteList.innerHTML = "";
  });

  function renderTags() {
    selectedTags.innerHTML = "";
    selectedLangs.forEach((lang) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.setAttribute("data-testid", `tag-${lang.toLowerCase()}`);
      tag.innerHTML = `${sanitize(lang)} <button class="tag-remove" data-testid="remove-tag-${lang.toLowerCase()}">&times;</button>`;
      tag.querySelector(".tag-remove").addEventListener("click", () => {
        selectedLangs.delete(lang);
        renderTags();
      });
      selectedTags.appendChild(tag);
    });
  }

  // ===== MULTI-SELECT =====
  document.getElementById("multiSelect").addEventListener("change", (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.text);
    document.getElementById("selectedFrameworks").textContent = selected.length ? `Selected: ${selected.join(", ")}` : "";
  });

  // ===== CUSTOM DROPDOWN (Click-to-open) =====
  const customDropdown = document.getElementById("customDropdown");
  const customDropdownTrigger = document.getElementById("customDropdownTrigger");
  const customDropdownValue = document.getElementById("customDropdownValue");
  const customDropdownMenu = document.getElementById("customDropdownMenu");

  customDropdownTrigger.addEventListener("click", () => {
    customDropdown.classList.toggle("open");
  });

  customDropdownMenu.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      customDropdownMenu.querySelectorAll("li").forEach((item) => item.classList.remove("selected"));
      li.classList.add("selected");
      customDropdownValue.textContent = li.textContent.trim();
      customDropdown.classList.remove("open");
      document.getElementById("customDropdownResult").textContent = `Selected: ${li.dataset.value}`;
    });
  });

  document.addEventListener("click", (e) => {
    if (!customDropdown.contains(e.target)) customDropdown.classList.remove("open");
  });

  // ===== SEARCHABLE DROPDOWN =====
  const searchableDropdown = document.getElementById("searchableDropdown");
  const searchableInput = document.getElementById("searchableDropdownInput");
  const searchableMenu = document.getElementById("searchableDropdownMenu");
  const cityItems = searchableMenu.querySelectorAll("li");

  searchableInput.addEventListener("focus", () => {
    searchableDropdown.classList.add("open");
  });

  searchableInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    let hasVisible = false;
    cityItems.forEach((li) => {
      const match = li.textContent.toLowerCase().includes(query);
      li.classList.toggle("hidden", !match);
      if (match) hasVisible = true;
    });
    const existing = searchableMenu.querySelector(".no-results");
    if (!hasVisible && !existing) {
      const noRes = document.createElement("li");
      noRes.className = "no-results";
      noRes.textContent = "No results found";
      searchableMenu.appendChild(noRes);
    } else if (hasVisible && existing) {
      existing.remove();
    }
    searchableDropdown.classList.add("open");
  });

  cityItems.forEach((li) => {
    li.addEventListener("click", () => {
      cityItems.forEach((item) => item.classList.remove("selected"));
      li.classList.add("selected");
      searchableInput.value = li.textContent;
      searchableDropdown.classList.remove("open");
      document.getElementById("searchableDropdownResult").textContent = `Selected: ${li.dataset.value}`;
    });
  });

  document.addEventListener("click", (e) => {
    if (!searchableDropdown.contains(e.target)) searchableDropdown.classList.remove("open");
  });

  // ===== GROUPED OPTIONS DROPDOWN =====
  document.getElementById("groupedSelect").addEventListener("change", (e) => {
    const opt = e.target.selectedOptions[0];
    const group = opt.parentElement.tagName === "OPTGROUP" ? opt.parentElement.label : "";
    document.getElementById("groupedSelectResult").textContent = e.target.value ? `Selected: ${opt.text}${group ? ` (${group})` : ""}` : "";
  });

  // ===== CASCADING DROPDOWNS =====
  const cascadeData = {
    asia: {
      countries: { japan: ["Tokyo", "Osaka", "Kyoto"], india: ["Mumbai", "Delhi", "Bangalore"], china: ["Beijing", "Shanghai", "Shenzhen"] },
    },
    europe: {
      countries: { uk: ["London", "Manchester", "Edinburgh"], france: ["Paris", "Lyon", "Nice"], germany: ["Berlin", "Munich", "Hamburg"] },
    },
    americas: {
      countries: { usa: ["New York", "Los Angeles", "Chicago"], canada: ["Toronto", "Vancouver", "Montreal"], brazil: ["São Paulo", "Rio de Janeiro", "Brasília"] },
    },
  };

  const cascadeContinent = document.getElementById("cascadeContinent");
  const cascadeCountry = document.getElementById("cascadeCountry");
  const cascadeCity = document.getElementById("cascadeCity");

  cascadeContinent.addEventListener("change", () => {
    const continent = cascadeContinent.value;
    cascadeCountry.innerHTML = '<option value="">Select country...</option>';
    cascadeCity.innerHTML = '<option value="">Select country first...</option>';
    cascadeCity.disabled = true;
    cascadeCountry.disabled = !continent;
    document.getElementById("cascadeResult").textContent = "";
    if (continent && cascadeData[continent]) {
      Object.keys(cascadeData[continent].countries).forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        opt.setAttribute("data-testid", `country-${c}`);
        cascadeCountry.appendChild(opt);
      });
    }
  });

  cascadeCountry.addEventListener("change", () => {
    const continent = cascadeContinent.value;
    const country = cascadeCountry.value;
    cascadeCity.innerHTML = '<option value="">Select city...</option>';
    cascadeCity.disabled = !country;
    document.getElementById("cascadeResult").textContent = "";
    if (continent && country && cascadeData[continent].countries[country]) {
      cascadeData[continent].countries[country].forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = city;
        opt.setAttribute("data-testid", `city-${opt.value}`);
        cascadeCity.appendChild(opt);
      });
    }
  });

  cascadeCity.addEventListener("change", () => {
    if (cascadeCity.value) {
      document.getElementById("cascadeResult").textContent =
        `Selected: ${cascadeContinent.selectedOptions[0].text} → ${cascadeCountry.selectedOptions[0].text} → ${cascadeCity.selectedOptions[0].text}`;
    }
  });

  // ===== CHECKBOX DROPDOWN (Multi-select with checkboxes) =====
  const checkboxDropdown = document.getElementById("checkboxDropdown");
  const checkboxDropdownTrigger = document.getElementById("checkboxDropdownTrigger");
  const checkboxDropdownValue = document.getElementById("checkboxDropdownValue");
  const checkboxDropdownMenu = document.getElementById("checkboxDropdownMenu");

  checkboxDropdownTrigger.addEventListener("click", () => {
    checkboxDropdown.classList.toggle("open");
  });

  checkboxDropdownMenu.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const checked = Array.from(checkboxDropdownMenu.querySelectorAll('input[type="checkbox"]:checked')).map((c) => c.value);
      checkboxDropdownValue.textContent = checked.length ? checked.join(", ") : "Select toppings...";
      document.getElementById("checkboxDropdownResult").textContent = checked.length ? `Selected: ${checked.join(", ")}` : "";
    });
  });

  document.addEventListener("click", (e) => {
    if (!checkboxDropdown.contains(e.target)) checkboxDropdown.classList.remove("open");
  });

  // ===== DISABLED OPTIONS DROPDOWN =====
  document.getElementById("disabledOptSelect").addEventListener("change", (e) => {
    document.getElementById("disabledOptResult").textContent = e.target.value ? `Selected: ${e.target.selectedOptions[0].text}` : "";
  });

  // ===== FOCUS-GATED DROPDOWN (OrangeHRM-style: options in DOM only while focused) =====
  const focusInput = document.getElementById("focusDropdownInput");
  const focusWrapper = document.getElementById("focusDropdown");
  const focusText = document.getElementById("focusDropdownText");
  const focusOptions = ["Software Engineer", "QA Lead", "DevOps Engineer", "Product Manager", "UI/UX Designer", "Data Analyst", "Scrum Master", "CTO"];
  let focusListOpen = false;

  function openFocusList() {
    if (focusListOpen) return;
    focusListOpen = true;
    const listEl = document.createElement("div");
    listEl.className = "oxd-select-dropdown";
    listEl.setAttribute("role", "listbox");
    listEl.setAttribute("data-testid", "focus-dropdown-list");
    focusOptions.forEach((label) => {
      const item = document.createElement("div");
      item.className = "oxd-select-option";
      item.setAttribute("role", "option");
      item.setAttribute("data-testid", "focus-opt-" + label.toLowerCase().replace(/[\s\/]+/g, "-"));
      item.textContent = label;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        focusInput.textContent = label;
        document.getElementById("focusDropdownResult").textContent = "Selected: " + label;
        closeFocusList();
      });
      listEl.appendChild(item);
    });
    focusWrapper.appendChild(listEl);
    focusWrapper.classList.add("oxd-select--open");
  }

  function closeFocusList() {
    focusListOpen = false;
    const listEl = focusWrapper.querySelector(".oxd-select-dropdown");
    if (listEl) listEl.remove();
    focusWrapper.classList.remove("oxd-select--open");
  }

  focusText.addEventListener("click", () => {
    if (focusListOpen) {
      closeFocusList();
    } else {
      openFocusList();
    }
  });

  document.addEventListener("click", (e) => {
    if (focusListOpen && !focusWrapper.contains(e.target)) {
      closeFocusList();
    }
  });

  // ===== DELAYED DROPDOWN =====
  document.getElementById("loadDelayedDropdownBtn").addEventListener("click", () => {
    const btn = document.getElementById("loadDelayedDropdownBtn");
    const loader = document.getElementById("delayedDropdownLoader");
    const select = document.getElementById("delayedSelect");
    btn.disabled = true;
    btn.textContent = "Loading...";
    loader.classList.remove("hidden");
    setTimeout(() => {
      const options = [
        { value: "electronics", text: "Electronics" },
        { value: "clothing", text: "Clothing" },
        { value: "books", text: "Books" },
        { value: "sports", text: "Sports & Outdoors" },
        { value: "home", text: "Home & Garden" },
      ];
      select.innerHTML = '<option value="">Select a category...</option>';
      options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.text;
        o.setAttribute("data-testid", `delayed-opt-${opt.value}`);
        select.appendChild(o);
      });
      select.disabled = false;
      loader.classList.add("hidden");
      btn.textContent = "Options Loaded";
    }, 2000);
  });

  document.getElementById("delayedSelect").addEventListener("change", (e) => {
    document.getElementById("delayedDropdownResult").textContent = e.target.value ? `Selected: ${e.target.selectedOptions[0].text}` : "";
  });

  // ===== DATA TABLE =====
  const tableData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "editor", status: "active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "viewer", status: "inactive" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "admin", status: "active" },
    { id: 5, name: "Ethan Hunt", email: "ethan@example.com", role: "editor", status: "pending" },
    { id: 6, name: "Fiona Apple", email: "fiona@example.com", role: "viewer", status: "active" },
    { id: 7, name: "George Lucas", email: "george@example.com", role: "editor", status: "inactive" },
    { id: 8, name: "Hannah Montana", email: "hannah@example.com", role: "viewer", status: "active" },
    { id: 9, name: "Ivan Drago", email: "ivan@example.com", role: "admin", status: "pending" },
    { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "editor", status: "active" },
    { id: 11, name: "Kevin Hart", email: "kevin@example.com", role: "viewer", status: "active" },
    { id: 12, name: "Luna Lovegood", email: "luna@example.com", role: "admin", status: "inactive" },
    { id: 13, name: "Mike Tyson", email: "mike@example.com", role: "editor", status: "active" },
    { id: 14, name: "Nora Jones", email: "nora@example.com", role: "viewer", status: "pending" },
    { id: 15, name: "Oscar Wilde", email: "oscar@example.com", role: "admin", status: "active" },
  ];

  let currentPage = 1;
  let rowsPerPage = 5;
  let sortCol = null;
  let sortDir = "asc";
  let filteredData = [...tableData];

  function renderTable() {
    const searchTerm = document.getElementById("tableSearch").value.toLowerCase();
    const filterRole = document.getElementById("tableFilter").value;

    filteredData = tableData.filter((row) => {
      const matchSearch = row.name.toLowerCase().includes(searchTerm) || row.email.toLowerCase().includes(searchTerm);
      const matchRole = filterRole === "all" || row.role === filterRole;
      return matchSearch && matchRole;
    });

    if (sortCol) {
      filteredData.sort((a, b) => {
        const aVal = a[sortCol];
        const bVal = b[sortCol];
        if (typeof aVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    pageData.forEach((row) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-testid", `table-row-${row.id}`);
      tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" data-id="${row.id}" data-testid="row-check-${row.id}"></td>
                <td>${row.id}</td>
                <td>${sanitize(row.name)}</td>
                <td>${sanitize(row.email)}</td>
                <td><span class="status-badge role-${row.role}">${sanitize(row.role)}</span></td>
                <td><span class="status-badge status-${row.status}">${sanitize(row.status)}</span></td>
                <td class="row-actions">
                    <button data-testid="edit-${row.id}" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="delete" data-testid="delete-${row.id}" title="Delete"><ion-icon name="trash-outline"></ion-icon></button>
                </td>
            `;

      // Delete row
      tr.querySelector(".delete").addEventListener("click", () => {
        const idx = tableData.findIndex((d) => d.id === row.id);
        if (idx > -1) {
          tableData.splice(idx, 1);
          renderTable();
        }
      });

      // Edit row
      tr.querySelector('[title="Edit"]').addEventListener("click", () => {
        openModal(
          "Edit User",
          `
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="editName" value="${sanitize(row.name)}" data-testid="edit-name-input">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" id="editEmail" value="${sanitize(row.email)}" data-testid="edit-email-input">
                    </div>
                `,
          () => {
            row.name = document.getElementById("editName").value;
            row.email = document.getElementById("editEmail").value;
            renderTable();
            closeModal();
          },
        );
      });

      tbody.appendChild(tr);
    });

    // Pagination
    document.getElementById("tableInfo").textContent = `Showing ${start + 1}-${Math.min(start + rowsPerPage, filteredData.length)} of ${filteredData.length} entries`;
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn page-arrow";
    prevBtn.id = "pagePrev";
    prevBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>';
    prevBtn.setAttribute("data-testid", "page-prev");
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
    paginationEl.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
      btn.id = `page-${i}`;
      btn.textContent = i;
      btn.setAttribute("data-testid", `page-${i}`);
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      paginationEl.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn page-arrow";
    nextBtn.id = "pageNext";
    nextBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>';
    nextBtn.setAttribute("data-testid", "page-next");
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
    paginationEl.appendChild(nextBtn);
  }

  document.getElementById("rowsPerPage").addEventListener("change", (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
  });

  document.getElementById("tableSearch").addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });
  document.getElementById("tableFilter").addEventListener("change", () => {
    currentPage = 1;
    renderTable();
  });
  document.getElementById("selectAll").addEventListener("change", (e) => {
    document.querySelectorAll(".row-checkbox").forEach((cb) => {
      cb.checked = e.target.checked;
    });
    document.querySelectorAll("#tableBody tr").forEach((tr) => {
      tr.classList.toggle("selected", e.target.checked);
    });
  });

  document.querySelectorAll(".sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (sortCol === col) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortCol = col;
        sortDir = "asc";
      }
      renderTable();
    });
  });

  document.getElementById("addRowBtn").addEventListener("click", () => {
    const newId = tableData.length > 0 ? Math.max(...tableData.map((d) => d.id)) + 1 : 1;
    openModal(
      "Add New User",
      `
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="newUserName" placeholder="Full name" data-testid="new-user-name">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="text" id="newUserEmail" placeholder="email@example.com" data-testid="new-user-email">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="newUserRole" data-testid="new-user-role">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
            </div>
        `,
      () => {
        const name = document.getElementById("newUserName").value || "New User";
        const email = document.getElementById("newUserEmail").value || "new@example.com";
        const role = document.getElementById("newUserRole").value;
        tableData.push({ id: newId, name, email, role, status: "active" });
        renderTable();
        closeModal();
      },
    );
  });

  renderTable();

  // ===== EDITABLE TABLE =====
  document.querySelectorAll(".editable-table td[contenteditable]").forEach((td) => {
    td.addEventListener("input", () => {
      const row = td.parentElement;
      const price = parseFloat(row.querySelector('[data-testid^="edit-price"]').textContent) || 0;
      const qty = parseInt(row.querySelector('[data-testid^="edit-qty"]').textContent) || 0;
      row.querySelector(".row-total").textContent = `$${(price * qty).toLocaleString()}`;
      updateGrandTotal();
    });
  });

  function updateGrandTotal() {
    let total = 0;
    document.querySelectorAll(".row-total").forEach((td) => {
      total += parseFloat(td.textContent.replace(/[$,]/g, "")) || 0;
    });
    document.getElementById("grandTotal").textContent = `$${total.toLocaleString()}`;
  }

  // ===== DYNAMIC FRUIT TABLE (shuffled columns & rows on each reload) =====
  (function () {
    const columns = ["Fruit", "Color", "Weight (g)", "Price (₹/kg)", "Season", "Stock"];
    const fruitData = {
      Mango: { color: "Yellow", season: "Summer" },
      Apple: { color: "Red", season: "Winter" },
      Banana: { color: "Green", season: "All Year" },
      Grapes: { color: "Purple", season: "Monsoon" },
      Orange: { color: "Orange", season: "Winter" },
    };
    const fruits = Object.keys(fruitData);

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const otherCols = columns.filter((c) => c !== "Fruit");
    const shuffledCols = ["Fruit", ...shuffle(otherCols)];
    const shuffledFruits = shuffle(fruits);

    const headRow = document.getElementById("dynamicFruitHead");
    shuffledCols.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      th.setAttribute("data-testid", "dyn-col-" + col.toLowerCase().replace(/[\s()\/]+/g, "-"));
      headRow.appendChild(th);
    });

    const tbody = document.getElementById("dynamicFruitBody");
    shuffledFruits.forEach((fruit, idx) => {
      const rowData = {
        Fruit: fruit,
        Color: fruitData[fruit].color,
        "Weight (g)": randInt(50, 900),
        "Price (₹/kg)": "₹" + randInt(40, 500),
        Season: fruitData[fruit].season,
        Stock: randInt(0, 200),
      };
      const tr = document.createElement("tr");
      tr.setAttribute("data-testid", "dyn-row-" + idx);
      shuffledCols.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = rowData[col];
        td.setAttribute("data-testid", "dyn-cell-" + idx + "-" + col.toLowerCase().replace(/[\s()\/]+/g, "-"));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  })();

  // ===== DRAG & DROP =====
  const dndList = document.getElementById("dndList");
  let draggedItem = null;

  dndList.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("dnd-item")) {
      draggedItem = e.target;
      e.target.classList.add("dragging");
    }
  });

  dndList.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("dnd-item")) {
      e.target.classList.remove("dragging");
      draggedItem = null;
    }
  });

  dndList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(dndList, e.clientY);
    if (draggedItem) {
      if (afterElement) {
        dndList.insertBefore(draggedItem, afterElement);
      } else {
        dndList.appendChild(draggedItem);
      }
    }
  });

  function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll(".dnd-item:not(.dragging)")];
    return items.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  // Drop zone
  const dropZone = document.getElementById("dropZone");
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (draggedItem) {
      draggedItem.remove();
      draggedItem = null;
    }
  });

  // ===== HOVER & CLICK EVENTS =====
  document.getElementById("doubleClickBtn").addEventListener("dblclick", () => {
    document.getElementById("doubleClickResult").textContent = "Double-clicked!";
  });

  document.getElementById("rightClickBtn").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    document.getElementById("rightClickResult").textContent = "Right-clicked!";
  });

  // Toggle buttons
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("active"));
  });

  // Notification toggle
  document.getElementById("notifToggle").addEventListener("change", (e) => {
    document.getElementById("notifStatus").textContent = e.target.checked ? "ON" : "OFF";
  });

  // ===== CONTEXT MENU =====
  const contextArea = document.getElementById("contextArea");
  const contextMenu = document.getElementById("contextMenu");
  const contextResult = document.getElementById("contextResult");

  contextArea.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextMenu.classList.remove("hidden");
    contextMenu.style.left = e.pageX + "px";
    contextMenu.style.top = e.pageY + "px";
  });

  document.addEventListener("click", () => contextMenu.classList.add("hidden"));

  contextMenu.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      contextResult.textContent = `Action: ${btn.dataset.action}`;
      contextMenu.classList.add("hidden");
    });
  });

  // ===== DELAYED LOADING =====
  document.getElementById("loadDelayedBtn").addEventListener("click", () => {
    const delay = parseInt(document.getElementById("delayTime").value) * 1000;
    const container = document.getElementById("delayedContent");
    container.innerHTML = '<div class="placeholder-content"><div class="spinner" style="margin: 0 auto;"></div><p style="margin-top:12px;" class="loading-dots">Loading</p></div>';

    setTimeout(() => {
      container.innerHTML = `
                <div class="loaded-data" data-testid="loaded-data">
                    <h4><ion-icon name="checkmark-circle"></ion-icon> Content Loaded Successfully!</h4>
                    <p>This content appeared after a ${delay / 1000} second delay.</p>
                    <p>Timestamp: ${new Date().toLocaleTimeString()}</p>
                    <ul>
                        <li>Item 1: Playwright is awesome</li>
                        <li>Item 2: Testing is fun</li>
                        <li>Item 3: Automation saves time</li>
                    </ul>
                </div>
            `;
    }, delay);
  });

  // ===== VISIBILITY CONTROLS =====
  const visibleEl = document.getElementById("visibleElement");
  document.getElementById("showBtn").addEventListener("click", () => visibleEl.classList.remove("hidden"));
  document.getElementById("hideBtn").addEventListener("click", () => visibleEl.classList.add("hidden"));
  document.getElementById("toggleVisBtn").addEventListener("click", () => visibleEl.classList.toggle("hidden"));

  let dynamicCount = 0;
  document.getElementById("addElementBtn").addEventListener("click", () => {
    dynamicCount++;
    const el = document.createElement("div");
    el.className = "dynamic-el";
    el.setAttribute("data-testid", `dynamic-el-${dynamicCount}`);
    el.innerHTML = `<span>Dynamic Element #${dynamicCount}</span><small>${new Date().toLocaleTimeString()}</small>`;
    document.getElementById("dynamicElements").appendChild(el);
  });

  document.getElementById("removeElementBtn").addEventListener("click", () => {
    const container = document.getElementById("dynamicElements");
    if (container.lastChild) container.lastChild.remove();
  });

  const toggleInput = document.getElementById("toggleInput");
  document.getElementById("disableBtn").addEventListener("click", () => (toggleInput.disabled = true));
  document.getElementById("enableBtn").addEventListener("click", () => (toggleInput.disabled = false));

  // ===== START/STOP TOGGLE =====
  const startStopBtn = document.getElementById("startStopBtn");
  const startStopStatus = document.getElementById("startStopStatus");
  startStopBtn.addEventListener("click", () => {
    if (startStopBtn.textContent === "Start") {
      startStopBtn.textContent = "Stop";
      startStopBtn.classList.remove("btn-primary");
      startStopBtn.classList.add("btn-danger");
      startStopStatus.textContent = "Status: Running";
    } else {
      startStopBtn.textContent = "Start";
      startStopBtn.classList.remove("btn-danger");
      startStopBtn.classList.add("btn-primary");
      startStopStatus.textContent = "Status: Stopped";
    }
  });

  // ===== COUNTER =====
  let count = 0;
  const counterValue = document.getElementById("counterValue");
  document.getElementById("incrementBtn").addEventListener("click", () => {
    count++;
    counterValue.textContent = count;
  });
  document.getElementById("decrementBtn").addEventListener("click", () => {
    count--;
    counterValue.textContent = count;
  });
  document.getElementById("resetCounterBtn").addEventListener("click", () => {
    count = 0;
    counterValue.textContent = count;
  });

  // ===== TIMER =====
  let timerSeconds = 0;
  let timerInterval = null;
  const timerDisplay = document.getElementById("timerDisplay");

  document.getElementById("startTimerBtn").addEventListener("click", () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      timerSeconds++;
      const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
      const secs = String(timerSeconds % 60).padStart(2, "0");
      timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
  });

  document.getElementById("stopTimerBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  document.getElementById("resetTimerBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    timerDisplay.textContent = "00:00";
  });

  // ===== PROGRESS BAR =====
  document.getElementById("startProgressBtn").addEventListener("click", () => {
    const bar = document.getElementById("progressBar");
    let progress = 0;
    bar.style.width = "0%";
    bar.textContent = "0%";
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      bar.style.width = progress + "%";
      bar.textContent = Math.floor(progress) + "%";
    }, 300);
  });

  // Spinner
  document.getElementById("toggleSpinnerBtn").addEventListener("click", () => {
    const spinner = document.getElementById("spinner");
    const status = document.getElementById("spinnerStatus");
    spinner.classList.toggle("hidden");
    status.textContent = spinner.classList.contains("hidden") ? "Click to load" : "Loading...";
  });

  // Skeleton
  document.getElementById("toggleSkeletonBtn").addEventListener("click", () => {
    const skeleton = document.getElementById("skeletonArea");
    const loaded = document.getElementById("loadedContent");
    skeleton.classList.toggle("hidden");
    loaded.classList.toggle("hidden");
  });

  // ===== MODALS =====
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalConfirm = document.getElementById("modalConfirm");
  let modalCallback = null;

  function openModal(title, bodyHTML, onConfirm) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHTML;
    modalCallback = onConfirm;
    modalOverlay.classList.remove("hidden");
  }

  function closeModal() {
    modalOverlay.classList.add("hidden");
    modalCallback = null;
  }

  document.getElementById("openModalBtn").addEventListener("click", () => {
    openModal(
      "Sample Modal",
      `
            <p>This is a sample modal dialog. You can test opening, closing, and interacting with modals.</p>
            <div class="form-group" style="margin-top:16px;">
                <label>Your feedback</label>
                <textarea rows="3" placeholder="Type something..." data-testid="modal-textarea"></textarea>
            </div>
        `,
      () => {
        const text = document.querySelector('[data-testid="modal-textarea"]')?.value || "";
        document.getElementById("dialogResult").textContent = `Modal confirmed with: "${text}"`;
        closeModal();
      },
    );
  });

  document.getElementById("openConfirmBtn").addEventListener("click", () => {
    openModal("Confirm Action", "<p>Are you sure you want to proceed with this action? This cannot be undone.</p>", () => {
      document.getElementById("dialogResult").textContent = "Confirmed!";
      closeModal();
    });
  });

  document.getElementById("openPromptBtn").addEventListener("click", () => {
    openModal(
      "Enter Your Name",
      `
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="promptInput" placeholder="Type your name..." data-testid="prompt-input">
            </div>
        `,
      () => {
        const val = document.getElementById("promptInput")?.value || "";
        document.getElementById("dialogResult").textContent = `You entered: "${val}"`;
        closeModal();
      },
    );
  });

  document.getElementById("openNestedBtn").addEventListener("click", () => {
    openModal(
      "Parent Modal",
      `
            <p>This is the parent modal. Click below to open a nested modal.</p>
            <button class="btn btn-primary" id="openNestedInner" data-testid="open-nested-inner" style="margin-top:12px;">Open Nested Modal</button>
        `,
      null,
    );
    setTimeout(() => {
      document.getElementById("openNestedInner")?.addEventListener("click", () => {
        document.getElementById("nestedModalOverlay").classList.remove("hidden");
      });
    }, 100);
  });

  modalConfirm.addEventListener("click", () => {
    if (modalCallback) modalCallback();
  });
  document.getElementById("modalCancel").addEventListener("click", closeModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Nested modal
  document.getElementById("nestedModalClose").addEventListener("click", () => {
    document.getElementById("nestedModalOverlay").classList.add("hidden");
  });
  document.getElementById("closeNestedModal").addEventListener("click", () => {
    document.getElementById("nestedModalOverlay").classList.add("hidden");
  });

  // ===== TOASTS =====
  function showToast(type, title, message) {
    const icons = {
      success: '<ion-icon name="checkmark-circle"></ion-icon>',
      error: '<ion-icon name="close-circle"></ion-icon>',
      warning: '<ion-icon name="warning"></ion-icon>',
      info: '<ion-icon name="information-circle"></ion-icon>',
    };
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("data-testid", `toast-${type}-${Date.now()}`);
    toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <strong>${sanitize(title)}</strong>
                <p>${sanitize(message)}</p>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;
    toast.querySelector(".toast-close").addEventListener("click", () => removeToast(toast));
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), 5000);
  }

  function removeToast(toast) {
    if (!toast.parentElement) return;
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }

  document.getElementById("toastSuccess").addEventListener("click", () => showToast("success", "Success!", "Operation completed successfully."));
  document.getElementById("toastError").addEventListener("click", () => showToast("error", "Error!", "Something went wrong. Please try again."));
  document.getElementById("toastWarning").addEventListener("click", () => showToast("warning", "Warning!", "Please review your input carefully."));
  document.getElementById("toastInfo").addEventListener("click", () => showToast("info", "Info", "Here is some useful information."));

  // Native dialogs
  document.getElementById("nativeAlert").addEventListener("click", () => {
    alert("This is a native alert dialog!");
    document.getElementById("nativeResult").textContent = "Alert was dismissed";
  });

  document.getElementById("nativeConfirm").addEventListener("click", () => {
    const result = confirm("Do you want to continue?");
    document.getElementById("nativeResult").textContent = `Confirm result: ${result}`;
  });

  document.getElementById("nativePrompt").addEventListener("click", () => {
    const result = prompt("What is your name?", "Playwright Tester");
    document.getElementById("nativeResult").textContent = `Prompt result: "${result}"`;
  });

  // ===== TABS =====
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // ===== ACCORDION =====
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains("active");

      // Close all
      document.querySelectorAll(".accordion-header").forEach((h) => h.classList.remove("active"));
      document.querySelectorAll(".accordion-body").forEach((b) => b.classList.remove("open"));

      if (!isOpen) {
        header.classList.add("active");
        body.classList.add("open");
      }
    });
  });

  // ===== WINDOW HANDLING =====
  document.getElementById("newTabBtn").addEventListener("click", () => {
    window.open("login.html", "_blank");
  });

  document.getElementById("popupBtn").addEventListener("click", () => {
    window.open("login.html", "popup", "width=500,height=600,scrollbars=yes");
  });

  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });

  // ===== SHADOW DOM =====
  // Shadow DOM host
  const shadowHost = document.getElementById("shadowHost");
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
            .shadow-container { padding: 20px; border: 2px dashed #6366f1; border-radius: 12px; }
            h4 { color: #6366f1; margin-bottom: 12px; font-family: 'Inter', sans-serif; }
            p { color: #475569; font-family: 'Inter', sans-serif; margin-bottom: 12px; font-size: 0.875rem; }
            input { padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; width: 100%; margin-bottom: 12px; font-size: 0.875rem; box-sizing: border-box; }
            input:focus { outline: none; border-color: #6366f1; }
            button { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.875rem; }
            button:hover { background: #4f46e5; }
            .result { margin-top: 12px; padding: 10px; background: #eef2ff; border-radius: 8px; font-size: 0.875rem; color: #4f46e5; font-family: 'Inter', sans-serif; min-height: 38px; }
        </style>
        <div class="shadow-container">
            <h4>Inside Shadow DOM</h4>
            <p>These elements are encapsulated within a Shadow DOM boundary.</p>
            <input type="text" id="shadowInput" placeholder="Type inside shadow DOM..." data-testid="shadow-input">
            <button id="shadowBtn" data-testid="shadow-button">Click Me</button>
            <div class="result" id="shadowResult" data-testid="shadow-result"></div>
        </div>
    `;

  shadowRoot.getElementById("shadowBtn").addEventListener("click", () => {
    const val = shadowRoot.getElementById("shadowInput").value;
    shadowRoot.getElementById("shadowResult").textContent = val ? `You typed: "${val}"` : "Please type something first!";
  });

  // Nested Shadow DOM
  const nestedHost = document.getElementById("nestedShadowHost");
  const nestedRoot = nestedHost.attachShadow({ mode: "open" });
  nestedRoot.innerHTML = `
        <style>
            .outer { padding: 20px; border: 2px dashed #ec4899; border-radius: 12px; font-family: 'Inter', sans-serif; }
            h4 { color: #ec4899; margin-bottom: 12px; }
            p { color: #475569; font-size: 0.875rem; margin-bottom: 12px; }
            .inner-host { margin-top: 16px; }
        </style>
        <div class="outer">
            <h4>Outer Shadow DOM</h4>
            <p>This has a nested shadow DOM inside it.</p>
            <div class="inner-host" id="innerHost"></div>
        </div>
    `;

  const innerHost = nestedRoot.getElementById("innerHost");
  const innerRoot = innerHost.attachShadow({ mode: "open" });
  innerRoot.innerHTML = `
        <style>
            .inner { padding: 16px; border: 2px dashed #06b6d4; border-radius: 8px; font-family: 'Inter', sans-serif; }
            h5 { color: #06b6d4; margin-bottom: 8px; }
            button { padding: 8px 16px; background: #06b6d4; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.813rem; }
            button:hover { background: #0891b2; }
            .inner-result { margin-top: 8px; font-size: 0.813rem; color: #0891b2; }
        </style>
        <div class="inner">
            <h5>Inner Shadow DOM (Nested)</h5>
            <button id="innerBtn" data-testid="inner-shadow-button">Click Inner Button</button>
            <div class="inner-result" id="innerResult" data-testid="inner-shadow-result"></div>
        </div>
    `;

  innerRoot.getElementById("innerBtn").addEventListener("click", () => {
    innerRoot.getElementById("innerResult").textContent = `Inner button clicked at ${new Date().toLocaleTimeString()}`;
  });

  // ===== INFINITE SCROLL =====
  const scrollContainer = document.getElementById("scrollContainer");
  const scrollLoader = document.getElementById("scrollLoader");
  let scrollPage = 0;
  const avatarColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#f43f5e", "#059669"];

  function loadScrollItems() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
      const num = scrollPage * 10 + i + 1;
      const item = document.createElement("div");
      item.className = "scroll-item";
      item.setAttribute("data-testid", `scroll-item-${num}`);
      const color = avatarColors[num % avatarColors.length];
      item.innerHTML = `
                <div class="scroll-item-avatar" style="background: ${color};">${num}</div>
                <div>
                    <strong>Item #${num}</strong>
                    <small style="display:block; color: var(--text-muted);">Loaded at ${new Date().toLocaleTimeString()}</small>
                </div>
            `;
      fragment.appendChild(item);
    }
    scrollContainer.appendChild(fragment);
    scrollPage++;
  }

  loadScrollItems();

  scrollContainer.addEventListener("scroll", () => {
    if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 50) {
      if (scrollPage < 5) {
        scrollLoader.classList.remove("hidden");
        setTimeout(() => {
          loadScrollItems();
          scrollLoader.classList.add("hidden");
        }, 800);
      }
    }
  });

  // ===== CLIPBOARD =====
  document.getElementById("copyBtn").addEventListener("click", async () => {
    const text = document.getElementById("copyInput").value;
    try {
      await navigator.clipboard.writeText(text);
      document.getElementById("copyStatus").textContent = "Copied!";
    } catch {
      document.getElementById("copyStatus").textContent = "Copy failed";
    }
    setTimeout(() => {
      document.getElementById("copyStatus").textContent = "";
    }, 2000);
  });

  // Keyboard events
  document.getElementById("keyboardInput").addEventListener("keydown", (e) => {
    document.getElementById("keyDisplay").textContent = `Key: "${e.key}" | Code: "${e.code}" | Shift: ${e.shiftKey} | Ctrl: ${e.ctrlKey} | Alt: ${e.altKey}`;
  });

  // ===== API MOCK =====
  document.getElementById("fetchDataBtn").addEventListener("click", () => {
    const resultEl = document.getElementById("apiResult");
    resultEl.innerHTML = '<span class="placeholder-text">Fetching data...</span>';

    setTimeout(() => {
      const mockData = {
        users: [
          { id: 1, name: "John Doe", role: "Developer" },
          { id: 2, name: "Jane Smith", role: "Designer" },
          { id: 3, name: "Bob Wilson", role: "Manager" },
        ],
        total: 3,
        timestamp: new Date().toISOString(),
      };
      resultEl.textContent = JSON.stringify(mockData, null, 2);
    }, 1500);
  });

  // ===== LOCAL STORAGE =====
  document.getElementById("setStorageBtn").addEventListener("click", () => {
    const key = document.getElementById("storageKey").value;
    const value = document.getElementById("storageValue").value;
    if (key) {
      localStorage.setItem(key, value);
      document.getElementById("storageResult").textContent = `Set: ${key} = ${value}`;
    }
  });

  document.getElementById("getStorageBtn").addEventListener("click", () => {
    const key = document.getElementById("storageKey").value;
    if (key) {
      const value = localStorage.getItem(key);
      document.getElementById("storageResult").textContent = value !== null ? `${key} = ${value}` : `"${key}" not found`;
    }
  });

  document.getElementById("clearStorageBtn").addEventListener("click", () => {
    localStorage.clear();
    document.getElementById("storageResult").textContent = "All storage cleared";
  });

  // ===== GALLERY / LIGHTBOX =====
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");
  let currentGalleryIndex = 0;

  const galleryData = Array.from(galleryItems).map((item) => {
    const img = item.querySelector(".gallery-img img");
    return {
      src: img ? img.src : "",
      alt: img ? img.alt : "",
      name: item.querySelector("p").textContent,
      color: item.dataset.color,
    };
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentGalleryIndex = index;
      showLightbox();
    });
  });

  function showLightbox() {
    const data = galleryData[currentGalleryIndex];
    lightboxContent.style.background = "transparent";
    lightboxContent.innerHTML = `<img src="${data.src}" alt="${sanitize(data.alt)}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">`;
    lightbox.classList.remove("hidden");
  }

  document.getElementById("lightboxClose").addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });

  document.getElementById("lightboxPrev").addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    showLightbox();
  });

  document.getElementById("lightboxNext").addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    showLightbox();
  });

  // ===== BACK TO TOP =====
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== MULTI-STEP WIZARD =====
  let wizStep = 1;
  const totalWizSteps = 4;
  const wizSteps = document.querySelectorAll(".wizard-step");
  const wizConnectors = document.querySelectorAll(".wizard-connector");
  const wizPanels = document.querySelectorAll(".wizard-panel");

  function updateWizard() {
    wizSteps.forEach((s, i) => {
      s.classList.remove("active", "completed");
      if (i + 1 === wizStep) s.classList.add("active");
      else if (i + 1 < wizStep) s.classList.add("completed");
    });
    wizConnectors.forEach((c, i) => {
      c.classList.toggle("active", i + 1 < wizStep);
    });
    wizPanels.forEach((p) => p.classList.remove("active"));
    const current = document.getElementById(`wizardStep${wizStep}`);
    if (current) current.classList.add("active");
    document.getElementById("wizPrev").disabled = wizStep === 1;
    const nextBtn = document.getElementById("wizNext");
    nextBtn.textContent = wizStep === totalWizSteps ? "Submit" : "Next";
    // Clear errors
    for (let i = 1; i <= 4; i++) {
      const err = document.getElementById(`wizError${i}`);
      if (err) err.textContent = "";
    }
  }

  function validateWizStep(step) {
    if (step === 1) {
      if (!document.getElementById("wizFirstName").value.trim() || !document.getElementById("wizLastName").value.trim() || !document.getElementById("wizEmail").value.trim()) {
        document.getElementById("wizError1").textContent = "All fields are required";
        return false;
      }
    } else if (step === 2) {
      if (!document.getElementById("wizStreet").value.trim() || !document.getElementById("wizCity").value.trim() || !document.getElementById("wizZip").value.trim()) {
        document.getElementById("wizError2").textContent = "All fields are required";
        return false;
      }
    } else if (step === 3) {
      if (!document.getElementById("wizCardNum").value.trim() || !document.getElementById("wizExpiry").value.trim() || !document.getElementById("wizCvv").value.trim()) {
        document.getElementById("wizError3").textContent = "All fields are required";
        return false;
      }
    } else if (step === 4) {
      if (!document.getElementById("wizAgree").checked) {
        document.getElementById("wizError4").textContent = "You must confirm the information";
        return false;
      }
    }
    return true;
  }

  document.getElementById("wizNext").addEventListener("click", () => {
    if (!validateWizStep(wizStep)) return;
    if (wizStep === 4) {
      // Build review on step 3->4 transition already done, now submit
      document.getElementById("wizardSuccessPanel").classList.add("active");
      document.getElementById("wizardActions").classList.add("hidden");
      wizSteps.forEach((s) => {
        s.classList.remove("active");
        s.classList.add("completed");
      });
      wizConnectors.forEach((c) => c.classList.add("active"));
      wizPanels.forEach((p) => p.classList.remove("active"));
      document.getElementById("wizardSuccessPanel").classList.add("active");
      return;
    }
    wizStep++;
    if (wizStep === 4) {
      // Build review summary
      document.getElementById("wizReview").innerHTML = `
        <p><strong>Name:</strong> ${sanitize(document.getElementById("wizFirstName").value)} ${sanitize(document.getElementById("wizLastName").value)}</p>
        <p><strong>Email:</strong> ${sanitize(document.getElementById("wizEmail").value)}</p>
        <p><strong>Address:</strong> ${sanitize(document.getElementById("wizStreet").value)}, ${sanitize(document.getElementById("wizCity").value)} ${sanitize(document.getElementById("wizZip").value)}</p>
        <p><strong>Card:</strong> ${sanitize(document.getElementById("wizCardNum").value)}</p>
      `;
    }
    updateWizard();
  });

  document.getElementById("wizPrev").addEventListener("click", () => {
    if (wizStep > 1) {
      wizStep--;
      updateWizard();
    }
  });

  document.getElementById("wizRestart").addEventListener("click", () => {
    wizStep = 1;
    document.querySelectorAll(".wizard-panel input").forEach((i) => {
      i.value = "";
      if (i.type === "checkbox") i.checked = false;
    });
    document.getElementById("wizardActions").classList.remove("hidden");
    updateWizard();
  });

  updateWizard();

  // ===== COOKIE CONSENT =====
  const cookieBanner = document.getElementById("cookieBanner");
  if (sessionStorage.getItem("playlab-cookies")) {
    cookieBanner.classList.add("hidden");
  }

  document.getElementById("cookieAccept").addEventListener("click", () => {
    sessionStorage.setItem("playlab-cookies", "accepted");
    cookieBanner.classList.add("hidden");
  });

  document.getElementById("cookieReject").addEventListener("click", () => {
    sessionStorage.setItem("playlab-cookies", "rejected");
    cookieBanner.classList.add("hidden");
  });

  document.getElementById("cookieSettings").addEventListener("click", () => {
    openModal(
      "Cookie Settings",
      `
      <div class="form-group"><label class="checkbox-label"><input type="checkbox" checked disabled /> Essential Cookies (Required)</label></div>
      <div class="form-group"><label class="checkbox-label"><input type="checkbox" data-testid="cookie-analytics" /> Analytics Cookies</label></div>
      <div class="form-group"><label class="checkbox-label"><input type="checkbox" data-testid="cookie-marketing" /> Marketing Cookies</label></div>
    `,
      () => {
        sessionStorage.setItem("playlab-cookies", "custom");
        cookieBanner.classList.add("hidden");
        closeModal();
      },
    );
  });

  // ===== CAROUSEL =====
  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.getElementById("carouselDots");
  let currentSlide = 0;
  let autoplayInterval = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `carousel-dot ${i === 0 ? "active" : ""}`;
    dot.setAttribute("data-testid", `carousel-dot-${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    dotsContainer.children[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dotsContainer.children[currentSlide].classList.add("active");
    document.getElementById("carouselStatus").textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
  }

  document.getElementById("carouselPrev").addEventListener("click", () => goToSlide(currentSlide - 1));
  document.getElementById("carouselNext").addEventListener("click", () => goToSlide(currentSlide + 1));

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }

  const autoplayCheckbox = document.getElementById("carouselAutoplay");
  autoplayCheckbox.addEventListener("change", (e) => {
    e.target.checked ? startAutoplay() : stopAutoplay();
  });

  if (autoplayCheckbox.checked) startAutoplay();

  // ===== NETWORK / API =====
  document.getElementById("fetchUsersBtn").addEventListener("click", async () => {
    const status = document.getElementById("fetchUsersStatus");
    const result = document.getElementById("fetchUsersResult");
    status.className = "api-status loading";
    status.textContent = "Loading...";
    result.innerHTML = '<span class="placeholder-text">Fetching...</span>';
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      status.className = "api-status success";
      status.textContent = `Status: ${res.status} OK — ${data.length} users`;
      result.textContent = JSON.stringify(
        data.slice(0, 5).map((u) => ({ id: u.id, name: u.name, email: u.email })),
        null,
        2,
      );
    } catch (err) {
      status.className = "api-status error";
      status.textContent = "Failed to fetch";
      result.textContent = err.message;
    }
  });

  document.getElementById("submitPostBtn").addEventListener("click", async () => {
    const status = document.getElementById("postStatus");
    const result = document.getElementById("postResult");
    const title = document.getElementById("postTitle").value || "Untitled";
    const body = document.getElementById("postBody").value || "No content";
    status.className = "api-status loading";
    status.textContent = "Submitting...";
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 }),
      });
      const data = await res.json();
      status.className = "api-status success";
      status.textContent = `Status: ${res.status} Created`;
      result.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      status.className = "api-status error";
      status.textContent = "Failed";
      result.textContent = err.message;
    }
  });

  document.getElementById("slowApiBtn").addEventListener("click", () => {
    const delay = parseInt(document.getElementById("apiDelay").value) * 1000;
    const result = document.getElementById("slowApiResult");
    result.innerHTML = '<span class="placeholder-text">Waiting for response...</span>';
    setTimeout(() => {
      result.textContent = JSON.stringify({ status: "ok", message: `Response after ${delay / 1000}s delay`, timestamp: new Date().toISOString() }, null, 2);
    }, delay);
  });

  document.querySelectorAll("[data-error]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.error;
      const messages = { 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error" };
      document.getElementById("errorApiResult").textContent = JSON.stringify({ error: true, status: parseInt(code), message: messages[code], timestamp: new Date().toISOString() }, null, 2);
    });
  });

  // ===== FLAKY ELEMENTS =====
  const randomBox = document.getElementById("randomAppearBox");
  const randomLog = document.getElementById("randomAppearLog");
  setInterval(() => {
    const visible = Math.random() > 0.4;
    randomBox.classList.toggle("hidden-state", !visible);
    randomLog.textContent = visible ? "Visible" : "Hidden";
  }, 2000);

  document.getElementById("spawnDelayedBtn").addEventListener("click", () => {
    const container = document.getElementById("delayedBtnContainer");
    container.innerHTML = '<span class="placeholder-text">Waiting for button...</span>';
    const delay = (Math.random() * 4 + 1) * 1000;
    setTimeout(() => {
      container.innerHTML = "";
      const btn = document.createElement("button");
      btn.className = "btn btn-primary";
      btn.textContent = "Click Me!";
      btn.setAttribute("data-testid", "spawned-button");
      btn.addEventListener("click", () => {
        container.innerHTML = '<span class="result-text">Button was clicked!</span>';
      });
      container.appendChild(btn);
    }, delay);
  });

  const changingTexts = ["Loading...", "Please wait...", "Almost there...", "Success! Click now", "Processing...", "Retrying..."];
  let changingIdx = 0;
  const changingBox = document.getElementById("changingTextBox");
  const changingAction = document.getElementById("changingTextAction");
  setInterval(() => {
    changingIdx = (changingIdx + 1) % changingTexts.length;
    changingBox.textContent = changingTexts[changingIdx];
    if (changingTexts[changingIdx] === "Success! Click now") {
      changingAction.classList.remove("hidden");
    } else {
      changingAction.classList.add("hidden");
    }
  }, 3000);

  changingAction.addEventListener("click", () => {
    document.getElementById("changingTextResult").textContent = "You caught it!";
  });

  // ===== DATE PICKER =====
  const dpInput = document.getElementById("datePickerInput");
  const dpCal = document.getElementById("datePickerCal");
  const dpDays = document.getElementById("dpDays");
  let dpDate = new Date();
  let dpSelected = null;

  dpInput.addEventListener("click", () => dpCal.classList.toggle("hidden"));
  document.addEventListener("click", (e) => {
    const isInsideDatePicker =
      e.target.closest("#datePickerInput") ||
      e.target.closest("#datepickerInputWrap") ||
      e.target.closest("#datePickerCal") ||
      e.target.closest("#dpPrevMonth") ||
      e.target.closest("#dpNextMonth") ||
      e.target.closest("#dpToday") ||
      e.target.closest("#dpClear");
    if (!isInsideDatePicker) {
      dpCal.classList.add("hidden");
    }
  });

  function renderCalendar() {
    const year = dpDate.getFullYear();
    const month = dpDate.getMonth();
    document.getElementById("dpMonthYear").textContent = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    dpDays.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const btn = document.createElement("button");
      btn.className = "dp-day other-month";
      btn.textContent = prevDays - i;
      btn.type = "button";
      dpDays.appendChild(btn);
    }

    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement("button");
      btn.className = "dp-day";
      btn.type = "button";
      btn.textContent = d;
      btn.setAttribute("data-testid", `dp-day-${d}`);
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) btn.classList.add("today");
      if (dpSelected && d === dpSelected.getDate() && month === dpSelected.getMonth() && year === dpSelected.getFullYear()) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        dpSelected = new Date(year, month, d);
        dpInput.value = dpSelected.toLocaleDateString("en-US");
        document.getElementById("datePickerResult").textContent = `Selected: ${dpSelected.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
        renderCalendar();
        dpCal.classList.add("hidden");
      });
      dpDays.appendChild(btn);
    }
  }

  document.getElementById("dpPrevMonth").addEventListener("click", () => {
    dpDate.setMonth(dpDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById("dpNextMonth").addEventListener("click", () => {
    dpDate.setMonth(dpDate.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById("dpToday").addEventListener("click", () => {
    dpDate = new Date();
    dpSelected = new Date();
    dpInput.value = dpSelected.toLocaleDateString("en-US");
    document.getElementById("datePickerResult").textContent = `Selected: Today`;
    renderCalendar();
    dpCal.classList.add("hidden");
  });
  document.getElementById("dpClear").addEventListener("click", () => {
    dpSelected = null;
    dpInput.value = "";
    document.getElementById("datePickerResult").textContent = "";
    renderCalendar();
  });

  renderCalendar();

  // Typable date input with picker support
  const typedDateInput = document.getElementById("typedDateInput");
  const typedDateCal = document.getElementById("typedDateCal");
  const typedDays = document.getElementById("typedDays");
  const typedDateState = { date: new Date(), selectedDate: null };

  function formatInputDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  }

  function parseDdMmYyyy(rawValue) {
    const value = rawValue.trim();
    const match = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);

    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
      return null;
    }

    return parsed;
  }

  function renderTypedDateCalendar() {
    const year = typedDateState.date.getFullYear();
    const month = typedDateState.date.getMonth();
    const monthLabel = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    document.getElementById("typedMonthYear").textContent = monthLabel;
    typedDays.innerHTML = "";

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement("button");
      btn.className = "dp-day";
      btn.type = "button";
      btn.textContent = d;
      const currentDate = new Date(year, month, d);
      if (currentDate.toDateString() === new Date().toDateString()) btn.classList.add("today");
      if (typedDateState.selectedDate && currentDate.toDateString() === typedDateState.selectedDate.toDateString()) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        typedDateState.date = new Date(year, month, d);
        typedDateState.selectedDate = new Date(year, month, d);
        typedDateInput.value = formatInputDate(typedDateState.date);
        document.getElementById("typedDateResult").textContent = `Selected: ${typedDateState.date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
        renderTypedDateCalendar();
        typedDateCal.classList.add("hidden");
      });
      typedDays.appendChild(btn);
    }
  }

  typedDateInput.addEventListener("click", () => {
    typedDateCal.classList.toggle("hidden");
    renderTypedDateCalendar();
  });

  typedDateInput.addEventListener("input", (event) => {
    const rawValue = event.target.value.trim();
    if (!rawValue) {
      typedDateState.selectedDate = null;
      document.getElementById("typedDateResult").textContent = "";
      return;
    }

    const parsed = parseDdMmYyyy(rawValue);
    if (parsed) {
      typedDateState.date = parsed;
      typedDateState.selectedDate = parsed;
      document.getElementById("typedDateResult").textContent = `Typed: ${parsed.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
      renderTypedDateCalendar();
      return;
    }

    typedDateState.selectedDate = null;
    document.getElementById("typedDateResult").textContent = "Enter a valid date in dd-mm-yyyy format";
  });

  document.getElementById("typedPrevMonth").addEventListener("click", () => {
    typedDateState.date.setMonth(typedDateState.date.getMonth() - 1);
    renderTypedDateCalendar();
  });

  document.getElementById("typedNextMonth").addEventListener("click", () => {
    typedDateState.date.setMonth(typedDateState.date.getMonth() + 1);
    renderTypedDateCalendar();
  });

  document.getElementById("typedToday").addEventListener("click", () => {
    typedDateState.date = new Date();
    typedDateState.selectedDate = new Date();
    typedDateInput.value = formatInputDate(typedDateState.date);
    document.getElementById("typedDateResult").textContent = "Selected: Today";
    renderTypedDateCalendar();
    typedDateCal.classList.add("hidden");
  });

  document.getElementById("typedClear").addEventListener("click", () => {
    typedDateState.selectedDate = null;
    typedDateInput.value = "";
    document.getElementById("typedDateResult").textContent = "";
    typedDateState.date = new Date();
    renderTypedDateCalendar();
    typedDateCal.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    const isInsideTyped =
      e.target.closest("#typedDateInput") ||
      e.target.closest("#typedDateInputWrap") ||
      e.target.closest("#typedDateCal") ||
      e.target.closest("#typedPrevMonth") ||
      e.target.closest("#typedNextMonth") ||
      e.target.closest("#typedToday") ||
      e.target.closest("#typedClear");
    if (!isInsideTyped) {
      typedDateCal.classList.add("hidden");
    }
  });

  // Month + year dropdown picker
  const monthYearInput = document.getElementById("monthYearInput");
  const monthYearCal = document.getElementById("monthYearCal");
  const monthYearMonthSelect = document.getElementById("monthYearMonthSelect");
  const monthYearYearSelect = document.getElementById("monthYearYearSelect");
  const monthYearDays = document.getElementById("monthYearDays");
  const monthYearState = { date: new Date(), selectedDate: null };

  function formatDisplayDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  }

  function populateMonthYearSelectors() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearMonthSelect.innerHTML = months.map((month, index) => `<option value="${index}">${month}</option>`).join("");
    const years = [];
    for (let year = 2020; year <= 2035; year++) years.push(year);
    monthYearYearSelect.innerHTML = years.map((year) => `<option value="${year}">${year}</option>`).join("");
    monthYearMonthSelect.value = monthYearState.date.getMonth();
    monthYearYearSelect.value = monthYearState.date.getFullYear();
  }

  function renderMonthYearCalendar() {
    const year = Number(monthYearYearSelect.value || monthYearState.date.getFullYear());
    const month = Number(monthYearMonthSelect.value || monthYearState.date.getMonth());
    monthYearState.date = new Date(year, month, 1);
    monthYearMonthSelect.value = String(month);
    monthYearYearSelect.value = String(year);

    if (monthYearState.selectedDate) {
      const selectedDate = monthYearState.selectedDate;
      monthYearInput.value = formatDisplayDate(selectedDate);
    } else {
      monthYearInput.value = "";
    }

    monthYearDays.innerHTML = "";
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement("button");
      btn.className = "dp-day";
      btn.type = "button";
      btn.textContent = d;
      const currentDate = new Date(year, month, d);
      if (currentDate.toDateString() === new Date().toDateString()) btn.classList.add("today");
      if (monthYearState.selectedDate && currentDate.toDateString() === monthYearState.selectedDate.toDateString()) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        const selectedDate = new Date(year, month, d);
        monthYearState.selectedDate = selectedDate;
        monthYearInput.value = formatDisplayDate(selectedDate);
        document.getElementById("monthYearResult").textContent = `Selected: ${selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
        monthYearCal.classList.add("hidden");
      });
      monthYearDays.appendChild(btn);
    }
  }

  monthYearInput.addEventListener("click", () => {
    monthYearCal.classList.toggle("hidden");
    populateMonthYearSelectors();
    renderMonthYearCalendar();
  });

  monthYearMonthSelect.addEventListener("change", renderMonthYearCalendar);
  monthYearYearSelect.addEventListener("change", renderMonthYearCalendar);

  document.getElementById("monthYearToday").addEventListener("click", () => {
    const today = new Date();
    monthYearState.date = new Date(today.getFullYear(), today.getMonth(), 1);
    monthYearState.selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    populateMonthYearSelectors();
    renderMonthYearCalendar();
    monthYearInput.value = formatDisplayDate(monthYearState.selectedDate);
    document.getElementById("monthYearResult").textContent = "Selected: Today";
    monthYearCal.classList.add("hidden");
  });

  document.getElementById("monthYearClear").addEventListener("click", () => {
    monthYearState.selectedDate = null;
    monthYearInput.value = "";
    document.getElementById("monthYearResult").textContent = "";
    monthYearCal.classList.add("hidden");
    monthYearState.date = new Date();
    populateMonthYearSelectors();
    renderMonthYearCalendar();
  });

  document.addEventListener("click", (e) => {
    const isInsideMonthYear =
      e.target.closest("#monthYearInput") ||
      e.target.closest("#monthYearInputWrap") ||
      e.target.closest("#monthYearCal") ||
      e.target.closest("#monthYearMonthSelect") ||
      e.target.closest("#monthYearYearSelect") ||
      e.target.closest("#monthYearToday") ||
      e.target.closest("#monthYearClear");
    if (!isInsideMonthYear) {
      monthYearCal.classList.add("hidden");
    }
  });

  // Date range
  document.getElementById("calcRangeBtn").addEventListener("click", () => {
    const start = document.getElementById("rangeStart").value;
    const end = document.getElementById("rangeEnd").value;
    const result = document.getElementById("rangeResult");
    if (!start || !end) {
      result.textContent = "Please select both dates";
      return;
    }
    const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    result.textContent = diff >= 0 ? `Duration: ${diff} day(s)` : "End date must be after start date";
  });

  // ===== MEDIA PLAYER =====
  const video = document.getElementById("videoPlayer");
  const audio = document.getElementById("audioPlayer");

  document.getElementById("videoPlay").addEventListener("click", () => video.play());
  document.getElementById("videoPause").addEventListener("click", () => video.pause());
  document.getElementById("videoStop").addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
  });
  document.getElementById("videoMute").addEventListener("click", () => {
    video.muted = !video.muted;
  });
  document.getElementById("videoVolume").addEventListener("input", (e) => {
    video.volume = e.target.value;
  });
  document.getElementById("videoSeek").addEventListener("input", (e) => {
    if (video.duration) video.currentTime = (e.target.value / 100) * video.duration;
  });
  video.addEventListener("timeupdate", () => {
    const m = Math.floor(video.currentTime / 60);
    const s = Math.floor(video.currentTime % 60)
      .toString()
      .padStart(2, "0");
    document.getElementById("videoTime").textContent = `${m}:${s}`;
    if (video.duration) document.getElementById("videoSeek").value = (video.currentTime / video.duration) * 100;
  });

  document.getElementById("audioPlay").addEventListener("click", () => audio.play());
  document.getElementById("audioPause").addEventListener("click", () => audio.pause());
  document.getElementById("audioStop").addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
  });
  document.getElementById("audioVolume").addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });
  document.getElementById("audioSeek").addEventListener("input", (e) => {
    if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
  });
  audio.addEventListener("timeupdate", () => {
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60)
      .toString()
      .padStart(2, "0");
    document.getElementById("audioTime").textContent = `${m}:${s}`;
    if (audio.duration) document.getElementById("audioSeek").value = (audio.currentTime / audio.duration) * 100;
  });

  // ===== ACCESSIBILITY =====
  document.querySelectorAll(".a11y-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("a11yKeyResult").textContent = `Clicked: ${btn.textContent} (via ${document.activeElement === btn ? "keyboard/click" : "click"})`;
    });
  });

  const a11ySearch = document.getElementById("a11ySearch");
  const liveRegion = document.getElementById("a11yLiveRegion");
  const a11yItems = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"];
  a11ySearch.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) {
      liveRegion.textContent = "";
      return;
    }
    const matches = a11yItems.filter((i) => i.toLowerCase().includes(q));
    liveRegion.textContent = matches.length ? `${matches.length} result(s): ${matches.join(", ")}` : "No results found";
  });

  const expandBtn = document.getElementById("a11yExpandBtn");
  const expandContent = document.getElementById("a11yExpandContent");
  expandBtn.addEventListener("click", () => {
    const expanded = expandBtn.getAttribute("aria-expanded") === "true";
    expandBtn.setAttribute("aria-expanded", !expanded);
    expandContent.classList.toggle("hidden");
  });

  // Focus trap
  const focusTrapArea = document.getElementById("focusTrapArea");
  document.getElementById("focusTrapOpen").addEventListener("click", () => {
    focusTrapArea.classList.remove("hidden");
    const firstInput = focusTrapArea.querySelector("input, button");
    if (firstInput) firstInput.focus();
  });

  document.getElementById("focusTrapClose").addEventListener("click", () => {
    focusTrapArea.classList.add("hidden");
    document.getElementById("focusTrapOpen").focus();
  });

  focusTrapArea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = focusTrapArea.querySelectorAll("input, button, [tabindex]");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === "Escape") {
      focusTrapArea.classList.add("hidden");
      document.getElementById("focusTrapOpen").focus();
    }
  });

  // ===== RESPONSIVE TESTING =====
  function updateViewport() {
    document.getElementById("viewportWidth").textContent = window.innerWidth + "px";
    document.getElementById("viewportHeight").textContent = window.innerHeight + "px";
    const w = window.innerWidth;
    let label = "Desktop";
    if (w <= 480) label = "Mobile";
    else if (w <= 768) label = "Tablet";
    else if (w <= 1024) label = "Small Desktop";
    document.getElementById("breakpointLabel").textContent = label;
  }
  window.addEventListener("resize", updateViewport);
  updateViewport();

  // ===== PROTECTED CONTENT =====
  function checkAuth() {
    const isAuth = localStorage.getItem("playlab-auth") === "true";
    const user = localStorage.getItem("playlab-user");
    if (isAuth) {
      document.getElementById("protectedLocked").classList.add("hidden");
      document.getElementById("protectedContent").classList.remove("hidden");
      document.getElementById("protectedUser").textContent = user || "User";
    } else {
      document.getElementById("protectedLocked").classList.remove("hidden");
      document.getElementById("protectedContent").classList.add("hidden");
    }
  }

  function updateNavbarAuth() {
    const isAuth = localStorage.getItem("playlab-auth") === "true";
    const navLoginBtn = document.getElementById("navLoginBtn");
    const navLogoutBtn = document.getElementById("navLogoutBtn");

    if (isAuth) {
      navLoginBtn.classList.add("hidden");
      navLogoutBtn.classList.remove("hidden");
    } else {
      navLoginBtn.classList.remove("hidden");
      navLogoutBtn.classList.add("hidden");
    }
  }

  document.getElementById("protectedLogout").addEventListener("click", () => {
    localStorage.removeItem("playlab-auth");
    localStorage.removeItem("playlab-user");
    sessionStorage.removeItem("playlab-auth");
    sessionStorage.removeItem("playlab-user");
    checkAuth();
    updateNavbarAuth();
  });

  document.getElementById("navLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("playlab-auth");
    localStorage.removeItem("playlab-user");
    sessionStorage.removeItem("playlab-auth");
    sessionStorage.removeItem("playlab-user");
    checkAuth();
    updateNavbarAuth();
    // If on login page, refresh to reset the form
    if (window.location.pathname.includes("login")) {
      location.reload();
    }
  });

  checkAuth();
  updateNavbarAuth();

  // ===== UTILITY =====
  function sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== SHOPPING SECTION =====
  const shopCart = [];
  let appliedCoupon = null;

  const coupons = {
    FLAT10: { type: "percent", value: 10, minOrder: 50000, label: "10% off" },
    SPEED20: { type: "percent", value: 20, minOrder: 0, categories: ["lamborghini", "triumph"], label: "20% off automobiles" },
    FIRST500: { type: "fixed", value: 500, minOrder: 0, label: "₹500 off" },
  };

  const productNames = {
    lamborghini: "Lamborghini Huracan",
    triumph: "Triumph Speed Triple 1200",
    seiko: "Seiko Presage Cocktail Time",
    rifle: "Bolt Action Sporting Rifle",
  };

  function formatINR(num) {
    return "₹" + num.toLocaleString("en-IN");
  }

  function renderCart() {
    const itemsEl = document.getElementById("shopCartItems");
    const emptyEl = document.getElementById("shopCartEmpty");
    const summaryEl = document.getElementById("shopCartSummary");
    const countEl = document.getElementById("shopCartCount");

    countEl.textContent = shopCart.length;

    if (shopCart.length === 0) {
      itemsEl.innerHTML = '<p class="shop-cart-empty" id="shopCartEmpty">Your cart is empty.</p>';
      summaryEl.classList.add("hidden");
      return;
    }

    summaryEl.classList.remove("hidden");
    itemsEl.innerHTML = shopCart
      .map(
        (item, idx) =>
          `<div class="shop-cart-item" data-testid="cart-item-${item.product}">
        <div class="shop-cart-item-info">
          <span class="shop-cart-item-name">${productNames[item.product]}</span>
          <span class="shop-cart-item-price">${formatINR(item.price)}</span>
        </div>
        <button class="shop-cart-item-remove" data-idx="${idx}" data-testid="remove-${item.product}">&times;</button>
      </div>`,
      )
      .join("");

    itemsEl.querySelectorAll(".shop-cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        shopCart.splice(parseInt(btn.dataset.idx), 1);
        appliedCoupon = null;
        resetCouponUI();
        renderCart();
      });
    });

    updateTotals();
  }

  function updateTotals() {
    const subtotal = shopCart.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;

    if (appliedCoupon) {
      const c = coupons[appliedCoupon];
      if (c.type === "percent") {
        const eligible = c.categories ? shopCart.filter((i) => c.categories.includes(i.product)).reduce((s, i) => s + i.price, 0) : subtotal;
        discount = Math.round((eligible * c.value) / 100);
      } else {
        discount = c.value;
      }
    }

    document.getElementById("shopSubtotal").textContent = formatINR(subtotal);
    document.getElementById("shopDiscount").textContent = "-" + formatINR(discount);
    document.getElementById("shopTotal").textContent = formatINR(subtotal - discount);

    const discountRow = document.getElementById("shopDiscountRow");
    if (discount > 0) {
      discountRow.classList.remove("hidden");
    } else {
      discountRow.classList.add("hidden");
    }
  }

  function resetCouponUI() {
    const msg = document.getElementById("shopCouponMsg");
    msg.classList.add("hidden");
    msg.classList.remove("success", "error");
    document.getElementById("shopCouponInput").value = "";
    appliedCoupon = null;
  }

  document.querySelectorAll(".shop-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      shopCart.push({ product: btn.dataset.product, price: parseInt(btn.dataset.price) });
      renderCart();
    });
  });

  document.querySelectorAll(".shop-buy-now").forEach((btn) => {
    btn.addEventListener("click", () => {
      shopCart.length = 0;
      shopCart.push({ product: btn.dataset.product, price: parseInt(btn.dataset.price) });
      appliedCoupon = null;
      resetCouponUI();
      renderCart();
      openCheckout();
    });
  });

  document.getElementById("shopApplyCoupon").addEventListener("click", () => {
    const code = document.getElementById("shopCouponInput").value.trim().toUpperCase();
    const msg = document.getElementById("shopCouponMsg");
    msg.classList.remove("hidden", "success", "error");

    if (!coupons[code]) {
      msg.textContent = "Invalid coupon code.";
      msg.classList.add("error");
      appliedCoupon = null;
    } else {
      const c = coupons[code];
      const subtotal = shopCart.reduce((sum, item) => sum + item.price, 0);
      if (c.minOrder && subtotal < c.minOrder) {
        msg.textContent = `Minimum order of ${formatINR(c.minOrder)} required.`;
        msg.classList.add("error");
        appliedCoupon = null;
      } else {
        msg.textContent = `Coupon "${code}" applied! ${c.label}`;
        msg.classList.add("success");
        appliedCoupon = code;
      }
    }
    updateTotals();
  });

  function openCheckout() {
    document.getElementById("shopCheckoutOverlay").classList.remove("hidden");
    document.getElementById("shopStepAddress").classList.remove("hidden");
    document.getElementById("shopStepPayment").classList.add("hidden");
    document.getElementById("shopStepConfirmation").classList.add("hidden");
  }

  document.getElementById("shopCheckoutBtn").addEventListener("click", openCheckout);

  document.getElementById("shopCheckoutClose").addEventListener("click", () => {
    document.getElementById("shopCheckoutOverlay").classList.add("hidden");
  });

  document.getElementById("shopCheckoutOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById("shopCheckoutOverlay").classList.add("hidden");
    }
  });

  document.getElementById("shopToPayment").addEventListener("click", () => {
    document.getElementById("shopStepAddress").classList.add("hidden");
    document.getElementById("shopStepPayment").classList.remove("hidden");
  });

  document.getElementById("shopBackToAddress").addEventListener("click", () => {
    document.getElementById("shopStepPayment").classList.add("hidden");
    document.getElementById("shopStepAddress").classList.remove("hidden");
  });

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("shopCardFields").classList.toggle("hidden", radio.value !== "card");
      document.getElementById("shopUpiField").classList.toggle("hidden", radio.value !== "upi");
    });
  });

  document.getElementById("shopPlaceOrder").addEventListener("click", () => {
    const orderId = "ORD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    document.querySelector(".shop-order-id").textContent = "Order ID: " + orderId;
    document.getElementById("shopStepPayment").classList.add("hidden");
    document.getElementById("shopStepConfirmation").classList.remove("hidden");
    shopCart.length = 0;
    appliedCoupon = null;
    resetCouponUI();
    renderCart();
  });

  document.getElementById("shopContinueShopping").addEventListener("click", () => {
    document.getElementById("shopCheckoutOverlay").classList.add("hidden");
  });
});
