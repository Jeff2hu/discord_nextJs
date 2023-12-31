import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new Response("Unauthorized", { status: 401 });
    if (!serverId) return new Response("ServerId missing", { status: 400 });
    if (name === "general")
      return new Response("Name can not be general", { status: 400 });
  } catch (err) {
    console.log("Channel POST Error: ", err);
    return new Response("Interval Error", { status: 500 });
  }
}
