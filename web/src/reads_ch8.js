/* ---------- Chapter 8: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch8").reads = [
  { id: "r8a", title: "고민 상담", by: "글 · 한지수", byEn: "by 한지수, agony aunt for the week", chat: true,
    intro: "The newsletter has started an advice column. 한지수 agreed to answer the first letter before she had read it.",
    text: [
      ["저는 매일 세 시에 버스 정류장에 가요.", "I go to the bus stop at three every day.", "고민"],
      ["그런데 버스를 탈지 안 탈지 아직 모르겠어요.", "But I still don't know whether to get on the bus or not.", "고민"],
      ["제 적성에 맞는 일이 뭔지도 궁금해요.", "I also wonder what kind of work suits me.", "고민"],
      ["먼저 적성 검사를 해 보는 게 어때요?", "How about taking an aptitude test first?", "조언"],
      ["그리고 버스를 한 번 타 보는 게 어때요?", "And how about getting on the bus, just once?", "조언"],
      ["{추신|추신}: 편지에는 이름이 없었고, {한쪽|한쪽}은 누가 이미 먹었어요.", "P.S. The letter had no name on it, and someone had already eaten one corner.", "조언"]
    ],
    gloss: { "추신": "P.S. (a note added at the end)", "한쪽": "one side, one corner" },
    qs: [
      { ask: "What is the letter writer unsure about?", opts: ["whether to get on the bus", "what time the bus comes", "where the bus stop is", "how to buy a ticket"],
        why: "버스를 탈지 안 탈지 모르겠어요. -을지/-ㄹ지 for something still open: whether to, or not." },
      { ask: "What is the first piece of advice?", opts: ["Take an aptitude test.", "Write a CV.", "Go to a job fair.", "Stop going to the bus stop."],
        why: "먼저 적성 검사를 해 보는 게 어때요? -는 게 어때요 is ‘how about’. The bus comes second." },
      { ask: "What was odd about the letter?", opts: ["It had no name, and one corner had been eaten.", "It was written in English.", "It arrived without a stamp.", "It was signed by the chief."],
        why: "이름이 없었고, 한쪽은 누가 이미 먹었어요. The newsletter does not speculate. The newsletter has a fair idea." }
    ],
    clip: { tag: "고민 상담", name: "Clipping: the newsletter column, week fifteen", line: "Advice given: an aptitude test, and the bus. The letter was partly eaten." } },

  { id: "r8b", title: "진로 고민", by: "글 · 박도윤", byEn: "by 박도윤",
    intro: "박도윤 has been thinking about his future, and has asked the village. The village had answers ready.",
    text: [
      ["요즘 저는 진로 고민이 많아요.", "These days I am worrying a lot about where my career is going."],
      ["감골에 계속 있을지 서울로 갈지 모르겠어요.", "I don't know whether to stay on in Gamgol or go to Seoul."],
      ["그래서 마을 사람들에게 조언을 부탁했어요.", "So I asked the villagers for advice."],
      ["복순 할머니는 “감골에 있는 게 어때? 까망이가 너를 좋아해.”라고 하셨어요.", "복순 할머니 said, “How about staying in Gamgol? 까망이 likes you.”"],
      ["장미숙 사장님은 “감골에 있는 게 어때요? 도윤 씨가 라면을 제일 많이 사요.”라고 하셨어요.", "장미숙 사장님 said, “How about staying in Gamgol? You buy more instant noodles than anyone.”"],
      ["소장님은 “{본인|본인}이 결정하는 게 어떻습니까?”라고 하셨어요.", "The chief said, “How about deciding for yourself?”"],
      ["소장님 조언이 제일 짧았어요.", "The chief's advice was the shortest."],
      ["그런데 제일 어려웠어요.", "It was also the hardest."]
    ],
    gloss: { "본인": "oneself, the person concerned" },
    qs: [
      { ask: "What can't 도윤 decide?", opts: ["whether to stay in Gamgol or go to Seoul", "which department to apply to", "whether to do a language course", "what to have for lunch"],
        why: "감골에 계속 있을지 서울로 갈지 모르겠어요. Two -을지/-ㄹ지 side by side: this, or that." },
      { ask: "Why does 장미숙 사장님 want him to stay?", opts: ["He buys more instant noodles than anyone.", "까망이 likes him.", "He fixed the shop sign.", "She needs help in the shop."],
        why: "도윤 씨가 라면을 제일 많이 사요. 까망이 was the grandmother's argument. Each argument tells you about the person making it." },
      { ask: "What did the chief advise?", opts: ["to decide for himself", "to go to Seoul", "to stay in Gamgol", "to take an aptitude test"],
        why: "본인이 결정하는 게 어떻습니까? The same ‘how about’, in 합쇼체, as the chief always speaks." }
    ],
    clip: { tag: "진로 고민", name: "Clipping: the newsletter column, week sixteen", line: "Three opinions: one goat, one noodle account, one chief." } }
];
