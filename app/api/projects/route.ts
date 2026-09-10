import { store } from '../../../server/services/store.service.ts';

export async function GET() {
  return Response.json(store.getProjects());
}

export async function POST(req: Request) {
  const body = await req.json();
  const newProject = store.addProject(body);
  return Response.json(newProject, { status: 201 });
}
