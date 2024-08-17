import ColorPickerPopUp from "@/components/ColorPickerPopUp"
import ContentScreenMemo from "@/components/ContentScreen2"
import ScreenPopUp from "@/components/ScreenPopoUp"
import Header2 from "@/components/testHeader/Header2"



function page() {
    return (
        <>
        <div className="h-screen">
            <Header2/>
            <ContentScreenMemo />
        </div>
        <ScreenPopUp/>
        <ColorPickerPopUp/>
        </>
    )
}

export default page
