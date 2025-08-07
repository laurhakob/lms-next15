import {ReactNode} from "react";
import {DottedSeparator} from "@/components/dotted-separator";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            <DottedSeparator/>
            {children}
        </div>
    );
}