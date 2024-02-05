using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;
//VS
namespace ProEventos.Persistence.Contratos
{
    public interface IPalestrantePersist : IGeralPersist
    {
        //Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos);
        Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    }
}