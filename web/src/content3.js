/* =====================================================================
   EXTRA CONTENT — larger review pools and an optional third file per chapter.
   Loaded after the chapters; only adds, never replaces.
   ===================================================================== */

POOL_CH1.push(
  // -으면서/-면서 · form
  { skill: "ms", type: "mc", ask: "먹다 + -으면서/-면서", ko: "아이들이 아이스크림을 ___ 걸어가요.", opts: ["먹으면서", "먹면서", "먹어면서", "먹을면서"], en: "The children walk along eating ice cream.", why: "먹- ends in a consonant, so it takes -으면서." },
  { skill: "ms", type: "mc", ask: "찾다 + -으면서/-면서", ko: "저는 인터넷에서 정보를 ___ 여행 계획을 세워요.", opts: ["찾으면서", "찾면서", "찾아면서", "찾을면서"], en: "I make travel plans while looking up information on the internet.", why: "찾- ends in a consonant, so it takes -으면서." },
  { skill: "ms", type: "mc", ask: "쉬다 + -으면서/-면서", ko: "주말에는 집에서 ___ 영화를 봐요.", opts: ["쉬면서", "쉬으면서", "쉴면서", "쉴으면서"], en: "At weekends I watch films while resting at home.", why: "쉬- ends in a vowel, so it takes plain -면서." },
  { skill: "ms", type: "fill", ask: "Give the missing form of 부르다.", ko: "언니는 노래를 ___ 요리해요.", accept: ["부르면서"], hint: ["부르다", "-으면서/-면서"], en: "My older sister cooks while singing.", why: "부르- ends in a vowel: 부르면서." },
  { skill: "ms", type: "fill", ask: "Give the missing form of 다니다.", ko: "저는 회사에 ___ 대학원 공부도 해요.", accept: ["다니면서"], hint: ["다니다", "-으면서/-면서"], en: "I work at a company and study at graduate school as well.", why: "다니- ends in a vowel: 다니면서." },
  // irregular and look-alike regular verbs
  { skill: "irr", type: "mc", ask: "듣다 + -으면서/-면서", ko: "저는 한국 노래를 ___ 한국어를 공부해요.", opts: ["들으면서", "듣으면서", "듣면서", "들면서"], en: "I study Korean while listening to Korean songs.", why: "듣다 is ㄷ irregular: ㄷ becomes ㄹ before -으면서, giving 들으면서." },
  { skill: "irr", type: "mc", ask: "걷다 + -을까/-ㄹ까 하다", ko: "날씨가 좋아서 집까지 ___ 해요.", opts: ["걸을까", "걷을까", "걸까", "걷까"], en: "The weather is nice, so I'm thinking of walking home.", why: "걷다 is ㄷ irregular: ㄷ becomes ㄹ before -을까, giving 걸을까." },
  { skill: "irr", type: "mc", ask: "받다 + -으면서/-면서", ko: "저는 전화를 ___ 메모를 해요.", opts: ["받으면서", "발으면서", "받면서", "바드면서"], en: "I take notes while I'm on the phone.", why: "받다 looks like 듣다 but is regular: its ㄷ stays, 받으면서." },
  { skill: "irr", type: "mc", ask: "웃다 + -으면서/-면서", ko: "친구가 ___ 인사했어요.", opts: ["웃으면서", "우으면서", "웃면서", "웃을면서"], en: "My friend greeted me with a smile.", why: "웃다 looks like 짓다 but is regular: its ㅅ stays, 웃으면서." },
  { skill: "irr", type: "fill", ask: "Give the missing form of 짓다.", ko: "그 사람은 집을 ___ 동영상도 찍었어요.", accept: ["지으면서"], diag: [{ p: ["짓으면서", "지면서"], msg: "짓다 is ㅅ irregular: ㅅ drops before a vowel ending, and 으 stays." }], hint: ["짓다", "-으면서/-면서"], en: "That person filmed videos while building the house.", why: "짓다 is ㅅ irregular: 지으면서." },
  // ㄹ stems
  { skill: "lst", type: "mc", ask: "놀다 + -으면서/-면서", ko: "아이들이 공원에서 ___ 웃어요.", opts: ["놀면서", "놀으면서", "노면서", "놀을면서"], en: "The children laugh while playing in the park.", why: "ㄹ stems take -면서 with no 으 and keep their ㄹ." },
  { skill: "lst", type: "mc", ask: "열다 + -을까/-ㄹ까 하다", ko: "내년에 작은 카페를 ___ 해요.", opts: ["열까", "열을까", "여을까", "열으까"], en: "I'm thinking of opening a small café next year.", why: "열- already ends in ㄹ, so it only adds -까." },
  { skill: "lst", type: "mc", ask: "만들다 + -으면서/-면서", ko: "저는 음식을 ___ 음악을 들어요.", opts: ["만들면서", "만들으면서", "만드면서", "만들을면서"], en: "I listen to music while making food.", why: "ㄹ stems take -면서 with no 으 and keep their ㄹ." },
  { skill: "lst", type: "fill", ask: "Give the missing form of 살다.", ko: "졸업 후에는 서울에서 ___ 해요.", accept: ["살까"], diag: [{ p: ["살을까"], msg: "살- already ends in ㄹ: no 을." }], hint: ["살다", "-을까/-ㄹ까 하다"], en: "After graduating I'm thinking of living in Seoul.", why: "살- ends in ㄹ, so it only adds -까: 살까 해요." },
  // one subject, two actions
  { skill: "mss", type: "mc", ask: "Only one of these sentences works. Which?", opts: ["저는 운전하면서 라디오를 들어요.", "저는 운전하면서 친구는 잠을 자요.", "눈이 오면서 저는 사진을 찍었어요.", "동생이 울면서 엄마는 전화했어요."], en: "I listen to the radio while driving.", why: "One person, two actions at once. The others change subject in the middle." },
  { skill: "mss", type: "mc", ask: "Only one of these sentences works. Which?", opts: ["형은 샤워하면서 노래를 불러요.", "형이 샤워하면서 저는 텔레비전을 봐요.", "아버지가 요리하면서 어머니는 책을 읽어요.", "친구가 노래하면서 저는 춤을 췄어요."], en: "My older brother sings in the shower.", why: "-으면서/-면서 needs the same subject for both halves." },
  { skill: "mss", type: "mc", ask: "What does the speaker mean?", ko: "밥을 먹으면서 이야기해요.", opts: ["We talk while we eat.", "We eat first and talk afterwards.", "We talk if we eat.", "We talk because we are eating."], enOpts: true, en: "We talk while we eat.", why: "-으면서/-면서 puts two actions at the same time." },
  // -을까/-ㄹ까 하다 · form
  { skill: "lk", type: "mc", ask: "배우다 + -을까/-ㄹ까 하다", ko: "방학에 수영을 ___ 해요.", opts: ["배울까", "배우을까", "배울을까", "배우까"], en: "I'm thinking of learning to swim in the holidays.", why: "배우- ends in a vowel, so ㄹ goes underneath: 배울까." },
  { skill: "lk", type: "mc", ask: "찾다 + -을까/-ㄹ까 하다", ko: "새 아르바이트를 ___ 해요.", opts: ["찾을까", "찾까", "찾으까", "찾을가"], en: "I'm thinking of looking for a new part-time job.", why: "찾- ends in a consonant, so it takes -을까." },
  { skill: "lk", type: "fill", ask: "Give the missing form of 쉬다.", ko: "이번 주말에는 그냥 집에서 ___ 해요.", accept: ["쉴까"], hint: ["쉬다", "-을까/-ㄹ까 하다"], en: "This weekend I'm thinking of just resting at home.", why: "쉬- ends in a vowel: 쉴까 해요." },
  { skill: "lk", type: "fill", ask: "Give the missing form of 모으다.", ko: "여행을 가고 싶어서 돈을 ___ 해요.", accept: ["모을까"], hint: ["모으다", "-을까/-ㄹ까 하다"], en: "I want to travel, so I'm thinking of saving up.", why: "모으- ends in a vowel: 모을까 해요." },
  // -을까/-ㄹ까 하다 · use
  { skill: "lku", type: "mc", ask: "Only one of these sentences works. Which?", opts: ["저는 다음 달부터 요가를 배울까 해요.", "우리 형은 다음 달부터 요가를 배울까 해요.", "저는 지난달부터 요가를 배울까 해요.", "저는 다음 달부터 요가를 배우을까 해요."], en: "I'm thinking of learning yoga from next month.", why: "Your own plan, lying ahead: not your brother's, not 지난달, and 배우- takes -ㄹ까." },
  { skill: "lku", type: "mc", ask: "Pick the answer that works.", ko: "가: 졸업하면 뭐 할 거예요?\n나: ___", opts: ["대학원에 진학할까 해요.", "대학원에 진학했을까 해요.", "선생님은 대학원에 진학할까 해요.", "대학원에 진학하면서 해요."], en: "A: What will you do when you graduate? B: I'm thinking of going on to graduate school.", why: "A loose plan of your own: 진학할까 해요. No past tense inside it, and it cannot speak for the teacher." },
  { skill: "lku", type: "mc", ask: "What does the speaker mean?", ko: "주말에 캠핑을 할까 해요.", opts: ["I'm thinking of going camping; it isn't fixed.", "I went camping at the weekend.", "I will definitely go camping.", "I'm asking you to come camping."], enOpts: true, en: "I'm thinking of going camping at the weekend.", why: "-을까/-ㄹ까 하다 is an intention not yet settled. An invitation would be 할까요?" },
  { skill: "lku", type: "write", to: "sunbae", ask: "Tell 선배: “I'm thinking of signing up at a gym.”", accept: ["(|저는 |전 )헬스클럽에 등록할까 (해요|합니다)"], diag: [{ p: ["(|나는 |난 )헬스클럽에 등록할까 해"], msg: "Right words, wrong speech level: she is your senior, so 해요체." }, { p: ["(|저는 |전 )헬스클럽에 등록할 (거예요|겁니다)"], msg: "That is a firm decision. For a loose plan use -을까/-ㄹ까 하다." }], hint: ["헬스클럽에 등록하다", "-을까/-ㄹ까 하다"], lenient: ["헬스클럽"], en: "I'm thinking of signing up at a gym.", why: "등록하- ends in a vowel: 등록할까 해요." },
  // speech level
  { skill: "lvl", type: "mc", to: "chief", ask: "You tell the chief how you are spending your days.", opts: ["저는 요즘 운동하면서 지냅니다.", "나는 요즘 운동하면서 지내.", "저는 요즘 운동하시면서 지내십니다.", "저는 요즘 운동하으면서 지냅니다."], en: "These days I spend my time exercising.", why: "To the chief: 저 and 합쇼체. -(으)시- would honour yourself, and 하- takes plain -면서." },
  { skill: "lvl", type: "mc", to: "haram", ask: "You ask 하람 about his holidays.", opts: ["방학에 뭐 할 거야?", "방학에 뭐 하실 거예요?", "방학에 뭐 할 겁니까?", "방학에 뭐 하을 거야?"], en: "What are you going to do in the holidays?", why: "He is sixteen: 반말. -(으)시- and 합쇼체 are for people you owe distance to." },
  { skill: "lvl", type: "mc", to: "deokbae", ask: "You ask the grandfather whether he is still learning.", opts: ["할아버지, 요즘도 컴퓨터를 배우세요?", "할아버지, 요즘도 컴퓨터를 배워?", "할아버지, 요즘도 컴퓨터를 배우니?", "할아버지, 요즘도 컴퓨터를 배우으세요?"], en: "Grandfather, are you still learning computers these days?", why: "He is 81: 해요체 with -(으)시-. 배우- takes -세요 without 으." },
  { skill: "lvl", type: "write", to: "doyun", ask: "Tell 도윤: “I'm thinking of quitting the gym.”", accept: ["(|나는 |난 |나 )헬스클럽(을|) 그만둘까 해"], diag: [{ p: ["(|저는 |전 )헬스클럽(을|) 그만둘까 (해요|합니다)"], msg: "Right words, wrong speech level: 도윤 is your 동기, so 반말." }], hint: ["헬스클럽", "그만두다", "-을까/-ㄹ까 하다"], lenient: ["헬스클럽"], en: "I'm thinking of quitting the gym.", why: "그만두- ends in a vowel: 그만둘까. 반말 closes with 해." },
  { skill: "lvl", type: "write", to: "chief", ask: "Tell the chief: “I'm thinking of getting my driver's licence next year.”", accept: ["(|저는 |전 )내년에(는|) 운전면허(를|) 딸까 합니다"], diag: [{ p: ["(|저는 |전 )내년에(는|) 운전면허(를|) 딸까 해요"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }, { p: ["(|나는 |난 )내년에(는|) 운전면허(를|) 딸까 해"], msg: "Right words, wrong speech level: this is the chief, so 저 and 합쇼체." }], hint: ["내년", "운전면허를 따다", "-을까/-ㄹ까 하다"], lenient: ["내년", "운전면허"], en: "I'm thinking of getting my driver's licence next year.", why: "따- ends in a vowel: 딸까. To the chief it closes with 합니다." },
  // words
  { skill: "voc", type: "mc", ask: "Finish the last sentence.", ko: "수진 씨는 지난달에 대학교 공부를 다 마쳤어요. 수진 씨는 ___.", opts: ["졸업했어요", "입학했어요", "휴학했어요", "복학했어요"], en: "Sujin finished all her university studies last month. Sujin has graduated.", why: "졸업하다 is finishing school. 입학하다 is starting it." },
  { skill: "voc", type: "mc", ask: "Finish the last sentence.", ko: "준 씨는 다음 주부터 새 회사에서 일해요. 드디어 ___.", opts: ["취직했어요", "휴직했어요", "졸업했어요", "입대했어요"], en: "Jun starts work at a new company next week. He has finally got a job.", why: "취직하다 is getting hired. 휴직하다 is taking leave from a job you already have." },
  { skill: "voc", type: "mc", ask: "Finish the last sentence.", ko: "민우 씨는 다음 달에 군인이 돼요. 민우 씨는 곧 ___.", opts: ["입대해요", "입학해요", "졸업해요", "복학해요"], en: "Minwu becomes a soldier next month. He is enlisting soon.", why: "입대하다 is entering the army. 입학하다 is entering a school." },
  { skill: "voc", type: "mc", ask: "Finish the last sentence.", ko: "저는 토요일마다 그림을 그리는 사람들을 만나요. 같은 취미를 가진 사람들의 모임이에요. 이건 ___ 모임이에요.", opts: ["동호회", "대학원", "사업", "업무"], en: "Every Saturday I meet people who paint. It's a gathering of people with the same hobby. It's a hobby club meet-up.", why: "동호회 is a club of people who share a hobby." },
  // partners and particles
  { skill: "col", type: "mc", ask: "Pick the verb.", ko: "작년에 컴퓨터 자격증을 ___.", opts: ["땄어요", "옮겼어요", "늘었어요", "그만뒀어요"], en: "I got a computer certificate last year.", why: "Certificates, licences and medals are all 따다." },
  { skill: "col", type: "mc", ask: "Pick the particle.", ko: "언니는 지금 프리랜서___ 일해요.", opts: ["로", "으로", "를", "에"], en: "My older sister works as a freelancer now.", why: "‘As a freelancer’ is -(으)로. 프리랜서 ends in a vowel, so 로." },
  { skill: "col", type: "mc", ask: "Pick the particle.", ko: "다음 달에 서울___ 이사할까 해요.", opts: ["로", "으로", "를", "이"], en: "I'm thinking of moving to Seoul next month.", why: "Direction takes -(으)로, and after ㄹ it is 로: 서울로." },
  { skill: "col", type: "mc", ask: "Pick the verb.", ko: "한국어 실력이 많이 ___.", opts: ["늘었어요", "땄어요", "모았어요", "옮겼어요"], en: "My Korean has improved a lot.", why: "Skill grows by itself: 실력이 늘다." },
  { skill: "ms", type: "write", to: "sunbae", ask: "Tell 선배: “I'm saving money while working at a company.” (회사에 다니다)", accept: ["(|저는 |전 )회사에 다니면서 돈(을|) (모으고 있어요|모아요|모으고 있습니다|모읍니다)"], diag: [{ p: ["(|나는 |난 )회사에 다니면서 돈(을|) (모으고 있어|모아)"], msg: "Right words, wrong speech level: she is your senior, so 해요체." }], hint: ["회사에 다니다", "돈을 모으다", "-으면서/-면서", "-고 있다"], lenient: ["회사"], en: "I'm saving money while working at a company.", why: "다니- ends in a vowel: 다니면서." }
);

CHAPTER_2.pool.push(
  // -을/-ㄹ 줄 알다/모르다 · form
  { skill: "jl", type: "mc", ask: "찍다 + -을/-ㄹ 줄 모르다", ko: "저는 사진을 잘 ___ 몰라요.", opts: ["찍을 줄", "찍 줄", "찍으 줄", "찍을 쭐"], en: "I don't really know how to take photos.", why: "찍- ends in a consonant: 찍을 줄, spelled 줄." },
  { skill: "jl", type: "mc", ask: "쓰다 + -을/-ㄹ 줄 모르다", ko: "그 아이는 아직 젓가락을 ___ 몰라요.", opts: ["쓸 줄", "쓰을 줄", "쓸을 줄", "쓸 쭐"], en: "That child doesn't know how to use chopsticks yet.", why: "쓰- ends in a vowel, so ㄹ goes underneath: 쓸 줄." },
  { skill: "jl", type: "mc", ask: "그리다 + -을/-ㄹ 줄 알다", ko: "제 친구는 만화를 ___ 알아요.", opts: ["그릴 줄", "그리을 줄", "그릴을 줄", "그릴 쭐"], en: "My friend knows how to draw comics.", why: "그리- ends in a vowel: 그릴 줄." },
  { skill: "jl", type: "fill", ask: "Give the missing form of 추다.", ko: "저는 춤을 ___ 줄 몰라요.", accept: ["출"], hint: ["추다", "-을/-ㄹ 줄 모르다"], en: "I don't know how to dance.", why: "추- ends in a vowel: 출 줄 몰라요." },
  { skill: "jl", type: "fill", ask: "Give the missing form of 고치다.", ko: "아버지는 자전거를 ___ 줄 아세요.", accept: ["고칠"], hint: ["고치다", "-을/-ㄹ 줄 알다"], en: "My father knows how to fix bicycles.", why: "고치- ends in a vowel: 고칠 줄." },
  { skill: "jl", type: "fill", ask: "Give the missing form of 운전하다.", ko: "언니는 ___ 줄 알아요.", accept: ["운전할"], hint: ["운전하다", "-을/-ㄹ 줄 알다"], en: "My older sister knows how to drive.", why: "하- ends in a vowel: 운전할 줄 알아요." },
  // ㄹ stems
  { skill: "lst", type: "mc", ask: "만들다 + -을/-ㄹ 줄 모르다", ko: "저는 김밥을 ___ 몰라요.", opts: ["만들 줄", "만들을 줄", "만드을 줄", "만들 쭐"], en: "I don't know how to make gimbap.", why: "만들- already ends in ㄹ, so 줄 follows directly." },
  { skill: "lst", type: "mc", ask: "놀다 + -고 나면", ko: "아이들은 밖에서 ___ 잘 자요.", opts: ["놀고 나면", "노고 나면", "놀으고 나면", "놀고 나으면"], en: "Once the children have played outside, they sleep well.", why: "Before -고 the ㄹ stays and no 으 is added: 놀고 나면." },
  { skill: "lst", type: "fill", ask: "Give the missing form of 만들다.", ko: "저녁을 다 ___ 나면 전화할게요.", accept: ["만들고"], diag: [{ p: ["만드고", "만들으고"], msg: "Before -고 the ㄹ stays and no 으 is added." }], hint: ["만들다", "-고 나면"], en: "Once dinner is all made, I'll call you.", why: "Stem + 고: 만들고 나면." },
  // ㄷ and ㅅ irregular
  { skill: "irr", type: "mc", ask: "걷다 + -을/-ㄹ 줄 알다", ko: "아기가 이제 ___ 알아요.", opts: ["걸을 줄", "걷을 줄", "걸 줄", "걸을 쭐"], en: "The baby knows how to walk now.", why: "걷다 is ㄷ irregular: ㄷ becomes ㄹ before -을, giving 걸을 줄." },
  { skill: "irr", type: "mc", ask: "듣다 + -고 나면", ko: "이 노래를 ___ 기분이 좋아져요.", opts: ["듣고 나면", "들고 나면", "들으고 나면", "듣으고 나면"], en: "Once I've listened to this song, I feel better.", why: "듣다 changes only before vowel endings. Before -고 it stays 듣고." },
  { skill: "irr", type: "mc", ask: "짓다 + -을/-ㄹ 줄 알다", ko: "그 사람은 집을 ___ 알아요.", opts: ["지을 줄", "짓을 줄", "질 줄", "지을 쭐"], en: "That person knows how to build a house.", why: "짓다 is ㅅ irregular: ㅅ drops before a vowel ending and 을 stays, giving 지을 줄." },
  // ㅂ irregular
  { skill: "bir", type: "mc", ask: "돕다 + -고 나면", ko: "친구를 ___ 기분이 좋아져요.", opts: ["돕고 나면", "도우고 나면", "도고 나면", "돕으고 나면"], en: "Once I've helped a friend, I feel good.", why: "돕다 changes only before vowel endings. Before -고 it stays 돕고." },
  { skill: "bir", type: "fill", ask: "Give the missing form of 돕다.", ko: "그 학생은 친구를 ___ 줄 알아요.", accept: ["도울"], diag: [{ p: ["돕을", "도을"], msg: "돕다 is ㅂ irregular: ㅂ becomes 우 before a vowel ending." }], hint: ["돕다", "-을/-ㄹ 줄 알다"], en: "That student knows how to help a friend.", why: "ㅂ becomes 우, then ㄹ: 도울 줄." },
  { skill: "bir", type: "mc", ask: "Which pair is right for 돕다?", opts: ["도울 줄 알아요 · 돕고 나면", "돕을 줄 알아요 · 돕고 나면", "도울 줄 알아요 · 도우고 나면", "돕을 줄 알아요 · 도우고 나면"], en: "knows how to help · once (I) have helped", why: "ㅂ turns into 우 only before a vowel ending (도울 줄). Before -고 it stays (돕고 나면)." },
  // -고 나면 · form
  { skill: "gn", type: "mc", ask: "쉬다 + -고 나면", ko: "조금 ___ 다시 시작할 거예요.", opts: ["쉬고 나면", "쉴고 나면", "쉬으고 나면", "쉬고 나으면"], en: "Once I've rested a little, I'll start again.", why: "-고 나면 goes straight onto the stem: 쉬고 나면." },
  { skill: "gn", type: "mc", ask: "읽다 + -고 나면", ko: "이 책을 다 ___ 영화도 볼 거예요.", opts: ["읽고 나면", "읽으고 나면", "읽어고 나면", "읽고 나으면"], en: "Once I've read the whole book, I'll watch the film too.", why: "-고 나면 goes straight onto the stem, with no 으: 읽고 나면." },
  { skill: "gn", type: "fill", ask: "Give the missing form of 끝나다.", ko: "수업이 ___ 나면 같이 점심을 먹을 거예요.", accept: ["끝나고"], hint: ["끝나다", "-고 나면"], en: "Once class is over, we'll have lunch together.", why: "Stem + 고: 끝나고 나면." },
  { skill: "gn", type: "fill", ask: "Give the missing form of 마시다.", ko: "저는 커피를 ___ 나면 잠이 안 와요.", accept: ["마시고"], hint: ["마시다", "-고 나면"], en: "Once I've had coffee, I can't sleep.", why: "Stem + 고: 마시고 나면." },
  { skill: "gn", type: "write", to: "sunbae", ask: "Tell 선배: “Once I've listened to music, I feel better.” (기분이 좋아지다)", accept: ["(|저는 |전 )음악(을|) 듣고 나면 기분(이|) (좋아져요|좋아집니다)"], diag: [{ p: ["(|저는 |전 )음악(을|) (들고|들으고|듣으고) 나면 기분(이|) (좋아져요|좋아집니다)"], msg: "Right words, wrong verb form: before -고, 듣다 keeps its ㄷ." }, { p: ["(|저는 |전 )음악(을|) 듣고 나면 기분(이|) (좋아졌어요|좋아졌습니다)"], msg: "Right words, wrong tense: the English is about what usually happens now, so 좋아져요." }], hint: ["음악", "듣다", "-고 나면", "기분이 좋아지다"], lenient: ["음악", "기분"], en: "Once I've listened to music, I feel better.", why: "듣고 나면, then the usual result: 기분이 좋아져요." },
  // -고 나면 · what follows
  { skill: "gnu", type: "mc", ask: "Only one of these sentences works. Which?", opts: ["숙제를 끝내고 나면 마음이 편해질 거예요.", "어제 숙제를 끝내고 나면 마음이 편해졌어요.", "숙제를 끝내고 나면 지난주에 놀았어요.", "숙제를 끝내으고 나면 마음이 편해질 거예요."], en: "Once the homework is done, you'll feel at ease.", why: "After -고 나면 comes a usual result or a prediction, not a finished past event." },
  { skill: "gnu", type: "mc", ask: "Pick the answer that works.", ko: "가: 요즘 너무 피곤해요.\n나: ___", opts: ["주말에 푹 쉬고 나면 괜찮아질 거예요.", "주말에 푹 쉬고 나면 괜찮아졌어요.", "주말에 푹 쉴고 나면 괜찮아질 거예요.", "주말에 푹 쉬고 나으면 괜찮아질 거예요."], en: "A: I'm so tired these days. B: Once you've had a good rest at the weekend, you'll be fine.", why: "쉬고 나면, followed by a prediction: 괜찮아질 거예요." },
  { skill: "gnu", type: "mc", ask: "What happens first?", ko: "저녁을 먹고 나면 산책을 해요.", opts: ["Dinner, and the walk once it is finished.", "The walk, and dinner afterwards.", "Both at the same time.", "The walk, but only on days without dinner."], enOpts: true, en: "Once I've had dinner, I go for a walk.", why: "-고 나면 finishes the first action before the second begins." },
  // a learned skill, not a circumstance
  { skill: "jlu", type: "mc", ask: "Only one of these sentences works. Which?", opts: ["저는 스키를 탈 줄 몰라요. 한 번도 안 배웠어요.", "눈이 안 와서 스키를 탈 줄 몰라요.", "돈이 없어서 스키를 탈 줄 몰라요.", "감기에 걸려서 오늘은 스키를 탈 줄 몰라요."], en: "I don't know how to ski. I've never learned.", why: "-을/-ㄹ 줄 모르다 means never having learned. No snow, no money and a cold are circumstances: -을/-ㄹ 수 없다." },
  { skill: "jlu", type: "mc", ask: "Only one of these can be said with -을/-ㄹ 줄 알다 instead. Which?", opts: ["저는 기타를 칠 수 있어요.", "내일은 쉬는 날이어서 만날 수 있어요.", "여기에서는 사진을 찍을 수 있어요.", "지금은 시간이 있어서 도와줄 수 있어요."], en: "I can play the guitar. = 저는 기타를 칠 줄 알아요.", why: "Playing the guitar is a learned skill. A day off, permission and spare time are circumstances." },
  { skill: "jlu", type: "mc", ask: "What does the speaker mean?", ko: "저는 운전할 줄 몰라요.", opts: ["I never learned to drive.", "I'm too tired to drive today.", "I'm not allowed to drive here.", "I don't feel like driving."], enOpts: true, en: "I don't know how to drive.", why: "-을/-ㄹ 줄 모르다 is about not having the skill at all." },
  { skill: "jlu", type: "mc", ask: "Pick the answer that makes sense.", ko: "가: 수영할 줄 알아요?\n나: ___", opts: ["아니요, 할 줄 몰라요. 한 번도 안 배웠어요.", "아니요, 할 줄 알아요. 한 번도 안 배웠어요.", "네, 할 줄 몰라요. 아주 잘해요.", "아니요, 하을 줄 몰라요. 한 번도 안 배웠어요."], en: "A: Do you know how to swim? B: No, I don't. I've never learned.", why: "아니요 goes with 몰라요, and 하- takes -ㄹ 줄: 할 줄." },
  // speech level
  { skill: "lvl", type: "mc", to: "chief", ask: "The chief asks whether you can drive. You can.", opts: ["네, 운전할 줄 압니다.", "네, 운전할 줄 알아.", "네, 운전할 줄 아십니다.", "네, 운전할 줄 알습니다."], en: "Yes, I know how to drive.", why: "합쇼체 of 알다 is 압니다: the ㄹ drops. 아십니다 would honour yourself." },
  { skill: "lvl", type: "mc", to: "haram", ask: "You ask 하람 whether he can swim.", opts: ["하람아, 수영할 줄 알아?", "하람아, 수영할 줄 아세요?", "하람 씨, 수영할 줄 압니까?", "하람아, 수영하을 줄 알아?"], en: "Haram, do you know how to swim?", why: "He is sixteen: 반말, 알아?" },
  { skill: "lvl", type: "write", to: "doyun", ask: "Tell 도윤: “Once I've eaten, I'll call you.”", accept: ["(|나 |내가 )밥(을|) 먹고 나면 전화할게"], diag: [{ p: ["(|저 |제가 )밥(을|) 먹고 나면 (전화할게요|전화하겠습니다)"], msg: "Right words, wrong speech level: 도윤 is your 동기, so 반말." }], hint: ["밥", "먹다", "-고 나면", "전화하다", "-을게"], lenient: ["전화"], en: "Once I've eaten, I'll call you.", why: "먹고 나면, then 반말: 전화할게." },
  { skill: "lvl", type: "write", to: "chief", ask: "Tell the chief: “I know how to shoot a video.”", accept: ["(|저는 |전 )(영상|동영상)(을|) 찍을 줄 압니다"], diag: [{ p: ["(|저는 |전 )(영상|동영상)(을|) 찍을 줄 알아요"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }, { p: ["(|저는 |전 )(영상|동영상)(을|) 찍을 줄 알습니다"], msg: "Right idea, wrong form: 알다 drops its ㄹ before -ㅂ니다, giving 압니다." }], hint: ["영상을 찍다", "-을/-ㄹ 줄 알다"], lenient: ["영상"], en: "I know how to shoot a video.", why: "찍을 줄 알다 in 합쇼체: 압니다." },
  // words
  { skill: "voc2", type: "mc", ask: "Finish the last sentence.", ko: "저는 책 읽는 것을 좋아해요. 제 취미는 ___.", opts: ["독서예요", "낚시예요", "헬스예요", "화장이에요"], en: "I like reading books. My hobby is reading.", why: "독서 is reading books." },
  { skill: "voc2", type: "mc", ask: "Finish the last sentence.", ko: "주말에 가족하고 공원에 가서 도시락을 먹었어요. 오랜만에 ___ 했어요.", opts: ["야외 나들이를", "맛집 탐방을", "경기 관람을", "악기 연주를"], en: "At the weekend I went to the park with my family and ate a packed lunch. We had an outing for the first time in a while.", why: "야외 나들이 is an outing outdoors." },
  { skill: "voc2", type: "mc", ask: "Finish the last sentence.", ko: "어려운 일을 다 끝내서 정말 기뻐요. 큰 ___ 느껴요.", opts: ["성취감을", "집중력을", "체력을", "피로를"], en: "I've finished a hard job and I'm really glad. I feel a great sense of achievement.", why: "성취감 is the feeling of having achieved something." },
  { skill: "voc2", type: "mc", ask: "Pick the word that fits.", ko: "저는 ___ 조용한 사람이에요. 그런데 축제에서는 말을 많이 해요.", opts: ["원래", "아직", "한번", "다시"], en: "I'm a quiet person by nature. But at festivals I talk a lot.", why: "원래 is how something is by nature or from the start." },
  // partners
  { skill: "col2", type: "mc", ask: "Pick the verb.", ko: "운동을 열심히 해서 체력이 ___.", opts: ["좋아졌어요", "풀렸어요", "차분해졌어요", "됐어요"], en: "I've exercised hard, so my stamina has improved.", why: "Stamina and concentration improve: 체력이 좋아지다." },
  { skill: "col2", type: "mc", ask: "Pick the verb.", ko: "산책을 해서 기분 전환이 ___.", opts: ["됐어요", "풀렸어요", "가벼워졌어요", "차분해졌어요"], en: "I went for a walk, and it took my mind off things.", why: "The set phrase is 기분 전환이 되다." },
  { skill: "col2", type: "mc", ask: "Pick the verb.", ko: "친구하고 오랜만에 이야기를 ___.", opts: ["나눴어요", "찍었어요", "쳤어요", "탔어요"], en: "I had a talk with a friend for the first time in ages.", why: "Conversation is shared: 이야기를 나누다." },
  { skill: "col2", type: "mc", ask: "Pick the verb.", ko: "언니는 피아노를 잘 ___.", opts: ["쳐요", "타요", "찍어요", "불러요"], en: "My older sister plays the piano well.", why: "Piano, guitar and tennis all take 치다." }
);

/* ---------- Chapter 1, optional third file: both patterns of the chapter together ---------- */
const CASE_1C = {
  id: "c1c", no: "01-C", title: "The Jar That Took a Leave of Absence",
  blurb: "A kimchi container has gone from a yard near the bus stop. Its owner had been told where it was going. She was watching television at the time.",
  kind: "Mixed · optional",
  souvenir: { id: "lid", tag: "김치", name: "Lid of a kimchi container, returned", line: "Reported stolen by the one person who had agreed to lend it." },
  scenes: [
    { place: "Gamgol substation · 08:30",
      narr: "복순 할머니 is in the public chair before the kettle has boiled. Something has been taken from her yard, and she has already decided who did it. She has decided it was everyone.",
      lines: [{ c: "boksun", ko: "김 순경, 우리 집 김치 통이 없어졌어!", en: "Officer, the kimchi container from my house has disappeared!" }],
      q: { type: "mc", skill: "lvl", from: "me", to: "boksun", ask: "Ask when she last saw it.", opts: ["할머니, 언제 마지막으로 보셨어요?", "할머니, 언제 마지막으로 봤어?", "할머니, 언제 마지막으로 봤니?", "할머니, 언제 마지막으로 보으셨어요?"], en: "Grandmother, when did you last see it?", why: "She is 79: 해요체 with -(으)시-. 보- ends in a vowel, so 보셨어요 without 으." } },
    { place: "Gamgol substation",
      narr: "Her alibi for the container is detailed, and mostly about a television drama.",
      lines: [],
      q: { type: "fill", skill: "ms", from: "boksun", to: "me", ask: "Give the missing form of 보다.", ko: "어제 저녁에 드라마를 ___ 김치를 먹었어. 그때는 있었어.", accept: ["보면서"], hint: ["보다", "-으면서/-면서"], en: "Yesterday evening I ate kimchi while watching a drama. It was there then.", why: "보- ends in a vowel: 보면서." } },
    { place: "감골슈퍼, the village shop",
      narr: "The shop owner saw one person pass by last night. She offers four versions of what she saw. Grammar leaves one.",
      lines: [],
      q: { type: "mc", skill: "mss", from: "misuk", to: "me", ask: "Which line survives?", opts: ["덕배 할아버지가 노래를 부르면서 지나가셨어요.", "덕배 할아버지가 노래를 부르면서 저는 가게에 있었어요.", "덕배 할아버지가 지나가면서 저는 문을 닫았어요.", "제가 문을 닫으면서 할아버지는 노래를 불렀어요."], en: "Grandfather Deokbae went by, singing.", why: "-으면서/-면서 needs one subject doing both things. The other lines change subject halfway." } },
    { place: "The bench by the village hall",
      narr: "덕배 할아버지 was singing because he was happy, and he was happy because of his phone.",
      lines: [],
      q: { type: "fill", skill: "irr", from: "deokbae", to: "me", ask: "Give the missing form of 걷다.", ko: "나는 어제 저녁에 공원을 ___ 손녀하고 영상통화를 했어.", accept: ["걸으면서"], diag: [{ p: ["걷으면서", "걷면서", "걸면서"], msg: "걷다 is ㄷ irregular: ㄷ becomes ㄹ, and 으 stays." }], hint: ["걷다", "-으면서/-면서"], en: "Yesterday evening I video-called my granddaughter while walking in the park.", why: "걷다 is ㄷ irregular: 걸으면서." },
      after: { narr: "He carried nothing but a phone, which he held at arm's length throughout, like a man walking a small bright dog." } },
    { place: "Outside the guesthouse",
      narr: "The visitor from Seoul has heard about the container and sees an opportunity, because she sees one in everything.",
      lines: [],
      q: { type: "mc", skill: "lku", from: "seojin", to: "me", ask: "Which of these can she say?", opts: ["저는 이 마을에서 김치 만드는 영상을 찍을까 해요.", "할머니는 김치를 다시 만들까 해요.", "저는 어제 김치 만드는 영상을 찍을까 해요.", "저는 이 마을에서 김치 만드는 영상을 찍으을까 해요."], en: "I'm thinking of shooting a video of kimchi being made in this village.", why: "Her own plan, lying ahead. It cannot speak for the grandmother, cannot sit with 어제, and 찍- takes -을까." } },
    { place: "Outside the shop",
      narr: "하람 is where he always is. He has, as always, seen something.",
      lines: [],
      q: { type: "write", skill: "lvl", from: "me", to: "haram", ask: "Ask him: “What did you do yesterday evening?”", accept: ["(하람아, |)(|너 )어제 저녁에 뭐 (했어|했니)(?|)"], diag: [{ p: ["(하람아, |하람 씨, |)어제 저녁에 뭐 (했어요|하셨어요|했습니까)(?|)"], msg: "Right words, wrong speech level: he is sixteen, so 반말." }], hint: ["어제", "저녁", "뭐", "하다"], lenient: ["어제", "저녁"], en: "What did you do yesterday evening?", why: "반말 drops 요: 했어?" },
      after: { lines: [{ c: "haram", ko: "저는 게임을 하면서 과자를 먹었어요. 아, 이장님이 큰 통을 들고 가시는 걸 봤어요!", en: "I was eating snacks while playing a game. Oh, and I saw the village head carrying a big container!" }] } },
    { place: "Village hall",
      narr: "The village head has the container on his desk. He is not hiding it. He has put a flower in it.",
      lines: [{ c: "ijang", ko: "아, 그 통이요? 축제 때 김치를 만들까 해서 빌렸어요. 어제 할머니께 말씀드렸어요!", en: "Oh, that container? I was thinking of making kimchi for the festival, so I borrowed it. I told the grandmother yesterday!" }],
      q: { type: "write", skill: "lvl", from: "me", to: "chief", ask: "Phone it in: “The village head borrowed the kimchi container.”", accept: ["이장님(이|은|께서|께서는) 김치 통(을|) (빌리셨습니다|빌려 가셨습니다)"], soft: [{ p: ["이장님(이|은) 김치 통(을|) (빌렸습니다|빌려 갔습니다)"], note: "Accepted. About the village head, 빌리셨습니다 is the more natural report." }], diag: [{ p: ["이장님(이|은|께서|께서는) 김치 통(을|) (빌리셨어요|빌렸어요|빌려 가셨어요|빌려 갔어요)"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }], hint: ["이장님", "김치 통", "빌리다", "-(으)시-", "-습니다"], lenient: ["김치"], en: "The village head borrowed the kimchi container.", why: "To the chief: 합쇼체. About an elder: -(으)시-. Together: 빌리셨습니다." } },
    { place: "A gate near the bus stop",
      narr: "You tell her. She is quiet for a moment, which is rare enough that a passing dog stops to look.",
      lines: [{ c: "boksun", ko: "아… 어제 드라마를 보면서 들었어. 그래서 잘 못 들었어.", en: "Ah… I was listening while watching the drama yesterday. So I didn't really hear." }],
      q: { type: "write", skill: "lk", from: "me", to: "boksun", ask: "Tell her: “I'm thinking of bringing the container tomorrow.” (가지고 오다)", accept: ["(할머니, |)(|제가 |저는 )내일 (김치 |)통(을|) (가지고 올까|가져올까|가져다드릴까|가져다 드릴까|갖다드릴까|갖다 드릴까) 해요"], diag: [{ p: ["(할머니, |)(|내가 |나는 )내일 (김치 |)통(을|) (가지고 올까|가져올까) 해"], msg: "Right words, wrong speech level: she is 79, so 해요체." }, { p: ["(할머니, |)(|제가 |저는 )내일 (김치 |)통(을|) 가지고 오을까 해요"], msg: "Right words, wrong verb form: 오- ends in a vowel." }], hint: ["내일", "통", "가지고 오다", "-을까/-ㄹ까 하다"], lenient: ["내일"], en: "I'm thinking of bringing the container tomorrow.", why: "오- ends in a vowel: 올까 해요." },
      after: { narr: "She says there is no hurry. She says it twice, which means there is. The container comes home that afternoon, flower included. The file is closed. One person watched the drama to the end, and it was not you." } },
  ],
  clues: [
    { type: "odd", skill: "irr", ask: "Five forms from the statements. One is wrong. Which?", opts: ["발으면서", "걸으면서", "들으면서", "지으면서", "웃으면서"], en: "The right form is 받으면서.", why: "받다 is regular: 받으면서. 걸으면서 and 들으면서 (ㄷ irregular), 지으면서 (ㅅ irregular) and 웃으면서 (regular) are all correct." },
    { type: "tiles", skill: "ms", ask: "Build 하람's statement: “I ate snacks while playing a game.”", tiles: ["저는", "게임을", "하면서", "과자를", "먹었어요"], extra: ["하으면서", "게임이", "과자가"], orders: ["저는 게임을 하면서 과자를 먹었어요", "게임을 하면서 저는 과자를 먹었어요"], en: "I ate snacks while playing a game.", why: "하- takes plain -면서. The game and the snacks are both objects: 을/를." },
    { type: "match", skill: "voc", ask: "Match each word to its meaning.", pairs: [["봉사 활동", "volunteer work"], ["어학연수", "language course abroad"], ["자격증", "certificate"], ["운전면허", "driver's licence"], ["동호회", "hobby club"], ["대학원", "graduate school"]], why: "These are the nouns inside the chapter's set phrases: 자격증을 따다, 대학원에 진학하다, and so on." },
    { type: "write", skill: "lvl", from: "me", to: "chief", ask: "You told 도윤: “나 내일 쉴까 해.” Say the same thing to the chief.", accept: ["(|저는 |전 )내일 쉴까 합니다"], diag: [{ p: ["(|저는 |전 )내일 쉴까 해요"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }, { p: ["(나는 |난 |나 )내일 쉴까 (해|합니다)", "내일 쉴까 해"], msg: "Right words, but to the chief you are 저, with 합쇼체." }], hint: ["내일", "쉬다", "-을까/-ㄹ까 하다"], lenient: ["내일"], en: "I'm thinking of taking tomorrow off.", why: "쉴까 하다 in 합쇼체: 쉴까 합니다." },
    { type: "mc", skill: "lku", ask: "The village head said “김치를 만들까 해서 빌렸어요.” What was his position on the kimchi?", opts: ["He was thinking of making it, but nothing was fixed.", "He had already made it.", "Someone else was going to make it.", "He was making it while borrowing the container."], enOpts: true, en: "I was thinking of making kimchi, so I borrowed it.", why: "-을까/-ㄹ까 하다 is an intention still open. He borrowed the container on the strength of a maybe." },
  ],
};

/* ---------- Chapter 2, optional third file: chapters 1 and 2 together ---------- */
const CASE_2C = {
  id: "c2c", no: "02-C", title: "The Magpie Defence",
  blurb: "The key to the station bicycle has gone. Every human suspect has an alibi, and one of them cannot ride a bicycle at all.",
  kind: "Mixed · optional",
  souvenir: { id: "key", tag: "열쇠", name: "Bicycle key, lightly pecked", line: "Recovered from a nest, along with a guitar pick, an earring and the suspect's complete indifference." },
  scenes: [
    { place: "Gamgol substation · 11:50",
      narr: "The station bicycle is your patrol vehicle, your commute and, on a good day, your dignity. Its key is not on its hook.",
      lines: [{ c: "chief", ko: "김 순경, 파출소 자전거 열쇠가 없어졌습니다!", en: "Officer Kim, the key to the station bicycle has disappeared!" }],
      q: { type: "mc", skill: "gn", from: "me", to: "chief", ask: "Promise to look. Fill the gap with 먹다.", ko: "점심을 ___ 바로 찾아보겠습니다.", opts: ["먹고 나면", "먹으고 나면", "먹어고 나면", "먹고 나으면"], en: "Once I've had lunch, I'll look for it straight away.", why: "-고 나면 goes straight onto the stem, with no 으: 먹고 나면." } },
    { place: "Gamgol substation",
      narr: "선배 goes through the staff for suspects and rules one out at once. She gives four reasons. One of them is Korean.",
      lines: [],
      q: { type: "mc", skill: "jlu", from: "sunbae", to: "me", ask: "Which line is sound?", opts: ["도윤 씨는 자전거를 탈 줄 몰라요. 안 배웠어요.", "도윤 씨는 오늘 바빠서 자전거를 탈 줄 몰라요.", "도윤 씨는 비가 와서 자전거를 탈 줄 몰라요.", "도윤 씨는 열쇠가 없어서 자전거를 탈 줄 몰라요."], en: "Doyun doesn't know how to ride a bicycle. He never learned.", why: "-을/-ㄹ 줄 모르다 means never having learned. Being busy, rain or a missing key are circumstances: -을/-ㄹ 수 없다." } },
    { place: "Gamgol substation · the radio",
      narr: "도윤 confirms it, cheerfully, over the radio. He would like to help anyway.",
      lines: [{ c: "doyun", ko: "응, 나 자전거 탈 줄 몰라. 너는 어떻게 할 거야?", en: "Yeah, I don't know how to ride a bike. What are you going to do?" }],
      q: { type: "write", skill: "irr", from: "me", to: "doyun", ask: "Tell him: “I'm thinking of looking for the key while walking round the village.”", accept: ["(|나는 |난 |나 )마을(을|에서|) 걸으면서 열쇠(를|) (찾을까|찾아볼까) 해"], diag: [{ p: ["(|나는 |난 |나 )마을(을|에서|) (걷으면서|걷면서|걸면서) 열쇠(를|) (찾을까|찾아볼까) 해"], msg: "Right words, wrong verb form: 걷다 is ㄷ irregular." }, { p: ["(|저는 |전 )마을(을|에서|) 걸으면서 열쇠(를|) (찾을까|찾아볼까) (해요|합니다)"], msg: "Right words, wrong speech level: 도윤 is your 동기, so 반말." }], hint: ["마을", "걷다", "열쇠", "찾다", "-으면서/-면서", "-을까/-ㄹ까 하다"], lenient: ["열쇠"], en: "I'm thinking of looking for the key while walking round the village.", why: "걷다 is ㄷ irregular: 걸으면서. 찾- ends in a consonant: 찾을까 해." } },
    { place: "Outside the station",
      narr: "하람 arrives on foot, which for a boy with a bicycle is itself a statement.",
      lines: [{ c: "haram", ko: "저는 오늘 걸어서 왔어요. 그런데 아까 까치가 파출소 앞에서 뭔가를 가지고 갔어요.", en: "I walked here today. But a little while ago a magpie (까치) took something away from in front of the station." }],
      q: { type: "fill", skill: "jl", from: "haram", to: "me", ask: "He adds, for the record. Give the missing form of 타다.", ko: "저는 자전거를 ___ 줄 알아요. 하지만 그 열쇠는 안 가지고 갔어요!", accept: ["탈"], hint: ["타다", "-을/-ㄹ 줄 알다"], en: "I do know how to ride a bicycle. But I didn't take that key!", why: "타- ends in a vowel, so ㄹ goes underneath: 탈 줄 알아요." } },
    { place: "The bench by the village hall",
      narr: "If a bird in this village has habits, 복순 할머니 knows them, and has opinions on its character.",
      lines: [],
      q: { type: "mc", skill: "lvl", from: "me", to: "boksun", ask: "Ask whether she has seen the magpie.", opts: ["할머니, 그 까치를 보셨어요?", "할머니, 그 까치를 봤어?", "할머니, 그 까치를 보으셨어요?", "할머니, 그 까치를 봤니?"], en: "Grandmother, have you seen that magpie?", why: "She is 79: 해요체 with -(으)시-, and 보- takes it without 으: 보셨어요." },
      after: { lines: [{ c: "boksun", ko: "봤어. 그 까치는 매일 아침 내 의자 옆에서 놀아. 밥을 먹고 나면 꼭 작은 걸 가지고 가.", en: "I have. That magpie plays next to my bench every morning. Once it has eaten, it always takes some small thing away." }] } },
    { place: "The bench · your notebook",
      narr: "You write up the bird's routine. It is, you realise, the most reliable witness statement you have taken in this village.",
      lines: [],
      q: { type: "mc", skill: "gnu", ask: "Which line can go in the notebook?", opts: ["까치는 밥을 먹고 나면 작은 물건을 가지고 가요.", "어제 까치는 밥을 먹고 나면 열쇠를 가지고 갔어요.", "까치는 밥을 먹으고 나면 작은 물건을 가지고 가요.", "까치는 밥을 먹고 나면 어제 갔어요."], en: "Once the magpie has eaten, it takes small objects away.", why: "After -고 나면 comes what usually happens, not a finished past event, and 먹- takes -고 directly." } },
    { place: "Gamgol substation · the report",
      narr: "The chief wants the suspect list. You give him the fact that clears the last name on it.",
      lines: [{ c: "chief", ko: "그럼 까치가 자전거도 가지고 갔습니까?", en: "So did the magpie take the bicycle as well?" }],
      q: { type: "write", skill: "jl", from: "me", to: "chief", ask: "Report: “The magpie doesn't know how to ride a bicycle.”", accept: ["(아닙니다. |아니요, |)까치는 자전거(를|) 탈 줄 모릅니다"], diag: [{ p: ["(아니요, |)까치는 자전거(를|) 탈 줄 몰라요"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }, { p: ["(아니요, |)까치는 자전거(를|) 탈 줄 모르십니다"], msg: "Right words, but -(으)시- honours the magpie. It has not earned it." }], hint: ["까치", "자전거", "타다", "-을/-ㄹ 줄 모르다"], lenient: ["자전거"], en: "The magpie doesn't know how to ride a bicycle.", why: "탈 줄 모르다 in 합쇼체: 모릅니다." },
      after: { narr: "The nest is in the dead lamp by the bus stop. It holds the key, a guitar pick, one earring from the shop and four bottle caps. The magpie watches you from the bench with the calm of someone who has a lawyer." } },
    { place: "Gamgol substation",
      narr: "Key in hand, you make a plan so sensible that it surprises everyone, you included.",
      lines: [],
      q: { type: "write", skill: "gn", from: "me", to: "chief", ask: "Tell the chief: “Once I've found the key, I'm thinking of making one more.” (You have found it. Say it anyway; he likes a plan.)", accept: ["(|저는 |전 )열쇠(를|) 찾고 나면 하나 더 만들까 합니다"], diag: [{ p: ["(|저는 |전 )열쇠(를|) 찾고 나면 하나 더 만들까 해요"], msg: "Right words, wrong speech level: this is the chief, so 합쇼체." }, { p: ["(|저는 |전 )열쇠(를|) 찾고 나면 하나 더 만들을까 합니다"], msg: "Right words, wrong verb form: 만들- already ends in ㄹ." }, { p: ["(|저는 |전 )열쇠(를|) 찾으고 나면 하나 더 만들까 합니다"], msg: "Right words, wrong verb form: -고 나면 goes straight onto the stem." }], hint: ["열쇠", "찾다", "-고 나면", "하나 더", "만들다", "-을까/-ㄹ까 하다"], lenient: ["열쇠"], en: "Once I've found the key, I'm thinking of making one more.", why: "찾고 나면, and 만들- only adds -까: 만들까 합니다." },
      after: { narr: "The spare key is cut the next day and hung on the hook. By Thursday the magpie has that one too. You have a third made and keep it in your pocket, and consider yourself to have learned something about rural policing." } },
  ],
  clues: [
    { type: "odd", skill: "gn", ask: "Five forms of 듣다 and 걷다 from two chapters. One is wrong. Which?", opts: ["걸고 나면", "들으면서", "듣고 나면", "들을까 해요", "걸을 줄 알아요"], en: "The right form is 걷고 나면.", why: "ㄷ turns into ㄹ only before a vowel ending (들으면서, 들을까, 걸을 줄). Before -고 it stays: 걷고 나면, 듣고 나면." },
    { type: "match", skill: "irr", ask: "Match each verb and ending to its form.", pairs: [["듣다 + -고 나면", "듣고 나면"], ["듣다 + -으면서", "들으면서"], ["만들다 + -ㄹ까 하다", "만들까 해요"], ["만들다 + -고 나면", "만들고 나면"], ["돕다 + -ㄹ 줄 알다", "도울 줄 알아요"], ["돕다 + -고 나면", "돕고 나면"]], why: "Irregular stems change before vowel endings and stay whole before -고." },
    { type: "tiles", skill: "gn", ask: "Build the sentence: “Once the magpie has eaten, it plays next to the bench.”", tiles: ["까치는", "밥을", "먹고", "나면", "의자", "옆에서", "놀아요"], extra: ["먹으고", "옆에", "밥이"], orders: ["까치는 밥을 먹고 나면 의자 옆에서 놀아요", "밥을 먹고 나면 까치는 의자 옆에서 놀아요"], en: "Once the magpie has eaten, it plays next to the bench.", why: "먹- takes -고 directly, and an action happens 에서 a place." },
    { type: "write", skill: "lvl", from: "me", to: "sunbae", ask: "You told 도윤: “나 자전거 탈 줄 알아.” Say the same thing to 선배.", accept: ["(|저는 |전 |저 )자전거(를|) 탈 줄 알아요"], soft: [{ p: ["(|저는 |전 )자전거(를|) 탈 줄 압니다"], note: "Accepted. 합쇼체 is more formal than she needs, but never wrong upwards." }], diag: [{ p: ["(|나는 |난 |나 )자전거(를|) 탈 줄 알아"], msg: "Right words, wrong speech level: she is your senior, so 해요체." }], hint: ["자전거", "타다", "-을/-ㄹ 줄 알다"], lenient: ["자전거"], en: "I know how to ride a bicycle.", why: "해요체: 알아요." },
    { type: "mc", skill: "lku", ask: "Four notes on the case. Only one is sound. Which?", opts: ["저는 열쇠를 하나 더 만들까 해요.", "까치는 내일도 열쇠를 가지고 갈까 해요.", "저는 어제 열쇠를 하나 더 만들까 해요.", "저는 열쇠를 하나 더 만들을까 해요."], en: "I'm thinking of making one more key.", why: "-을까/-ㄹ까 하다 is the speaker's own plan, lying ahead. It cannot speak for the magpie, and 만들- only adds -까." },
  ],
};

CONTENT.chapters[0].cases.push(CASE_1C);
CONTENT.chapters[1].cases.push(CASE_2C);
