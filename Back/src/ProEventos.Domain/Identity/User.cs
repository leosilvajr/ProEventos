using Microsoft.AspNetCore.Identity;
using ProEventos.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Domain.Identity
{                                        //<int> = TKey = id da tabela
    public class User : IdentityUser<int> //Herança: 
    {
        //Um User possui diversas Role
        public string PrimeiroNome { get; set; }
        public string UltimoNome { get; set; }
        public Titulo Titulo { get; set; }
        public string Descricao { get; set; }
        public Funcao Funcao { get; set; }
        public string ImagemURL { get; set; }
        public IEnumerable<UserRole> UserRoles { get; set; }

    }
}
