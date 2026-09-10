import { store } from '../../../server/services/store.service.ts';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageKey = url.searchParams.get('pageKey') || 'home';
  return Response.json(store.getSeoMetadata(pageKey));
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const pageKey = url.searchParams.get('pageKey') || 'home';
  const body = await req.json();
  const updated = store.updateSeoMetadata(pageKey, body);
  return Response.json({ metadata: updated });
}
