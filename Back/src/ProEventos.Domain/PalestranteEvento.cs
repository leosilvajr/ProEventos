
namespace ProEventos.Domain
{
    public class PalestranteEvento
    {
        public int PalestranteId { get; set; }  //FOREIGN key 
        public Palestrante Palestrante { get; set; }
        public int EventoId { get; set; } //FOREIGN key
         public Evento Evento { get; set; }
    }
}