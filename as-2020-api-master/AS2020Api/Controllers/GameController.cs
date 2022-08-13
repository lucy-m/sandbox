using AS2020Api.Data;
using AS2020Api.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AS2020Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameRepository _games;
        private readonly CharacterRepository _characters;
        private readonly GameParameters _parameters;

        public GameController(GameRepository games, CharacterRepository characters,
            GameParameters parameters)
        {
            _games = games;
            _characters = characters;
            _parameters = parameters;
        }


        [HttpGet("status/{id}")]
        public ActionResult<GameStatus> GetStatus(Guid id)
        {
            return _games.GetGame(id).Status.WithPlayerStatus(_ => PlayerStatus.New());
        }

        [HttpPost("new")]
        public ActionResult<Guid> NewGame([FromBody] GameInitialConfig config)
        {
            var playerName = config.PlayerName;
            var character = _characters.GetbyName(config.SelectedCharacter);
            var game = new Game(playerName, character);
            _games.RegisterGame(game);
            return game.Id;
        }

        [HttpPost("act")]
        public ActionResult<ActResult> Act([FromBody] GameActionBatch actions)
        {
            var now = DateTimeOffset.UtcNow;
            
                var result = _games.ApplyAndValidateActions(actions, now);
                return Ok(result);
        }

        [HttpGet("parameters")]
        public ActionResult<GameParameters> GetParameters()
        {
            return _parameters;
        }

        [HttpGet("leaderboard")]
        public ActionResult<IReadOnlyCollection<LeaderboardEntry>> GetLeaderboard()
        {
            return Ok(_games.GetLeaderBoard());
        }
    }
}
