using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.API.Helpers
{
    public class Util : IUtil
    {
        private readonly IWebHostEnvironment _hostEnvironment;

        public Util(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        public async Task<string> SaveImage(IFormFile imageFile, string destino)
        {
            //Pegar o imageName
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
                .Take(10)
                .ToArray()).Replace(' ', '-'); //Se tiver espaço em branco, substitua por traço

            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @$"Resources/{destino}", imageName);

            using (var filesStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(filesStream);
            }

            return imageName;
        }

        public void DeleteImage(string imageName, string destino)
        {
            //Raiz Atual do meu caminho
            if (!string.IsNullOrEmpty(imageName))
            {
                var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @$"Resources/{destino}", imageName);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

        }
    }
}
