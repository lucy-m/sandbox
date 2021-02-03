using System;

namespace AS2020Api.Model
{
    public class EventStatusScoreCalculator
    {
        private readonly GameParameters _parameters;

        public EventStatusScoreCalculator(GameParameters parameters)
        {
            _parameters = parameters;
        }

        public int CalculateScoreForEvent(PlayEvent playEvent, GameStatus status)
        {
            var properties = PlayEventProperties.GetByType(playEvent.Type);
            var baseCost = properties.BaseEventScore;
            var stepCount = properties.StepCount(status);
            var stepRatio = 1 + ((float)_parameters.ItemStepRate / 100);
            var stepTotalCost = (int) Math.Ceiling(Math.Pow(stepRatio, stepCount) * baseCost);

            return stepTotalCost;
        }
        
        public int CalculateScoreForTick(PlayEvent playEvent, GameStatus status)
        {
            var properties = PlayEventProperties.GetByType(playEvent.Type);
            return properties.BaseTickScore;
        }
    }
}
