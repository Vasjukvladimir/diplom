using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private static List<TaskItem> tasks = new List<TaskItem>
        {
            new TaskItem { Id = 1, Title = "Сделать диплом", IsCompleted = false },
            new TaskItem { Id = 2, Title = "Купить кофе", IsCompleted = true }
        };

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> Get()
        {
            return Ok(tasks);
        }

        [HttpPost]
        public ActionResult<TaskItem> Post([FromBody] TaskItem newTask)
        {
            newTask.Id = tasks.Any() ? tasks.Max(t => t.Id) + 1 : 1;
            tasks.Add(newTask);
            return CreatedAtAction(nameof(Get), new { id = newTask.Id }, newTask);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            tasks.Remove(task);
            return NoContent();
        }
    }
}
