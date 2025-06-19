using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using LLama;
using LLama.Common;
using LLama.Sampling;

namespace WeAIBackend.Ai.Services
{
    public class AiService : IDisposable
    {
        private LLamaWeights? _model;
        private LLamaContext? _context;
        private InteractiveExecutor? _executor;

        private readonly string _modelPath;
        private readonly ModelParams _modelParams;

        public AiService()
        {
            var projectRoot = Path.Combine(AppContext.BaseDirectory, "..", "..", "..");
            _modelPath = Path.GetFullPath(Path.Combine(projectRoot, "Ai", "ModelsAi", "llama-2-7b-chat.Q4_K_M.gguf"));

            Console.WriteLine($"Путь к модели: {_modelPath}");

            _modelParams = new ModelParams(_modelPath)
            {
                ContextSize = 1024,
                GpuLayerCount = 5,
            };
        }

        public async Task InitializeAsync()
        {
            if (!File.Exists(_modelPath))
                throw new FileNotFoundException("Файл модели не найден", _modelPath);

            _model = LLamaWeights.LoadFromFile(_modelParams);
            _context = _model.CreateContext(_modelParams);
            _executor = new InteractiveExecutor(_context);

            await Task.CompletedTask;
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            if (_executor == null)
                throw new InvalidOperationException("Модель не инициализирована. Вызовите InitializeAsync.");

            var chatHistory = new ChatHistory();

            // Инструкция ассистенту
            chatHistory.AddMessage(AuthorRole.System,
                "Ты — умный помощник. Чтобы у тебя не спросили - отвечай строго на русском языке, без префиксов 'User:', 'Assistant:'. Пиши русскими буквами.");

            var session = new ChatSession(_executor, chatHistory);

            var inferenceParams = new InferenceParams()
            {
                MaxTokens = 256,
                AntiPrompts = new List<string> { "User:" },
                SamplingPipeline = new DefaultSamplingPipeline(),
            };

            string result = "";

            await foreach (var text in session.ChatAsync(new ChatHistory.Message(AuthorRole.User, prompt), inferenceParams))
            {
                result += text;
            }

            // Очистка вывода от лишних меток
            string cleaned = result
                .Replace("User:", "", StringComparison.OrdinalIgnoreCase)
                .Replace("System:", "", StringComparison.OrdinalIgnoreCase)
                .Replace("Assistant:", "", StringComparison.OrdinalIgnoreCase)
                .Trim();

            return cleaned;
        }

        public void Dispose()
        {
            _context?.Dispose();
            _model?.Dispose();
        }
    }
}
