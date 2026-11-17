/* ---------- Chapter 4: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch4").reads = [
  { id: "r4a", title: "할머니의 쪽지", by: "글 · 복순 할머니", byEn: "by 복순 할머니, meant for you",
    intro: "복순 할머니 sent the newsletter a note meant for you. The newsletter printed it, as the newsletter does.",
    text: [
      ["내일 아침 일찍 우리 집에 와라.", "Come round to my house early tomorrow morning."],
      ["부엌 전구가 나갔어.", "The kitchen bulb has gone."],
      ["전구 좀 갈아라.", "Change the bulb, will you."],
      ["그리고 창문으로 바람이 들어오니까 커튼도 달아라.", "And there's a draught coming in through the window, so put the curtains up too."],
      ["{오는 길에|오는 길에} 장도 좀 봐라.", "Do a bit of shopping on your way over as well."],
      ["두부에다가 휴지까지 사 와라.", "Bring tofu, and toilet paper on top of that."],
      ["까망이 아침도 줘라.", "Give 까망이 her breakfast too."],
      ["이 신문은 주지 마라.", "Don't give her this newsletter."],
      ["어제 신문도 다 먹었어.", "She ate all of yesterday's."]
    ],
    gloss: { "오는 길에": "on the way here" },
    qs: [
      { ask: "What needs doing in the kitchen?", opts: ["The light bulb needs changing.", "The walls need painting.", "The toilet needs unblocking.", "The windows need cleaning."],
        why: "부엌 전구가 나갔어. 전구 좀 갈아라. -아라 is a plain command, the way an elder speaks to you." },
      { ask: "What should be bought on the way?", opts: ["tofu and toilet paper", "a light bulb and curtains", "detergent and toilet paper", "food for 까망이"],
        why: "두부에다가 휴지까지: tofu, and toilet paper on top of that. 에다가 adds, 까지 finishes the list." },
      { ask: "Why must 까망이 not get this newsletter?", opts: ["She ate all of yesterday's.", "She does not like reading.", "It belongs to the grandmother.", "The officer has to read it first."],
        why: "어제 신문도 다 먹었어. The newsletter has no comment. The newsletter is being eaten." }
    ],
    clip: { tag: "할머니의 쪽지", name: "Clipping: the newsletter column, week seven", line: "Bulb, curtains, tofu, toilet paper, goat. Not the newsletter." } },

  { id: "r4b", title: "네 시의 정전", by: "글 · 강하람", byEn: "by 강하람, 16",
    intro: "강하람 writes this week about the station's cleaning day, which is shorter than it used to be.",
    text: [
      ["토요일은 파출소를 청소하는 날이에요.", "Saturday is cleaning day at the station."],
      ["도윤 형은 토요일 아침마다 “오늘은 빨리 끝내자.”라고 해요.", "Every Saturday morning 도윤 says, “Let's get it done quickly today.”"],
      ["그래서 저는 청소기를 돌리고, 형은 먼지를 털어요.", "So I run the vacuum cleaner and he does the dusting."],
      ["그런데 요즘 오후 네 시만 되면 전기가 나가요.", "But lately, as soon as it is four in the afternoon, the power goes off."],
      ["그러면 형이 “어두우니까 오늘은 여기까지 하자.”라고 해요.", "Then he says, “It's dark, so let's stop here for today.”"],
      ["형은 이 {정전|정전}을 아주 좋아해요.", "He is very fond of this power cut."]
    ],
    gloss: { "정전": "a power cut" },
    qs: [
      { ask: "What does 도윤 say on Saturday mornings?", opts: ["“Let's get it done quickly today.”", "“Let's take a break.”", "“You do all of it.”", "“Let's clean the windows first.”"],
        why: "오늘은 빨리 끝내자. -자 is ‘let's’, to a friend or someone younger. The break comes later." },
      { ask: "What happens at four in the afternoon?", opts: ["The power goes off.", "The cleaning starts.", "까망이 arrives.", "The chief comes back."],
        why: "오후 네 시만 되면 전기가 나가요. Every day, as soon as it is four." },
      { ask: "How does 도윤 feel about the power cuts?", opts: ["He is very fond of them.", "He is worried about them.", "They annoy him.", "He has not noticed them."],
        why: "형은 이 정전을 아주 좋아해요. A power cut at four, and cleaning ends at four. He is not asking questions." }
    ],
    clip: { tag: "네 시의 정전", name: "Clipping: the newsletter column, week eight", line: "Cleaning day now ends at four, by popular demand of one." } }
];
