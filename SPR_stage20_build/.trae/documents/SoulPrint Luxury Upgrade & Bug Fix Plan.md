I will upgrade the **SoulPrint** module to a "Luxury Professional Edition" and fix the reported bugs.

### 1. 🐛 Fix Functional Bugs & Data Issues
- **Refactor Scoring Algorithm (`calculate_soul_metrics`)**:
    - **Issue**: Scores are currently global percentages (all summing to 100), leading to low values (<20) for individual traits.
    - **Fix**: Switch to **Relative Dominance Scoring**. For each model (e.g., Big Five), identify the maximum raw score and scale it to ~95/100. Other traits will be scaled proportionally. This ensures the "Dominant Trait" always looks strong (high score) and differences are visible.
- **Fix HTML Rendering**: Ensure the "Soul Card" HTML is correctly formatted and rendered. I will inspect the `textwrap.dedent` usage and ensure `unsafe_allow_html=True` is effective.
- **Fix "Undefined" Labels**: Explicitly define `xaxis_title` and `yaxis_title` for all Plotly charts to prevent "undefined" placeholders.

### 2. 🎨 Luxury UI/Visual Upgrade
- **Global Style Injection**: Update `luxury_css` to include richer textures, glassmorphism effects, and premium font settings.
- **Premium Chart Theme (`luxury_chart`)**:
    - **Typography**: Enforce "Helvetica Neue" / sans-serif with gold/silver accents.
    - **Colors**: Use a premium palette (Champagne Gold `#D4AF37`, Royal Purple `#6A5ACD`, Teal `#4ECDC4`).
    - **Layout**: Remove unnecessary gridlines, add subtle borders, and ensure transparent backgrounds.
- **Specific Chart Polish**:
    - **Big Five**: Thicker bars, better contrast.
    - **MBTI**: Distinct colors for opposing traits, clear center line.
    - **Enneagram**: Filled radar chart with glowing edges.
    - **Galaxy 3D**: Add visual origin (0,0,0) axes, increase node size, and improve depth perception.

### 3. 🎭 Session 7 (Emotions) Overhaul
- **Simplify Mnemonics**: Rewrite the "Memory Mnemonics" section to be concise, punchy, and instantly understandable (removing dense text).
- **3D Galaxy Improvements**:
    - **Origin Marker**: Add visible X/Y/Z axes lines crossing at (0,0,0).
    - **Scaling**: Increase bubble size for better visibility.
    - **Context**: Clearer labels for Valence/Arousal/Dominance.

### 4. 🛠 Execution Steps
1.  **Modify `mirror/prompt_mirror.py`**:
    - Update `calculate_soul_metrics` logic.
    - Update `luxury_chart` helper function.
    - Rewrite chart generation code for all 7 sessions with new styling and titles.
    - Refactor Session 7 (3D chart + Mnemonics).
    - Update CSS injection.
2.  **Verify**: Check for linter errors and ensure the server reloads.
