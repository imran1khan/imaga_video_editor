"use client"
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    Lock,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import Image from "next/image"
import { Button } from "@/components/ui/button"

import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import React, { useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRecoilState, useSetRecoilState } from "recoil"
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage"




function Header({className}:{className?:string}) {
    const [downloadImage,setDownLoadImageFile] = useRecoilState(downloadImageFile);
    const downloadImageFunction=useCallback(async(e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        setDownLoadImageFile(Math.random().toString());// this section is just for cleanup and restart
    },[setDownLoadImageFile]);
    return (
        <div className={`flex bg-blue-900 justify-evenly items-center py-2 ${className}`}>
            <div><Image className="bg-slate-300 rounded-md p-2" width={80} height={80} src={`https://www.iloveimg.com/img/iloveimg.svg`} alt="" /></div>
            {data.list.map((v, i) => (
                <Button className="uppercase" variant={'ghost'} key={i + v.Title}>
                    {v.Title}
                </Button>
            ))}
            <NavigationMenu ngClass={"left-[-70rem]"}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>MORE TOOLS</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="grid w-[70%] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:grid-cols-5 lg:w-[1500px]">
                                {
                                    data.nav_data.map((v, i) => (
                                        <div key={v.Category + i.toString()}>
                                            <div className="uppercase p-2 font-bold">{v.Category}</div>
                                            <div className="h-auto">
                                                {
                                                    v.Action.map((v, i) => (<div className="h-[50%] p-4 rounded-md cursor-pointer hover:bg-[#0f1a33]" key={v.contentName + i}>{v.contentName}</div>))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            {/* hamberger menu */}
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost"><HamburgerMenuIcon width={20} height={20} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Keyboard className="mr-2 h-4 w-4" />
                                <span>Keyboard shortcuts</span>
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={downloadImageFunction}>
                                <Keyboard className="mr-2 h-4 w-4" />
                                <span>download image</span>
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Invite users</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            <span>Email</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            <span>Message</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            <span>More...</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                <span>New Team</span>
                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Github className="mr-2 h-4 w-4" />
                            <span>GitHub</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Cloud className="mr-2 h-4 w-4" />
                            <span>API</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Header

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const data = {
    list: [
        {
            Title: "compressed image"
        },
        {
            Title: "resize image"
        },
        {
            Title: "crope image"
        },
        {
            Title: "convert to jpg"
        },
        {
            Title: "photo editor"
        },
    ],
    nav_data: [
        {
            Category: "Optimize",
            Action: [
                {
                    contentName: "Compress IMAGE"
                },
                {
                    contentName: "Upscale"
                },
                {
                    contentName: "Remove background"
                }
            ]
        },
        {
            Category: "Create",
            Action: [
                {
                    contentName: "Meme generator"
                },
                {
                    contentName: "Photo editor"
                },
            ]
        },
        {
            Category: "Modify",
            Action: [
                {
                    contentName: "Rotate IMAGE"
                },
                {
                    contentName: "Crop IMAGE"
                },
                {
                    contentName: "Resize IMAGE"
                },
            ]
        },
        {
            Category: "Convert",
            Action: [
                {
                    contentName: "Convert to JPG"
                },
                {
                    contentName: "Convert to PNG"
                },
                {
                    contentName: "HTML to IMAGE"
                },
            ]
        },
        {
            Category: "Security",
            Action: [
                {
                    contentName: "Watermark IMAGE"
                },
                {
                    contentName: "Blur face"
                },
            ]
        },
    ]
}

