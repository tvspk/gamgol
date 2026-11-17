/* ---------- Chapter 6: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch6").reads = [
  { id: "r6a", title: "감골슈퍼 규정", by: "글 · 장미숙 (감골슈퍼)", byEn: "by 장미숙, 감골슈퍼",
    intro: "This week the column is the shop's returns policy, written by 장미숙 사장님, who has had a week.",
    text: [
      ["감골슈퍼에서는 영수증이 없어도 교환해도 돼요.", "At 감골슈퍼 you may exchange things even without a receipt."],
      ["저는 손님들 얼굴을 다 기억하니까요.", "I remember every customer's face, you see."],
      ["개봉한 제품도 반품해도 돼요.", "You may return opened products too."],
      ["하지만 먹은 제품은 반품하면 안 돼요.", "But you may not return products you have eaten."],
      ["지난주에 복순 할머니가 {반쯤|반쯤} 먹은 인삼을 가지고 오셨어요.", "Last week 복순 할머니 came in with some ginseng, about half eaten."],
      ["“식감이 이상해서 환불하려고.”", "“The texture's odd, so I'm getting my money back.”"],
      ["그런데 인삼을 먹은 건 할머니가 아니라 까망이였어요.", "But it was not the grandmother who ate the ginseng. It was 까망이."],
      ["규정은 규정이니까 환불 {대신|대신} 인삼을 하나 더 팔았어요.", "Rules are rules, so instead of a refund I sold her another ginseng."]
    ],
    gloss: { "반쯤": "about half", "대신": "instead (of)" },
    qs: [
      { ask: "Can you exchange things at 감골슈퍼 without a receipt?", opts: ["Yes: the owner remembers every customer's face.", "No, never.", "Only within seven days.", "Only if the price tag is still on."],
        why: "영수증이 없어도 교환해도 돼요: even without (-어도) a receipt, you may (-어도 되다). Two -어도 in one sentence, doing different jobs." },
      { ask: "What may not be returned?", opts: ["products that have been eaten", "products that have been opened", "anything without a receipt", "anything bought on a Saturday"],
        why: "먹은 제품은 반품하면 안 돼요. -으면/-면 안 되다 is the refusal. Opened is fine. Eaten is not." },
      { ask: "What happened about the ginseng?", opts: ["No refund, but the grandmother bought another one.", "The grandmother got all her money back.", "It was exchanged for tofu.", "까망이 was given another one free."],
        why: "환불 대신 인삼을 하나 더 팔았어요. The rule held. The shop, if anything, came out ahead." }
    ],
    clip: { tag: "감골슈퍼 규정", name: "Clipping: the newsletter column, week eleven", line: "Receipts optional. Eating the goods, not." } },

  { id: "r6b", title: "칠 일 이내", by: "글 · 윤서진", byEn: "by 윤서진",
    intro: "윤서진 on shopping from the countryside, where the internet arrives quickly and everything else does not.",
    text: [
      ["감골에는 큰 가게가 없어서 저는 인터넷으로 물건을 자주 사요.", "There are no big shops in Gamgol, so I often buy things online."],
      ["지난달에는 전기밥솥을 샀어요.", "Last month I bought an electric rice cooker."],
      ["그런데 전원이 켜지지 않았어요.", "But it would not switch on."],
      ["그래서 반품하려고 {판매자|판매자}에게 연락했어요.", "So I contacted the seller, meaning to send it back."],
      ["판매자는 “구매 후 칠 일 이내에는 반품해도 돼요.”라고 했어요.", "The seller said, “You may return it within seven days of purchase.”"],
      ["하지만 {택배 기사님|택배 기사님}은 {열흘|열흘}에 한 번 오세요.", "But the delivery driver comes once every ten days."],
      ["그래서 전기밥솥은 지금 화분으로 쓰고 있어요.", "So the rice cooker is now in use as a flowerpot."]
    ],
    gloss: { "판매자": "the seller", "택배 기사님": "the delivery driver (polite)", "열흘": "ten days" },
    qs: [
      { ask: "Why does 서진 buy things online?", opts: ["There are no big shops in Gamgol.", "It is cheaper.", "She enjoys waiting for parcels.", "장미숙 사장님 told her to."],
        why: "감골에는 큰 가게가 없어서: -아서/-어서 gives the reason. There is 감골슈퍼, which is not big, and does not sell rice cookers." },
      { ask: "What was wrong with the rice cooker?", opts: ["It would not switch on.", "She did not like the colour.", "It was too big.", "It made a strange noise."],
        why: "전원이 켜지지 않았어요: the power would not come on." },
      { ask: "Why couldn't she send it back?", opts: ["Returns close after seven days, and the driver only comes every ten.", "She had lost the receipt.", "The seller refused to take it back.", "She had already used it to cook rice."],
        why: "칠 일 이내에는 반품해도 돼요, but the driver comes 열흘에 한 번. Seven is less than ten. The flowerpot is doing well." }
    ],
    clip: { tag: "칠 일 이내", name: "Clipping: the newsletter column, week twelve", line: "One rice cooker, now a flowerpot. Warranty unclear." } }
];
