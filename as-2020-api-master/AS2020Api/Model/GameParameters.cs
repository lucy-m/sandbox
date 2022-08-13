using System.Collections.Generic;
using System.Linq;

namespace AS2020Api.Model
{
    public class GameParameters
    {
        public readonly int BatchSize = 5;
        public readonly int BaseScriptRate = 1;
        public readonly int ItemStepRate = 10;
        public readonly int CoffeeDrinkDuration = 4;
        public readonly int EnergizedDuration = 10;
        public readonly int WatchTvDuration = 6;
        public readonly int EntertainedDuration = 30;

        public readonly IDictionary<PlayEventType, int> BaseScoreRates =
            PlayEventProperties.GetAll().ToDictionary(p => p.Type, p => p.BaseEventScore);

        public readonly IDictionary<PlayEventType, int> BaseScorePerTick =
            PlayEventProperties.GetAll().ToDictionary(p => p.Type, p => p.BaseTickScore);
    }
}
