using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    //Aqui nesse caso a Classe UserPersist Será Herdada de GeralPersist  e vamos implementar o IUserPersist
    {
        private readonly ProEventosContext _context;

        public UserPersist(ProEventosContext context) : base(context) 
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        /// <summary>
        /// Quando for passado o username como parametro, eu pesquiso no meu contexto de Users do IdentityDbContext.
        /// SingleOrDefaultAsync = Retorna de forma assíncrona o único elemento de uma sequência que atende a uma condição especificada.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<User> GetUserByUserNameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(user => user.UserName == username.ToLower());
        }

    }
}
