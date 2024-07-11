import ContentScreenMemo from "@/components/ContentScreen"
import Header from "@/components/Header"



function page() {
    return (
        <div className="h-screen">
            <Header className="h-[8%]"/>
            <main className="h-[92%]">
                <ContentScreenMemo/>
            </main>
        </div>
    )
}

export default page