/* ---------- Chapter 11: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch11").reads = [
  { id: "r11a", title: "뮤지컬 평", by: "글 · 한지수", byEn: "by 한지수",
    intro: "한지수 was on duty on Saturday and missed the musical. She has reviewed it anyway, from reports.",
    text: [
      ["지난 토요일에 군 공연장에서 뮤지컬이 열렸어요.", "Last Saturday a musical was put on at the county theatre."],
      ["복순 할머니는 줄거리가 흥미롭다고 하셨어요.", "복순 할머니 said the plot was interesting."],
      ["덕배 할아버지는 주인공이 연기를 정말 잘한다고 하셨어요.", "덕배 할아버지 said the lead acts really well."],
      ["도윤 씨는 시간이 짧게 느껴졌다고 했어요.", "도윤 said the time seemed to fly."],
      ["그런데 세 사람 모두 첫 {장면|장면}에서 {잠들었다고|잠들다} 해요.", "But I hear all three of them fell asleep in the first scene."],
      ["그래도 돈이 아깝다고 한 사람은 없었어요.", "Still, nobody said it was a waste of money."],
      ["표가 무료였거든요.", "The tickets were free, you see."]
    ],
    gloss: { "장면": "a scene", "잠들다": "to fall asleep" },
    qs: [
      { ask: "What did 덕배 할아버지 say?", opts: ["that the lead acts really well", "that the plot was interesting", "that the time seemed to fly", "that it was boring"],
        why: "주인공이 연기를 정말 잘한다고 하셨어요. 잘하다 is a verb, so the quote ends -ㄴ다고. The plot was the grandmother's view." },
      { ask: "What happened to all three, according to what the writer heard?", opts: ["They fell asleep in the first scene.", "They left at the interval.", "They had booked the best seats.", "They sang along with the cast."],
        why: "첫 장면에서 잠들었다고 해요. … 다고 해요 with no speaker named: ‘I hear’, ‘people say’." },
      { ask: "Why did nobody say it was a waste of money?", opts: ["The tickets were free.", "The musical was very moving.", "They had booked early, at a discount.", "The village head paid for everyone."],
        why: "표가 무료였거든요. Hard to waste money one has not spent." }
    ],
    clip: { tag: "뮤지컬 평", name: "Clipping: the newsletter column, week twenty-one", line: "Reviewed by three people who slept through it. Warmly recommended." } },

  { id: "r11b", title: "야외 영화의 밤", by: "글 · 이장", byEn: "by the village head",
    intro: "An announcement from the village head, who has organised a film night and is taking no chances.",
    text: [
      ["다음 주 금요일에 마을 회관 앞에서 야외 영화의 밤이 열려요.", "Next Friday there will be an open-air film night in front of the village hall."],
      ["의자는 제가 준비할 테니까 {돗자리|돗자리}는 안 가지고 오셔도 돼요.", "I'll put out chairs, so you needn't bring a mat."],
      ["밤에는 추울 테니까 따뜻한 옷을 입고 오세요.", "It is bound to be cold in the evening, so wear something warm."],
      ["영화 제목은 아직 {비밀|비밀}이에요.", "The title of the film is still a secret."],
      ["하지만 주인공이 염소로 변신한다고 해요.", "But I hear the lead turns into a goat."],
      ["그래서 {맨 앞|맨 앞}에 까망이 자리를 준비할 테니까 까망이도 꼭 데리고 오세요.", "So I'll keep a place for 까망이 in the front row. Do bring her."]
    ],
    gloss: { "돗자리": "a mat (for sitting on outdoors)", "비밀": "a secret", "맨 앞": "the very front" },
    qs: [
      { ask: "What is the village head going to do?", opts: ["put out chairs", "bring mats for everyone", "sell tickets at the door", "show the film inside the hall"],
        why: "의자는 제가 준비할 테니까: with 제가, -을/-ㄹ 테니까 is a promise, and what follows is your part: no mats needed." },
      { ask: "Why should people wear something warm?", opts: ["It is bound to be cold in the evening.", "The film is very long.", "The village hall has no heating.", "The chairs are made of metal."],
        why: "밤에는 추울 테니까: without 제가, -을/-ㄹ 테니까 is a confident guess, given as a reason." },
      { ask: "What is said about the film?", opts: ["The lead turns into a goat.", "It is about Gamgol.", "까망이 plays the lead.", "It is a musical."],
        why: "주인공이 염소로 변신한다고 해요. Hearsay, and 변신하다 is a verb: 변신한다고. 까망이 is only in the audience. So far." }
    ],
    clip: { tag: "야외 영화의 밤", name: "Clipping: the newsletter column, week twenty-two", line: "Front row reserved. Guest of honour: four legs." } }
];
