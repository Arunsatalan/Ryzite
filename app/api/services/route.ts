import { store } from '../../../server/services/store.service.ts';

export async function GET() {
  return Response.json(store.getServices());
}

export async function POST(req: Request) {
  const body = await req.json();
  const newService = store.addService(body);
  return Response.json(newService, { status: 201 });
}
