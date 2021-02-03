export class PlayEventType {
  private static readonly byName = new Map<string, PlayEventType>();

  private constructor(public readonly name: string) {
    PlayEventType.byName.set(name, this);
  }

  public static readonly Tick = new PlayEventType('Tick');
  public static readonly CookieClicked = new PlayEventType('CookieClicked');
  public static readonly ScriptWritten = new PlayEventType('ScriptWritten');
  public static readonly ScriptDeployed = new PlayEventType('ScriptDeployed');
  public static readonly KubernetesResearched = new PlayEventType(
    'KubernetesResearched'
  );
  public static readonly KubernetesDeploy = new PlayEventType(
    'KubernetesDeploy'
  );
  public static readonly CcgCreated = new PlayEventType('CcgCreated');
  public static readonly CcgDeploy = new PlayEventType('CcgDeploy');
  public static readonly DrinkCoffee = new PlayEventType('DrinkCoffee');
  public static readonly DeEnergize = new PlayEventType('DeEnergize');
  public static readonly WatchTv = new PlayEventType('WatchTv');
  public static readonly Unentertained = new PlayEventType('Unentertained');

  public static ByName(name: string): PlayEventType {
    const value = this.byName.get(name);

    if (value) {
      return value;
    }

    throw new Error('Unknown play event type ' + name);
  }
}

export interface PlayEvent {
  type: PlayEventType;
}
