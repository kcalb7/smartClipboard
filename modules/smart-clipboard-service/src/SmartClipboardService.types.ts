export type ChangePayload = {
  text: string;
};

export type SmartClipboardServiceEvents = {
  onClipChange: (payload: ChangePayload) => void;
};
