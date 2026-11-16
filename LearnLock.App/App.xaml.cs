using System;
using Microsoft.UI.Xaml;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Services;
using LearnLock.Database;
using LearnLock.Auth;
using LearnLock.Math;
using LearnLock.Timer;

namespace LearnLock_App
{
    public partial class App : Application
    {
        private Window? _window;

        public static IServiceProvider Services { get; private set; } = null!;
        public static MainWindow? MainWindowInstance { get; set; }

        public App()
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
            {
                try
                {
                    string path = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "LearnLock", "crash.log");
                    System.IO.File.WriteAllText(path, "AppDomain UnhandledException:\n" + args.ExceptionObject?.ToString());
                }
                catch { }
            };

            TaskScheduler.UnobservedTaskException += (sender, args) =>
            {
                try
                {
                    string path = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "LearnLock", "crash.log");
                    System.IO.File.AppendAllText(path, "\nTaskScheduler UnobservedTaskException:\n" + args.Exception?.ToString());
                    args.SetObserved();
                }
                catch { }
            };

            this.InitializeComponent();
            this.UnhandledException += App_UnhandledException;

            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            Services = serviceCollection.BuildServiceProvider();
        }

        private void App_UnhandledException(object sender, Microsoft.UI.Xaml.UnhandledExceptionEventArgs e)
        {
            try
            {
                string path = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "LearnLock", "crash.log");
                System.IO.File.WriteAllText(path, "WinUI UnhandledException:\n" + e.Exception?.ToString());
            }
            catch { }
            e.Handled = true; // Attempt to keep running or at least generate the log
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Database
            services.AddDbContext<LearnLockDbContext>(ServiceLifetime.Singleton);

            // Core services
            services.AddSingleton<IAuthService, AuthService>();
            services.AddSingleton<IMathService, MathService>();
            services.AddSingleton<ITimerService, TimerService>();
            services.AddSingleton<SystemMonitorService>();
            services.AddSingleton<AutoUpdateService>();
        }

        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            _window = new MainWindow();
            MainWindowInstance = (MainWindow)_window;

            using (var scope = Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<LearnLockDbContext>();
                context.Database.EnsureCreated();
                try
                {
                    Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.ExecuteSqlRaw(
                        context.Database, 
                        "ALTER TABLE ParentProfiles ADD COLUMN LockedFreeSubject TEXT DEFAULT ''"
                    );
                }
                catch { }

                try
                {
                    Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.ExecuteSqlRaw(
                        context.Database, 
                        "ALTER TABLE ParentProfiles ADD COLUMN ProtectedWindowsUsers TEXT DEFAULT ''"
                    );
                }
                catch { }

                try
                {
                    Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.ExecuteSqlRaw(
                        context.Database, 
                        "ALTER TABLE ParentProfiles ADD COLUMN IsBanned INTEGER DEFAULT 0"
                    );
                }
                catch { }

                try
                {
                    Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.ExecuteSqlRaw(
                        context.Database, 
                        "ALTER TABLE ChildProfiles ADD COLUMN AvatarEmoji TEXT DEFAULT '👦'"
                    );
                }
                catch { }
            }
            
            // Start the global app blocker
            var monitor = Services.GetRequiredService<SystemMonitorService>();
            monitor.StartMonitoring();
            
            _window.Activate();
        }
    }
}
