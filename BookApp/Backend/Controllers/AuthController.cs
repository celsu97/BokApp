using BookApp.Backend.Data;
using BookApp.Backend.DTOs;
using BookApp.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookApp.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest("Username already exists.");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Lägg till 5 startcitat åt den nya användaren
        var defaultQuotes = new List<Quote>
        {
            new Quote { Text = "Vara eller icke vara, det är frågan.", Author = "William Shakespeare", UserId = user.Id },
            new Quote { Text = "Jag tänker, alltså finns jag.", Author = "René Descartes", UserId = user.Id },
            new Quote { Text = "Det enda jag vet är att jag ingenting vet.", Author = "Sokrates", UserId = user.Id },
            new Quote { Text = "Var den förändring du vill se i världen.", Author = "Mahatma Gandhi", UserId = user.Id },
            new Quote { Text = "Livet är vad som händer medan du är upptagen med att göra andra planer.", Author = "John Lennon", UserId = user.Id }
        };

        _context.Quotes.AddRange(defaultQuotes);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse { Token = token, Username = user.Username });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}