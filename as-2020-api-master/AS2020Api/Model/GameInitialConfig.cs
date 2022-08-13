namespace AS2020Api.Model
{
    public class GameInitialConfig
    {
        public readonly string PlayerName;
        public readonly string SelectedCharacter;

        public GameInitialConfig(string playerName, string selectedCharacter)
        {
            PlayerName = playerName;
            SelectedCharacter = selectedCharacter;
        }
    }
}
