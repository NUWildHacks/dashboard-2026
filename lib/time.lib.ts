import { MONTH_ABBREVIATIONS, ONE_DAY, ONE_HOUR, ONE_MINUTE } from "@/constants/time.constants";

export function getDateFromMilliseconds(milliseconds: number) {
  const date = new Date(milliseconds);

  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export const getTimeFromMinutes = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? " PM" : " AM"}`;
};

export function getSendTime(sendMilliseconds: number) {
  const now = new Date();

  const diffMilliseconds = now.getTime() - sendMilliseconds;

  if (diffMilliseconds < ONE_MINUTE) {
    return "Less than a minute ago";
  } else if (diffMilliseconds < ONE_HOUR) {
    const minutes = Math.floor(diffMilliseconds / ONE_MINUTE);
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (diffMilliseconds < ONE_DAY) {
    const hours = Math.floor(diffMilliseconds / ONE_HOUR);
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else {
    return getDateFromMilliseconds(sendMilliseconds);
  }
}
