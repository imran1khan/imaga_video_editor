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
import { Cloud, CreditCard, FolderOpen, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, Users } from 'lucide-react'
import { ImageFileAtom } from "@/packages/store/atoms/ImageFileAtom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { downloadImageFile } from "@/packages/store/atoms/DownLoadImage"


function HamMenu() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const setImageFile = useSetRecoilState(ImageFileAtom);
    const fileInputFunction = useCallback((e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!fileInputRef.current || !fileInputRef) {
            return;
        }
        const fileinput = fileInputRef.current;
        console.log('click')
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
            setImageFile(file);
        }
    }, [setImageFile]);
    const setDownLoadImageFile = useSetRecoilState(downloadImageFile);
    const downloadImageFunction=useCallback(async(e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        setDownLoadImageFile(true);
    },[setDownLoadImageFile]);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><HamburgerMenuIcon width={15} height={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ml-4">
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
                        <input ref={fileInputRef} type="file" accept="image/*" src="" alt="" hidden />
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