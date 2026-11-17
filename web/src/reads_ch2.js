/* ---------- Chapter 2: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch2").reads = [
  { id: "r2a", title: "까망이 채널", by: "글 · 강하람", byEn: "by 강하람, 16",
    intro: "The column, written this week by 강하람, sixteen, who has a channel and would like you to know it.",
    text: [
      ["저는 요즘 인터넷 개인 방송을 하고 있어요.", "These days I run my own internet channel."],
      ["영상을 찍을 줄 알고, {편집|편집}도 조금 할 줄 알아요.", "I know how to shoot videos, and I can do a bit of editing too."],
      ["그런데 감골에는 찍을 것이 별로 없어서 매일 까망이를 찍어서 올려요.", "But there is not much to film in Gamgol, so every day I film 까망이 and upload it."],
      ["영상을 올리고 나면 {댓글|댓글}을 기다리면서 숙제를 해요.", "Once a video is up, I do my homework while I wait for comments."],
      ["어제 {드디어|드디어} 처음으로 댓글을 받았어요.", "Yesterday I finally got my first comment."],
      ["“까망이 영상은 언제 또 올려요?”", "“When are you posting another 까망이 video?”"],
      ["제 이름은 아무도 안 물어봤어요.", "Nobody asked my name."]
    ],
    gloss: { "편집": "editing (a video)", "댓글": "a comment (under a post or video)", "드디어": "finally, at last" },
    qs: [
      { ask: "What does 하람 know how to do?", opts: ["shoot videos, and edit them a little", "edit videos, but not shoot them", "nothing yet: he is still learning to film", "play an instrument for his videos"],
        why: "영상을 찍을 줄 알고, 편집도 조금 할 줄 알아요. Both, the second one modestly." },
      { ask: "What does he do once a video is uploaded?", opts: ["his homework, while waiting for comments", "goes straight to bed", "films 까망이 again", "goes fishing with 덕배 할아버지"],
        why: "올리고 나면 댓글을 기다리면서 숙제를 해요: once it is up, homework, with one eye on the comments. Possibly both eyes." },
      { ask: "What did the first comment want to know?", opts: ["when the next 까망이 video is coming", "what 하람's name is", "how to edit videos", "where Gamgol is"],
        why: "까망이 영상은 언제 또 올려요? And, as 하람 notes, nobody asked his name." }
    ],
    clip: { tag: "까망이 채널", name: "Clipping: the newsletter column, week three", line: "First comment received. It was about the goat." } },

  { id: "r2b", title: "사십 년 낚시", by: "글 · 덕배 할아버지", byEn: "by 덕배 할아버지",
    intro: "This week's column comes from 덕배 할아버지, who has fished the same river for longer than the bridge has stood on it.",
    text: [
      ["저는 매일 아침 강에서 낚시를 해요.", "Every morning I go fishing in the river."],
      ["사십 년 동안 했지만 아직도 물고기를 잡을 줄 몰라요.", "I have done it for forty years, and I still don't know how to catch a fish."],
      ["그래도 괜찮아요.", "That's all right, though."],
      ["낚시를 하고 나면 스트레스가 풀리고 마음이 차분해지니까요.", "Once I have been fishing, my stress is gone and my mind is calm."],
      ["물고기들도 저를 아주 좋아해요.", "The fish are very fond of me, too."],
      ["매일 와서 {미끼|미끼}만 먹고 가요.", "They come every day, eat the bait and leave."]
    ],
    gloss: { "미끼": "bait" },
    qs: [
      { ask: "How long has 덕배 할아버지 been fishing?", opts: ["forty years", "four years", "fourteen years", "since last month"],
        why: "사십 년 동안: forty years. 사 is four, 십 is ten, and the fish have had all forty to get used to him." },
      { ask: "Why does he keep fishing?", opts: ["It relieves his stress and calms him down.", "He sells the fish at the market.", "His doctor told him to.", "까망이 likes fish."],
        why: "낚시를 하고 나면 스트레스가 풀리고 마음이 차분해지니까요. The catch is not the point. There is no catch." },
      { ask: "What do the fish do?", opts: ["come every day, eat only the bait and leave", "stay away from him", "jump into his bucket", "follow him home"],
        why: "매일 와서 미끼만 먹고 가요. 만 means only the bait. The fish have a system, too." }
    ],
    clip: { tag: "사십 년 낚시", name: "Clipping: the newsletter column, week four", line: "Forty years, no fish, excellent relations with the fish." } }
];
