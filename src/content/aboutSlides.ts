export interface AboutSlide {
  src: string;
  alt: string;
}

/** Увеличьте при замене файлов с тем же именем — сбрасывает кеш браузера. */
export const ABOUT_IMAGES_VERSION = "20250611";

/** Добавляйте файлы в public/images/about/ и указывайте пути здесь */
export const ABOUT_SLIDES: AboutSlide[] = [
  {
    src: `/images/about/photo-1.jpg?v=${ABOUT_IMAGES_VERSION}`,
    alt: "Колледж «ЛОГОС»",
  },
  {
    src: `/images/about/photo-2.jpg?v=${ABOUT_IMAGES_VERSION}`,
    alt: "Студенты на занятиях",
  },
  {
    src: `/images/about/photo-3.jpg?v=${ABOUT_IMAGES_VERSION}`,
    alt: "Учебный процесс в колледже",
  },
  {
    src: `/images/about/photo-4.jpg?v=${ABOUT_IMAGES_VERSION}`,
    alt: "Занятия в колледже",
  },
  {
    src: `/images/about/photo-5.jpg?v=${ABOUT_IMAGES_VERSION}`,
    alt: "Колледж «ЛОГОС»",
  },
];

export const ABOUT_SLIDE_INTERVAL_MS = 6000;
