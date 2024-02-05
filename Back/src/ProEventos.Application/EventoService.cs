using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;
//VS
namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;
        public EventoService(IGeralPersist geralPersist,
                             IEventoPersist eventoPersist,
                             IMapper mapper)
        {
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEventos(int userId, EventoDto model)
        {
            try
            {
                //Mapper
                //Recebo meu model, passo para o metodo que agora é um dto e mapeio para o Evento
                var evento = _mapper.Map<Evento>(model);

                evento.UserId = userId; //Implementado verificaçao do userId

                _geralPersist.Add<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);

                    return _mapper.Map<EventoDto>(eventoRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model)
        {
            try
            {

                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento == null) return null;

                model.Id = evento.Id;
                model.UserId = userId;

                _mapper.Map(model, evento); //Mapeando do model com destino ao evento.

                _geralPersist.Update<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);

                    return _mapper.Map<EventoDto>(eventoRetorno);
                }
                return null;
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento == null) throw new Exception("Evento para delete não encontrado.");

                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams ,includePalestrantes);
                if (eventos == null) return null;

                var resultado = _mapper.Map<PageList<EventoDto>> (eventos);

                //Fazendo automapper manual
                resultado.CurrentPage = eventos.CurrentPage;
                resultado.TotalPages = eventos.TotalPages;
                resultado.PageSize = eventos.PageSize;
                resultado.TotalCount = eventos.TotalCount;

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //public async Task<EventoDto[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false)
        //{
        //    try
        //    {
        //        var eventos = await _eventoPersist.GetAllEventosByTemaAsync(userId, tema, includePalestrantes);
        //        if (eventos == null) return null;

        //        var resultado = _mapper.Map<EventoDto[]>(eventos);

        //        return resultado;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}

        public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {

            /*Vamos mapear a variavel eventos que é um evento do meu dominio 
             E vamos fazer o mapeamento para o EventoDto */

            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, includePalestrantes);
                if (evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}