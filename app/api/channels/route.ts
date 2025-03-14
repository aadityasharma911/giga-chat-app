import { currentProf } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    ) {
    try {
        const profile = await currentProf();
        const { name, type } = await req.json();
        const { searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!serverId){
            return new NextResponse("Server ID missing", {status: 400})
        }
//if user somehow bypasses frontend validation , only one 'general' channel
        if (name === "general"){
            return new NextResponse("Channel name cannot be 'general'", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in:[MemberRole.MODERATOR, MemberRole.ADMIN]
                        }//only members who are admin or moderator
                    }
                }
            },
            data:{
                channels: {
                    create:{
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        })

        return NextResponse.json(server);
        
    } catch (error) {
        console.log("[CHANNELS_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}