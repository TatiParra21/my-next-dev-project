
export const handleError =(error:unknown,destination:string ):string=>{
   const prefix = `[${destination}]`;

  if (error instanceof Error) {
    const message = `${prefix} ${error.message}`;
    console.error(message, error); // ← also log the full error object (stack trace!)
    return message;
  }

  if (typeof error === "string") {
    const message = `${prefix} ${error}`;
    console.error(message);
    return message;
  }

  const message = `${prefix} Unknown error`;
  console.error(message, error);
  return message;
}