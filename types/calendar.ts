import Event from "./events";

export type CalendarRowInterval = {
  start: number;
  end: number;
  label: string;
};

export type CalendarItemLayout = {
  event: Event;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
};
