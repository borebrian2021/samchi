using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Core.Models.PublishedContent;
using System.Linq;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common.UmbracoContext;

namespace YourProjectNamespace.ViewComponents
{
    public class AllItemsViewComponent : ViewComponent
    {
        private readonly IUmbracoContextAccessor _umbracoContextAccessor;

        public AllItemsViewComponent(IUmbracoContextAccessor umbracoContextAccessor)
        {
            _umbracoContextAccessor = umbracoContextAccessor;
        }

        public IViewComponentResult Invoke()
        {
            // Get Umbraco context
            if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
            {
                return Content("No Umbraco context available.");
            }

            // Fetch content nodes by alias
            var items = umbracoContext.Content
                .GetAtRoot()
                .DescendantsOrSelfOfType("itemsDetailEach")
                .ToList();

            return View(items); // Pass into the component's view
        }
    }
}
