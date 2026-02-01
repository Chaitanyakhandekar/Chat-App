import {create} from "zustand"
import { devtools, persist } from "zustand/middleware";

export const userAuthStore = create(
    devtools(
        (set)=>(
    {
        user:null,

        setUser:(newUser)=>(
          set({user:newUser})
        )
    }
)
    )
)