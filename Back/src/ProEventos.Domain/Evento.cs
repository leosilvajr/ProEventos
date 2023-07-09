using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//VS

namespace ProEventos.Domain
{
    //Data Anotation EF Core
    //[Table("EventosDetalhes")]
    public class Evento
    {
        //[Key] --Nesse caso nao precisa usar o Key porque o objeto ja tem o nome Id
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }

        //[NotMapped] //Nao vai pro banco.
        //public int ContagemDias { get; set; }

        [Required]
        public string Tema { get; set; }
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public IEnumerable<Lote> Lotes { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}