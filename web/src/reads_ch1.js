/* ---------- Chapter 1: village newsletter columns (reading) ----------
   text: one entry per sentence [Korean, English]. {surface|lemma} marks a word outside the chapter;
   the lemma is looked up in gloss and shown in English when tapped. */
CONTENT.chapters.find(c => c.id === "ch1").reads = [
  { id: "r1a", title: "길은 다 외웠어요", by: "글 · 감골 파출소 새 경찰관", byEn: "by the new officer at Gamgol Substation",
    intro: "The newsletter has a column. Nobody asked for it. It continues. This week it was written by you, apparently.",
    text: [
      ["저는 이번 달부터 감골 파출소에서 일하고 있어요.", "I have been working at Gamgol Substation since the start of this month."],
      ["요즘 선배에게 업무를 배우면서 마을 길도 {익히고|익히다} 있어요.", "These days I am learning the job from my senior and getting to know the village roads at the same time."],
      ["감골에는 길이 네 개 있는데, 그중 세 개가 버스 정류장으로 가요.", "Gamgol has four roads, and three of them go to the bus stop."],
      ["그리고 정류장에는 보통 까망이가 서 있어요.", "And standing at the bus stop, as a rule, is 까망이."],
      ["그래서 길은 벌써 다 {외웠어요|외우다}.", "So I have already learned all the roads by heart."],
      ["이제 마을 사람들 이름을 {외울까|외우다} 해요.", "Now I am thinking of learning the villagers' names."],
      ["412명이니까 시간이 조금 걸릴 거예요.", "There are 412 of them, so it may take a little while."]
    ],
    gloss: { "익히다": "to get to know, to get used to", "외우다": "to memorise, to learn by heart" },
    qs: [
      { ask: "How many roads in Gamgol do not go to the bus stop?", opts: ["one", "three", "four", "none"],
        why: "Four roads, three to the bus stop: 길이 네 개 있는데, 세 개가 버스 정류장으로 가요. That leaves one, going somewhere without a goat." },
      { ask: "Why was learning the roads easy?", opts: ["There are only four, and most of them end at the bus stop.", "까망이 showed the writer the way.", "The writer grew up in Gamgol.", "The village had just put up new road signs."],
        why: "Four roads, three to one bus stop, one goat on it. 그래서 길은 벌써 다 외웠어요: the 그래서 points straight back at that." },
      { ask: "What is the writer thinking of doing now?", opts: ["learning the names of the villagers", "moving back to Seoul", "learning the roads", "getting a driving licence"],
        why: "이름을 외울까 해요: -을까 하다 is a plan the writer is leaning towards. The roads are already done." }
    ],
    clip: { tag: "길은 다 외웠어요", name: "Clipping: the newsletter column, week one", line: "Four roads, three of them to one goat. Filed under orientation." } },

  { id: "r1b", title: "요가 동호회", by: "글 · 윤서진", byEn: "by 윤서진",
    intro: "The column again. This week a guest writer, who works from home and has started to notice the windows.",
    text: [
      ["저는 감골에서 프리랜서로 일하고 있어요.", "I work as a freelancer in Gamgol."],
      ["하루 종일 집에서 일하니까 요즘 운동을 거의 못 해요.", "I work at home all day, so these days I hardly manage any exercise."],
      ["제일 가까운 헬스클럽까지는 버스로 한 시간이 걸리고, 버스는 하루에 세 번 와요.", "The nearest gym is an hour away by bus, and the bus comes three times a day."],
      ["그래서 동영상 강의를 보면서 집에서 요가를 하기 시작했어요.", "So I have started doing yoga at home while watching a video course."],
      ["그런데 요즘 {창문|창문} 밖에서 까망이도 같이 하고 있어요.", "Lately, though, 까망이 has been doing it too, outside the window."],
      ["지금까지는 까망이 실력이 더 빨리 늘고 있어요.", "So far, 까망이 is improving faster."],
      ["다음 달에는 다른 동영상 강의를 볼까 해요.", "Next month I am thinking of watching a different video course."]
    ],
    gloss: { "창문": "window" },
    qs: [
      { ask: "Why doesn't 서진 go to the gym?", opts: ["It is an hour away by bus, and the bus comes three times a day.", "She has not got enough money.", "The gym closed last month.", "까망이 will not let her leave the house."],
        why: "헬스클럽까지는 버스로 한 시간이 걸리고, 버스는 하루에 세 번 와요. Fitness, in Gamgol, is mostly a question of timetables." },
      { ask: "What is 까망이 doing these days?", opts: ["doing yoga outside 서진's window", "watching videos on 서진's computer", "waiting for the bus to the gym", "working as a freelancer"],
        why: "창문 밖에서 까망이도 같이 하고 있어요: outside the window, 까망이 is doing it too. The 도 is doing a lot of work here." },
      { ask: "What is 서진 thinking of doing next month?", opts: ["watching a different video course", "signing up at the gym", "moving to Seoul", "teaching 까망이 yoga"],
        why: "다른 동영상 강의를 볼까 해요. A different course. The reasons are not given. The reasons have four legs." }
    ],
    clip: { tag: "요가 동호회", name: "Clipping: the newsletter column, week two", line: "Two members, one of them a goat. The goat is ahead." } }
];
