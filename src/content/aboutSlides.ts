export interface AboutSlide {
  src: string;
  alt: string;
}

/** Добавляйте файлы в public/images/about/ и указывайте пути здесь */
export const ABOUT_SLIDES: AboutSlide[] = [
  {
    src: "/images/about/photo-1.jpg",
    alt: "Колледж «ЛОГОС»",
  },
  {
    src: "/images/about/photo-2.jpg",
    alt: "Студенты на занятиях",
  },
  {
    src: "/images/about/photo-3.jpg",
    alt: "Учебный процесс в колледже",
  },
  {
    src: "/images/about/photo-4.jpg",
    alt: "Занятия в колледже",
  },
  {
    src: "/images/about/photo-5.jpg",
    alt: "Колледж «ЛОГОС»",
  },
];

export const ABOUT_SLIDE_INTERVAL_MS = 6000;
