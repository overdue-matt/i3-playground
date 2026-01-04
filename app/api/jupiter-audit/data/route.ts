import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data', 'jupiter-audit');

    if (!existsSync(dataDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Read all files and return their data
    const allData = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = join(dataDir, filename);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return {
          filename,
          ...data,
        };
      })
    );

    // Sort by timestamp (most recent first)
    allData.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ files: allData });
  } catch (error) {
    console.error('Error reading data files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to read data files' },
      { status: 500 }
    );
  }
}
