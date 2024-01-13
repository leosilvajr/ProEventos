﻿using Microsoft.AspNetCore.Http;
using ProEventos.API.Models;
using System.Reflection.Metadata;
using System.Text.Json;

namespace ProEventos.API.Extensions
{
    //Toda classe de Extensão deve ser estatica
    public static class Pagination
    {
        public static void AddPagination( this HttpResponse response, 
            int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var pagination = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase

            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination, options));
            response.Headers.Add("Acess-Control-Expose-Headers", "Pagination");
        }
    }
}
