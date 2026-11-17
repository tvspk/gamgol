/* ---------- Chapter 14: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch14").reads = [
  { id: "r14a", title: "삼십일 년", by: "글 · 오만석 소장", byEn: "by 오만석, station chief",
    intro: "The chief has written the column once more. He has been in Gamgol a long time, and it shows, mostly in a good way.",
    text: [
      ["저는 성격이 급한 편입니다.", "I am, by nature, on the impatient side."],
      ["그래서 감골에 처음 왔을 때 적응하기가 힘들었습니다.", "So when I first came to Gamgol, I found it hard to settle in."],
      ["아무리 급해도 버스는 하루에 세 번밖에 안 왔습니다.", "However much of a hurry I was in, the bus came only three times a day."],
      ["아무리 불러도 염소들은 길에서 {비키지|비키다} 않았습니다.", "However often I called, the goats would not move out of the road."],
      ["그리고 삼십일 년이 지났습니다.", "And then thirty-one years went by."],
      ["지금은 버스가 늦어도 화가 나지 않습니다.", "These days, even when the bus is late, I do not get angry."],
      ["까망이가 길에 서 있어도 이제는 저도 옆에 서서 같이 기다립니다.", "Even when 까망이 is standing in the road, I now stand beside her and wait as well."]
    ],
    gloss: { "비키다": "to move out of the way" },
    qs: [
      { ask: "What does the chief say about his character?", opts: ["He is on the impatient side.", "He is very patient.", "He is stubborn.", "He is careless."],
        why: "성격이 급한 편입니다. 급하다: hasty. -은 편이다 softens it, as a chief would." },
      { ask: "Why was it hard for him to settle in?", opts: ["However much he hurried, the bus came three times a day, and the goats would not move.", "The villagers did not like him.", "There was no work at the station.", "He missed Seoul too much."],
        why: "아무리 급해도 … 아무리 불러도 …: 아무리 … -아도/-어도, ‘however much’. Gamgol did not change. He did." },
      { ask: "What does he do now when 까망이 is standing in the road?", opts: ["He stands beside her and waits.", "He calls her until she moves.", "He phones the grandmother.", "He walks round her and carries on."],
        why: "까망이가 길에 서 있어도 … 같이 기다립니다. Even if she is in the road, he waits. Thirty-one years will do that." }
    ],
    clip: { tag: "삼십일 년", name: "Clipping: the newsletter column, week twenty-seven", line: "Thirty-one years. The bus is still late. Nobody minds." } },

  { id: "r14b", title: "고민 상담소에서", by: "글 · 한지수", byEn: "by 한지수",
    intro: "The last column in this file. 한지수 reports from the advice bureau, where three worries came in this week.",
    text: [
      ["이번 주에도 고민 상담소에 고민이 세 개 들어왔어요.", "Three worries came in to the advice bureau again this week."],
      ["도윤 씨는 아무리 자도 피곤하다고 했어요.", "도윤 said that however much he sleeps, he is tired."],
      ["그래서 “밤에 휴대폰 게임을 좀 줄이지 그래요?”라고 했어요.", "So I said, “Why don't you cut down on the phone games at night?”"],
      ["하람이는 구독자가 늘지 않아서 걱정이라고 했어요.", "하람 said he was worried because his subscribers are not going up."],
      ["그래서 “까망이 말고 다른 것도 찍어 보지 그래요?”라고 했어요.", "So I said, “Why don't you try filming something other than 까망이?”"],
      ["세 번째 고민에는 이름이 없었어요. “버스를 타 봐도 돼요?”", "The third worry had no name on it. “May I try getting on the bus?”"],
      ["저는 {답장|답장}을 썼어요. “아무리 무서워도 한번 타 보지 그래요?”", "I wrote back: “However scary it is, why don't you get on it once?”"],
      ["다음 날 세 시, 정류장은 {비어|비다} 있었어요.", "The next day at three, the bus stop was empty."]
    ],
    gloss: { "답장": "a reply (to a letter or message)", "비다": "to be empty" },
    qs: [
      { ask: "What is 도윤's worry?", opts: ["However much he sleeps, he is tired.", "He cannot sleep at all.", "His wrist still hurts.", "He cannot decide about his career."],
        why: "아무리 자도 피곤하다고 했어요. 아무리 … -아도/-어도, then passed on as a quote: 피곤하다고." },
      { ask: "What did the writer suggest to 하람?", opts: ["filming something other than 까망이", "closing the channel", "charging his subscribers for snacks", "filming 까망이 more often"],
        why: "다른 것도 찍어 보지 그래요? -지 그래요 is light advice for the listener. Charging subscribers was his own idea, and nobody has endorsed it." },
      { ask: "What did the writer find at the bus stop the next day at three?", opts: ["Nobody: it was empty.", "까망이, waiting as usual.", "The bus, which had not left.", "The person who wrote the third worry, holding a ticket."],
        why: "정류장은 비어 있었어요. For the first time in this newsletter, nobody was standing at the bus stop at three." }
    ],
    clip: { tag: "고민 상담소에서", name: "Clipping: the newsletter column, week twenty-eight", line: "Three o'clock. The stop was empty." } }
];
