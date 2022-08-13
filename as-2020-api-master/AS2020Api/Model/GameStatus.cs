using System;

namespace AS2020Api.Model
{
    public class GameStatus
    {
        public Guid Id { get; }
        public string PlayerName { get; }
        public Character Character { get; }
        public int Score { get; }
        public int ScoreRate { get; }
        public bool ScriptWritten { get; }
        public int ScriptDeployedCount { get; }
        public bool KubernetesResearched { get; }
        public int KubernetesDeployCount { get; }
        public bool CcgCreated { get; }
        public int CcgDeployCount { get; }
        public PlayerStatus PlayerStatus { get; }

        public static GameStatus Test { get; } = new GameStatus("Lucy", new Character("Irving"), 
            Guid.Empty, 0, 0, false, 0, false, 0, false, 0, PlayerStatus.New());

        public GameStatus(string playerName, Character character) 
            : this(playerName, character, Guid.NewGuid(), 0, 0, false, 0, false, 0, false, 0, PlayerStatus.New())
        {
        }

        private GameStatus(string playerName, Character character, Guid id, int score, int scoreRate, bool scriptWritten, 
            int scriptDeployedCount, bool kubernetesResearched, int kubernetesDeployCount, bool coloConfigGeneratorCreated,
            int coloDeployCount, PlayerStatus playerStatus)
        {
            PlayerName = playerName;
            Character = character;
            Id = id;
            Score = score;
            ScoreRate = scoreRate;
            ScriptWritten = scriptWritten;
            ScriptDeployedCount = scriptDeployedCount;
            KubernetesResearched = kubernetesResearched;
            KubernetesDeployCount = kubernetesDeployCount;
            CcgCreated = coloConfigGeneratorCreated;
            CcgDeployCount = coloDeployCount;
            PlayerStatus = playerStatus;
        }

        public GameStatus WithScore(int score)
        {
            return new GameStatus(PlayerName, Character, Id, score, ScoreRate, ScriptWritten, ScriptDeployedCount, 
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus WithScorePerSecond(int scorePerSecond)
        {
            return new GameStatus(PlayerName, Character, Id, Score, scorePerSecond, ScriptWritten, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus WithScriptWritten()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, true, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus IncrementScriptDeploy()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, ScriptWritten, ScriptDeployedCount + 1,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus IncreaseScoreByTick()
        {
            return new GameStatus(PlayerName, Character, Id, Score + ScoreRate, ScoreRate, ScriptWritten, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus WithKubernetesResearched()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, true, ScriptDeployedCount, 
                true, KubernetesDeployCount, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus IncrementKubernetesDeploy()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, ScriptWritten, ScriptDeployedCount, 
                KubernetesResearched, KubernetesDeployCount + 1, CcgCreated, CcgDeployCount, PlayerStatus);
        }

        public GameStatus WithCcgCreated()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, ScriptWritten, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, true, CcgDeployCount, PlayerStatus);
        }

        public GameStatus IncrementColoDeploy()
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, ScriptWritten, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount + 1, PlayerStatus);
        }

        public GameStatus WithPlayerStatus(Func<PlayerStatus, PlayerStatus> fn)
        {
            return new GameStatus(PlayerName, Character, Id, Score, ScoreRate, ScriptWritten, ScriptDeployedCount,
                KubernetesResearched, KubernetesDeployCount, CcgCreated, CcgDeployCount, fn(PlayerStatus));
        }
    }
}
