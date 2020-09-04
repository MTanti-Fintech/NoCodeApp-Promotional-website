export interface MainData {
  questionsData: QuestionsData[];
}

export interface QuestionsData {
  question: Question;
  answer: Answer[];
}

export interface Answer {
  answer: Question;
  subanswers: Subanswers[];
}

export interface Subanswers {
  index: string;
  value: string;
  subanswers: Question[];
}

export interface Question {
  index: string;
  value: string;
}
