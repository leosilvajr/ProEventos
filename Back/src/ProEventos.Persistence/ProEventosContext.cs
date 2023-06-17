using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;

//Contexto que sera ultilizado para a Criação da Tabela no Banco de Dados
namespace ProEventos.Persistence
{
    public class ProEventosContext : DbContext //Microsoft.EntityFrameworkCore
    {
                                                        //Passar para a base DbContext
        public ProEventosContext(DbContextOptions<ProEventosContext> options)
            : base(options){}

        //Adicionar esse contexto no Services de Startup.cs
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; } //Associaçao de Muitos para Muitos
        public DbSet<RedeSocial> RedesSociais { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
                //Atraves do PalestrantesEventos ao criar o banco de dados a tabela Evento e Palestrante serao relacionadas
            modelBuilder.Entity<PalestranteEvento>()
                .HasKey(PE => new {PE.EventoId, PE.PalestranteId});
        }

    }
}