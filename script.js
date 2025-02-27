document.addEventListener("DOMContentLoaded", function () {
    // Tailwind-Konfiguration
    if (typeof tailwind !== "undefined") {
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ["Outfit", "serif"],
                    },
                    colors: {
                        primary: "#db6e02",
                        dark: "#1A1A1A",
                        panel: "#212121"
                    },
                    keyframes: {
                        bounceLetter: {
                            "0%": { transform: "translateY(0)" },
                            "30%": { transform: "translateY(-8px)" },
                            "50%": { transform: "translateY(4px)" },
                            "70%": { transform: "translateY(-4px)" },
                            "100%": { transform: "translateY(0)" }
                        },
                        wiggleArrow: {
                            "0%": { transform: "translateX(0)" },
                            "50%": { transform: "translateX(5px)" },
                            "100%": { transform: "translateX(0px)" }
                        }
                    },
                    animation: {
                        bounceLetter: "bounceLetter 0.6s ease-in-out",
                        wiggleArrow: "wiggleArrow 0.6s ease-in-out infinite"
                    }
                }
            }
        };
    } else {
        console.error("Tailwind konnte nicht geladen werden.");
    }

    // Lucide Icons aktivieren
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    } else {
        console.error("Lucide Icons konnten nicht geladen werden.");
    }

    // Liste der möglichen Tailwind-Farben
    const colors = [
        "text-red-500", "text-blue-500", "text-green-500", "text-yellow-500",
        "text-purple-500", "text-pink-500", "text-indigo-500", "text-orange-500",
        "text-teal-500", "text-lime-500"
    ];

    // Hover-Text-Effekt für Buchstaben mit Bouncing
    const textElements = document.querySelectorAll(".hover-text-effect");

    textElements.forEach(element => {
        const words = element.textContent.split(" "); // Text in Wörter aufteilen
        element.innerHTML = ""; // Inhalt leeren

        words.forEach((word, wordIndex) => {
            let wordSpan = document.createElement("span");
            wordSpan.classList.add("whitespace-nowrap"); // Verhindert Wort-Trennung

            word.split("").forEach((letter, letterIndex) => {
                let span = document.createElement("span");
                span.textContent = letter;

                // JEDER BUCHSTABE bekommt `inline-block`, um sicherzustellen, dass `M` sich bewegen kann
                span.classList.add(
                    "inline-block",
                    "transition-transform",
                    "duration-300",
                    "ease-out"
                );

                // Füge Hover-Farbe & Bouncing-Effekt hinzu
                span.addEventListener("mouseenter", function () {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    span.classList.forEach(cls => {
                        if (cls.startsWith("text-")) span.classList.remove(cls);
                    });
                    span.classList.add(randomColor);

                    // Bouncing Animation nur neu starten, wenn nicht bereits aktiv
                    if (!span.classList.contains("animate-bounceLetter")) {
                        span.classList.add("animate-bounceLetter");

                        // Entferne die Animation nach 0.6s, damit sie neu gestartet werden kann
                        setTimeout(() => {
                            span.classList.remove("animate-bounceLetter");
                        }, 600);
                    }
                });

                wordSpan.appendChild(span);
            });

            element.appendChild(wordSpan);

            // Leerzeichen zwischen Wörtern, aber nicht am Ende
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(" "));
            }
        });
        
    });

    // Skill-Balken-Animation
    const toggleSlider = document.getElementById("toggle-skills");
    const sliderBg = document.getElementById("slider-bg");
    const sliderCircle = document.getElementById("slider-circle");
    const techLabel = document.getElementById("tech-label");
    const softLabel = document.getElementById("soft-label");
    const technicalSkills = document.getElementById("technical-skills");
    const softSkills = document.getElementById("soft-skills");
    const skillBars = document.querySelectorAll(".skill-bar");
    const softSkillBars = document.querySelectorAll(".skill-bar-soft");

    // Tooltips für Tech- und Soft-Skills
    const tooltipsTech = document.querySelectorAll(".tooltip-tech");
    const tooltipsSoft = document.querySelectorAll(".tooltip-soft");

    const technicalLevels = ["80%", "70%", "85%", "75%", "90%", "80%", "70%", "100%"];
    const softSkillLevels = ["90%", "85%", "80%", "75%", "85%", "70%", "100%", "90%"];

    function animateSkillBars() {
        skillBars.forEach((bar, index) => {
            bar.style.width = isElementInViewport(bar) ? technicalLevels[index] : "0%";
        });

        softSkillBars.forEach((bar, index) => {
            bar.style.width = isElementInViewport(bar) ? softSkillLevels[index] : "0%";
        });
    }

    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight * 0.90 && 
            rect.bottom > window.innerHeight * 0.10
        );
    }

    // Scroll-Event für die Animation
    window.addEventListener("scroll", animateSkillBars);
    window.addEventListener("resize", animateSkillBars);
    animateSkillBars(); // Direkt nach dem Laden aufrufen

    // Toggle-Slider für Diagramme & Farben
    let showingSoftSkills = false;
    toggleSlider.checked = showingSoftSkills;
    updateUI(showingSoftSkills);

    toggleSlider.addEventListener("change", function () {
        showingSoftSkills = toggleSlider.checked;
        updateUI(showingSoftSkills);
        animateSkillBars(); // Direkt updaten
    });

    function updateUI(state) {
        // Skills umschalten
        technicalSkills.classList.toggle("hidden", state);
        softSkills.classList.toggle("hidden", !state);

        // Tooltips umschalten
        tooltipsTech.forEach(tooltip => tooltip.classList.toggle("hidden", state));
        tooltipsSoft.forEach(tooltip => tooltip.classList.toggle("hidden", !state));

        if (state) {
            // Soft-Skills aktiv
            sliderBg.classList.remove("from-orange-500", "to-red-600");
            sliderBg.classList.add("from-blue-600", "to-green-500");
            sliderCircle.classList.add("translate-x-12");

            techLabel.classList.remove("bg-gradient-to-r", "from-orange-500", "to-red-600", "text-transparent", "bg-clip-text");
            techLabel.classList.add("text-white");

            softLabel.classList.remove("text-white");
            softLabel.classList.add("bg-gradient-to-r", "from-blue-600", "to-green-500", "text-transparent", "bg-clip-text");
        } else {
            // Tech-Skills aktiv
            sliderBg.classList.remove("from-blue-600", "to-green-500");
            sliderBg.classList.add("from-orange-500", "to-red-600");
            sliderCircle.classList.remove("translate-x-12");

            softLabel.classList.remove("bg-gradient-to-r", "from-blue-600", "to-green-500", "text-transparent", "bg-clip-text");
            softLabel.classList.add("text-white");

            techLabel.classList.remove("text-white");
            techLabel.classList.add("bg-gradient-to-r", "from-orange-500", "to-red-600", "text-transparent", "bg-clip-text");
        }
    }
});
