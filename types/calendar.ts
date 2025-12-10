import Event from "./events";

export type TimeBlock = {
  start: number;
  label: string;
};

export type CalendarItemLayout = {
  event: Event;
  left: number;
  top: number;
  width: number;
  height: number;
};
