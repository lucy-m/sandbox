using System.Collections.Generic;
using System.Linq;
using AS2020Api.Model;

namespace AS2020Api.Data
{
    public class CharacterRepository
    {
        public readonly IDictionary<string, Character> CharacterNames;

        public CharacterRepository(params string[] names)
        {
            CharacterNames = names.ToDictionary(n => n, n => new Character(n));
        }

        public Character GetbyName(string name)
        {
            if (CharacterNames.ContainsKey(name))
            {
                return CharacterNames[name];
            }

            throw AirainSimException.UnknownCharacter(name);
        }
    }
}
