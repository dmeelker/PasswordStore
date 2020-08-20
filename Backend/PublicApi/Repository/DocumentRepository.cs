using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PublicApi.Repository
{
    public class DocumentRepository
    {
        private readonly string _storageDirectory = "datafiles";

        public async Task<string> Get(string id)
        {
            var file = Path.Combine(_storageDirectory, id);
            if (File.Exists(file))
                return await File.ReadAllTextAsync(Path.Combine(_storageDirectory, id));
            else
                return null;
        }

        public async Task Save(string id, byte[] data)
        {
            await File.WriteAllBytesAsync(Path.Combine(_storageDirectory, id), data);
        }
    }
}
