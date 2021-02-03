using System;
using System.Collections.Generic;

namespace AS2020Api.Model
{
    public class GameActionBatch
    {
        public Guid Id { get; }
        public IReadOnlyCollection<PlayEvent> Actions { get; }
        public int Score { get; }
        public int ScoreRate { get; }

        public GameActionBatch(IReadOnlyCollection<PlayEvent> actions, Guid id, int score, int scoreRate)
        {
            Id = id;
            Actions = actions;
            Score = score;
            ScoreRate = scoreRate;
        }
    }
}
