using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.API.Helpers;
using ProEventos.Application;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _util;
        private readonly string _destino = "Perfil";
        public AccountController(IAccountService accountService,
                                 ITokenService tokenService,
                                 IUtil util)
        {
            _accountService = accountService;
            _tokenService = tokenService;
            _util = util;
        }

        [HttpGet("GetUser")] //Metodo de Extensão:GetUser vai usar O token par apegar nome do usuario e senha
        //[AllowAnonymous] //Permitir Anonimos, ou seja, alguem que nao contem o token
        public async Task<IActionResult> GetUser()
        {
            try
            {
                //Usar Classe de Extensão
                //User = ClaimsPrincipal
                var userName = User.GetUserName();

                var user = await _accountService.GetUserByUserNameAsync(userName);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto uderDto)
        {
            try
            {
                if (await _accountService.UserExists(uderDto.Username))
                {
                    return BadRequest("Usuário já existe.");
                }
                var user = await _accountService.CreateAccountAsync(uderDto);
                if (user != null)
                {
                    return Ok(new
                    {
                        userName = user.UserName,
                        PrimeroNome = user.PrimeiroNome,
                        token = _tokenService.CreateToken(user).Result
                    });
                }

                return BadRequest("Usuário não criado, tente com outro Username.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar registrar usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLogin)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(userLogin.Username);
                if (user == null) return Unauthorized("Usuário ou Senha está errado");

                var result = await _accountService.CheckUserPasswordAsync(user, userLogin.Password);
                if (!result.Succeeded) return Unauthorized();

                return Ok(new
                {
                    userName = user.UserName,
                    PrimeroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar realizar Login. Erro: {ex.Message}");
            }
        }


        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {

                //Eu so posso atualizar o usuario baseado no meu Token.
                if (userUpdateDto.UserName != User.GetUserName())
                    return Unauthorized("Usuário Inválido");

                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if (user == null) return Unauthorized("Usuário Inválido");

                var userReturn = await _accountService.UpdateAccount(userUpdateDto);
                if (userReturn == null) return NoContent();

                return Ok(new
                {
                    userName = userReturn.UserName,
                    PrimeroNome = userReturn.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar Atualizar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());

                if (user == null) //Verificando se o evento exite.
                    return NoContent();

                var file = Request.Form.Files[0]; // Recebe do meu request vai enviar um formulario com files.

                if (file.Length > 0)
                {
                    //Deletar Imagem
                    _util.DeleteImage(user.ImagemURL, _destino);

                    //Salvar Imagem
                    user.ImagemURL = await _util.SaveImage(file, _destino);
                }

                var eventoRetorno = await _accountService.UpdateAccount(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar realizar upload de foto. Erro: {ex.Message}");
            }
        }

    }
}
