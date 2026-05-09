<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SUPER SIMON — הוראות משחק</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Heebo:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --red: #ff1e1e;
            --blue: #005cae;
            --dark: #0b1117;
            --card: #111821;
            --border: #1e2d3d;
            --text: #e2e8f0;
            --muted: #64748b;
            --accent: #38bdf8;
        }

        body {
            font-family: 'Heebo', sans-serif;
            background: var(--dark);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Hero */
        .hero {
            position: relative;
            background: linear-gradient(to bottom, var(--red) 0%, var(--red) 45%, var(--blue) 45%, var(--blue) 100%);
            padding: 60px 20px 80px;
            text-align: center;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.45) 0%, transparent 70%);
        }

        .hero-title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(2.5rem, 10vw, 5rem);
            font-weight: 900;
            color: white;
            letter-spacing: 4px;
            text-shadow: 0 0 40px rgba(255,255,255,0.3);
            position: relative;
            z-index: 1;
        }

        .hero-sub {
            font-size: 1.1rem;
            color: rgba(255,255,255,0.75);
            margin-top: 10px;
            font-weight: 300;
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
        }

        /* Grid of cells demo */
        .mini-board {
            display: grid;
            grid-template-columns: repeat(3, 52px);
            gap: 8px;
            margin: 28px auto 0;
            width: fit-content;
            position: relative;
            z-index: 1;
        }

        .mini-cell {
            width: 52px;
            height: 52px;
            border-radius: 12px;
            border: 3px solid rgba(0,0,0,0.4);
            box-shadow: inset 0 4px 8px rgba(255,255,255,0.25), inset 0 -4px 8px rgba(0,0,0,0.3);
            animation: pulse-cell 2.4s ease-in-out infinite;
        }
        .mini-cell:nth-child(1) { background:#ff1e1e; animation-delay: 0s; }
        .mini-cell:nth-child(2) { background:#ffcc00; animation-delay: 0.2s; }
        .mini-cell:nth-child(3) { background:#00cc44; animation-delay: 0.4s; }
        .mini-cell:nth-child(4) { background:#1e90ff; animation-delay: 0.6s; }
        .mini-cell:nth-child(5) { background:#ff6600; animation-delay: 0.8s; }
        .mini-cell:nth-child(6) { background:#9933ff; animation-delay: 1.0s; }
        .mini-cell:nth-child(7) { background:#ff0099; animation-delay: 1.2s; }
        .mini-cell:nth-child(8) { background:#00ffcc; animation-delay: 1.4s; }
        .mini-cell:nth-child(9) { background:#ffff00; animation-delay: 1.6s; }

        @keyframes pulse-cell {
            0%, 80%, 100% { opacity: 0.7; transform: scale(1); }
            40% { opacity: 1; transform: scale(1.12); box-shadow: 0 0 20px currentColor, inset 0 4px 8px rgba(255,255,255,0.4); }
        }

        /* Content */
        .content {
            max-width: 680px;
            margin: 0 auto;
            padding: 48px 20px 64px;
        }

        /* Section */
        .section {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
        }

        .section::before {
            content: '';
            position: absolute;
            top: 0; right: 0;
            width: 4px;
            height: 100%;
            background: var(--accent);
            border-radius: 0 20px 20px 0;
        }

        .section-icon {
            font-size: 2rem;
            margin-bottom: 12px;
            display: block;
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 1rem;
            color: var(--accent);
            letter-spacing: 2px;
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .section p {
            color: #94a3b8;
            line-height: 1.8;
            font-size: 1rem;
        }

        /* Steps */
        .steps { list-style: none; display: flex; flex-direction: column; gap: 16px; }

        .step {
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }

        .step-num {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--red), #ff6b6b);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.85rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 0 16px rgba(255,30,30,0.4);
        }

        .step-text {
            color: #94a3b8;
            line-height: 1.7;
            padding-top: 6px;
        }

        .step-text strong { color: var(--text); }

        /* Stats grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
        }

        .stat-card {
            background: #0b1117;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px;
            text-align: center;
        }

        .stat-icon { font-size: 1.6rem; display: block; margin-bottom: 6px; }
        .stat-label { color: var(--muted); font-size: 0.8rem; letter-spacing: 1px; }
        .stat-desc { color: var(--text); font-size: 0.9rem; margin-top: 4px; font-weight: 700; }

        /* Color grid */
        .color-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .color-cell {
            border-radius: 12px;
            height: 52px;
            border: 3px solid rgba(0,0,0,0.4);
            box-shadow: inset 0 4px 8px rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            color: rgba(255,255,255,0.8);
            text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        }

        /* Controls */
        .controls-list { display: flex; flex-direction: column; gap: 12px; }

        .ctrl-row {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #0b1117;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px 16px;
        }

        .ctrl-btn {
            font-size: 1.4rem;
            width: 42px;
            text-align: center;
            flex-shrink: 0;
        }

        .ctrl-desc { color: #94a3b8; font-size: 0.95rem; }
        .ctrl-desc strong { color: var(--text); }

        /* Keyboard hint */
        .kbd-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 12px;
        }

        kbd {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: #1b2430;
            border: 2px solid var(--border);
            border-bottom: 4px solid #0b1117;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.8rem;
            color: var(--accent);
            font-weight: 700;
        }

        /* Tip */
        .tip {
            background: linear-gradient(135deg, rgba(56,189,248,0.08), rgba(124,58,237,0.08));
            border: 1px solid rgba(56,189,248,0.2);
            border-radius: 14px;
            padding: 18px 22px;
            color: #7dd3fc;
            font-size: 0.95rem;
            line-height: 1.7;
            margin-top: 24px;
            text-align: center;
        }

        .tip strong { color: white; }

        /* Footer */
        footer {
            text-align: center;
            color: var(--muted);
            font-size: 0.85rem;
            padding: 32px 20px;
            border-top: 1px solid var(--border);
        }

        footer span {
            font-family: 'Orbitron', sans-serif;
            color: var(--accent);
            font-size: 0.8rem;
        }

        @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr; }
            .color-grid { grid-template-columns: repeat(3, 1fr); }
        }
    </style>
</head>
<body>

<div class="hero">
    <h1 class="hero-title">SUPER SIMON</h1>
    <p class="hero-sub">הוראות משחק</p>
    <div class="mini-board">
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
    </div>
</div>

<div class="content">

    <!-- What is the game -->
    <div class="section">
        <span class="section-icon">🎮</span>
        <div class="section-title">מה זה סופר סיימון?</div>
        <p>סופר סיימון הוא משחק זיכרון ורצפים. המחשב מדליק תאים בסדר אקראי — ואתם צריכים לחזור על אותו רצף בדיוק, בסדר הנכון. ככל שתצליחו יותר, הרצף מתארך והקצב מואץ!</p>
    </div>

    <!-- How to play -->
    <div class="section">
        <span class="section-icon">📋</span>
        <div class="section-title">איך משחקים?</div>
        <ul class="steps">
            <li class="step">
                <div class="step-num">1</div>
                <div class="step-text"><strong>הזן שם שחקן</strong> במסך הפתיחה ולחץ כניסה.</div>
            </li>
            <li class="step">
                <div class="step-num">2</div>
                <div class="step-text"><strong>צפה ברצף</strong> — המחשב ידליק תאים אחד אחרי השני. שים לב היטב לסדר!</div>
            </li>
            <li class="step">
                <div class="step-num">3</div>
                <div class="step-text"><strong>חזור על הרצף</strong> — לחץ על התאים באותו סדר שבו הוצגו.</div>
            </li>
            <li class="step">
                <div class="step-num">4</div>
                <div class="step-text"><strong>עלה שלב</strong> — כל 5 רצפים מוצלחים תעלה שלב, הקצב יואץ ויתווסף תא לרצף.</div>
            </li>
            <li class="step">
                <div class="step-num">5</div>
                <div class="step-text"><strong>שמור על הניסיונות</strong> — יש לך 3 ניסיונות. טעות או פקיעת זמן מורידים ניסיון אחד.</div>
            </li>
        </ul>
    </div>

    <!-- HUD -->
    <div class="section">
        <span class="section-icon">📊</span>
        <div class="section-title">מד המשחק</div>
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-icon">⏱️</span>
                <div class="stat-label">זמן</div>
                <div class="stat-desc">שניות לתורך</div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🧠</span>
                <div class="stat-label">שלב</div>
                <div class="stat-desc">השלב הנוכחי</div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">⭐</span>
                <div class="stat-label">נקודות</div>
                <div class="stat-desc">סך הרצפים שהצלחת</div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🔁</span>
                <div class="stat-label">ניסיונות</div>
                <div class="stat-desc">3 ניסיונות בסך הכל</div>
            </div>
        </div>
    </div>

    <!-- Colors -->
    <div class="section">
        <span class="section-icon">🎨</span>
        <div class="section-title">צבעי הלוח</div>
        <p style="margin-bottom:16px;">ללוח 9 תאים בצבעים שונים. כל תא מנגן גם צליל ייחודי כשנלחץ.</p>
        <div class="color-grid">
            <div class="color-cell" style="background:#ff1e1e;">1 — אדום</div>
            <div class="color-cell" style="background:#ffcc00; color:rgba(0,0,0,0.7);">2 — צהוב</div>
            <div class="color-cell" style="background:#00cc44;">3 — ירוק</div>
            <div class="color-cell" style="background:#1e90ff;">4 — כחול</div>
            <div class="color-cell" style="background:#ff6600;">5 — כתום</div>
            <div class="color-cell" style="background:#9933ff;">6 — סגול</div>
            <div class="color-cell" style="background:#ff0099;">7 — ורוד</div>
            <div class="color-cell" style="background:#00ffcc; color:rgba(0,0,0,0.7);">8 — ציאן</div>
            <div class="color-cell" style="background:#ffff00; color:rgba(0,0,0,0.7);">9 — צהוב בהיר</div>
        </div>
    </div>

    <!-- Controls -->
    <div class="section">
        <span class="section-icon">🕹️</span>
        <div class="section-title">כפתורי שליטה</div>
        <div class="controls-list">
            <div class="ctrl-row">
                <div class="ctrl-btn">🔊</div>
                <div class="ctrl-desc"><strong>סאונד</strong> — הפעלה / כיבוי של צלילים</div>
            </div>
            <div class="ctrl-row">
                <div class="ctrl-btn">🏠</div>
                <div class="ctrl-desc"><strong>בית</strong> — פתח תפריט בית עם סטטיסטיקות</div>
            </div>
            <div class="ctrl-row">
                <div class="ctrl-btn">⏸️</div>
                <div class="ctrl-desc"><strong>השהייה</strong> — עצור / המשך את המשחק</div>
            </div>
        </div>

        <p style="margin-top:20px; margin-bottom:10px; color:#94a3b8;">ניתן לשחק גם עם מקלדת:</p>
        <div class="kbd-row">
            <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd>
            <kbd>4</kbd><kbd>5</kbd><kbd>6</kbd>
            <kbd>7</kbd><kbd>8</kbd><kbd>9</kbd>
        </div>
    </div>

    <!-- Tip -->
    <div class="tip">
        💡 <strong>טיפ:</strong> נסה להמציא שיר או סיפור מהרצף שאתה רואה — הזיכרון האנושי שומר סיפורים הרבה יותר טוב ממספרים!
    </div>

</div>

<footer>
    <span>SUPER SIMON</span> &nbsp;|&nbsp; שמור על ריכוז ותנצח 🏆
</footer>

</body>
</html>
