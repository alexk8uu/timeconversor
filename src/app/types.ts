// app/types.ts
export interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode: boolean;
  label: string;
}
