/* ---------- Chapter 12: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch12").reads = [
  { id: "r12a", title: "뭐 하다가 다쳤어?", by: "글 · 박도윤", byEn: "by 박도윤",
    intro: "박도윤 has hurt his wrist and has written about it, possibly before thinking it through.",
    text: [
      ["지난주에 손목을 다쳤어요.", "Last week I hurt my wrist."],
      ["{젓가락|젓가락}을 못 들 정도로 아팠어요.", "It hurt so much I could not lift my chopsticks."],
      ["마을 어르신들은 모두 “뭐 하다가 다쳤어?”라고 물어보세요.", "All the village elders ask, “What were you doing when you hurt it?”"],
      ["할머니들한테는 “까망이를 잡다가 다쳤어요.”라고 했어요.", "To the grandmothers I said, “I hurt it catching 까망이.”"],
      ["하람이한테는 “운동하다가 다쳤어.”라고 했어요.", "To 하람 I said, “I hurt it working out.”"],
      ["사실은 휴대폰 게임을 너무 많이 하다가 다쳤어요.", "In fact I hurt it playing games on my phone too much."],
      ["이 칼럼은 할머니들이 안 읽으셨으면 좋겠어요.", "I do hope the grandmothers don't read this column."]
    ],
    gloss: { "젓가락": "chopsticks" },
    qs: [
      { ask: "How bad was the pain?", opts: ["He could not lift his chopsticks.", "He could not sleep at all.", "He could not walk.", "It hardly hurt."],
        why: "젓가락을 못 들 정도로 아팠어요. -을/-ㄹ 정도로 measures the pain by what it stopped him doing." },
      { ask: "What did he tell the grandmothers?", opts: ["that he hurt it catching 까망이", "that he hurt it working out", "that he hurt it playing phone games", "that he hurt it carrying boxes"],
        why: "할머니들한테는 “까망이를 잡다가 다쳤어요.” Working out was the version for 하람." },
      { ask: "How did he really hurt it?", opts: ["playing games on his phone too much", "catching 까망이", "working out", "cooking ramen"],
        why: "사실은 휴대폰 게임을 너무 많이 하다가 다쳤어요. 사실은: ‘in fact’. -다가: what he was doing when it happened." }
    ],
    clip: { tag: "뭐 하다가 다쳤어?", name: "Clipping: the newsletter column, week twenty-three", line: "Wrist injured. Official cause: a goat. Actual cause: a phone." } },

  { id: "r12b", title: "파스", by: "글 · 복순 할머니", byEn: "by 복순 할머니",
    intro: "복순 할머니 writes on health. Her method is simple and involves a great many pain-relief patches.",
    text: [
      ["저는 어깨가 뭉쳐서 매일 밤 파스를 붙여요.", "My shoulders are stiff, so I put on a pain-relief patch every night."],
      ["지난주에는 {밭|밭}에서 일하다가 허리를 삐끗했어요.", "Last week I put my back out while working in the field."],
      ["일어나지 못할 정도로 아팠어요.", "It hurt so much I could not get up."],
      ["그래서 허리에도 파스를 붙였어요.", "So I put a patch on my back as well."],
      ["다음 날 아침에 보니까 까망이 {등|등}에도 파스가 붙어 있었어요.", "Next morning I looked, and there was a patch stuck on 까망이's back too."],
      ["까망이가 밤에 제 옆에서 자다가 제 파스를 가져갔어요.", "Sleeping beside me in the night, 까망이 had made off with my patch."],
      ["다행이에요. 까망이도 요즘 어깨가 뭉쳤거든요.", "Just as well. 까망이's shoulders have been stiff lately too, you see."]
    ],
    gloss: { "밭": "a field (for vegetables)", "등": "the back (of the body)" },
    qs: [
      { ask: "How did she put her back out?", opts: ["working in the field", "carrying 까망이", "getting out of bed", "dancing at the village hall"],
        why: "밭에서 일하다가 허리를 삐끗했어요. -다가: in the middle of working, it happened." },
      { ask: "How bad was it?", opts: ["She could not get up.", "She could not eat.", "She could not talk.", "It only hurt a little."],
        why: "일어나지 못할 정도로 아팠어요. The same measure as 못 일어날 정도로, in a slightly more formal shape." },
      { ask: "Why does she think the patch on 까망이 is a good thing?", opts: ["까망이's shoulders have been stiff lately too.", "It keeps her warm at night.", "The doctor said goats need patches.", "It stops her eating newspapers."],
        why: "다행이에요. 까망이도 요즘 어깨가 뭉쳤거든요. One patch, two patients. The newspapers remain at risk." }
    ],
    clip: { tag: "파스", name: "Clipping: the newsletter column, week twenty-four", line: "One patch, transferred overnight. Both parties report improvement." } }
];
