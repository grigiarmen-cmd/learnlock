import { NextResponse } from "next/server";

export async function GET() {
  // Google Drive file ID
  const fileId = "1SbOZ9wmNcN6EhIcl3EsU-_TvL0BQTOUe";
  
  // Direct Google Drive download URL
  const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
  
  return NextResponse.redirect(driveDownloadUrl, 302);
}
