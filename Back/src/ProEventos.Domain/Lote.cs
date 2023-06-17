
using System;

namespace ProEventos.Domain
{
    public class Lote
    {
        //UM LOTE PERTENCE APENAS A UM EVENTO ENTÃO NAO POSSUI LISTAS.
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }

        public int Quantidade { get; set; }
        public int EventoId { get; set; }
        public Evento Evento { get; set; }
    }
}