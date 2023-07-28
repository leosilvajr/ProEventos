using System.Threading.Tasks;
using ProEventos.Domain;
//VS

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        /// <summary>
        /// Metodo get que retornara uma lista de lotes por eventoId
        /// </summary>
        /// <param name="eventoId">Codigo chave da tabela de eventos</param>
        /// <returns></returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Metodo que retornara apenas 1 lote
        /// </summary>
        /// <param name="eventoId">Codigo chave da tabela de eventos</param>
        /// <param name="id"> Codigo chave do meu lote </param>
        /// <returns></returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}