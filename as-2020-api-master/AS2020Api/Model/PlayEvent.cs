namespace AS2020Api.Model
{
    public enum PlayEventType
    {
        Tick,
        CookieClicked,
        ScriptWritten,
        ScriptDeployed,
        KubernetesResearched,
        KubernetesDeploy,
        CcgCreated,
        CcgDeploy,
        DrinkCoffee,
        DeEnergize,
        WatchTv,
        Unentertained
    }

    public class PlayEvent
    {
        public PlayEventType Type { get; }

        public PlayEvent(PlayEventType type)
        {
            Type = type;
        }
    }
}
