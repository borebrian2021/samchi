using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Cms.Web.Common.Security;
using System.Threading.Tasks;
using Mysamchi.Models;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Persistence;

namespace Mysamchi.Controllers
{
    public class MemberController : SurfaceController
    {
        private readonly IMemberSignInManager _memberSignInManager;

        public MemberController(
            IUmbracoContextAccessor umbracoContextAccessor,
            IUmbracoDatabaseFactory databaseFactory,
            ServiceContext services,
            AppCaches appCaches,
            IProfilingLogger profilingLogger,
            IPublishedUrlProvider publishedUrlProvider,
            ILogger<MemberController> logger,
            IUmbracoHelperAccessor umbracoHelperAccessor,
            IMemberSignInManager memberSignInManager)
            : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
            _memberSignInManager = memberSignInManager;
        }


        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
                return CurrentUmbracoPage();

            var result = await _memberSignInManager.PasswordSignInAsync(model.Username, model.Password, true, false);

            if (result.Succeeded)
                return Redirect(model.RedirectUrl ?? "/admin-portal");

            TempData["LoginError"] = "Invalid username or password.";
            return CurrentUmbracoPage();
        }

        [HttpPost]
        public async Task<IActionResult> Logout(string redirectUrl = "/")
        {
            await _memberSignInManager.SignOutAsync();
            return Redirect(redirectUrl);
        }
    }
}