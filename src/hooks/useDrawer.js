import { useState } from "react";

export default function useDrawer(){
    const[visible,setVisible] = useState(false);

    function open(){
        setVisible(true);
    }
    function close(){
        setVisible(false);
    }

    return {visible,open,close}
}