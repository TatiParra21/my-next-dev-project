
export const handleError =(error:unknown,destination:string ):string=>{
    let message: string
    if (error instanceof Error) {
        message = `${destination}: ${error.message}`
    } else if (typeof error === 'string') {
        message = `Error in ${destination}: ${error}`
    } else {
        message = `${destination}: An unknown error occurred` 
        
    }
    console.error(message);
    return message
}