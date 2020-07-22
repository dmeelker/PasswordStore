using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PublicApi.Repository
{
    public class DocumentRepository
    {
        private readonly string _storageDirectory = "data";

        public async Task<string> Get(string id)
        {
            return await File.ReadAllTextAsync(Path.Combine(_storageDirectory, id));
        }

        public async Task Save(string id, byte[] data)
        {
            await File.WriteAllBytesAsync(Path.Combine(_storageDirectory, id), data);
        }
    }
}
