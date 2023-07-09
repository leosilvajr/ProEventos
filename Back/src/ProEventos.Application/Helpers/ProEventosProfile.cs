using AutoMapper;
using ProEventos.Application.Dtos;
using ProEventos.Domain;

namespace ProEventos.Application.Helpers
{
    public class ProEventosProfile :Profile
    {

        public ProEventosProfile()
        {
            //Toda vez que um dado vier de evento, eu quero que mapeie para o Dto
            CreateMap<Evento, EventoDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();
        }

    }
}
