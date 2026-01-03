# SoulPrint: 全维度心理学与情绪建模 (基于权威理论)

## 核心目标
构建一个深度的 **"SoulPrint" (灵魂刻印)** 模块，严格基于用户提供的**六大心理学模型** (Big Five, MBTI, Enneagram, Jungian, DISC, HEXACO) 和 **16种融合情绪模型**。这不仅是一个报告，而是一个基于权威理论的**AI 人格与情绪镜像系统**。

## 理论模型架构
我们将把用户的 Prompt 数据映射到以下权威模型中：

### 1. 人格维度映射 (Psychological Mapping)
通过分析 Prompt 的用词、结构、意图和复杂度，计算以下维度的得分：
*   **Big Five (OCEAN)**: 开放性 (Openness)、尽责性 (Conscientiousness)、外向性 (Extraversion)、宜人性 (Agreeableness)、神经质 (Neuroticism)。
*   **MBTI**: E/I (社交倾向), S/N (实感/直觉), T/F (思考/情感), J/P (判断/知觉)。
*   **Enneagram (九型)**: 识别核心驱动力 (如追求完美、乐于付出、追求成功等)。
*   **Jungian Archetypes**: 识别原型 (英雄、智者、爱人、创造者、叛逆者)。
*   **DISC**: 支配 (D)、影响 (I)、稳健 (S)、谨慎 (C)。
*   **HEXACO**: 增加诚实-谦逊 (Honesty-Humility) 维度。

### 2. 情绪维度映射 (Emotional Mapping - 16 Core Emotions)
基于 **Valence (愉悦度) - Arousal (激活度) - Dominance (控制度)** 三维模型，将 Prompt 的情绪色彩映射到 16 种核心情绪：
*   **A组 (内耗类)**: 羞耻、焦虑、内疚、恐惧、厌恶
*   **B组 (外攻类)**: 嫉妒、愤怒、烦躁
*   **C组 (情感回响类)**: 怀旧、感动
*   **D组 (平和稳定类)**: 平静、满足
*   **E组 (正向能量类)**: 惊喜、快乐、自豪、爱

## 炸裂功能设计
1.  **Soul Radar (六维全能雷达)**:
    *   综合六大模型，提取最显著的六个特征维度，绘制动态雷达图。
2.  **Emotional Galaxy (情绪星云)**:
    *   基于 V-A-D 三维坐标，将 16 种情绪分类可视化。用户的 Prompt 会落在对应的“情绪星球”上，形成个人的情绪分布图。
3.  **Archetype Identity (原型身份卡)**:
    *   生成一张 RPG 风格角色卡，包含：
        *   **称号**: 基于荣格原型和九型人格 (e.g., "The Logical Creator" - 逻辑创造者)。
        *   **属性面板**: Big Five / DISC / HEXACO 数值。
        *   **核心驱动**: Enneagram 类型。
4.  **权威背书**:
    *   在界面显著位置标注所依据的心理学理论 (Based on Big Five, Jungian Psychology, etc.)，增强专业感。

## 技术实现方案
1.  **NLP 关键词词典构建**:
    *   建立六大模型及 16 种情绪的专属关键词库 (基于心理学定义的同义词/关联词)。
    *   例如：`Openness` -> [imagine, create, new, idea]; `Anxiety` (焦虑) -> [worry, fear, nervous, help, urgent]。
2.  **多维评分算法**:
    *   遍历所有 Prompt，进行关键词匹配和语义分析。
    *   计算每个维度的加权得分 (归一化到 0-100)。
3.  **Streamlit 可视化**:
    *   使用 `Plotly Polar` (雷达图) 展示人格维度。
    *   使用 `Plotly Scatter 3D` 展示 V-A-D 情绪模型。
    *   使用 HTML/CSS 构建高质感角色卡片。

## 执行步骤
1.  **数据层**: 在 `prompt_mirror.py` 中构建庞大的心理学关键词字典 (`PSYCH_KEYWORDS`, `EMOTION_KEYWORDS`)。
2.  **算法层**: 实现 `calculate_soul_print(df)` 函数，输出各模型得分。
3.  **UI 层**: 新增 `SoulPrint` Tab，布局雷达图、情绪星云和角色卡片。
4.  **验证**: 确保所有六个模型和 16 种情绪都有对应的展示或计算逻辑。