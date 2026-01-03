I will upgrade the **SoulPrint** module to a professional-grade psychological analysis suite, integrating all 6 personality models + 16 emotion models into dedicated "Sessions" as requested.

### **Completion Status: 100% (Target)**

### **Execution Plan**

1.  **System Architecture Upgrade**
    *   **Refactor `My Soul` Tab**: Abandon the simple split. Create a unified, scrollable "Soul Report" with **7 Distinct Sessions**.
    *   **Fix HTML Rendering**: Use `textwrap.dedent` to solve the indentation issue causing the "Soul Card" to display as raw code.
    *   **Fix Variable Shadowing**: Ensure `t` (translation function) is not overwritten by local variables, resolving the `TypeError`.

2.  **Implementation: The 7 Sessions (Deep Dive)**
    *   **Session 1: Big Five (OCEAN)**
        *   **Content**: Authoritative definition + Wiki Link.
        *   **Viz**: Horizontal Bar Chart showing the 5 dimensions.
    *   **Session 2: MBTI**
        *   **Content**: Jungian Typology explanation + Wiki Link.
        *   **Viz**: Diverging Bar Chart (E vs I, N vs S, T vs F, J vs P).
    *   **Session 3: Enneagram**
        *   **Content**: 9 Types overview + Wiki Link.
        *   **Viz**: Radar Chart specifically for the 9 types.
    *   **Session 4: Jungian Archetypes**
        *   **Content**: Collective Unconscious theory + Wiki Link.
        *   **Viz**: Column Chart of the 5 archetypes.
    *   **Session 5: DISC**
        *   **Content**: Behavioral style definition + Wiki Link.
        *   **Viz**: Donut Chart of D-I-S-C distribution.
    *   **Session 6: HEXACO**
        *   **Content**: The "Honesty-Humility" addition + Wiki Link.
        *   **Viz**: Bar Chart highlighting the H-factor.
    *   **Session 7: Emotional Spectrum (The Core)**
        *   **Content**: Full V-A-D Model explanation + **User-provided Mnemonics** ("羞焦愧怕恶最苦...", "愉悦判断好坏...").
        *   **Viz 1 (Optimized 3D)**: "Emotional Galaxy" with fixed axes (no flickering), better camera angle, and "Star" markers.
        *   **Viz 2 (2D Summary)**: A Heatmap or Grouped Bar Chart of the 16 emotions sorted by the 5 groups (A-E).

3.  **Quality of Life Improvements**
    *   **3D Chart Optimization**: Lock axis ranges `[-1, 1]` to prevent "disappearing axes". Improve marker sizing logic.
    *   **Code Hygiene**: Strict type checking and safe HTML generation.

### **Outcome**
A "Mind Cockpit" that not only analyzes but *educates*, providing a comprehensive psychological profile backed by authoritative definitions and high-fidelity visualizations.