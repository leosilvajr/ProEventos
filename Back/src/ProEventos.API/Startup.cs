using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ProEventos.Application;
using ProEventos.Application.Contratos;
using ProEventos.Persistence;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            //Acessa o appsettings.json
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {

            //Service, oque contexto que voce está ultilizando é o meu DbContext que possui o meu Evento
            services.AddDbContext<ProEventosContext>(
                
                context => context.UseSqlite(Configuration.GetConnectionString("Default"))
            );
            services.AddControllers() //Trabalhando com arquitetura MVC
                    .AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore
                    );

            //AutoMapper - Injeção do Objeto
                    //Dentro do dominio da minha aplicaçao no contexto existem varios Assemblies 
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //Injeção de Dependencia
            //Toda vez que for requisitado o IEventoService injete o EventoService
            services.AddScoped<IEventoService, EventoService>();
            services.AddScoped<IGeralPersist, GeralPersist>();
            services.AddScoped<IEventoPersist, EventoPersist>();

            //Habilitando o CORS
            services.AddCors();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProEventos.API", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProEventos.API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            // Dando permissoes aos CORS
            app.UseCors(cors => 
                cors.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
