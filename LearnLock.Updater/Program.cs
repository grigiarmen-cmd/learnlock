using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Threading;

namespace LearnLock.Updater
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 4)
            {
                Console.WriteLine("Usage: LearnLock.Updater <pid> <zipPath> <extractPath> <exeToStart>");
                return;
            }

            int pid = int.Parse(args[0]);
            string zipPath = args[1];
            string extractPath = args[2];
            string exeToStart = args[3];

            Console.WriteLine($"Waiting for LearnLock (PID: {pid}) to exit...");
            try
            {
                var process = Process.GetProcessById(pid);
                process.WaitForExit(10000); // wait up to 10 seconds
            }
            catch (Exception ex)
            {
                // Process might already be dead
                Console.WriteLine($"Process already exited or not found: {ex.Message}");
            }

            // Wait a little extra to ensure file locks are released
            Thread.Sleep(1000);

            try
            {
                Console.WriteLine($"Extracting {zipPath} to {extractPath}...");
                // Extracting and overwriting
                using (var archive = ZipFile.OpenRead(zipPath))
                {
                    foreach (var entry in archive.Entries)
                    {
                        string destinationPath = Path.GetFullPath(Path.Combine(extractPath, entry.FullName));

                        // Security check to ensure zip slip vulnerability is prevented
                        if (destinationPath.StartsWith(extractPath, StringComparison.Ordinal))
                        {
                            if (string.IsNullOrEmpty(entry.Name))
                            {
                                Directory.CreateDirectory(destinationPath);
                            }
                            else
                            {
                                Directory.CreateDirectory(Path.GetDirectoryName(destinationPath)!);
                                // Skip extracting the updater over itself to prevent locked file errors
                                if (destinationPath.EndsWith("LearnLock.Updater.exe", StringComparison.OrdinalIgnoreCase) || 
                                    destinationPath.EndsWith("LearnLock.Updater.dll", StringComparison.OrdinalIgnoreCase))
                                {
                                    continue;
                                }
                                entry.ExtractToFile(destinationPath, overwrite: true);
                            }
                        }
                    }
                }

                Console.WriteLine("Update extracted successfully. Cleaning up...");
                File.Delete(zipPath);

                Console.WriteLine($"Starting {exeToStart}...");
                Process.Start(new ProcessStartInfo
                {
                    FileName = exeToStart,
                    WorkingDirectory = extractPath,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Update failed: {ex.Message}");
                Console.ReadLine(); // Keep window open to see error
            }
        }
    }
}
