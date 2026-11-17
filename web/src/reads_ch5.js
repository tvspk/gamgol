/* ---------- Chapter 5: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch5").reads = [
  { id: "r5a", title: "해외여행", by: "글 · 오만석 소장", byEn: "by 오만석, station chief",
    intro: "The chief has written this week's column. He writes as he speaks: formally, and as if someone might be taking minutes.",
    text: [
      ["저는 해외여행을 한 번도 가 본 적이 없습니다.", "I have never once travelled abroad."],
      ["여권도 만든 적이 없습니다.", "I have never even had a passport made."],
      ["서울에는 두 번 가 본 적이 있습니다.", "I have been to Seoul twice."],
      ["서울은 볼거리도 많았고 야경도 멋졌습니다.", "Seoul had a great deal to see, and the night view was splendid."],
      ["그런데 사람이 너무 많아서 그런지 아무도 저에게 인사를 하지 않았습니다.", "But perhaps because there were so many people, nobody greeted me."],
      ["감골에서는 같은 사람에게 하루에 다섯 번씩 인사를 받습니다.", "In Gamgol the same person greets me five times a day."],
      ["그래서 다음 휴가철에도 감골에 있겠습니다.", "I shall therefore spend the next holiday season in Gamgol as well."]
    ],
    gloss: {},
    qs: [
      { ask: "How often has the chief travelled abroad?", opts: ["never", "twice", "once", "five times"],
        why: "한 번도 가 본 적이 없습니다: not once. The two trips were to Seoul, which is not abroad, whatever Gamgol thinks." },
      { ask: "Why, he guesses, did nobody greet him in Seoul?", opts: ["Perhaps because there were too many people.", "Because he was not in uniform.", "Because it was the middle of the night.", "Because he did not greet anyone first."],
        why: "사람이 너무 많아서 그런지: -아서/-어서 그런지 marks a guess at the reason, not a fact." },
      { ask: "Where will he spend the next holiday season?", opts: ["in Gamgol", "in Seoul", "abroad", "in a national park"],
        why: "다음 휴가철에도 감골에 있겠습니다. Five greetings a day is not something one gives up lightly." }
    ],
    clip: { tag: "해외여행", name: "Clipping: the newsletter column, week nine", line: "The chief's travels: Seoul, twice. Greeted there: never." } },

  { id: "r5b", title: "오 분마다", by: "글 · 강하람", byEn: "by 강하람, 16",
    intro: "강하람 is back from the school trip to Seoul and has filed a report, unprompted.",
    text: [
      ["지난주에 수학여행으로 서울에 갔어요.", "Last week I went to Seoul on a school trip."],
      ["경복궁에 처음 가 봤는데, 정말 인상적이었어요.", "It was my first time at Gyeongbokgung, and it was really impressive."],
      ["그런데 저는 지하철을 타 본 적이 한 번도 없었어요.", "But I had never once ridden the subway."],
      ["그래서 그런지 경복궁보다 지하철이 더 {신기했어요|신기하다}.", "Maybe that's why I found the subway even more amazing than the palace."],
      ["지하철은 오 분마다 와요.", "The subway comes every five minutes."],
      ["그래서 {일부러|일부러} 세 번 놓쳐 봤어요.", "So I missed it three times on purpose, just to see."],
      ["그때마다 오 분 후에 다음 지하철이 왔어요.", "Each time, the next one came five minutes later."],
      ["친구들은 경복궁 사진을 찍었고, 저는 지하철 사진을 찍었어요.", "My friends took photos of Gyeongbokgung, and I took photos of the subway."]
    ],
    gloss: { "신기하다": "to be amazing, to be a marvel (new and surprising)", "일부러": "on purpose, deliberately" },
    qs: [
      { ask: "What did 하람 find more amazing than the palace?", opts: ["the subway", "the night view", "the food", "the shops"],
        why: "경복궁보다 지하철이 더 신기했어요. 그래서 그런지: maybe because he had never ridden it before." },
      { ask: "Why did he miss the subway three times?", opts: ["On purpose: another one came every five minutes.", "He got lost in the station.", "He was taking photos of the palace.", "The trains were too full."],
        why: "일부러 세 번 놓쳐 봤어요. In Gamgol, missing a bus costs four hours. In Seoul it costs five minutes, and he wanted to see it happen." },
      { ask: "What did his friends take photos of?", opts: ["Gyeongbokgung", "the subway", "하람", "the bus to Gamgol"],
        why: "친구들은 경복궁 사진을 찍었고, 저는 지하철 사진을 찍었어요. Everyone came home with the photos they wanted." }
    ],
    clip: { tag: "오 분마다", name: "Clipping: the newsletter column, week ten", line: "Three trains missed on purpose. A personal best." } }
];
