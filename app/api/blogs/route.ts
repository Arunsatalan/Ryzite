import { store } from '../../../server/services/store.service.ts';

export async function GET() {
  return Response.json(store.getBlogs());
}

export async function POST(req: Request) {
  const body = await req.json();
  const newBlog = store.addBlog(body);
  return Response.json(newBlog, { status: 201 });
}
