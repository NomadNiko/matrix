import { NextRequest, NextResponse } from 'next/server';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const LOG_DIR = join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, 'api-data.log');

async function ensureLogFile() {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true });
  }
  if (!existsSync(LOG_FILE)) {
    await writeFile(LOG_FILE, '');
  }
}

async function logRequest(
  method: string,
  url: string,
  headers: Headers,
  body: unknown
) {
  await ensureLogFile();

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method,
    url,
    headers: Object.fromEntries(headers.entries()),
    body,
  };

  const logLine = `\n${JSON.stringify(logEntry, null, 2)}\n${'='.repeat(80)}\n`;

  await appendFile(LOG_FILE, logLine);
}

async function handleRequest(request: NextRequest) {
  try {
    const method = request.method;
    const url = request.url;
    const headers = request.headers;

    let body: unknown = null;
    try {
      const text = await request.text();
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = text;
        }
      }
    } catch {
      body = null;
    }

    // Log everything
    await logRequest(method, url, headers, body);

    return NextResponse.json(
      {
        success: true,
        message: 'Data received and logged',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}
