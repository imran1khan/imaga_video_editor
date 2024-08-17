import { GitHubLogoIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { CreditCard, FolderOpen, Keyboard, Moon, PenIcon, Pipette, Settings, Sun, User } from 'lucide-react'
import useToggelThem from '../ToggelThem/ToggelThem';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { colorPickerAtom, ColorPickerPopUpAtom, selectedColorAtom } from '@/packages/store/drawingAtom/ColorPickerAtom';

const style = 'w-7 h-7 rounded-sm cursor-pointer hover:outline hover:outline-1 dark:hover:outline-white hover:outline-gray-950';
function HamMenu2() {
  const [hide,setHide]=useState(true);
  const [colorPickHide,setColorPickHide]=useState(true);
  const { Theme, setTheme } = useToggelThem();
  const [ColorList,setColorList] = useRecoilState(colorPickerAtom);
  const [color, setColor] = useRecoilState(selectedColorAtom);
  const showColorPicker = useSetRecoilState(ColorPickerPopUpAtom);
  const showDiv = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    showColorPicker((p) => {
      let display = ''
      if (p.display === 'none') {
        display = 'block'
      }
      else {
        display = 'none'
      }
      return { ...p, display, color: color }
    });
  }

  const SaveColor=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    const newArr = [...ColorList];
    if (newArr.length>=5) {
      newArr.pop();
    }
    const arr = [color,...newArr]
    setColorList(arr);
  };
  const deleteColor=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    const newColorList = ColorList.filter((val)=> val !== color)
    // i want at least 5 color so i am adding a color 
    setColorList(newColorList);
  }
  return (
    <div className='relative'>
      <Button onClick={()=>{setHide(p=>!p)}} className='dark:bg-slate-900 bg-slate-400' variant={'outline'}><HamburgerMenuIcon width={15} height={15} /></Button>
      <div hidden={hide} className='absolute w-[14rem] h-[20rem] bg-gray-400 dark:bg-gray-900 mt-2 rounded-sm p-2'>
        {
          menuList.map((val, i) => (<DropMenu key={val.shortcut + i} icon={val.icon} shortcut={val.shortcut} title={val.title} />))
        }
        <div className='flex justify-between'>
          <span>Theme</span>
          <div className='space-x-1'>
            <Button onClick={() => { setTheme(true) }} className={`cursor-pointer bg-purple-600 dark:bg-slate-700 dark:hover:bg-slate-500 h-6`}>
              <Sun className="h-4 w-4 text-white" />
            </Button>
            <Button onClick={() => { setTheme(false) }} className={`cursor-pointer bg-slate-500 dark:bg-purple-600 dark:hover:bg-slate-400 h-6`}>
              <Moon className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        <div className='space-y-1 relative'>
          <span>canvas background</span>
          <div className='flex gap-2'>
            {ColorList.map((val, i) => (<div key={val + i} style={{ backgroundColor: val }} onClick={() => { setColor(val) }} className={style}></div>))}
            <div className='dark:bg-slate-400 bg-slate-800 h-8 w-[0.5px]'></div>
            <div onClick={()=>{setColorPickHide(p=>!p)}} style={{ backgroundColor: color }} className={style}></div>
          </div>
          {/* tooltip color selector */}
          <div hidden={colorPickHide} className='dark:bg-slate-900 bg-slate-400 w-[12rem] h-[7rem] absolute top-[1.7rem] left-[14rem] rounded-md p-2'>
            <div style={{ fontSize: '0.8rem' }} className='font-thin'>Hex code</div>
            <div className='border border-gray-50 h-[2rem] rounded-md flex'>
              <div className='flex-grow flex justify-center items-center'><span>{color}</span></div>
              <div onClick={showDiv} className='w-8 h-auto dark:hover:bg-slate-700 flex justify-center items-center rounded-r-md cursor-pointer'><Pipette className="h-4 w-4" /></div>
            </div>
            <div className='py-2 flex justify-between'>
              <Button onClick={deleteColor} className='w-[3.5rem] h-[2rem] text-red-600' variant={'outline'}>delet</Button>
              <Button onClick={SaveColor} className='w-[3.5rem] h-[2rem]' variant={'outline'}>save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// function HamMenu2() {
//   const { Theme, setTheme } = useToggelThem();
//   const [ColorList, setColorList] = useRecoilState(colorPickerAtom);
//   const [color, setColor] = useRecoilState(selectedColorAtom);
//   const showColorPicker = useSetRecoilState(ColorPickerPopUpAtom);
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//     const showDiv = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//       showColorPicker((p) => {
//         let display = ''
//         if (p.display === 'none') {
//           display = 'block'
//         }
//         else {
//           display = 'none'
//         }
//         return { ...p, display, color: color }
//       });
//     }

//   const toggleMenu = () => {
//     setIsMenuVisible(prev => !prev);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//       setIsMenuVisible(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const SaveColor = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     const newArr = [...ColorList];
//     if (newArr.length >= 5) {
//       newArr.pop();
//     }
//     const arr = [color, ...newArr];
//     setColorList(arr);
//   };

//   const deleteColor = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     const newColorList = ColorList.filter((val) => val !== color);
//     setColorList(newColorList);
//   };

//   return (
//     <div className='relative'>
//       <Button className='dark:bg-slate-900 bg-slate-400' variant={'outline'} onClick={toggleMenu}>
//         <HamburgerMenuIcon width={15} height={15} />
//       </Button>
//       {isMenuVisible && (
//         <div ref={menuRef} className='absolute w-[14rem] h-[20rem] bg-gray-400 dark:bg-gray-900 mt-2 rounded-sm p-2'>
//           {
//             menuList.map((val, i) => (
//               <DropMenu key={val.shortcut + i} icon={val.icon} shortcut={val.shortcut} title={val.title} />
//             ))
//           }
//           <div className='flex justify-between'>
//             <span>Theme</span>
//             <div className='space-x-1'>
//               <Button onClick={() => { setTheme(true) }} className={`cursor-pointer bg-purple-600 dark:bg-slate-700 dark:hover:bg-slate-500 h-6`}>
//                 <Sun className="h-4 w-4 text-white" />
//               </Button>
//               <Button onClick={() => { setTheme(false) }} className={`cursor-pointer bg-slate-500 dark:bg-purple-600 dark:hover:bg-slate-400 h-6`}>
//                 <Moon className="h-4 w-4 text-white" />
//               </Button>
//             </div>
//           </div>
//           <div className='space-y-1 relative'>
//             <span>canvas background</span>
//             <div className='flex gap-2'>
//               {ColorList.map((val, i) => (
//                 <div key={val + i} style={{ backgroundColor: val }} onClick={() => { setColor(val) }} className={style}></div>
//               ))}
//               <div className='dark:bg-slate-400 bg-slate-800 h-8 w-[0.5px]'></div>
//               <div style={{ backgroundColor: color }} className={style}></div>
//             </div>
//             {/* tooltip color selector */}
//             <div className='dark:bg-slate-900 bg-slate-400 w-[12rem] h-[7rem] absolute top-[1.7rem] left-[14rem] rounded-md p-2'>
//               <div style={{ fontSize: '0.8rem' }} className='font-thin'>Hex code</div>
//               <div className='border border-gray-50 h-[2rem] rounded-md flex'>
//                 <div className='flex-grow flex justify-center items-center'><span>{color}</span></div>
//                 <div onClick={showDiv} className='w-8 h-auto dark:hover:bg-slate-700 flex justify-center items-center rounded-r-md cursor-pointer'>
//                   <Pipette className="h-4 w-4" />
//                 </div>
//               </div>
//               <div className='py-2 flex justify-between'>
//                 <Button onClick={deleteColor} className='w-[3.5rem] h-[2rem] text-red-600' variant={'outline'}>delete</Button>
//                 <Button onClick={SaveColor} className='w-[3.5rem] h-[2rem]' variant={'outline'}>save</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

export default HamMenu2

interface prop {
  icon: React.JSX.Element;
  title: string;
  shortcut: string;
}
function DropMenu({ icon, shortcut, title }: prop) {

  return (
    <div className='flex justify-between text-sm cursor-pointer hover:bg-slate-800 rounded-md p-2'>
      <div className='flex items-center'>
        {icon}
        <span>{title}</span>
      </div>
      <span>{shortcut}</span>
    </div>
  )
}
const menuList = [
  {
    icon: <FolderOpen className="mr-2 h-4 w-4" />,
    title: 'open',
    shortcut: '⇧⌘P'
  },
  {
    icon: <User className="mr-2 h-4 w-4" />,
    title: 'profile',
    shortcut: '⇧⌘P'
  },
  {
    icon: <CreditCard className="mr-2 h-4 w-4" />,
    title: 'Billing',
    shortcut: '⇧⌘P'
  },
  {
    icon: <Settings className="mr-2 h-4 w-4" />,
    title: 'settings',
    shortcut: '⇧⌘P'
  },
  {
    icon: <Keyboard className="mr-2 h-4 w-4" />,
    title: 'download image',
    shortcut: '⇧⌘P'
  },
  {
    icon: <GitHubLogoIcon className="mr-2 h-4 w-4" />,
    title: 'GitHub',
    shortcut: '⇧⌘P'
  },
]