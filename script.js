document.addEventListener("DOMContentLoaded", function () {
    // Tailwind-Konfiguration setzen
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
    // Neue Funktion für die Scroll-Animation der Balken
    const skillBars = document.querySelectorAll(".skill-bar");
    
    // Präzise angepasste Werte für die Linien – kein zu viel / zu wenig
    const skillLevels = [
        "calc(66.66% + 0.5px)",  // 1. Linie (Basics)
        "calc(100% - 0.25px)",  // 2. Linie (Gemeistert)
        "calc(66.66% + 0.5px)", 
        "calc(66.66% + 0.5px)", 
        "calc(100% - 0.25px)",  
        "calc(33.33% + 0.5px)"   // Mitte (Lernfähig)
    ]; 

    function checkScroll() {
        const windowHeight = window.innerHeight;
        const middlePoint = windowHeight / 2;
        const activationRange = 300;

        skillBars.forEach((bar, index) => {
            const barPosition = bar.parentElement.getBoundingClientRect().top;

            if (barPosition < middlePoint + activationRange && barPosition > middlePoint - activationRange) {
                bar.style.width = skillLevels[index]; // Pixelgenaue Anpassung
            } else {
                bar.style.width = "0%";
            }
        });
    }

        window.addEventListener("scroll", checkScroll);
        checkScroll(); // Falls Balken direkt sichtbar ist
});
