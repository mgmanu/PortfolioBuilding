
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. ELEMENT REFERENCES
    // =========================================

    const sidebar = document.getElementById("sidebar");
    const pages = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll(".nav-link");

    const heading = document.getElementById("page-heading");
    const breadcrumb = document.getElementById("breadcrumb");

    const pageNames = {
        dashboard: "Dashboard Overview",
        about: "About Me",
        skills: "My Skills",
        projects: "My Projects",
        experience: "Experience",
        contact: "Contact Me"
    };


    // =========================================
    // 2. PAGE NAVIGATION
    // =========================================

    function showPage(pageName) {

        const selectedPage = document.getElementById(pageName);

        if (!selectedPage) return;

        pages.forEach(page => {
            page.classList.remove("active");
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        selectedPage.classList.add("active");

        const activeLink = document.querySelector(
            `.nav-link[data-page="${pageName}"]`
        );

        if (activeLink) {
            activeLink.classList.add("active");
        }

        heading.textContent = pageNames[pageName];
        breadcrumb.textContent = pageName.toUpperCase();

        sidebar.classList.remove("open");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        animateProgressBars(selectedPage);

    }


    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            showPage(link.dataset.page);
        });

    });


    document.querySelectorAll("[data-navigate]").forEach(button => {

        button.addEventListener("click", () => {
            showPage(button.dataset.navigate);
        });

    });


    // =========================================
    // 3. MOBILE SIDEBAR
    // =========================================

    const menuToggle = document.getElementById("menuToggle");
    const mobileClose = document.getElementById("mobileClose");

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    mobileClose.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    document.addEventListener("click", event => {

        if (
            window.innerWidth <= 768 &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }

    });


    // =========================================
    // 4. LIVE DATE AND CLOCK
    // =========================================

    function updateClock() {

        const now = new Date();

        const clock = document.getElementById("digitalClock");
        const date = document.getElementById("clockDate");

        const dateOptions = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        };

        clock.textContent = now.toLocaleTimeString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                hour12: false
            }
        );

        date.textContent = now.toLocaleDateString(
            "en-IN",
            dateOptions
        );

    }

    updateClock();
    setInterval(updateClock, 1000);


    // =========================================
    // 5. ANIMATED STATISTICS
    // =========================================

    function animateCounters() {

        const counters = document.querySelectorAll(".counter");

        counters.forEach(counter => {

            if (counter.dataset.animated === "true") return;

            counter.dataset.animated = "true";

            const target = Number(counter.dataset.target);
            const duration = 1200;
            const startTime = performance.now();

            function updateCounter(currentTime) {

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const value = Math.floor(target * progress);

                counter.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }

            }

            requestAnimationFrame(updateCounter);

        });

    }

    animateCounters();


    // =========================================
    // 6. ANIMATED SKILL BARS
    // =========================================

    function animateProgressBars(container) {

        const bars = container.querySelectorAll(".progress-fill");

        bars.forEach(bar => {

            bar.style.width = "0";

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {
                    bar.style.width = bar.dataset.width;
                });

            });

        });

    }

    animateProgressBars(document.getElementById("dashboard"));


    // =========================================
    // 7. LEARNING ACTIVITY CHART
    // =========================================

    const chartBars = document.getElementById("chartBars");
    const chartPeriod = document.getElementById("chartPeriod");
    const chartTotal = document.getElementById("chartTotal");

    const chartData = {

        week: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [3, 5, 4, 7, 2, 8, 5],
            total: "34.0 hrs"
        },

        month: {
            labels: ["W1", "W2", "W3", "W4"],
            values: [12, 18, 15, 22],
            total: "67.0 hrs"
        }

    };


    function renderChart(period) {

        const data = chartData[period];

        chartBars.replaceChildren();

        chartTotal.textContent = data.total;

        const maxValue = 25;

        data.values.forEach((value, index) => {

            const column = document.createElement("div");
            column.className = "chart-column";

            const bar = document.createElement("div");
            bar.className = "chart-bar";

            bar.dataset.hours = value;

            const label = document.createElement("span");
            label.className = "chart-label";
            label.textContent = data.labels[index];

            column.appendChild(bar);
            column.appendChild(label);

            chartBars.appendChild(column);

            requestAnimationFrame(() => {

                bar.style.height =
                    `${(value / maxValue) * 100}%`;

            });

        });

    }

    renderChart("week");

    chartPeriod.addEventListener("change", () => {

        renderChart(chartPeriod.value);

        showToast("Activity chart updated.");

    });


    // =========================================
    // 8. PROJECT FILTERING
    // =========================================

    const filterButtons = document.querySelectorAll(".filter-btn");

    const projectCards = document.querySelectorAll(".project-card");

    const projectCount = document.getElementById("projectCount");

    const emptyProjects = document.getElementById("emptyProjects");


    function filterProjects(category) {

        let visibleCount = 0;

        projectCards.forEach(card => {

            const matches =
                category === "all" ||
                card.dataset.category === category;

            card.classList.toggle("hidden", !matches);

            if (matches) visibleCount++;

        });

        projectCount.textContent =
            `${String(visibleCount).padStart(2, "0")} PROJECTS`;

        emptyProjects.classList.toggle(
            "show",
            visibleCount === 0
        );

    }


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            filterProjects(button.dataset.filter);

        });

    });


    // =========================================
    // 9. PROJECT DETAIL MODAL
    // =========================================

    const projectModal = document.getElementById("projectModal");

    const modalTitle = document.getElementById("modalTitle");

    const modalDescription = document.getElementById("modalDescription");

    const modalTags = document.getElementById("modalTags");

    const modalLink = document.getElementById("modalLink");


    projectCards.forEach(card => {

        card.addEventListener("click", () => {

            modalTitle.textContent = card.dataset.title;

            modalDescription.textContent =
                card.dataset.description;

            modalTags.replaceChildren();

            const tags = card.dataset.tags.split(",");

            tags.forEach(tag => {

                const span = document.createElement("span");

                span.textContent = tag.trim();

                modalTags.appendChild(span);

            });

            const url = card.dataset.link;

            modalLink.href = url;

            projectModal.classList.add("show");

            document.body.classList.add("modal-open");

        });

    });


    function closeProjectModal() {

        projectModal.classList.remove("show");

        document.body.classList.remove("modal-open");

    }

    document.getElementById("modalClose").addEventListener(
        "click",
        closeProjectModal
    );

    projectModal.addEventListener("click", event => {

        if (event.target === projectModal) {
            closeProjectModal();
        }

    });

    modalLink.addEventListener("click", event => {

        if (
            modalLink.getAttribute("href") === "#"
        ) {

            event.preventDefault();

            showToast("Add your actual project URL first.");

        }

    });


    // =========================================
    // 10. COMMAND PALETTE
    // =========================================

    const commandOverlay = document.getElementById("commandOverlay");

    const commandInput = document.getElementById("commandInput");

    const commandResults = document.getElementById("commandResults");

    const commandItems = [
        ...document.querySelectorAll(".command-item")
    ];


    function openCommandPalette() {

        commandOverlay.classList.add("show");

        commandInput.value = "";

        filterCommands("");

        commandItems.forEach(item => {
            item.classList.remove("selected");
        });

        setTimeout(() => commandInput.focus(), 100);

    }


    function closeCommandPalette() {

        commandOverlay.classList.remove("show");

    }


    document.getElementById("searchTrigger").addEventListener(
        "click",
        openCommandPalette
    );


    function filterCommands(value) {

        const search = value.toLowerCase();

        let visibleCount = 0;

        commandItems.forEach(item => {

            const matches = item.textContent
                .toLowerCase()
                .includes(search);

            item.classList.toggle("filtered-out", !matches);

            item.classList.remove("selected");

            if (matches) visibleCount++;

        });

        let empty = document.querySelector(".command-empty");

        if (visibleCount === 0) {

            if (!empty) {

                empty = document.createElement("div");

                empty.className = "command-empty";

                commandResults.appendChild(empty);

            }

            empty.textContent = "No matching results found.";

        } else if (empty) {

            empty.remove();

        }

    }


    commandInput.addEventListener("input", () => {

        filterCommands(commandInput.value);

    });


    commandResults.addEventListener("click", event => {

        const item = event.target.closest(".command-item");

        if (!item || item.classList.contains("filtered-out")) {
            return;
        }

        closeCommandPalette();

        showPage(item.dataset.command);

    });


    commandInput.addEventListener("keydown", event => {

        const visible = commandItems.filter(item =>
            !item.classList.contains("filtered-out")
        );

        if (event.key === "Enter") {

            event.preventDefault();

            const selected = visible.find(item =>
                item.classList.contains("selected")
            );

            const target = selected || visible[0];

            if (target) target.click();

        }


        if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            if (!visible.length) return;

            let selected = visible.findIndex(item =>
                item.classList.contains("selected")
            );

            if (selected !== -1) {
                visible[selected].classList.remove("selected");
            }

            selected = event.key === "ArrowDown"
                ? (selected + 1) % visible.length
                : (selected <= 0
                    ? visible.length - 1
                    : selected - 1);

            visible[selected].classList.add("selected");

        }

    });


    commandOverlay.addEventListener("click", event => {

        if (event.target === commandOverlay) {
            closeCommandPalette();
        }

    });


    // =========================================
    // 11. KEYBOARD SHORTCUTS
    // =========================================

    document.addEventListener("keydown", event => {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            openCommandPalette();

        }

        if (event.key === "Escape") {

            closeCommandPalette();

            closeProjectModal();

            notificationPanel.classList.remove("show");

        }

    });


    // =========================================
    // 12. NOTIFICATION CENTER
    // =========================================

    const notificationBtn = document.getElementById("notificationBtn");

    const notificationPanel = document.getElementById("notificationPanel");

    const notificationList = notificationPanel.querySelector(
        ".notification-list"
    );

    const notificationDot = document.querySelector(".notification-dot");

    const notificationEmpty = document.getElementById(
        "notificationEmpty"
    );


    notificationBtn.addEventListener("click", event => {

        event.stopPropagation();

        notificationPanel.classList.toggle("show");

    });


    notificationPanel.addEventListener("click", event => {

        event.stopPropagation();

    });


    document.addEventListener("click", () => {

        notificationPanel.classList.remove("show");

    });


    document.getElementById("clearNotifications").addEventListener(
        "click",
        () => {

            notificationList.replaceChildren();

            notificationDot.style.display = "none";

            notificationEmpty.classList.add("show");

            showToast("Notifications cleared.");

        }
    );


    // =========================================
    // 13. THEME TOGGLE
    // =========================================

    const themeToggle = document.getElementById("themeToggle");

    const themeIcon = themeToggle.querySelector("i");


    function applyTheme(theme) {

        document.body.classList.toggle(
            "light-theme",
            theme === "light"
        );

        themeIcon.className = theme === "light"
            ? "fa-solid fa-sun"
            : "fa-regular fa-moon";

        localStorage.setItem("portfolio-theme", theme);

    }


    const savedTheme = localStorage.getItem("portfolio-theme");

    applyTheme(savedTheme === "light" ? "light" : "dark");


    themeToggle.addEventListener("click", () => {

        const isLight = document.body.classList.contains("light-theme");

        applyTheme(isLight ? "dark" : "light");

        showToast(
            isLight
                ? "Dark appearance activated."
                : "Light appearance activated."
        );

    });


    // =========================================
    // 14. TOAST NOTIFICATIONS
    // =========================================

    function showToast(message) {

        const container = document.getElementById("toastContainer");

        const toast = document.createElement("div");

        toast.className = "toast";

        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform = "translateX(20px)";

            setTimeout(() => toast.remove(), 300);

        }, 3000);

    }


    // =========================================
    // 15. CURSOR SPOTLIGHT
    // =========================================

    if (window.matchMedia("(pointer: fine)").matches) {

        document.addEventListener("mousemove", event => {

            document.body.style.setProperty(
                "--mouse-x",
                event.clientX + "px"
            );

            document.body.style.setProperty(
                "--mouse-y",
                event.clientY + "px"
            );

        });

    }


    // =========================================
    // 16. BACK TO TOP
    // =========================================

    const backToTop = document.getElementById("backToTop");

    function scrollToTop() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    window.addEventListener("scroll", () => {

        backToTop.classList.toggle(
            "show",
            window.scrollY > 300
        );

    });


    backToTop.addEventListener("click", scrollToTop);

    document.getElementById("footerTop").addEventListener(
        "click",
        scrollToTop
    );


    // =========================================
    // 17. CONTACT FORM
    // =========================================

    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("senderName").value.trim();

        const email = document.getElementById("senderEmail").value.trim();

        const message = document.getElementById("senderMessage").value.trim();

        const formMessage = document.getElementById("formMessage");

        if (!name || !email || !message) {

            formMessage.textContent = "Please complete all fields.";

            return;

        }

        const recipient = "yourmail@example.com";

        const subject = encodeURIComponent(
            `Portfolio enquiry from ${name}`
        );

        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        formMessage.textContent =
            "Opening your default email application...";

        window.location.href =
            `mailto:${recipient}?subject=${subject}&body=${body}`;

    });


    // =========================================
    // 18. INITIALIZATION
    // =========================================

    showPage("dashboard");

    filterProjects("all");

    renderChart("week");

    showToast("Welcome to MONARCH.");

});
