using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : IdentityDbContext<User, Role, int,
                                                     IdentityUserClaim<int>,UserRole, IdentityUserLogin<int>,
                                                     IdentityRoleClaim<int>, IdentityUserToken<int>> 
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options)
            : base(options) { }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; }
        public DbSet<RedeSocial> RedesSociais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserRole>(userRole => // Dado um UserRole
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId }); //Só consegueguimos acessar UserId e RoleId por conta do TKey da Herança de IdentityUser

                //Uma UserRole possui um Role com muitas UserRoles e que possui uma ForeignKe de RoleId
                userRole.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired(); //Obrigatorio.

                //Toda vez que eu criar um User dentro de Roles eu preciso passar o UserId
                userRole.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            });   


            modelBuilder.Entity<PalestranteEvento>()
                .HasKey(pe => new { pe.EventoId, pe.PalestranteId });

            modelBuilder.Entity<Evento>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Evento)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Palestrante>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Palestrante)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}