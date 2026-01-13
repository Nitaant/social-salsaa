// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        // Toggle the 'active' class to show/hide the menu
        navLinks.classList.toggle('active');
    });

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- SIMPLE SCROLL ANIMATION (Optional) ---
    // This adds a 'fade-in' class to elements as you scroll down
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.card');
    hiddenElements.forEach((el) => observer.observe(el));
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    // Get your key from: https://platform.openai.com/api-keys
    // Leave empty '' to use the "Offline Mode" fallback
    const OPENAI_API_KEY = ''; 

    // --- DOM ELEMENTS ---
    const generateBtn = document.getElementById('generateBtn');
    const ideaDisplay = document.getElementById('ideaDisplay');
    const industryInput = document.getElementById('industryInput');
    const loader = document.getElementById('loader');

    // --- FALLBACK IDEAS (Offline Mode) ---
    const offlineIdeas = [
        "Start a fake beef with a competitor brand on Twitter.",
        "Post a photo of your office dog with a CEO caption.",
        "Share a screenshot of your notes app with 'rejected ideas'.",
        "Do a 'Day in the life' but only show the chaotic parts.",
        "Film your team trying the spiciest hot sauce available.",
        "Post a blurry photo and caption it 'aesthetic'.",
        "Ask your followers to roast your logo."
    ];

    if(generateBtn && ideaDisplay) {
        
        generateBtn.addEventListener('click', async () => {
            const industry = industryInput.value.trim() || "General Brand";
            
            // UI States
            ideaDisplay.style.display = 'none';
            loader.classList.remove('hidden');
            generateBtn.disabled = true;
            generateBtn.innerText = "COOKING... 🍳";

            try {
                if (!OPENAI_API_KEY) {
                    // Simulate AI delay for offline mode
                    setTimeout(() => {
                        const randomIdea = offlineIdeas[Math.floor(Math.random() * offlineIdeas.length)];
                        displayResult(` ${randomIdea}`);
                    }, 1500);
                } else {
                    // Call OpenAI API
                    const aiResponse = await fetchAIResponse(industry);
                    displayResult(aiResponse);
                }
            } catch (error) {
                console.error(error);
                displayResult("❌ My brain broke. Try again.");
            }
        });
    }

    // --- HELPER FUNCTIONS ---

    function displayResult(text) {
        loader.classList.add('hidden');
        ideaDisplay.style.display = 'block';
        ideaDisplay.innerText = text;
        generateBtn.disabled = false;
        generateBtn.innerText = "GENERATE CHAOS";
    }

    async function fetchAIResponse(industry) {
        const url = 'https://api.openai.com/v1/chat/completions';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "You are a chaotic, viral marketing genius. Give me ONE short, funny, slightly unhinged social media content idea for the specific industry provided. Keep it under 20 words."
                }, {
                    role: "user",
                    content: `Industry: ${industry}`
                }],
                temperature: 0.9
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        return data.choices[0].message.content.replace(/"/g, '');
    }
});