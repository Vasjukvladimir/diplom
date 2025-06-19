using Microsoft.AspNetCore.Mvc; 
using System.Threading.Tasks;
using WeAIBackend.Ai.Services;

namespace WeAIBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;

        public AiController(AiService aiService)
        {
            _aiService = aiService;
        }

        // POST api/ai/generate
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] PromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest("Промпт не может быть пустым");

            var result = await _aiService.GenerateTextAsync(request.Prompt);
            return Ok(new { response = result });
        }

        // POST api/ai/analyze-file
        [HttpPost("analyze-file")]
        public async Task<IActionResult> AnalyzeFileContent([FromBody] FileContentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Содержимое файла не может быть пустым");

            // Формируем промпт с содержимым файла
            string prompt = $"Проанализируй содержимое файла \"{request.Filename}\":\n{request.Content}\nДай краткий ответ:";

            var result = await _aiService.GenerateTextAsync(prompt);

            return Ok(new { response = result });
        }
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }

    public class FileContentRequest
    {
        public string Filename { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
