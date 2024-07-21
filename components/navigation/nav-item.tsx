"use client";
//non action comp, like image of joined servers
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavItem = ({ id, imageUrl, name }: NavItemProps) => {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push("/servers/" + id); //redirects to server that is clicked
  };
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group flex items-center relative">
        {/* this div creates dynamic bar that changes width when on an active server */}
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        {/* this div shows the servers available with image */}
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} className="object-cover" alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};
