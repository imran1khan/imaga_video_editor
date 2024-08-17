`use client`
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

import React, { useCallback, useRef } from 'react'
import { Button } from '../ui/button'
import { GitHubLogoIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Cloud, CreditCard, FolderOpen, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Moon, Plus, PlusCircle, Settings, Sun, User, UserPlus, Users } from 'lucide-react'
import { ImageFileAtom, ImageFileListAtom } from "@/packages/store/atoms/ImageFileAtom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage"
import useToggelThem from "../ToggelThem/ToggelThem"


function HamMenu() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // const setImageFile = useSetRecoilState(ImageFileAtom);
    const setImageElement = useSetRecoilState(ImageFileListAtom);
    const fileInputFunction = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!fileInputRef.current || !fileInputRef) {
            return;
        }
        const fileinput = fileInputRef.current;
        fileinput.click();
        fileinput.onchange = () => {
            if (!fileinput.files || fileinput.files.length < 1) {
                console.log(`file is either null or no value ${fileinput.files}`);
                return;
            }
            const file = fileinput.files[0];
            if (!file) {
                console.log(`no fil found ${file}`);
                return;
            }
            // setImageFile(file);

            // setting the image on the imageList Atom for testing
            const image = new Image();
            const objUrl = URL.createObjectURL(file);
            image.src = objUrl;
            image.onload = () => {
                setImageElement((p) => {
                    return [image, ...p]
                });
            }
        }
    }, [setImageElement]);
    const setDownLoadImageFile = useSetRecoilState(downloadImageFile);
    const downloadImageFunction = useCallback(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setDownLoadImageFile(true);
    }, [setDownLoadImageFile]);
    const {Theme,setTheme}=useToggelThem();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="dark:bg-slate-900 bg-slate-400">
                <Button variant="outline"><HamburgerMenuIcon width={15} height={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ml-4 dark:bg-slate-900 bg-slate-400">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={fileInputFunction}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        <input ref={fileInputRef} type="file" accept="image/*" src="" alt="" className="hidden" />
                        <span>open</span>
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
                            <DropdownMenuSubContent className="bg-slate-400 dark:bg-slate-900">
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
                    <GitHubLogoIcon className="mr-2 h-4 w-4" />
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
                <DropdownMenuItem onClick={(e)=>{e.preventDefault()}}>
                    <span>Theme</span>
                    <DropdownMenuShortcut className="space-x-1">
                        <Button onClick={()=>{setTheme(true)}} className={`cursor-pointer bg-purple-600 dark:bg-slate-700 dark:hover:bg-slate-500 h-6`}>
                            <Sun className="h-4 w-4 text-white" />
                        </Button>
                        <Button onClick={()=>{setTheme(false)}} className={`cursor-pointer bg-slate-500 dark:bg-purple-600 dark:hover:bg-slate-400 h-6`}>
                            <Moon className="h-4 w-4 text-white" />
                        </Button>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col">
                    <span className="self-start">Canvas Background</span>
                    <input type="color" name="" id="" />
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-purple-950"></div>
                        <div className="w-8 h-8 bg-purple-950"></div>
                        <div className="w-8 h-8 bg-purple-950"></div>
                        <div className="w-8 h-8 bg-purple-950"></div>
                        <div className="w-8 h-8 bg-purple-950"></div>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HamMenu