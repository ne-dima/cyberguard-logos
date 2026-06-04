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
    "Три насыщенных дня: от кибергигиены и криптографии до хакатона с питч-сессией перед экспертами Positive Technologies и BI.ZONE. Теория, игры и командные проекты — в колледже «ЛОГОС».",
  highlights: [
    { label: "3 дня", detail: "программы" },
    { label: "Хакатон", detail: "с питч-сессией" },
    { label: "Партнёры", detail: "индустрии ИБ" },
  ],
} as const;

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    id: "day-1",
    number: 1,
    title: "Введение в цифровой мир",
    tagline: "Угрозы, шифрование и старт хакатона",
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
      },
      {
        id: "d1-quest",
        title: "Квест «Агенты кибербезопасности»",
        description:
          "Командная игра-расследование на платформе BI.ZONE Cyber Polygon: найти источник утечки данных в вымышленной компании.",
        kind: "quest",
        partner: "BI.ZONE",
      },
      {
        id: "d1-hackathon",
        title: "Старт хакатона",
        description:
          "Разбор кейсов, формирование команд и выдача заданий от Positive Technologies и BI.ZONE на следующие дни.",
        kind: "hackathon",
        partner: "Positive Technologies · BI.ZONE",
      },
    ],
  },
  {
    id: "day-2",
    number: 2,
    title: "Атака и защита",
    tagline: "Промбез, когнитивная безопасность и работа в командах",
    activities: [
      {
        id: "d2-ot",
        title: "Мастер-класс по промышленной безопасности",
        description:
          "Деловая игра «Охотники за рисками»: школьники — инспекторы по охране труда на виртуальном заводе и ищут нарушения.",
        kind: "game",
      },
      {
        id: "d2-cognitive-hack",
        title: "Хакатон: когнитивная безопасность",
        description:
          "Команды создают постер или чек-лист «Как распознать информационную атаку». Метод SCARF (Status, Certainty, Autonomy, Relatedness, Fairness) и сценарии противодействия манипуляциям.",
        kind: "hackathon",
      },
      {
        id: "d2-cognitive-lecture",
        title: "«Когнитивная безопасность: как нас взламывают через мозг»",
        description: "Лекция-дискуссия о том, как технологии влияют на мышление и принятие решений.",
        kind: "lecture",
      },
      {
        id: "d2-mentors",
        title: "Работа над проектами с наставниками",
        description: "Студенты профильных вузов помогают командам двигаться по задачам хакатона.",
        kind: "workshop",
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
    title: "Финал и создание решений",
    tagline: "Питч, карьера в ИБ и торжественное закрытие",
    activities: [
      {
        id: "d3-hackathon",
        title: "Финал хакатона",
        description: "Доработка проектов и подготовка выступлений: постеры, чек-листы, презентации.",
        kind: "hackathon",
      },
      {
        id: "d3-pitch",
        title: "Питч-сессия хакатона",
        description:
          "3–4 часа презентаций проектов. В жюри — представители Positive Technologies, BI.ZONE и приглашённые эксперты.",
        kind: "pitch",
        partner: "Positive Technologies · BI.ZONE",
      },
      {
        id: "d3-career",
        title: "«Как стать белым хакером и защищать мир»",
        description: "Карьерные перспективы в ИБ, советы по обучению и ответы на вопросы участников.",
        kind: "lecture",
      },
      {
        id: "d3-closing",
        title: "Торжественное закрытие",
        description:
          "Награждение победителей, вручение дипломов и призов, приглашения на профориентационные мероприятия.",
        kind: "closing",
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
