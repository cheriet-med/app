import Image from "next/image"


export default function hompage() {
  return (

       <div className="h-dvh w-full sm:col-span-1 relative flex items-center bg-secondary">
            <Image src="/her.jpg"
             alt="logo"
             fill
              sizes="100vw" 
              className="z-0 object-cover" 
              quality={85}  
              
            
              priority />
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <div className="absolute sm:bottom-10 mx-5 lg:mx-72 px-1 shadow-lg">
              <h1 className="text-xl md:text-3xl font-bold text-white mb-8 uppercase">Building trust, one verified review at a time. </h1>
           
            </div>
          </div>
  )
}