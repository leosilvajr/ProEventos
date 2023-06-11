using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.API.Models;

//Contexto que sera ultilizado para a Criação da Tabela no Banco de Dados
namespace ProEventos.API.Data
{
    public class DataContext : DbContext //Microsoft.EntityFrameworkCore
    {
                                                        //Passar para a base DbContext
        public DataContext(DbContextOptions<DataContext> options): base(options){}

        //Adicionar esse contexto no Services de Startup.cs
        public DbSet<Evento> Eventos { get; set; }
    }
}