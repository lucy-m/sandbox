namespace AS2020Api.Model
{
    public class LeaderboardEntry
    {
        public string Player { get; }
        public int Score { get; }

        public LeaderboardEntry(string player, int score)
        {
            Player = player;
            Score = score;
        }
    }
}
