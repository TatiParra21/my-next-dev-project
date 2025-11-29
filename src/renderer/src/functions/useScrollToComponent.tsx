import { useEffect } from "react";
import { RefObject } from "react";
export const useScrollToComponent=(ref:RefObject<HTMLElement | null>,trigger?:unknown,behavior:ScrollBehavior = "smooth"):void=>{
      console.log(
        "no scroll?"
      )
      useEffect(() => {
        if(ref)
       ref.current?.scrollIntoView({ behavior, block: "start" });
    }, [ref,behavior, trigger]);
    
}