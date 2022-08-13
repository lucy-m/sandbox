export interface GameActionBatch {
  id: string;
  actions: Array<{ type: string }>;
  score: number;
  scoreRate: number;
}
