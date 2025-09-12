"use client"
import { Trash, Copy, Edit, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BillboardColumn } from "./colums"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuLabel
 } from "@/components/ui/dropdown-menu";

interface CellActionProps {
    data: BillboardColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
     data
 }) => {

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Billboard ID copied to clipboard.");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );   
};