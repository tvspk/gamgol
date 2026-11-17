/* ---------- Chapter 10: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch10").reads = [
  { id: "r10a", title: "할 뻔했어요", by: "글 · 감골 파출소 새 경찰관", byEn: "by the new officer at Gamgol Substation",
    intro: "You have written the column again. The editor says it is good to hear from the young. The editor is the only one who says this.",
    text: [
      ["감골에 와서 저는 실수를 여러 번 할 뻔했어요.", "Since coming to Gamgol I have nearly made several mistakes."],
      ["첫날에는 소장님한테 반말을 할 뻔했어요.", "On the first day I nearly used 반말 to the chief."],
      ["소장님이 너무 친절하게 웃으셨거든요.", "He smiled so kindly, you see."],
      ["둘째 날에는 하람이한테 높임말을 할 뻔했어요.", "On the second day I nearly used polite speech to 하람."],
      ["하람이가 저보다 키가 훨씬 크거든요.", "He is a good deal taller than me, you see."],
      ["셋째 날에는 까망이한테 고개를 숙일 뻔했어요.", "On the third day I nearly bowed to 까망이."],
      ["까망이는 감골에서 저보다 훨씬 오래 살았거든요.", "She has lived in Gamgol a great deal longer than I have, you see."]
    ],
    gloss: {},
    qs: [
      { ask: "What happened on the first day?", opts: ["The writer nearly used 반말 to the chief, but did not.", "The writer used 반말 to the chief.", "The chief told the writer off.", "The writer was late for work."],
        why: "반말을 할 뻔했어요: -을/-ㄹ 뻔하다 means it almost happened, and did not. The chief is still smiling." },
      { ask: "Why did the writer nearly use polite speech to 하람?", opts: ["He is much taller than the writer.", "He is older than the writer.", "He is also a police officer.", "He spoke 합쇼체 first."],
        why: "하람이가 저보다 키가 훨씬 크거든요. Height is not age. 하람 is sixteen and gets 반말." },
      { ask: "Why did the writer nearly bow to 까망이?", opts: ["She has lived in Gamgol much longer than the writer.", "The grandmother asked the writer to.", "She bowed first.", "She belongs to the chief."],
        why: "까망이는 감골에서 저보다 훨씬 오래 살았거든요. Seniority, in its way, is seniority." }
    ],
    clip: { tag: "할 뻔했어요", name: "Clipping: the newsletter column, week nineteen", line: "Near misses: one chief, one teenager, one goat." } },

  { id: "r10b", title: "집마다", by: "글 · 윤서진", byEn: "by 윤서진",
    intro: "윤서진 on village manners, which she is learning the way most people learn them: one near miss at a time.",
    text: [
      ["감골은 집마다 규칙이 달라요.", "In Gamgol, every house has its own rules."],
      ["복순 할머니 집에서는 신발을 벗고 바닥에 앉아요.", "At 복순 할머니's house you take your shoes off and sit on the floor."],
      ["덕배 할아버지 집에서는 식사할 때마다 라디오를 켜요.", "At 덕배 할아버지's house the radio goes on every time there is a meal."],
      ["이장님 {댁|댁}에서는 웃어른이 먼저 수저를 드세요.", "At the village head's house the eldest picks up the spoon first."],
      ["지난주에 저는 이장님보다 먼저 먹을 뻔했어요.", "Last week I nearly started eating before the village head."],
      ["다행히 까망이가 제 {숟가락|숟가락}을 먼저 가져갔어요.", "Luckily, 까망이 took my spoon first."],
      ["이장님은 까망이가 {예의가 바르다고|예의가 바르다} 하셨어요.", "The village head said 까망이 has very good manners."]
    ],
    gloss: { "댁": "house, home (polite word, for an elder's)", "숟가락": "spoon", "예의가 바르다": "to have good manners" },
    qs: [
      { ask: "What does the first sentence say about Gamgol?", opts: ["Every house has its own rules.", "Every house has the same rules.", "Only the grandmother's house has rules.", "Nobody in Gamgol keeps any rules."],
        why: "집마다 규칙이 달라요. 마다 after a noun: each one, and each one different." },
      { ask: "What happened at the village head's house?", opts: ["서진 nearly started eating before him, but did not.", "서진 started eating before him.", "서진 kept her shoes on.", "서진 turned on the radio."],
        why: "먼저 먹을 뻔했어요. Nearly. A goat intervened." },
      { ask: "What did the village head say about 까망이?", opts: ["that she has very good manners", "that she must eat outside", "that she owes him a spoon", "that she should eat first"],
        why: "까망이가 예의가 바르다고 하셨어요. She took the spoon before 서진 could eat: from the head of the table, that counts as manners." }
    ],
    clip: { tag: "집마다", name: "Clipping: the newsletter column, week twenty", line: "Every house its own rules. The goat knows all of them." } }
];
