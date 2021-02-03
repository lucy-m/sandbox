using AS2020Api.Model;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AS2020Api.Data
{
    public class PlayEventValidator
    {
        private readonly ILogger<PlayEventValidator> _logger;
        private readonly EventStatusScoreCalculator _eventStatusScoreCalculator;

        public PlayEventValidator(EventStatusScoreCalculator eventStatusScoreCalculator, ILogger<PlayEventValidator> logger)
        {
            _eventStatusScoreCalculator = eventStatusScoreCalculator;
            _logger = logger;
        }

        public (bool Valid, GameStatus Next) ValidateAndCalculateNext(Game game, GameActionBatch batch, DateTimeOffset receivedAt)
        {
            var result = batch.Actions.Aggregate(
                (Valid: true, GameStatus: game.Status),
                (current, playEvent) =>
                {
                    var playEventIsValid = current.Valid && Validate(current.GameStatus, playEvent);
                    var nextState = CalculateNext(current.GameStatus, playEvent);
                    return (playEventIsValid, nextState);
                });

            var tickCount = batch.Actions.Count(t => t.Type == PlayEventType.Tick);
            var expectedMaxTickCount = (int) Math.Ceiling(receivedAt.Subtract(game.LastUpdated).TotalSeconds) + 2;

            var tooManyTicks = tickCount > expectedMaxTickCount;
            var overallScoreMatches = result.GameStatus.Score == batch.Score;
            var overallScoreRateMatches = result.GameStatus.ScoreRate == batch.ScoreRate;
            var actionsPerTickValid = CheckActionsPerTick(batch);

            if (!overallScoreMatches)
            {
                _logger.LogInformation("Overall game scores do not match, game {0} batch {1}", overallScoreMatches, result.GameStatus.Score);
            }

            if(tooManyTicks)
            {
                _logger.LogInformation("Too many ticks in batch, expected max {0} but got {1} ticks", expectedMaxTickCount, tickCount);
            }

            var valid = new[]
            {
                result.Valid,
                overallScoreMatches,
                overallScoreRateMatches,
                !tooManyTicks,
                actionsPerTickValid
            }.All(v => v);

            if(!valid)
            {
                Console.WriteLine("Invalid");
            }

            return (valid, result.GameStatus);
        }

        private bool CheckActionsPerTick(GameActionBatch batch)
        {
            var actionsSplitByTick = batch.Actions.Aggregate<
                PlayEvent, 
                (IEnumerable<IEnumerable<PlayEvent>> Batches, IEnumerable<PlayEvent> Current),
                IReadOnlyCollection<IReadOnlyCollection<PlayEvent>>>(
                (Batches: new List<List<PlayEvent>>(), Current: new List<PlayEvent>()),
                (acc, nextEvent) =>
                {
                    if (nextEvent.Type == PlayEventType.Tick)
                    {
                        var newBatches = acc.Batches.Append(acc.Current);
                        var newCurrent = new List<PlayEvent>() { nextEvent };

                        return (Batches: newBatches, Current: newCurrent);
                    } else
                    {
                        var newBatches = acc.Batches;
                        var newCurrent = acc.Current.Append(nextEvent);

                        return (Batches: newBatches, Current: newCurrent); 
                    }
                }, acc => acc.Batches.Select(b => b.ToArray()).ToArray());

            var actionBatchValidity = actionsSplitByTick
                .Select(actions => CheckActionsInTick(actions));

            var allValid = actionBatchValidity.All(valid => valid);

            return allValid;
        }

        private bool CheckActionsInTick(IReadOnlyCollection<PlayEvent> events)
        {
            var cookieClicks = events
                .Where(e => e.Type == PlayEventType.CookieClicked)
                .ToArray();

            var otherEventTypes = events
                .Select(e => e.Type)
                .Distinct()
                .Where(t => t != PlayEventType.CookieClicked && !PlayEventProperties.GetByType(t).Automatic)
                .ToArray();

            var clickedCookieAndOtherEvent = cookieClicks.Any() && otherEventTypes.Any();
            var tooManyCookieClicks = cookieClicks.Length >= 10;

            var valid = !clickedCookieAndOtherEvent && !tooManyCookieClicks;

            return valid;
        }

        private bool Validate(GameStatus gameStatus, PlayEvent playEvent)
        {
            var properties = PlayEventProperties.GetByType(playEvent.Type);
            var eventType = playEvent.Type;
            var canBuy = gameStatus.Score + _eventStatusScoreCalculator.CalculateScoreForEvent(playEvent, gameStatus) >= 0;
            var additionalValidation = properties.AdditionalValidation(gameStatus);

            var isValid = canBuy && additionalValidation;

            if(!isValid)
            {
                _logger.LogInformation("Play event is invalid for current game status", gameStatus, playEvent);
            }

            return canBuy && additionalValidation;
        }

        private GameStatus CalculateNext(GameStatus gameStatus, PlayEvent playEvent)
        {
            var properties = PlayEventProperties.GetByType(playEvent.Type);
            var eventType = playEvent.Type;

            var additionalScore = gameStatus.PlayerStatus.GetAdditionalPlayEventScore(playEvent, gameStatus);

            var newStatus = gameStatus
                .WithScore(gameStatus.Score + _eventStatusScoreCalculator.CalculateScoreForEvent(playEvent, gameStatus) + additionalScore)
                .WithScorePerSecond(gameStatus.ScoreRate + _eventStatusScoreCalculator.CalculateScoreForTick(playEvent, gameStatus));

            var withAdditionalEffects = properties.AdditionalEffects(newStatus);

            return withAdditionalEffects;
        }
    }
}
