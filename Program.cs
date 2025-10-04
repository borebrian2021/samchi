var builder = WebApplication.CreateBuilder(args);

// Configure the backoffice auth cookie BEFORE building Umbraco
builder.Services.ConfigureApplicationCookie(options =>
{
    // Make the Umbraco backoffice auth cookie valid for the whole domain
    options.Cookie.Path = "/";
});

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

var app = builder.Build();

await app.BootUmbracoAsync();
app.UseStaticFiles();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
