
document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // 1. PAGE NAVIGATION
    // ============================

    const navLinks = document.querySelectorAll(".nav-link");
    const pages = document.querySelectorAll(".page");
    const heading = document.getElementById("page-heading");
    const breadcrumb = document.getElementById("breadcrumb");
    const sidebar = document.getElementById("sidebar");

    const pageNames = {
        dashboard: "Dashboard Overview",
        about: "About Me",
        skills: "My Skills",
        projects: "My Projects",
        experience: "Experience",
        contact: "Contact Me"
    };

    function showPage(pageName) {

        pages.forEach(page => {
            page.classList.remove("active");
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        const selectedPage = document.getElementById(pageName);

        if (!selectedPage) return;

        selectedPage.classList.add("active");

        const selectedLink = document.querySelector(
            `.nav-link[data-page="${pageName}"]`
        );

        if (selectedLink) {
            selectedLink.classList.add("active");
        }

        heading.textContent = pageNames[pageName];
        breadcrumb.textContent = pageName.toUpperCase();

        sidebar.classList.remove("open");

        animateProgressBars(selectedPage);
    }

    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            showPage(link.dataset.page);
        });

    });


    // Navigate using dashboard buttons

    document.querySelectorAll("[data-navigate]").forEach(button => {

        button.addEventListener("click", () => {
            showPage(button.dataset.navigate);
        });

    });


    // ============================
    // 2. MOBILE SIDEBAR
    // ============================

    const menuToggle = document.getElementById("menuToggle");

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
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


    // ============================
    // 3. CURRENT DATE
    // ============================

    const currentDate = document.getElementById("currentDate");

    currentDate.textContent = new Date().toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );


    // ============================
    // 4. ANIMATED COUNTERS
    // ============================

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

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


    // ============================
    // 5. SKILL BAR ANIMATION
    // ============================

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


    // ============================
    // 6. PROJECT FILTERING
    // ============================

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            projectCards.forEach(card => {

                const category = card.dataset.category;

                if (filter === "all" || category === filter) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }

            });

        });

    });


    // ============================
    // 7. THEME TOGGLE
    // ============================

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle.querySelector("i");

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

        const isLight = document.body.classList.contains("light-theme");

        themeIcon.className = isLight
            ? "fa-solid fa-sun"
            : "fa-regular fa-moon";

    });


    // ============================
    // 8. CONTACT FORM
    // ============================

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

        formMessage.textContent = "Opening your email application...";

        window.location.href =
            `mailto:${recipient}?subject=${subject}&body=${body}`;

    });


    // ============================
    // 9. INITIAL PAGE
    // ============================

    showPage("dashboard");

});
