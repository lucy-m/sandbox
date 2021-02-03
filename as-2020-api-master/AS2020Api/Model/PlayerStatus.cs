namespace AS2020Api.Model
{
    public class PlayerStatus
    {
        public bool Energized { get; }
        public bool Entertained { get; }

        private PlayerStatus(bool energized, bool entertained)
        {
            Energized = energized;
            Entertained = entertained;
        }

        public static PlayerStatus New()
        {
            return new PlayerStatus(false, false);
        }

        public PlayerStatus Energize()
        {
            return new PlayerStatus(true, Entertained);
        }

        public PlayerStatus DeEnergize()
        {
            return new PlayerStatus(false, Entertained);
        }

        public PlayerStatus Entertain()
        {
            return new PlayerStatus(Energized, true);
        }

        public PlayerStatus Unentertain()
        {
            return new PlayerStatus(Energized, false);
        }

        public int GetAdditionalPlayEventScore(PlayEvent playEvent, GameStatus status)
        {
            if (playEvent.Type == PlayEventType.CookieClicked)
            {
                var multiplier = (Energized ? 0.5 : 0) + (Entertained ? 0.3 : 0);

                return (int) (status.ScoreRate * multiplier);
            }

            return 0;
        }
    }
}
