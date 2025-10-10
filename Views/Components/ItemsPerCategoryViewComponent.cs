using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Core.Models.PublishedContent;
using System.Linq;
using Umbraco.Cms.Core.Web;
using System.Runtime.CompilerServices;

public class ItemsPerCategoryViewComponent : ViewComponent
{
    private readonly IUmbracoContextAccessor _umbracoContextAccessor;

    public ItemsPerCategoryViewComponent(IUmbracoContextAccessor umbracoContextAccessor)
    {

        _umbracoContextAccessor = umbracoContextAccessor;
    }

    public async Task<IViewComponentResult> InvokeAsync(string categoryName)
    {

        // Get Umbraco context
        if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
        {
            return Content("No Umbraco context available.");
        }
        // Fetch content nodes by alias
        var items = umbracoContext.Content.GetAtRoot()
            .DescendantsOrSelfOfType("itemsDetailEach").ToList();
        
        ViewBag.HomeValues= umbracoContext.Content.GetAtRoot().FirstOrDefault(x => x.ContentType.Alias == "home");

        return View(items); // Pass into the component's view
    }
}
