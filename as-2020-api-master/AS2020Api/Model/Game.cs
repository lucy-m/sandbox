using System;
using System.Collections.Generic;
using System.Linq;

namespace AS2020Api.Model
{
    public class Game
    {
        public Guid Id => Status.Id;
        public GameStatus Status { get; }
        public DateTimeOffset LastUpdated { get; }
        public IReadOnlyCollection<PlayEvent> History { get; }

        public static Game Test { get; } = new Game(GameStatus.Test, new PlayEvent[0], DateTimeOffset.UtcNow);

        public Game(string playerName, Character character) : this(new GameStatus(playerName, character), new List<PlayEvent>(), DateTimeOffset.UtcNow)
        {
        }

        private Game(GameStatus status, IReadOnlyCollection<PlayEvent> history, DateTimeOffset lastUpdated)
        {
            Status = status;
            History = history;
            LastUpdated = DateTimeOffset.Now;
        }

        public Game Update(GameStatus newStatus, IReadOnlyCollection<PlayEvent> newActions, DateTimeOffset updatedAt)
        {
            var newHistory = History.Concat(newActions).ToList();

            return new Game(newStatus, newHistory, updatedAt);
        }
    }
}
