using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Flashcards.WinUISerializer
{
    public class LibraryTree
    {
        public required List<Node> Contents { get; set; }
    }

    [JsonPolymorphic]
    [JsonDerivedType(typeof(Divider), "Divider")]
    [JsonDerivedType(typeof(Card), "Card")]
    public abstract class Node
    {
    }

    public class Divider : Node
    {
        public string Name { get; set; } = string.Empty;
        public List<Node> Children { get; set; } = new();
        public int TotalChildren => Children?.Sum(c => c switch
        {
            Card => 1,
            Divider d => d.TotalChildren,
            _ => 0
        }) ?? 0;
        public bool IsExpanded { get; set; } = false;
    }

    public class Card : Node
    {
        public string Front { get; set; } = string.Empty;
        public string Back { get; set; } = string.Empty;
        public double Weight { get; set; } = 20.0;
    }

    [JsonSourceGenerationOptions(
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonSerializable(typeof(LibraryTree))]
    [JsonSerializable(typeof(Node))]
    [JsonSerializable(typeof(Divider))]
    [JsonSerializable(typeof(Card))]
    public partial class AppJsonContext : JsonSerializerContext
    {
    }

    class Program
    {
        public static async Task<string> ComputeHash(LibraryTree libraryTree)
        {
            using MemoryStream stream = new();
            await JsonSerializer.SerializeAsync(stream, libraryTree, AppJsonContext.Default.LibraryTree);
            stream.Position = 0;
            using SHA256 sha256 = SHA256.Create();
            byte[] hashBytes = await sha256.ComputeHashAsync(stream);
            return Convert.ToHexString(hashBytes);
        }

        static async Task Main(string[] args)
        {
            string inputJson = "";
            if (args.Length > 0 && File.Exists(args[0]))
            {
                inputJson = await File.ReadAllTextAsync(args[0]);
            }
            else
            {
                inputJson = await Console.In.ReadToEndAsync();
            }

            if (string.IsNullOrWhiteSpace(inputJson))
            {
                Console.Error.WriteLine("No input JSON provided.");
                return;
            }

            var libraryTree = JsonSerializer.Deserialize(inputJson, AppJsonContext.Default.LibraryTree);
            if (libraryTree == null)
            {
                Console.Error.WriteLine("Failed to deserialize LibraryTree.");
                return;
            }

            // 1. Minified JSON serialized via AppJsonContext
            using var minStream = new MemoryStream();
            await JsonSerializer.SerializeAsync(minStream, libraryTree, AppJsonContext.Default.LibraryTree);
            minStream.Position = 0;
            using var minReader = new StreamReader(minStream, Encoding.UTF8);
            string minifiedJson = await minReader.ReadToEndAsync();

            // 2. Indented JSON serialized via AppJsonContext
            var indentedOptions = new JsonSerializerOptions(AppJsonContext.Default.Options)
            {
                WriteIndented = true
            };
            string indentedJson = JsonSerializer.Serialize(libraryTree, indentedOptions);

            // 3. Compute Hash 1:1 with LibraryCoordinator
            string hash = await ComputeHash(libraryTree);

            var result = new
            {
                hash,
                minifiedJson,
                indentedJson
            };

            Console.WriteLine(JsonSerializer.Serialize(result));
        }
    }
}
