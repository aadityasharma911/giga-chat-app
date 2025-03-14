import { currentProf } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4 } from "uuid"
//return a new invite link
export async function PATCH(
    req: Request, 
    {params}: {params: {serverId: string} })
    {
    try {
        const profile = await currentProf()
        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!params.serverId){
            return new NextResponse("Bad Request", {status: 400})
        }

        const server = await db.server.update({
            where:{
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4()
            }
        });
        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVERS_PATCH]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}