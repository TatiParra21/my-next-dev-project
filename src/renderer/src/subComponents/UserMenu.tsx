import {
  Avatar,
  HStack,
  HoverCard,
  Link,
  Portal,
  Stack,
  Text, Button, 
} from "@chakra-ui/react"
import { googleAuthStore, selectLogout } from "@renderer/store/projectStore"
export const Logout =({handleLogout}:{handleLogout:  () => Promise<void>}) =>{
  return (
    <HStack>
      <Button onClick={handleLogout} >Logout</Button>
    </HStack>
  )
}
"use client"
const AvatarComponent =()=>{
  return(
        <Avatar.Root colorPalette="red">
                  <Avatar.Fallback />               
        </Avatar.Root>
  )
}

export const UserMenu =({email}:{email:string})=>{
  const logOut = googleAuthStore(selectLogout)
    const handleLogout=async()=>{
      await logOut()
    }
    return(
    <HoverCard.Root size="sm">
      <HoverCard.Trigger asChild>
        <Link href="#">
           <AvatarComponent/>    
        </Link>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow />
            <Stack gap="4" direction="row">
              <AvatarComponent/>
              <Stack gap="3">
                <Stack gap="1">
                  <Text textStyle="sm" color="black" fontWeight="semibold">
                    {email}
                  </Text>
                   <Logout handleLogout={handleLogout} /> 
                </Stack>
              
              </Stack>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
    )
}