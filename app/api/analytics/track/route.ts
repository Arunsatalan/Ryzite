import { store } from '../../../../server/services/store.service.ts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ev = store.addAnalyticsEvent(body);
    return Response.json(ev, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to record event' }, { status: 400 });
  }
}
