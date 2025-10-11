using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Web;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Web.Common.UmbracoContext;
using Umbraco.Cms.Persistence.EFCore;
namespace samtech.APIs
{
    public class DashboardController : SurfaceController
    {
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IUmbracoContextAccessor umbracoContextAccessor,
            IUmbracoDatabaseFactory databaseFactory,
            ServiceContext services,
            AppCaches appCaches,
            IProfilingLogger profilingLogger,
            IPublishedUrlProvider publishedUrlProvider,
            ILogger<DashboardController> logger)
            : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult submitLead(string name, string product)
        {
            // Log or store the inquiry
            _logger.LogInformation($"Inquiry received from {name} about {product}");

            // Optionally save to DB or send email

            // Return success (could be JSON or redirect)
            return Json(new { success = true });
        }



    }


    namespace samtech.Controllers
    {
        public class LeadsController : SurfaceController

        {
            private readonly IUmbracoContextAccessor _umbracoContextAccessor;
            private readonly IContentService _contentService;
            private readonly IUmbracoContextFactory _umbracoContextFactory;
            private readonly IContentTypeService _contentTypeService;
            private readonly IMemberManager _memberManager;
            private readonly IMemberService _memberService;
            private readonly Umbraco.Cms.Web.Common.UmbracoHelper _umbracoHelper;

            // ✅ Inject required services
            public LeadsController(

                IUmbracoContextAccessor umbracoContextAccessor,
                IUmbracoDatabaseFactory databaseFactory,
                 IContentTypeService contentTypeService,
                ServiceContext services,
                     Umbraco.Cms.Web.Common.UmbracoHelper umbracoHelper,
                AppCaches appCaches,
                IProfilingLogger profilingLogger,
                IPublishedUrlProvider publishedUrlProvider,
                IContentService contentService,
                 IMemberManager memberManager,
                IUmbracoContextFactory umbracoContextFactory,
                IMemberService memberService)
                : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
            {
                _contentService = contentService;
                _umbracoContextAccessor = umbracoContextAccessor;
                _umbracoContextFactory = umbracoContextFactory;
                _memberManager = memberManager;
                _memberService = memberService;
                _umbracoHelper = umbracoHelper;
            }

            [HttpPost]
            [IgnoreAntiforgeryToken]
            public IActionResult SubmitInquiry(string PhoneNumber, string ItemId, string OrderId, decimal Price, string ItemName, string ParentId, string LoyaltyPoints)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(OrderId))
                        return Json(new { success = false, message = "Order ID cannot be empty." });

                    string contentTypeAlias = "leadsManagement";
                    int parentId = int.TryParse(ParentId, out var id) ? id : -1;

                    // ✅ Create the content node
                    var newLead = _contentService.Create(OrderId, parentId, contentTypeAlias);

                    newLead.SetValue("orderId", OrderId);
                    newLead.SetValue("itemId", ItemId);
                    newLead.SetValue("itemName", ItemName);
                    newLead.SetValue("price", Price);
                    newLead.SetValue("loyaltyPoints", LoyaltyPoints);
                    newLead.SetValue("status", 0);

                    _contentService.Save(newLead);

                    // ✅ Publish invariant content type (no culture)
                    var publishResult = _contentService.Publish(newLead, Array.Empty<string>());

                    if (publishResult.Success)
                    {
                        return Json(new
                        {
                            success = true,
                            message = $"Lead '{OrderId}' created successfully.",
                            nodeId = newLead.Id
                        });
                    }

                    return Json(new { success = false, message = "Publishing failed." });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = ex.Message });
                }
            }

            [HttpPost]
            [IgnoreAntiforgeryToken]
            public async Task<IActionResult> RevokeClaim(int id)
            {
                try
                {
                    var currentMember = await _memberManager.GetCurrentMemberAsync();
                    if (currentMember == null)
                        return Unauthorized(new { success = false, message = "You must be logged in to revoke a claim." });

                    var lead = _contentService.GetById(id);
                    if (lead == null)
                        return NotFound(new { success = false, message = $"Lead with ID {id} not found." });

                    // ✅ Reverse the claim values
                    lead.SetValue("status", false);
                    lead.SetValue("claimedBy", string.Empty);
                    lead.SetValue("claimedOn", null);

                    _contentService.Save(lead);
                    _contentService.Publish(lead, Array.Empty<string>());

                    return Json(new { success = true, message = $"✅ Claim for Lead {id} has been successfully revoked." });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, message = ex.Message });
                }
            }

            [HttpPost]
            [IgnoreAntiforgeryToken]
            public IActionResult CreateAccount(  string OrderId, string WhatAppNumber,   int LoyaltyPointsEarned,    int NumberOfOrders,    string LastOrderDate,    string CreatedBy)
            {
                var umbracoContext1 = _umbracoContextAccessor.GetRequiredUmbracoContext();
                var parentNode1 = umbracoContext1.Content.GetByRoute("/loyalty-account-management/");
                //var parentNode = _contentService.GetRootContent().FirstOrDefault(x => x.ContentType.Alias == "loyaltyPointsParentAlias");
                //var contentType = _contentTypeService.Get("loyaltyPointsAccount");
                var contentTypeId = parentNode1?.Id;
                try
                {
                    var content = _contentService.Create(WhatAppNumber, parentNode1.Id, "loyaltyPointsAccount");
                    content.SetValue("orderId", OrderId);
                    content.SetValue("whatAppNumber", WhatAppNumber);
                    content.SetValue("loyaltyPointsEarned", LoyaltyPointsEarned);
                    content.SetValue("numberOfOrders", NumberOfOrders);
                    content.SetValue("lastOrderDate", LastOrderDate);
                    content.SetValue("createdBy", CreatedBy);

                    _contentService.Save(content);
                    _contentService.Publish(content, Array.Empty<string>());

                    return Json(new { success = true, message = $"Loyalty account for {WhatAppNumber} created successfully." });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, message = ex.Message });
                }
            }
            [HttpGet]
            public IActionResult CheckPhone(string phone)
            {
                if (string.IsNullOrWhiteSpace(phone))
                    return Json(new { exists = false });

                // 👇 Search for document type 'loyaltyPointsAccount' where 'whatAppNumber' contains the phone
                var content = _umbracoHelper
                    .ContentAtRoot()
                    .DescendantsOrSelfOfType("loyaltyPointsAccount")
                    .FirstOrDefault(x =>
                    {
                        var number = x.Value<string>("whatAppNumber");
                        return !string.IsNullOrEmpty(number) && number.Contains(phone);
                    });

                if (content != null)
                {
                    var name = content.Value<string>("customerName") ?? "Existing Loyalty Account";
                    return Json(new { exists = true, name });
                }

                return Json(new { exists = false });
            }


            [HttpPost]
            [IgnoreAntiforgeryToken]
            public async Task<IActionResult> ClaimLead(int id)
            {
                try
                {
                    // ✅ Await the member lookup
                    var currentMember = await _memberManager.GetCurrentMemberAsync();

                    if (currentMember == null)
                        return Unauthorized(new { success = false, message = "You must be logged in to claim a lead." });

                    var email = currentMember.Email ?? "(no email)";

                    var lead = _contentService.GetById(id);
                    if (lead == null)
                        return NotFound(new { success = false, message = $"Lead with ID {id} not found." });

                    // ✅ Update values
                    lead.SetValue("status", true);
                    lead.SetValue("claimedBy", email);
                    lead.SetValue("claimedOn", DateTime.Now);

                    _contentService.Save(lead);
                    _contentService.Publish(lead, Array.Empty<string>());

                    return Json(new { success = true, message = $"Lead {id} successfully claimed by {email}." });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, message = ex.Message });
                }
            }


            [HttpPost]
            [IgnoreAntiforgeryToken]
            public IActionResult CloseLeads(
            [FromForm] string phone,
            [FromForm] string closeTime,
            [FromForm] string closeType,
            [FromForm] string remarks,
            [FromForm] int itemId,
            [FromForm] int itemPrice)
            {
                try
                {
                    // ✅ 1. Try to find the loyalty account for the phone number
                    var loyaltyAccount = _umbracoHelper
                        .ContentAtRoot()
                        .DescendantsOrSelfOfType("loyaltyPointsAccount")
                        .FirstOrDefault(x => x.Value<string>("whatAppNumber") == phone);

                    // ✅ Always close the lead (even if account not found)
                    var lead = _contentService.GetById(itemId);
                    if (lead == null)
                        return Json(new { success = false, message = "Lead not found." });

                    // ✅ Convert closeTime properly
                    if (!DateTime.TryParse(closeTime, out var parsedCloseTime))
                        parsedCloseTime = DateTime.Now;

                    lead.SetValue("closedOn", parsedCloseTime);
                    lead.SetValue("closureStatus", closeType);
                    lead.SetValue("remarks", remarks);
                    lead.SetValue("closed", true);

                    if (closeType == "Successful")
                        lead.SetValue("closedSuccessfully", true);

                    _contentService.Save(lead);
                    _contentService.Publish(lead, Array.Empty<string>());

                    // ✅ 2. If the close was successful and a loyalty account exists → update it
                    if (closeType == "Successful" && loyaltyAccount != null)
                    {
                        var account = _contentService.GetById(loyaltyAccount.Id);
                        if (account == null)
                            return Json(new { success = false, message = $"Account with ID {loyaltyAccount.Id} not found." });

                        // ✅ Calculate and add loyalty points
                        double newPoints = itemPrice / 100.0;
                        double totalPoints = account.GetValue<double>("loyaltyPointsEarned") + newPoints;
                        int totalOrders = account.GetValue<int>("numberOfOrders") + 1;

                        account.SetValue("loyaltyPointsEarned", totalPoints);
                        account.SetValue("numberOfOrders", totalOrders);
                      

                        _contentService.Save(account);
                        _contentService.Publish(account, Array.Empty<string>());

                        return Json(new
                        {
                            success = true,
                            message = $"Lead closed successfully. Loyalty account updated with {newPoints} points."
                        });
                    }

                    // ✅ 3. If no loyalty account exists but close succeeded
                    if (closeType == "Successful" && loyaltyAccount == null)
                    {
                        return Json(new
                        {
                            success = true,
                            message = "Lead closed successfully, but no loyalty account found for this number."
                        });
                    }

                    // ✅ 4. If close was not successful
                    return Json(new { success = true, message = "Lead closed (unsuccessful closure)." });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = $"Error closing lead: {ex.Message}" });
                }
            }


            //[HttpPost]
            //[IgnoreAntiforgeryToken]
            //public async Task<IActionResult> CloseLead(int itemId, string closedBy, DateTime closeTime, string closeType, string remarks, string phone)
            //{

            //    if (string.IsNullOrWhiteSpace(phone))
            //        return Json(new { exists = false });

            //    // 👇 Search for document type 'loyaltyPointsAccount' where 'whatAppNumber' contains the phone
            //    var content = _umbracoHelper
            //        .ContentAtRoot()
            //        .DescendantsOrSelfOfType("loyaltyPointsAccount")
            //        .FirstOrDefault(x =>
            //        {
            //            var number = x.Value<string>("whatAppNumber");
            //            return !string.IsNullOrEmpty(number) && number.Contains(phone);
            //        });

            //    if (content != null)
            //    {

            //        if (closeType == "Successful")
            //        {
            //            var lead1 = _contentService.GetById(content.Id);
            //            if (lead1 == null)
            //                return NotFound(new { success = false, message = $"Lead with ID {content.Id} not found." });
            //            int initialPoints = lead1.Value<int>("loyaltyPointsEarned");
            //            // ✅ Update values
            //            lead1.SetValue("status", true);
            //            lead1.SetValue("claimedBy", email);
            //            lead1.SetValue("claimedOn", DateTime.Now);

            //            _contentService.Save(lead1);
            //            _contentService.Publish(lead1, Array.Empty<string>());



            //            try
            //            {
            //                // ✅ Get the content node (lead) by its ID
            //                var lead = _contentService.GetById(itemId);
            //                if (lead == null)
            //                    return Json(new { success = false, message = "Lead not found." });

            //                // ✅ Update field values (make sure these aliases match your Umbraco document type)
            //                lead.SetValue("closedOn", closeTime);
            //                lead.SetValue("closureStatus", closeType);
            //                if (remarks == "Successful")
            //                {
            //                    lead.SetValue("closedSuccessfully", true);

            //                }
            //                lead.SetValue("remarks", remarks);
            //                lead.SetValue("closed", true); // mark as closed

            //                // ✅ Save and publish
            //                _contentService.Save(lead);
            //                _contentService.Publish(lead, Array.Empty<string>());

            //                return Json(new { success = true, message = "Lead closed successfully." });
            //            }
            //            catch (Exception ex)
            //            {
            //                // 🔴 Handle errors
            //                return Json(new
            //                {
            //                    success = false,
            //                    message = $"Error closing lead: {ex.Message}"
            //                });
            //            }
            //        }
            //        else
            //        {


            //        }
            //    }



            //}


        }
    }
}