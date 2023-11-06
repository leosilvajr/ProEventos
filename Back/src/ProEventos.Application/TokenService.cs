using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config, UserManager<User> userManager, IMapper mapper)
        {
            _configuration = config;
            _userManager = userManager;
            _mapper = mapper;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public async Task<string> CreateToken(UserUpdateDto userUpdateDto)
        {
            // Mapeia o objeto UserUpdateDto para um objeto User.
            var user = _mapper.Map<User>(userUpdateDto);

            // Lista de afirmações (claims) que compõem o token.
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName)
        };

            // Obtém as funções (roles) do usuário a partir do UserManager.
            var roles = await _userManager.GetRolesAsync(user);

            // Adiciona as roles como claims ao token.
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Define as credenciais de assinatura do token.
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // Cria a descrição do token.
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            // Cria o token JWT.
            var token = tokenHandler.CreateToken(tokenDescription);

            // Converte o token em uma string JWT e retorna.
            return tokenHandler.WriteToken(token);
        }

    }
}
