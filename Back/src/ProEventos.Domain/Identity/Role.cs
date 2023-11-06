﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Domain.Identity
{
    public class Role : IdentityRole<int>
    {
        //Uma Role pode pertencer a diversos Users (Associação de Muito pra Muitos)
        public List<UserRole> UserRoles { get; set; }
    }
}
