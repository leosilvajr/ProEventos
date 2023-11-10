using ProEventos.Application;
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;

//DTO : DATA TRANSFER OBJETC
/*Objeto de Transferencia de Dados*/

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O Campo {0} é obrigatório.")]
        //[MinLength(3, ErrorMessage = "{0} deve ter no mínimo 4 Caracteres.")]
        //[MaxLength(50, ErrorMessage = "{0} deve ter no máximo 50 Caracteres.")]
        [StringLength(50, MinimumLength =3, ErrorMessage = "O {0} deve ter no mínimo 3 e no máximo 50 Caracteres.")]
        public string Tema { get; set; }

        [Display(Name = "Qtd Pessoas")]
        [Range(1, 120000, ErrorMessage = "{0} não pode ser menor que 1 e maior que 120.000")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "O Campo {0} é obrigatório.")]
        [Phone(ErrorMessage = "O Campo {0} está com numero inválido .")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O Campo {0} é obrigatório.")]
        [Display(Name = "E-mail")]
        [EmailAddress(ErrorMessage = "{0} inválido.")]
        public string Email { get; set; }

        public int  UserId{ get; set; }

        public UserDto UserDto{ get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}
