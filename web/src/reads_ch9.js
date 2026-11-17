/* ---------- Chapter 9: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch9").reads = [
  { id: "r9a", title: "덕배식 라면", by: "글 · 덕배 할아버지", byEn: "by 덕배 할아버지",
    intro: "This week, a recipe. 덕배 할아버지 has shared it on the understanding that nobody will be able to copy it.",
    text: [
      ["제 라면은 마을에서 제일 맛있어요.", "My ramen is the best in the village."],
      ["비결이 있거든요.", "I have a secret, you see."],
      ["먼저 물을 끓이고 나서 면을 넣어요.", "First I boil the water, and then I put the noodles in."],
      ["면을 넣고 나서 {정확히|정확히} 삼 분 동안 라디오를 들어요.", "Once the noodles are in, I listen to the radio for exactly three minutes."],
      ["라디오가 없으면 라면이 맛이 없거든요.", "Without the radio, ramen doesn't taste of anything."],
      ["그다음에 계란을 넣고, {파|파}를 살짝 넣어요.", "After that I put in an egg, and a little spring onion."],
      ["다 먹고 나서 설거지는 도윤이가 해요.", "When it is all eaten, 도윤 does the washing-up."]
    ],
    gloss: { "정확히": "exactly", "파": "spring onion" },
    qs: [
      { ask: "What does he do once the noodles are in?", opts: ["listens to the radio for exactly three minutes", "stirs them without stopping", "reads the newsletter", "fries an egg on the side"],
        why: "면을 넣고 나서 정확히 삼 분 동안 라디오를 들어요. -고 나서: the noodles first, then the radio." },
      { ask: "Why does he need the radio?", opts: ["Without it, he says, the ramen has no taste.", "It tells him the time.", "It keeps 까망이 calm.", "The recipe is read out on it."],
        why: "라디오가 없으면 라면이 맛이 없거든요. -거든요 gives the reason, after the fact. Whether it is a good reason is another question." },
      { ask: "Who does the washing-up?", opts: ["도윤", "덕배 할아버지", "하람", "nobody"],
        why: "다 먹고 나서 설거지는 도윤이가 해요. The real secret of the recipe, perhaps." }
    ],
    clip: { tag: "덕배식 라면", name: "Clipping: the newsletter column, week seventeen", line: "Secret ingredient: three minutes of radio. Washing-up: outsourced." } },

  { id: "r9b", title: "냄비", by: "글 · 윤서진", byEn: "by 윤서진",
    intro: "윤서진 on cooking, a subject she approaches the way some people approach the sea: with respect, from a distance.",
    text: [
      ["저는 요리를 잘 못해요.", "I am not good at cooking."],
      ["서울에서 혼자 살 때 전자레인지로 다 했거든요.", "When I lived alone in Seoul, I did everything in the microwave, you see."],
      ["지난주에 복순 할머니가 우리 집에 오셔서 부엌을 보셨어요.", "Last week 복순 할머니 came round and had a look at my kitchen."],
      ["할머니는 냄비를 열어 보시고 나서 아무 말씀도 안 하셨어요.", "She opened my pot and looked in, and after that she said nothing at all."],
      ["냄비 안에 먼지가 쌓여 있었거든요.", "There was dust piled up inside it, you see."],
      ["그다음 날부터 할머니가 매일 {반찬|반찬}을 가지고 오세요.", "Since the next day she has been bringing me side dishes every day."],
      ["제 전자레인지는 요즘 할머니 반찬만 {데워요|데우다}.", "These days my microwave heats up nothing but her side dishes."]
    ],
    gloss: { "반찬": "side dishes (served with rice)", "데우다": "to heat up, to warm up" },
    qs: [
      { ask: "Why is 서진 not good at cooking?", opts: ["Living alone in Seoul, she did everything in the microwave.", "Her kitchen is too small.", "She is always too busy.", "She has no pots."],
        why: "전자레인지로 다 했거든요. The -거든요 sentence comes after, and explains the one before." },
      { ask: "Why did the grandmother say nothing after opening the pot?", opts: ["There was dust piled up inside it.", "The soup in it was delicious.", "It was full of instant noodles.", "까망이's food was in it."],
        why: "냄비 안에 먼지가 쌓여 있었거든요. Some silences are longer than others." },
      { ask: "What does the microwave do these days?", opts: ["heats up the grandmother's side dishes, and nothing else", "nothing: it is broken", "cooks all of 서진's meals", "serves as a flowerpot"],
        why: "할머니 반찬만 데워요. 만: only. The flowerpot, for the record, is the rice cooker." }
    ],
    clip: { tag: "냄비", name: "Clipping: the newsletter column, week eighteen", line: "One pot, dusty. Side dishes now arrive daily." } }
];
