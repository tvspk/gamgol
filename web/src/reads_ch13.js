/* ---------- Chapter 13: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch13").reads = [
  { id: "r13a", title: "생활비", by: "글 · 윤서진", byEn: "by 윤서진",
    intro: "윤서진 has compared the cost of living in Seoul and in Gamgol. One item did not go the way she expected.",
    text: [
      ["서울에 살 때는 월세가 너무 부담스러웠어요.", "When I lived in Seoul, the rent weighed on me terribly."],
      ["감골에 와 보니까 주거비가 정말 싸더라고요.", "Coming to Gamgol, I found housing really is cheap."],
      ["교통비도 거의 안 들더라고요.", "And I found I spend almost nothing on transport."],
      ["식비도 적게 드는 편이에요.", "Food costs are on the low side too."],
      ["할머니가 반찬을 가져오시거든요.", "The grandmother brings me side dishes, you see."],
      ["그런데 전기 요금은 서울보다 많이 {나오더라고요|나오다}.", "But the electricity bill, I found, comes to more than in Seoul."],
      ["밤에 너무 조용해서 불을 다 켜고 자거든요.", "It is so quiet at night that I sleep with every light on, you see."]
    ],
    gloss: { "나오다": "to come to (of a bill: an amount comes out)" },
    qs: [
      { ask: "What did she find out about housing in Gamgol?", opts: ["It really is cheap.", "It costs more than in Seoul.", "It costs the same as in Seoul.", "She lives with the grandmother for free."],
        why: "주거비가 정말 싸더라고요. -더라고요: something she saw for herself and is now reporting." },
      { ask: "Why are her food costs low?", opts: ["The grandmother brings her side dishes.", "She hardly eats.", "She grows her own vegetables.", "She only eats ramen."],
        why: "식비도 적게 드는 편이에요. 할머니가 반찬을 가져오시거든요. -는 편이다 softens: on the low side, not nothing." },
      { ask: "Why is her electricity bill high?", opts: ["It is so quiet at night that she sleeps with every light on.", "Her microwave is always running.", "Prices in the village went up.", "She works through the night."],
        why: "밤에 너무 조용해서 불을 다 켜고 자거든요. The city is expensive. The silence, it turns out, is too." }
    ],
    clip: { tag: "생활비", name: "Clipping: the newsletter column, week twenty-five", line: "Rent: cheap. Food: grandmother. Electricity: the silence." } },

  { id: "r13b", title: "용돈", by: "글 · 강하람", byEn: "by 강하람, 16",
    intro: "강하람 has started keeping accounts. The accounts have started telling him things.",
    text: [
      ["저는 돈을 아껴 쓰는 편이에요.", "I tend to be careful with money."],
      ["한 달 {용돈|용돈}은 오만 원인데, 보통 반은 저금을 해요.", "My pocket money is fifty thousand won a month, and I usually save half."],
      ["그런데 이번 달에는 돈이 많이 부족했어요.", "But this month I was a long way short."],
      ["가계부를 보니까 감골슈퍼에서 쓴 돈이 제일 많더라고요.", "When I looked at my accounts, the biggest spending was at 감골슈퍼."],
      ["대부분 까망이 {간식|간식}이었어요. 영상을 찍을 때마다 사거든요.", "Most of it was snacks for 까망이. I buy some every time I film her, you see."],
      ["충동구매를 하는 편은 아닌데, 까망이가 쳐다보면 사게 되더라고요.", "I'm not one for impulse buying, but when 까망이 looks at me, I find I buy things."],
      ["다음 달부터는 구독자들한테 간식비를 받을까 해요.", "From next month I'm thinking of charging my subscribers for the snacks."]
    ],
    gloss: { "용돈": "pocket money", "간식": "a snack, snacks" },
    qs: [
      { ask: "What kind of spender is 하람, by his own account?", opts: ["careful with money", "an impulse buyer", "someone who spends it all at once", "he gets no pocket money"],
        why: "돈을 아껴 쓰는 편이에요: he tends to be careful. -는 편이다 is a leaning, which is just as well, given what follows." },
      { ask: "Where did most of the money go this month?", opts: ["snacks for 까망이, bought at 감골슈퍼", "bus fares to the county town", "his phone bill", "a new guitar"],
        why: "감골슈퍼에서 쓴 돈이 제일 많더라고요 … 대부분 … 까망이 간식이었어요. The accounts were very clear about it." },
      { ask: "What is he thinking of doing next month?", opts: ["charging his subscribers for the snacks", "closing the channel", "saving all of his pocket money", "getting a part-time job"],
        why: "구독자들한테 간식비를 받을까 해요. -을까 하다 from Chapter 1. At last count the channel had one comment, and it was about the goat." }
    ],
    clip: { tag: "용돈", name: "Clipping: the newsletter column, week twenty-six", line: "Pocket money, mostly converted into goat." } }
];
