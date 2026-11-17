/* ---------- Chapter 3: village newsletter columns (reading) ----------
   chat: true prints one line per entry, with the speaker (third item) in front. */
CONTENT.chapters.find(c => c.id === "ch3").reads = [
  { id: "r3a", title: "아무거나", by: "글 · 박도윤", byEn: "by 박도윤, with you in it", chat: true,
    intro: "This week the column is a text conversation between 도윤 and you. 도윤 sent it in. You were not consulted.",
    text: [
      ["주말에 밥 한번 먹자.", "Let's have a meal together at the weekend.", "도윤"],
      ["좋아. 뭐 먹을래?", "Sure. What do you want to eat?", "나"],
      ["난 아무거나 괜찮아.", "Anything's fine by me.", "도윤"],
      ["그럼 {분식집|분식집} 갈까?", "Then shall we go to the snack bar?", "나"],
      ["분식은 어제 먹었어.", "I had snack-bar food yesterday.", "도윤"],
      ["그럼 {중국집|중국집}은?", "The Chinese place, then?", "나"],
      ["거기는 분위기가 별로야.", "The atmosphere there isn't great.", "도윤"],
      ["…그럼 네가 정해.", "…Then you decide.", "나"],
      ["난 진짜 아무 데나 괜찮아.", "Honestly, anywhere's fine by me.", "도윤"]
    ],
    gloss: { "분식집": "a snack bar (tteokbokki, gimbap, noodles)", "중국집": "a Chinese restaurant" },
    qs: [
      { ask: "What does 도윤 say he wants to eat?", opts: ["anything at all, or so he says", "snack-bar food", "Chinese food", "nothing: he is not hungry"],
        why: "난 아무거나 괜찮아. 아무거나 is ‘anything’. What he then turns down is another matter." },
      { ask: "Why doesn't 도윤 want to go to the Chinese place?", opts: ["The atmosphere there isn't great.", "He had Chinese food yesterday.", "It costs too much.", "It is closed at the weekend."],
        why: "거기는 분위기가 별로야. Yesterday's meal was snack-bar food, which ruled out the other suggestion." },
      { ask: "Why does the writer end up saying “그럼 네가 정해”?", opts: ["도윤 turns down every suggestion.", "도윤 knows the village better.", "The writer has to work all weekend.", "도윤 is paying."],
        why: "Two suggestions, two refusals, from someone for whom anything is fine. 정해 is plain 반말: ‘you decide’." }
    ],
    clip: { tag: "아무거나", name: "Clipping: the newsletter column, week five", line: "Anything at all, except whatever you suggest." } },

  { id: "r3b", title: "아무 때나 와", by: "글 · 한지수", byEn: "by 한지수",
    intro: "The column is by 한지수 this week. She grew up in the city and has views on punctuality.",
    text: [
      ["서울에서는 길이 자주 정체돼서 약속에 늦는 사람이 많아요.", "In Seoul the roads are often jammed, so a lot of people are late for appointments."],
      ["감골에는 차가 별로 없어서 길이 정체되지 않아요.", "Gamgol has hardly any cars, so the roads never jam."],
      ["그런데 감골 사람들도 약속에 자주 늦어요.", "And yet people in Gamgol are often late too."],
      ["버스를 한 번 놓치면 다음 버스가 네 시간 후에 오니까요.", "Miss the bus once, and the next one comes four hours later."],
      ["그래서 마을 {어르신|어르신}들은 약속을 잡을 때 “아무 때나 와.”라고 하세요.", "So when the village elders arrange to meet, they say, “Come whenever.”"],
      ["감골에서 약속 시간을 {지키는|지키다} 건 까망이뿐이에요.", "In Gamgol, the only one who keeps to the agreed time is 까망이."],
      ["매일 세 시에 버스 정류장에 와요.", "She comes to the bus stop at three every day."]
    ],
    gloss: { "어르신": "an elder (a respectful word for an older person)", "지키다": "to keep (a promise, a time)" },
    qs: [
      { ask: "Why are people in Seoul often late?", opts: ["The roads are often jammed.", "They miss the bus.", "They forget their appointments.", "They get lost on the way."],
        why: "길이 자주 정체돼서: the roads jam. Missing the bus is the Gamgol method." },
      { ask: "Why are people in Gamgol late?", opts: ["If they miss the bus, the next one is four hours later.", "The roads are jammed.", "The elders tell them to come late.", "They all have two appointments at once."],
        why: "버스를 한 번 놓치면 다음 버스가 네 시간 후에 오니까요. No traffic, just a long wait." },
      { ask: "Who is always on time?", opts: ["까망이, at three every day", "the village elders", "the bus", "the writer"],
        why: "약속 시간을 지키는 건 까망이뿐이에요: only 까망이. Who she has the appointment with remains unknown." }
    ],
    clip: { tag: "아무 때나 와", name: "Clipping: the newsletter column, week six", line: "Punctuality in Gamgol: one goat." } }
];
