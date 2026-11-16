import { NextResponse } from "next/server";

// Central dynamic version configuration
// In the future, to release an update, just update latestVersion or downloadUrl here!
export async function GET() {
  return NextResponse.json({
    latestVersion: "v2.5.0",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1SbOZ9wmNcN6EhIcl3EsU-_TvL0BQTOUe",
    viewUrl: "https://drive.google.com/file/d/1SbOZ9wmNcN6EhIcl3EsU-_TvL0BQTOUe/view?usp=sharing",
    releaseNotes: "Zentralanpassung aller Lernanforderungen (Fachanforderungen SH), verbessertes UI mit Textumbruch, Direktzugriff ins Dashboard und Bann-System.",
    publishedAt: new Date().toISOString()
  });
}
