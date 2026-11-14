using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace IconMaker
{
    class Program
    {
        static void Main(string[] args)
        {
            string sourcePng = @"C:\Users\garakelyan\.gemini\antigravity-ide\brain\dc19e888-962e-4acb-8106-bf03ecdc8ee6\learnlock_app_icon_1784496579203.png";
            string assetsFolder = @"E:\antigravity\begrenzung\LearnLock.App\Assets";

            if (!File.Exists(sourcePng))
            {
                Console.WriteLine("Source PNG not found!");
                return;
            }

            using var original = Image.FromFile(sourcePng);

            // Generate AppIcon.ico (256x256 PNG inside ICO container)
            using (var ms = new MemoryStream())
            {
                using var bmp256 = ResizeImage(original, 256, 256);
                bmp256.Save(ms, ImageFormat.Png);
                byte[] pngBytes = ms.ToArray();

                using var fs = new FileStream(Path.Combine(assetsFolder, "AppIcon.ico"), FileMode.Create);
                using var bw = new BinaryWriter(fs);
                bw.Write((short)0); // reserved
                bw.Write((short)1); // type 1 = ico
                bw.Write((short)1); // 1 image
                bw.Write((byte)0);  // width 256
                bw.Write((byte)0);  // height 256
                bw.Write((byte)0);  // color count
                bw.Write((byte)0);  // reserved
                bw.Write((short)1); // color planes
                bw.Write((short)32);// bpp
                bw.Write((int)pngBytes.Length); // size
                bw.Write((int)22);  // offset
                bw.Write(pngBytes);
            }

            // Generate PNG Assets
            SaveResized(original, Path.Combine(assetsFolder, "StoreLogo.png"), 50, 50);
            SaveResized(original, Path.Combine(assetsFolder, "Square150x150Logo.scale-200.png"), 300, 300);
            SaveResized(original, Path.Combine(assetsFolder, "Square44x44Logo.scale-200.png"), 88, 88);
            SaveResized(original, Path.Combine(assetsFolder, "Square44x44Logo.targetsize-24_altform-unplated.png"), 24, 24);
            SaveResized(original, Path.Combine(assetsFolder, "Square44x44Logo.targetsize-48_altform-lightunplated.png"), 48, 48);
            SaveResized(original, Path.Combine(assetsFolder, "LockScreenLogo.scale-200.png"), 48, 48);

            // Special sizes
            SavePadded(original, Path.Combine(assetsFolder, "SplashScreen.scale-200.png"), 1240, 600, 300);
            SavePadded(original, Path.Combine(assetsFolder, "Wide310x150Logo.scale-200.png"), 620, 300, 200);

            Console.WriteLine("Successfully created all assets.");
        }

        static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);
            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }
            return destImage;
        }

        static void SaveResized(Image img, string path, int w, int h)
        {
            using var bmp = ResizeImage(img, w, h);
            bmp.Save(path, ImageFormat.Png);
        }

        static void SavePadded(Image img, string path, int w, int h, int iconSize)
        {
            var destImage = new Bitmap(w, h);
            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.Clear(Color.Transparent);
                using var iconBmp = ResizeImage(img, iconSize, iconSize);
                int x = (w - iconSize) / 2;
                int y = (h - iconSize) / 2;
                graphics.DrawImage(iconBmp, x, y);
            }
            destImage.Save(path, ImageFormat.Png);
        }
    }
}
