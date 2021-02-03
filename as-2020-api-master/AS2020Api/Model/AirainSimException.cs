using System;

namespace AS2020Api.Model
{
    public class AirainSimException : Exception
    {
        protected AirainSimException(string message): base(message) { }

        public static AirainSimException UnableToFindGame(Guid id) => new AirainSimException($"Unable to find game with ID {id}");
        public static AirainSimException UnknownCharacter(string name) => new AirainSimException($"Unknown character {name}");
        public static AirainSimException NoPropertiesForEventType(PlayEventType type) => new AirainSimException($"No properties declared for event type {type}");
    }
}
