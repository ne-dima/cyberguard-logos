export type ProgramActivityKind =
  | "lecture"
  | "quest"
  | "hackathon"
  | "game"
  | "workshop"
  | "pitch"
  | "closing"
  | "optional"
  | "quiz";

export interface ProgramActivity {
  id: string;
  title: string;
  description: string;
  kind: ProgramActivityKind;
  partner?: string;
  optional?: boolean;
}

export interface ProgramDay {
  id: string;
  number: number;
  title: string;
  tagline: string;
  company: string;
  activities: ProgramActivity[];
}

export interface ProgramExtraGroup {
  id: string;
  title: string;
  subtitle?: string;
  activities: ProgramActivity[];
}

export const PROGRAM_INTRO = {
  title: "Что будет на КиберСтраже",
  lead:
    "Три насыщенных дня в колледже «ЛОГОС» — каждый посвящён одному из партнёров. Лекции, практика, игры и командный хакатон с финальной питч-сессией перед экспертами индустрии.",
  companyDays: [
    {
      day: 1,
      title: "День компании Positive Technologies",
      theme: "Введение в цифровой мир",
      description: "Кибергигиена, криптография и старт хакатона",
    },
    {
      day: 2,
      title: "День компании Яндекс",
      theme: "Атака и защита",
      description: "Промбез, когнитивная безопасность и работа в командах",
    },
    {
      day: 3,
      title: "День компании InfoWatch",
      theme: "Финал и создание решений",
      description: "Питч-сессия, карьера в ИБ и торжественное закрытие",
    },
  ],
  highlights: [
    { label: "День 1", detail: "Positive Technologies" },
    { label: "День 2", detail: "Яндекс" },
    { label: "День 3", detail: "InfoWatch" },
  ],
} as const;

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    id: "day-1",
    number: 1,
    title: "День компании Positive Technologies",
    tagline: "Угрозы, шифрование и старт хакатона",
    company: "Positive Technologies",
    activities: [
      {
        id: "d1-opening",
        title: "Открытие и «Кибергигиена для цифрового поколения»",
        description:
          "Лекция от Positive Technologies: реальные угрозы — фишинг, социальная инженерия, DDoS — на простых примерах. Главный акцент на «человеческий фактор» в безопасности.",
        kind: "lecture",
        partner: "Positive Technologies",
      },
      {
        id: "d1-crypto",
        title: "«Криптография: тайный язык компьютеров»",
        description:
          "История шифрования от шифра Цезаря до современных алгоритмов и живая практическая демонстрация.",
        kind: "lecture",
        partner: "Positive Technologies",
      },
      {
        id: "d1-quest",
        title: "Квест «Агенты кибербезопасности»",
        description:
          "Командная игра-расследование: найти источник утечки данных в вымышленной компании.",
        kind: "quest",
        partner: "Positive Technologies",
      },
      {
        id: "d1-hackathon",
        title: "Старт хакатона",
        description:
          "Разбор кейсов, формирование команд и выдача заданий от Positive Technologies на следующие дни.",
        kind: "hackathon",
        partner: "Positive Technologies",
      },
    ],
  },
  {
    id: "day-2",
    number: 2,
    title: "День компании Яндекс",
    tagline: "Промбез, когнитивная безопасность и работа в командах",
    company: "Яндекс",
    activities: [
      {
        id: "d2-ot",
        title: "Мастер-класс по промышленной безопасности",
        description:
          "Деловая игра «Охотники за рисками»: школьники — инспекторы по охране труда на виртуальном заводе и ищут нарушения.",
        kind: "game",
        partner: "Яндекс",
      },
      {
        id: "d2-cognitive-hack",
        title: "Хакатон: когнитивная безопасность",
        description:
          "Команды создают постер или чек-лист «Как распознать информационную атаку». Метод SCARF (Status, Certainty, Autonomy, Relatedness, Fairness) и сценарии противодействия манипуляциям.",
        kind: "hackathon",
        partner: "Яндекс",
      },
      {
        id: "d2-cognitive-lecture",
        title: "«Когнитивная безопасность: как нас взламывают через мозг»",
        description: "Лекция-дискуссия о том, как технологии влияют на мышление и принятие решений.",
        kind: "lecture",
        partner: "Яндекс",
      },
      {
        id: "d2-mentors",
        title: "Работа над проектами с наставниками",
        description: "Студенты профильных вузов помогают командам двигаться по задачам хакатона.",
        kind: "workshop",
        partner: "Яндекс",
      },
      {
        id: "d2-cybersport",
        title: "Киберспортивный вечер",
        description:
          "Соревнования по дисциплинам, развивающим тактическое мышление (по расписанию дня).",
        kind: "optional",
        optional: true,
      },
    ],
  },
  {
    id: "day-3",
    number: 3,
    title: "День компании InfoWatch",
    tagline: "Питч, карьера в ИБ и торжественное закрытие",
    company: "InfoWatch",
    activities: [
      {
        id: "d3-hackathon",
        title: "Финал хакатона",
        description: "Доработка проектов и подготовка выступлений: постеры, чек-листы, презентации.",
        kind: "hackathon",
        partner: "InfoWatch",
      },
      {
        id: "d3-pitch",
        title: "Питч-сессия хакатона",
        description:
          "3–4 часа презентаций проектов. В жюри — представители Positive Technologies, Яндекс, InfoWatch и приглашённые эксперты.",
        kind: "pitch",
        partner: "Positive Technologies · Яндекс · InfoWatch",
      },
      {
        id: "d3-career",
        title: "«Как стать белым хакером и защищать мир»",
        description: "Карьерные перспективы в ИБ, советы по обучению и ответы на вопросы участников.",
        kind: "lecture",
        partner: "InfoWatch",
      },
      {
        id: "d3-closing",
        title: "Торжественное закрытие",
        description:
          "Награждение победителей, вручение дипломов и призов, приглашения на профориентационные мероприятия.",
        kind: "closing",
        partner: "InfoWatch",
      },
    ],
  },
];

export const PROGRAM_EXTRAS: ProgramExtraGroup[] = [
  {
    id: "prom-safety",
    title: "Мастер-класс: промбезопасность",
    subtitle: "Интерактив вне основных дней",
    activities: [
      {
        id: "ex-alphabet",
        title: "«Азбука безопасности»",
        description:
          "Интерактивный квиз: знаки безопасности и правила поведения на производстве.",
        kind: "quiz",
      },
      {
        id: "ex-backpack",
        title: "«Что в моём рюкзаке?»",
        description:
          "Викторина в формате шоу: угадать назначение средств индивидуальной защиты.",
        kind: "quiz",
      },
    ],
  },
  {
    id: "quests",
    title: "Квесты и станции",
    subtitle: "Со студентами-волонтёрами",
    activities: [
      {
        id: "ex-key",
        title: "«Ключ к кибербезопасности»",
        description:
          "Квест для школьников: отличить фишинг от настоящего письма и создать надёжный пароль.",
        kind: "quest",
      },
      {
        id: "ex-oko",
        title: "«КиберОко»",
        description:
          "Станционная игра: «Опасные сообщения», «Фотографии в интернете», «Онлайн-друг», «Хороший и плохой пароль».",
        kind: "quest",
      },
    ],
  },
];

export const PROGRAM_ACTIVITY_KIND_LABELS: Record<ProgramActivityKind, string> = {
  lecture: "Лекция",
  quest: "Квест",
  hackathon: "Хакатон",
  game: "Игра",
  workshop: "Практика",
  pitch: "Питч",
  closing: "Финал",
  optional: "Опционально",
  quiz: "Квиз",
};
