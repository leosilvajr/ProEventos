using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;

        public AccountService(UserManager<User> userManager,
                                SignInManager<User> signInManager,
                                IMapper mapper,
                                IUserPersist userPersist)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _userPersist = userPersist;
        }

        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            try
            {
                //Chamo o _userManager que acessa o Users que é um IQueryable 
                var user = await _userManager.Users.SingleOrDefaultAsync(user => user.UserName == userUpdateDto.UserName.ToLower());


                //Se o User for encontrado na linha de cima corresponde ao passord, se na corresponder eu passo false.
                return await _signInManager.CheckPasswordSignInAsync(user, password, false); //Se o User for verdadeiro ele muda pra True e Loga.

            }
            catch (Exception ex)
            {

                throw new Exception($"Erro ao tentar verificar o Password. Erro: {ex.Message}");
            }
        }

        public async Task<UserDto> CreateAccountAsync(UserDto userDto)
        {
            try
            {
                //Mapeando o argumento userDto para o User
                var user =  _mapper.Map<User>(userDto);

                                    //_userManger vai criar o meu usario de forma assyncrona usando o user e o meu userDto.Password
                var result = await _userManager.CreateAsync(user, userDto.Password);

                if (result.Succeeded)
                {
                    //Nesse momento o meu objeto UserDto esta todo preenchido com os dados corretos.
                    var userToReturn = _mapper.Map<UserDto>(user);
                    return userToReturn;
                }
                return null;

            }
            catch (Exception ex)
            {

                throw new Exception($"Erro ao tentar criar Usuário. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> GetUserByUserNameAsync(string userName)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userName);
                if (user == null)
                {
                    return null;
                }
                
                var userUpdateDto = _mapper.Map<UserUpdateDto>(user);
                return userUpdateDto;

            }
            catch (Exception ex)
            {

                throw new Exception($"Erro ao tentar buscar Usuário através do Username. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userUpdateDto.UserName);
                if (user == null)
                {
                    return null;
                }
                _mapper.Map(userUpdateDto, user);

                //Vamos Criar/Atualizar o Token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                //Reset do Password
                var result = await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);

                _userPersist.Update<User>(user);
                if (await _userPersist.SaveChangesAsync())
                {
                    var userRetorno = await _userPersist.GetUserByUserNameAsync(user.UserName);
                    return _mapper.Map<UserUpdateDto>(userRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception($"Erro ao tentar atualizar Usuário. Erro: {ex.Message}");
            }
        }

        public async Task<bool> UserExists(string userName)
        {
            try
            {
                return await _userManager.Users.AnyAsync(user => user.UserName == userName.ToLower());
            }
            catch (Exception ex)
            {

                throw new Exception($"Erro ao verificar se o Usuário existe. Erro: {ex.Message}");
            }
        }
    }
}
