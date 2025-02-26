document.addEventListener("DOMContentLoaded", function () {
    // Tailwind-Konfiguration
    if (typeof tailwind !== "undefined") {
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ["Outfit", "serif"]
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
                        }
                    },
                    animation: {
                        bounceLetter: "bounceLetter 0.6s ease-in-out"
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
    const technicalSkills = document.getElementById("technical-skills");
    const softSkills = document.getElementById("soft-skills");
    const skillBars = document.querySelectorAll(".skill-bar");
    const softSkillBars = document.querySelectorAll(".skill-bar-soft");

    const technicalLevels = ["80%", "70%", "85%", "75%", "90%", "80%", "70%", "65%"];
    const softSkillLevels = ["90%", "85%", "80%", "75%", "85%", "70%", "100%", "50%"];

    function animateSkillBars() {
        const windowHeight = window.innerHeight;
        const middlePoint = windowHeight / 2;
        const activationRange = 300;

        skillBars.forEach((bar, index) => {
            const barPosition = bar.parentElement.getBoundingClientRect().top;
            if (barPosition < middlePoint + activationRange && barPosition > middlePoint - activationRange) {
                bar.style.width = technicalLevels[index];
            } else {
                bar.style.width = "0%"; // Zurücksetzen, wenn nicht sichtbar
            }
        });

        softSkillBars.forEach((bar, index) => {
            const barPosition = bar.parentElement.getBoundingClientRect().top;
            if (barPosition < middlePoint + activationRange && barPosition > middlePoint - activationRange) {
                bar.style.width = softSkillLevels[index];
            } else {
                bar.style.width = "0%";
            }
        });
    }

    // Dynamische Legende mit Hover-Effekt
    const techDescriptions = document.querySelectorAll(".tech-desc");
    const socialDescriptions = document.querySelectorAll(".social-desc");

    function updateLegend(type) {
        if (type === "tech") {
            techDescriptions.forEach(desc => desc.classList.remove("hidden"));
            socialDescriptions.forEach(desc => desc.classList.add("hidden"));
        } else {
            socialDescriptions.forEach(desc => desc.classList.remove("hidden"));
            techDescriptions.forEach(desc => desc.classList.add("hidden"));
        }
    }

    // Scroll-Event für die Animation & Legenden-Wechsel
    window.addEventListener("scroll", () => {
        animateSkillBars();

        if (!technicalSkills.classList.contains("hidden")) {
            updateLegend("tech");
        } else {
            updateLegend("social");
        }
    });

    // Toggle für Tech & Soft Skills
    const toggleButton = document.getElementById("toggle-skills");
    let showingSoftSkills = false;

    toggleButton.addEventListener("click", function () {
        showingSoftSkills = !showingSoftSkills;

        // Wechsel der Diagramme
        technicalSkills.classList.toggle("hidden");
        softSkills.classList.toggle("hidden");

        // Wechsel der Legenden-Texte
        if (showingSoftSkills) {
            toggleButton.textContent = "Technische Skills anzeigen";
            updateLegend("social");
            toggleButton.classList.remove("hover:from-blue-600", "hover:via-green-600", "hover:to-yellow-600");
            toggleButton.classList.add("hover:from-pink-700", "hover:via-red-700", "hover:to-orange-500");
        } else {
            toggleButton.textContent = "Soft Skills anzeigen";
            updateLegend("tech");
            toggleButton.classList.remove("hover:from-pink-700", "hover:via-red-700", "hover:to-orange-500");
            toggleButton.classList.add("hover:from-blue-600", "hover:via-green-600", "hover:to-yellow-600");
        }

        // Stelle sicher, dass Balken erneut animieren
        animateSkillBars();
    });

    // Starte Animation direkt beim Laden
    animateSkillBars();
});
