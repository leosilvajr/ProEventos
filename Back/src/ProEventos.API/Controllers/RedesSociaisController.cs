using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RedesSociaisController : ControllerBase
    {
        private readonly IRedeSocialService _redeSocialService;
        private readonly IEventoService _eventoService;
        private readonly IPalestranteService _palestranteService;

        public RedesSociaisController(IRedeSocialService RedeSocialService,
                              IEventoService eventoService,
                              IPalestranteService palestranteService)
        {
            // Injeta os serviços necessários no construtor do controlador.
            _palestranteService = palestranteService;
            _redeSocialService = RedeSocialService;
            _eventoService = eventoService;
        }

        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId)
        {
            try
            {
                // Verifica se o usuário é autor do evento com base no ID do evento.
                if (!(await AutorEvento(eventoId))) //AutorEvento - Metodo para verificar se o evento listado pertence a quem está logado.
                    return Unauthorized();

                // Obtém todas as redes sociais associadas ao evento com base no ID do evento.
                var redeSocial = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                // Retorna NoContent se não houver redes sociais associadas ao evento.
                if (redeSocial == null) return NoContent();

                // Retorna Ok com as redes sociais associadas ao evento.
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Rede Social por Evento. Erro: {ex.Message}");
            }
        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante()
        {
            try
            {
                // Obtém o palestrante associado ao usuário autenticado.
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                // Retorna Unauthorized se o palestrante não for encontrado.
                if (palestrante == null) return Unauthorized();

                // Obtém todas as redes sociais associadas ao palestrante com base no ID do palestrante.
                var redeSocial = await _redeSocialService.GetAllByPalestranteIdAsync(palestrante.Id);
                // Retorna NoContent se não houver redes sociais associadas ao palestrante.
                if (redeSocial == null) return NoContent();

                // Retorna Ok com as redes sociais associadas ao palestrante.
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Rede Social por Palestrante. Erro: {ex.Message}");
            }
        }


        [HttpPut("evento/{eventoId}")]
        public async Task<IActionResult> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                // Verifica se o usuário é autor do evento com base no ID do evento.
                if (!(await AutorEvento(eventoId)))
                    return Unauthorized();

                // Tenta salvar as redes sociais associadas ao evento com base no ID do evento e nos modelos fornecidos.
                var redeSocial = await _redeSocialService.SaveByEvento(eventoId, models);
                // Retorna NoContent se as redes sociais não foram salvas.
                if (redeSocial == null) return NoContent();

                // Retorna Ok com as redes sociais salvas se a operação for bem-sucedida.
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar salvar Rede Social por Evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveByPalestrante(RedeSocialDto[] models)
        {
            try
            {
                // Obtém o palestrante associado ao usuário autenticado.
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                // Retorna Unauthorized se o palestrante não for encontrado.
                if (palestrante == null) return Unauthorized();

                // Tenta salvar as redes sociais associadas ao palestrante com base no ID do palestrante e nos modelos fornecidos.
                var redeSocial = await _redeSocialService.SaveByPalestrante(palestrante.Id, models);
                // Retorna NoContent se as redes sociais não foram salvas.
                if (redeSocial == null) return NoContent();

                // Retorna Ok com as redes sociais salvas se a operação for bem-sucedida.
                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar salvar Rede Social por Palestrante. Erro: {ex.Message}");
            }
        }

        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                // Verifica se o usuário é autor do evento com base no ID do evento.
                if (!(await AutorEvento(eventoId)))
                    return Unauthorized();

                // Obtém a rede social associada ao evento e ao ID da rede social especificado.
                var RedeSocial = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                // Retorna NoContent se a rede social não for encontrada.
                if (RedeSocial == null) return NoContent();

                // Tenta deletar a rede social associada ao evento e ao ID da rede social especificado.
                return await _redeSocialService.DeleteByEvento(eventoId, redeSocialId)
                       // Retorna Ok se a operação for bem-sucedida; lança uma exceção em caso de problema não específico.
                       ? Ok(new { message = "Rede Social Deletada" })
                       // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                       : throw new Exception("Ocorreu um problema não específico ao tentar deletar Rede Social por Evento.");
            }
            catch (Exception ex)
            {
                // Retorna resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar Rede Social por Evento. Erro: {ex.Message}");
            }
        }


        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId)
        {
            try
            {
                // Obtém o palestrante associado ao usuário autenticado.
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrante == null) return Unauthorized();

                // Obtém a rede social associada ao palestrante e ao ID da rede social especificado.
                var RedeSocial = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrante.Id, redeSocialId);
                if (RedeSocial == null) return NoContent();

                // Tenta deletar a rede social associada ao palestrante e ao ID da rede social especificado.
                return await _redeSocialService.DeleteByPalestrante(palestrante.Id, redeSocialId)
                       // Retorna resposta Ok se a operação for bem-sucedida.
                       ? Ok(new { message = "Rede Social Deletada" })
                       // Lança uma exceção se ocorrer um problema não específico durante a tentativa de exclusão.
                       : throw new Exception("Ocorreu um problema não específico ao tentar deletar Rede Social por Palestrante.");
            }
            catch (Exception ex)
            {
                // Retorna uma resposta de erro 500 em caso de exceção, indicando detalhes do erro.
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar Rede Social por Palestrante. Erro: {ex.Message}");
            }
        }

        [NonAction]
        private async Task<bool> AutorEvento(int eventoId)
        {
            // Obtém o evento associado ao usuário autenticado e ao ID do evento especificado.
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, false);
            // Retorna true se o evento for encontrado, indicando que o usuário é autor do evento.
            if (evento == null) return false;

            return true;
        }

    }
}