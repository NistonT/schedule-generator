import { Clock, CloudSun, Coffee, Moon, Sprout, Sun, Wine } from "lucide-react";

// Отображаем дни так, чтобы воскресенье было в конце
export const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Соответствующие иконки для каждого дня
export const dayIcons = [Moon, CloudSun, Coffee, Wine, Clock, Sprout, Sun];

// Реальные номера дней недели по dayjs
export const realDayIndex = [1, 2, 3, 4, 5, 6, 0];
