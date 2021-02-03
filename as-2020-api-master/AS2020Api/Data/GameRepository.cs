using AS2020Api.Model;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AS2020Api.Data
{
    public class GameRepository
    {
        private readonly IDictionary<Guid, Game> _games = new Dictionary<Guid, Game>();
        private readonly PlayEventValidator _playEventValidator;
        private readonly ILogger<GameRepository> _logger;

        public GameRepository(PlayEventValidator playEventValidator, ILogger<GameRepository> logger)
        {
            _playEventValidator = playEventValidator;
            _logger = logger;
            RegisterGame(Game.Test);
        }

        public void RegisterGame(Game game)
        {
            _games[game.Id] = game;
        }

        public Game GetGame(Guid id)
        {
            if (_games.ContainsKey(id))
            {
                return _games[id];
            } else
            {
                throw AirainSimException.UnableToFindGame(id);
            }
        }

        public ActResult ApplyAndValidateActions(GameActionBatch gameActionBatch, DateTimeOffset timeReceived)
        {
            var game = GetGame(gameActionBatch.Id);
            var (valid, newGameStatus) = _playEventValidator.ValidateAndCalculateNext(game, gameActionBatch, timeReceived);

            if (valid)
            {
                var updatedGame = game.Update(newGameStatus, gameActionBatch.Actions, timeReceived);
                _games[gameActionBatch.Id] = updatedGame;
                _logger.LogInformation("Received valid update for game {0}", gameActionBatch.Id);
            } else
            {
                _logger.LogInformation("Received invalid update for game {0}", gameActionBatch.Id);
            }

            return new ActResult(valid);
        }

        public IReadOnlyCollection<LeaderboardEntry> GetLeaderBoard()
        {
            return _games.Values
                .Where(g => g != Game.Test)
                .Select(g => new LeaderboardEntry(g.Status.PlayerName, g.Status.Score))
                .OrderByDescending(g => g.Score)
                .ToArray();
        }
    }
}