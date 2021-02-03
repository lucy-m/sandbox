using System;
using System.Collections.Generic;
using System.Linq;

namespace AS2020Api.Model
{
    public class PlayEventProperties
    {
        public PlayEventType Type { get; }
        public int BaseEventScore { get; }
        public int BaseTickScore { get; }
        public Func<GameStatus, bool> AdditionalValidation { get; }
        public Func<GameStatus, GameStatus> AdditionalEffects { get; }
        public Func<GameStatus, int> StepCount { get; }
        public bool Automatic { get; }
        
        private static readonly List<PlayEventProperties> All = new List<PlayEventProperties>();
        private static readonly IDictionary<PlayEventType, PlayEventProperties> ByType = new Dictionary<PlayEventType, PlayEventProperties>();

        private PlayEventProperties(
            PlayEventType type,
            bool automatic,
            int baseEventScore,
            int baseTickScore,
            Func<GameStatus, bool> additionalValidation,
            Func<GameStatus, GameStatus> additionalEffects,
            Func<GameStatus, int> stepCount) {

            Type = type;
            Automatic = automatic;
            BaseEventScore = baseEventScore;
            BaseTickScore = baseTickScore;
            AdditionalValidation = additionalValidation;
            AdditionalEffects = additionalEffects;
            StepCount = stepCount;

            All.Add(this);
            ByType[type] = this;
        }

        public static readonly PlayEventProperties Tick = new PlayEventProperties(
            PlayEventType.Tick, true, 0, 0, _ => true, status => status.IncreaseScoreByTick(), _ => 0
        );
        public static readonly PlayEventProperties CookieClicked = new PlayEventProperties(
            PlayEventType.CookieClicked, false, 5, 0, _ => true, status => status, _ => 0
        );
        public static readonly PlayEventProperties ScriptWritten = new PlayEventProperties(
            PlayEventType.ScriptWritten, false, -75, 0, status => !status.ScriptWritten, status => status.WithScriptWritten(), _ => 0
        );
        public static readonly PlayEventProperties ScriptDeployed = new PlayEventProperties(
            PlayEventType.ScriptDeployed, false, -50, 1, status => status.ScriptWritten, status => status.IncrementScriptDeploy(), 
            status => status.ScriptDeployedCount
        );
        public static readonly PlayEventProperties KubernetesResearched = new PlayEventProperties(
            PlayEventType.KubernetesResearched, false, -500, 0, status => !status.KubernetesResearched, 
            status => status.WithKubernetesResearched(), _ => 0
        );
        public static readonly PlayEventProperties KubernetesDeploy = new PlayEventProperties(
            PlayEventType.KubernetesDeploy, false, -20, 1, status => status.KubernetesResearched, status => status.IncrementKubernetesDeploy(), 
            status => status.KubernetesDeployCount
        );
        public static readonly PlayEventProperties CcgCreated = new PlayEventProperties(
            PlayEventType.CcgCreated, false, -2500, 0, status => !status.CcgCreated, status => status.WithCcgCreated(), _ => 0
        );
        public static readonly PlayEventProperties CcgDeploy = new PlayEventProperties(
            PlayEventType.CcgDeploy, false, -100, 10, status => status.CcgCreated, status => status.IncrementColoDeploy(), 
            status => status.CcgDeployCount
        );
        public static readonly PlayEventProperties DrinkCoffee = new PlayEventProperties(
            PlayEventType.DrinkCoffee, false, 0, 0, _ => true, status => status.WithPlayerStatus(ps => ps.Energize()), _ => 0
        );
        public static readonly PlayEventProperties DeEnergize = new PlayEventProperties(
            PlayEventType.DeEnergize, true, 0, 0, _ => true, status => status.WithPlayerStatus(ps => ps.DeEnergize()), _ => 0
        );
        public static readonly PlayEventProperties WatchTv = new PlayEventProperties(
            PlayEventType.WatchTv, false, 0, 0, _ => true, status => status.WithPlayerStatus(ps => ps.Entertain()), _ => 0
        );
        public static readonly PlayEventProperties UnEntertain = new PlayEventProperties(
            PlayEventType.Unentertained, true, 0, 0, _ => true, status => status.WithPlayerStatus(ps => ps.Unentertain()), _ => 0
        );

        public static IReadOnlyCollection<PlayEventProperties> GetAll()
        {
            return All;
        }

        public static PlayEventProperties GetByType(PlayEventType type)
        {
            if (!ByType.ContainsKey(type))
            {
                throw AirainSimException.NoPropertiesForEventType(type);
            }

            return ByType[type];
        }
    }
}
