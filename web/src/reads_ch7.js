/* ---------- Chapter 7: village newsletter columns (reading) ---------- */
CONTENT.chapters.find(c => c.id === "ch7").reads = [
  { id: "r7a", title: "둘째 줄", by: "글 · 덕배 할아버지", byEn: "by 덕배 할아버지",
    intro: "덕배 할아버지 has entered a singing contest and wished to say so in print, before anyone else did.",
    text: [
      ["다음 달에 {군|군}에서 노래 대회가 있어요.", "Next month there is a singing contest in the county."],
      ["저는 신청서를 작성해서 어제 제출했어요.", "I filled in the application form and handed it in yesterday."],
      ["노래를 잘하기는 해요.", "I do sing well, that much is true."],
      ["그런데 {가사|가사}를 자주 잊어버려요.", "But I often forget the words."],
      ["작년에도 예선에 나가기는 했지만 첫 줄만 세 번 불렀어요.", "Last year I did enter the preliminary round, but I sang only the first line, three times."],
      ["심사 위원들은 “첫 줄은 아주 좋았어요.”라고 했어요.", "The judges said, “The first line was very good.”"],
      ["올해는 둘째 줄까지 불렀으면 좋겠어요.", "This year I hope to get as far as the second line."]
    ],
    gloss: { "군": "county (a rural district)", "가사": "the words of a song, lyrics" },
    qs: [
      { ask: "What does 덕배 할아버지 say about his singing?", opts: ["He sings well, but often forgets the words.", "He sings badly, but knows all the words.", "He has never sung in front of people.", "He can only sing along to the radio."],
        why: "노래를 잘하기는 해요. 그런데 가사를 자주 잊어버려요. -기는 하다 grants one thing, and the ‘but’ follows." },
      { ask: "What happened in last year's preliminary round?", opts: ["He sang the first line three times.", "He took first place.", "He forgot to hand in the form.", "He sang the whole song twice."],
        why: "첫 줄만 세 번 불렀어요. 만: only the first line. The judges were complimentary about it." },
      { ask: "What does he hope for this year?", opts: ["to get as far as the second line", "to win first place", "to be one of the judges", "to sing with 까망이"],
        why: "둘째 줄까지 불렀으면 좋겠어요. A modest wish, and in the past form, as -았으면/-었으면 좋겠다 always is." }
    ],
    clip: { tag: "둘째 줄", name: "Clipping: the newsletter column, week thirteen", line: "Last year: line one, three times. This year's target: line two." } },

  { id: "r7b", title: "열 번 연습", by: "글 · 강하람", byEn: "by 강하람, 16",
    intro: "강하람 has had an audition. He writes about it here, which is braver than the audition.",
    text: [
      ["저는 지난주에 학교 밴드 오디션을 봤어요.", "Last week I auditioned for the school band."],
      ["기타를 칠 줄 알기는 해요.", "I do know how to play the guitar."],
      ["그런데 사람들 앞에 서면 손이 떨려요.", "But when I stand in front of people, my hands shake."],
      ["그래서 오디션 날 아침에 까망이 앞에서 열 번 연습했어요.", "So on the morning of the audition I practised ten times in front of 까망이."],
      ["까망이는 열 번 다 끝까지 들었어요.", "까망이 listened to all ten, right to the end."],
      ["심사 위원들은 일 분만 듣고 “감사합니다.”라고 했어요.", "The judges listened for one minute and said, “Thank you.”"],
      ["다음에는 까망이가 심사 위원이었으면 좋겠어요.", "Next time I wish 까망이 were one of the judges."]
    ],
    gloss: {},
    qs: [
      { ask: "What is 하람's problem with the guitar?", opts: ["He can play, but his hands shake in front of people.", "He cannot play it at all.", "His guitar is broken.", "He forgets the songs."],
        why: "기타를 칠 줄 알기는 해요. 그런데 … 손이 떨려요. The skill is there. The hands have other ideas." },
      { ask: "How did he practise on the morning of the audition?", opts: ["ten times, in front of 까망이", "once, alone in his room", "with 도윤, at the station", "he did not practise at all"],
        why: "까망이 앞에서 열 번 연습했어요. The audience was small, but it stayed." },
      { ask: "What does he wish?", opts: ["that 까망이 were one of the judges next time", "that the audition were held in Gamgol", "that 도윤 would join the band", "that he had a new guitar"],
        why: "까망이가 심사 위원이었으면 좋겠어요. Ten full hearings against one minute: one sees his point." }
    ],
    clip: { tag: "열 번 연습", name: "Clipping: the newsletter column, week fourteen", line: "Audience of one: attentive, patient, horned." } }
];
