using System.ComponentModel.DataAnnotations;

namespace Mysamchi.Models
{
    public class LoginModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string RedirectUrl { get; set; } = "/admin-portal";
    }
}