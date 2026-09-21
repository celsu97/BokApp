using System.Security.Claims;
using BookApp.Backend.Data;
using BookApp.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookApp.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuotesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
    {
        var userId = GetUserId();
        return await _context.Quotes.Where(q => q.UserId == userId).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetQuote(int id)
    {
        var userId = GetUserId();
        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);
        if (quote == null) return NotFound();
        return quote;
    }

    [HttpPost]
    public async Task<ActionResult<Quote>> CreateQuote(Quote quote)
    {
        quote.UserId = GetUserId();
        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetQuote), new { id = quote.Id }, quote);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuote(int id, Quote updatedQuote)
    {
        var userId = GetUserId();
        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);
        if (quote == null) return NotFound();

        quote.Text = updatedQuote.Text;
        quote.Author = updatedQuote.Author;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote(int id)
    {
        var userId = GetUserId();
        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);
        if (quote == null) return NotFound();

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}