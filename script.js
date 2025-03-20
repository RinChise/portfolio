document.addEventListener("DOMContentLoaded", function () {
    // Tailwind Configuration
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
        console.error("Tailwind could not be loaded.");
    }
    
    // Navbar scroll behavior
    setupNavbar();
    
    // Card flip functionality
    setupCardFlip();

    // Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    } else {
        console.error("Lucide Icons could not be loaded.");
    }

    // Text hover effects
    setupTextHoverEffects();

    // Skill bars animation
    setupSkillBars();
    
    // Functions
    
    function setupNavbar() {
        let lastScrollTop = 0;
        let scrollTimeout = null;
        const navbar = document.getElementById('navbar');
        
        // Globale Flags
        window.isNavigatingViaNavbar = false;
        window.preventNavbarHide = false;
        
        if (navbar) {
            // Speichere die ursprüngliche Position
            const navLinks = navbar.querySelectorAll('a');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Setze beide Flags beim Klicken
                    window.isNavigatingViaNavbar = true;
                    window.preventNavbarHide = true;
                    
                    // Stelle sicher, dass die Navbar sofort sichtbar ist
                    navbar.classList.remove('-translate-y-24');
                    
                    // Zeitverzögerte Rücksetzung
                    setTimeout(() => {
                        window.isNavigatingViaNavbar = false;
                    }, 2500);
                    
                    // Noch längerer Timeout für preventNavbarHide
                    setTimeout(() => {
                        window.preventNavbarHide = false;
                    }, 3000);
                });
            });
            
            // Separates Event für das Scroll-Ereignis
            let scrollHandler = function() {
                // Beende frühzeitig, wenn Navbar-Navigation aktiv ist
                if (window.isNavigatingViaNavbar || window.preventNavbarHide) {
                    navbar.classList.remove('-translate-y-24');
                    return;
                }
                
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Immer am Anfang der Seite zeigen
                if (scrollTop < 50) {
                    navbar.classList.remove('-translate-y-24');
                    return;
                }
                
                // Normale Scroll-Logik
                if (scrollTop > lastScrollTop + 10) {
                    // Nach unten scrollen
                    navbar.classList.add('-translate-y-24');
                } else if (scrollTop < lastScrollTop - 5) {
                    // Nach oben scrollen
                    navbar.classList.remove('-translate-y-24');
                }
                
                lastScrollTop = scrollTop;
            };
            
            // Entfernt alle vorherigen Scroll-Events und fügt den neuen hinzu
            window.removeEventListener('scroll', scrollHandler);
            window.addEventListener('scroll', scrollHandler);
        }
    }
    
    function setupCardFlip() {
        const flipCard = document.getElementById("flip-card");
        const profilePic = document.getElementById("profile-pic");
        const profilePicAlt = document.getElementById("profile-pic-alt");

        // Check if all required elements exist before adding event listeners
        if (flipCard && profilePic && profilePicAlt) {
            let isFlipped = false;

            profilePic.addEventListener("click", function () {
                isFlipped = !isFlipped;
                flipCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
            });

            profilePicAlt.addEventListener("click", function () {
                isFlipped = !isFlipped;
                flipCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
            });
        } else {
            console.warn("One or more elements for card flip animation were not found");
        }
    }
    
    function setupTextHoverEffects() {
        // Available Tailwind colors for hover effect
        const colors = [
            "text-red-500", "text-blue-500", "text-green-500", "text-yellow-500",
            "text-purple-500", "text-pink-500", "text-indigo-500", "text-orange-500",
            "text-teal-500", "text-lime-500"
        ];

        // Hover text effect for letters with bouncing
        const textElements = document.querySelectorAll(".hover-text-effect");

        textElements.forEach(element => {
            const words = element.textContent.split(" "); // Split text into words
            element.innerHTML = ""; // Clear content

            words.forEach((word, wordIndex) => {
                let wordSpan = document.createElement("span");
                wordSpan.classList.add("whitespace-nowrap"); // Prevent word breaking

                word.split("").forEach((letter) => {
                    let span = document.createElement("span");
                    span.textContent = letter;

                    // Each letter gets inline-block to ensure it can move
                    span.classList.add(
                        "inline-block",
                        "transition-transform",
                        "duration-300",
                        "ease-out"
                    );

                    // Add hover color & bouncing effect
                    span.addEventListener("mouseenter", function () {
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        // Remove any existing text color classes
                        span.classList.forEach(cls => {
                            if (cls.startsWith("text-")) span.classList.remove(cls);
                        });
                        span.classList.add(randomColor);

                        // Only start bouncing animation if not already active
                        if (!span.classList.contains("animate-bounceLetter")) {
                            span.classList.add("animate-bounceLetter");

                            // Remove animation after 0.6s so it can be restarted
                            setTimeout(() => {
                                span.classList.remove("animate-bounceLetter");
                            }, 600);
                        }
                    });

                    wordSpan.appendChild(span);
                });

                element.appendChild(wordSpan);

                // Add space between words, but not at the end
                if (wordIndex < words.length - 1) {
                    element.appendChild(document.createTextNode(" "));
                }
            });
        });
    }
    
    function setupSkillBars() {
        const toggleSkills = document.getElementById("toggle-skills");
        const sliderBg = document.getElementById("slider-bg");
        const sliderCircle = document.getElementById("slider-circle");
        const techLabel = document.getElementById("tech-label");
        const softLabel = document.getElementById("soft-label");
        const technicalSkills = document.getElementById("technical-skills");
        const softSkills = document.getElementById("soft-skills");
        const skillBars = document.querySelectorAll(".skill-bar");
        const softSkillBars = document.querySelectorAll(".skill-bar-soft");
        
        // Tooltips for tech and soft skills
        const tooltipsTech = document.querySelectorAll(".tooltip-tech");
        const tooltipsSoft = document.querySelectorAll(".tooltip-soft");

        // Skill levels - percentage width for each bar
        const technicalLevels = ["44%", "68%", "40%", "15%", "66%", "60%", "27%", "25%", "20%", "18%"];
        const softSkillLevels = ["82%", "84%", "50%", "85%", "65%", "60%", "80%", "95%"];

        // Animate skill bars when they're in viewport
        function animateSkillBars() {
            skillBars.forEach((bar, index) => {
                if (index < technicalLevels.length) {
                    bar.style.width = isElementInViewport(bar) ? technicalLevels[index] : "0%";
                }
            });

            softSkillBars.forEach((bar, index) => {
                if (index < softSkillLevels.length) {
                    bar.style.width = isElementInViewport(bar) ? softSkillLevels[index] : "0%";
                }
            });
        }

        // Check if element is visible in viewport
        function isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top < window.innerHeight * 0.90 && 
                rect.bottom > window.innerHeight * 0.10
            );
        }

        // Handle scroll and resize events for animations
        window.addEventListener("scroll", animateSkillBars);
        window.addEventListener("resize", animateSkillBars);
        
        // Call immediately after loading
        setTimeout(animateSkillBars, 300);

        // Make sure all skill elements exist before adding event listeners
        if (toggleSkills && sliderBg && sliderCircle && techLabel && softLabel && 
            technicalSkills && softSkills) {
            
            // Toggle slider for charts & colors
            let showingSoftSkills = false;
            toggleSkills.checked = showingSoftSkills;
            updateUI(showingSoftSkills);

            toggleSkills.addEventListener("change", function () {
                showingSoftSkills = toggleSkills.checked;
                updateUI(showingSoftSkills);
                animateSkillBars(); // Update immediately
            });

            function updateUI(state) {
                // Toggle skills
                technicalSkills.classList.toggle("hidden", state);
                softSkills.classList.toggle("hidden", !state);

                // Toggle tooltips
                tooltipsTech.forEach(tooltip => tooltip.classList.toggle("hidden", state));
                tooltipsSoft.forEach(tooltip => tooltip.classList.toggle("hidden", !state));

                if (state) {
                    // Soft skills active
                    sliderBg.classList.remove("from-orange-500", "to-red-600");
                    sliderBg.classList.add("from-blue-600", "to-green-500");
                    sliderCircle.classList.add("translate-x-12");

                    techLabel.classList.remove("bg-gradient-to-r", "from-orange-500", "to-red-600", "text-transparent", "bg-clip-text");
                    techLabel.classList.add("text-white");

                    softLabel.classList.remove("text-white");
                    softLabel.classList.add("bg-gradient-to-r", "from-blue-600", "to-green-500", "text-transparent", "bg-clip-text");
                } else {
                    // Tech skills active
                    sliderBg.classList.remove("from-blue-600", "to-green-500");
                    sliderBg.classList.add("from-orange-500", "to-red-600");
                    sliderCircle.classList.remove("translate-x-12");

                    softLabel.classList.remove("bg-gradient-to-r", "from-blue-600", "to-green-500", "text-transparent", "bg-clip-text");
                    softLabel.classList.add("text-white");

                    techLabel.classList.remove("text-white");
                    techLabel.classList.add("bg-gradient-to-r", "from-orange-500", "to-red-600", "text-transparent", "bg-clip-text");
                }
            }
        } else {
            console.warn("One or more skill toggle elements were not found");
        }
    }
});