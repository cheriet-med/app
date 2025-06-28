import Image from "next/image"


export default function med (){
return (
   <div className="h-dvh w-full sm:col-span-1 relative flex items-center bg-secondary">
        <Image src="/og/og.png"
         alt="tag"
         fill
          sizes="100vw" 
          className="z-0 object-cover" 
          quality={85}  
          
        
          priority />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="absolute sm:bottom-10 mx-5 lg:mx-10 px-1 shadow-lg">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-8">hello</h1>
          <p className="max-w-5xl text-white sm:text-lg">hello world</p>
        </div>
      </div>
)
}