'use client'
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import UserMenu from "@/components/user-dashboard/menu";
import Image from "next/image";
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";
import { FaCopy } from "react-icons/fa"; // Import FaCopy
import { FaOpencart } from "react-icons/fa6";
import useFetchOrdersUser from "@/components/user-dashboard/FetcherGlobalOrderForUser";
import WriteReview from "@/components/user-dashboard/writeReview";
import SuggestionsProducts from '@/components/products/SuggestionProducts';
import ReturnDemand from "@/components/user-dashboard/return";


export default function Orders () {
    const [isCopied, setIsCopied] = useState<string | null>(null);; // Track if password is copied
 const t = useTranslations('cart-c')
 const te = useTranslations('orders')
    const router = useRouter(); // Initialize the router


    const [stat, setStat] = useState("pending");; // Track if password is copied
    const { order,error, isLoading } = useFetchOrdersUser();
    const { data: session, status } = useSession({ required: true });
//console.log(posts)
const l = useLocale();
const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const orderuser = order.filter(post => post.user === Number(session?.user.id));

const pendingCount = orderuser.filter(post => post.status === 'pending').length;
const shippedCount = orderuser.filter(post => post.status === 'shipped').length;
const completedCount = orderuser.filter(post => post.status === 'completed').length;
const returnCount = orderuser.filter(post => post.status === 'return').length;

const fetsh = orderuser.filter(post => post.status === stat)


const handleCopyPassword = (i:string) => {
    if (i) {
      navigator.clipboard.writeText(i)
        .then(() => {
          setIsCopied(i); // Show "Copied!" text
          setTimeout(() => setIsCopied(null), 2000); // Hide "Copied!" text after 2 seconds
        })
        .catch(() => {
          console.error(te('filed')); // Handle error
        });
    }
  };










  const handleSubmit = async (id:number, user:number, product:number) => {
  

        const orderItem = {
          user:user,
          product:product,
          updated_at: today,
          status: "completed",
        };

        //console.log("Posting item:", orderItem);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItem),
        });

        const responseText = await response.text();
        
        if (!response.ok) {
          console.error("Error posting item:", responseText);
        }
        setStat("completed")
        window.location.reload()
  };



  const handleDelete = async (id:number, user:number, product:number) => {
  

    const orderItem = {
      user:user,
      product:product,
      status: "hide",
    };

    //console.log("Posting item:", orderItem);

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderItem),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("Error posting item:", responseText);
    }
    window.location.reload()
};



    return (
    <div>
              <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
            <div className="grid lg:grid-cols-4 gap-10 mt-6">
            <div className=" lg:col-span-1 ">
            <UserMenu/>
            </div>
          
            <div className="lg:col-span-3 space-y-4 ">
<div className="flex gap-10 border border-spacing-1 p-3 flex-wrap">
    <p onClick={()=>setStat("pending")} className="cursor-pointer hover:text-bl capitalize">{te('pending')} {"("} {pendingCount} {")"}</p>
    <p onClick={() => setStat("shipped")} className="cursor-pointer hover:text-bl capitalize">{te('shipped')} {"("} {shippedCount} {")"}</p>
    <p onClick={() => setStat("completed")} className="cursor-pointer hover:text-bl capitalize">{te('completed')} {"("} {completedCount} {")"}</p>
    <p onClick={() => setStat("return")} className="cursor-pointer hover:text-bl capitalize">{te('return')} {"("} {returnCount} {")"}</p>
</div>
{isLoading? <div className="grid lg:grid-cols-2 gap-4 h-96 bg-gray-200 animate-pulse"></div>  :
<div className="grid lg:grid-cols-2 gap-4 ">
  {fetsh.length == 0 ? 
  <div className="flex gap-4 items-center  border border-spacing-1 p-3">
    <FaOpencart size={32}/>
    <p className="text-gray-800 font-semibold ">{te('no-order')}</p>
  </div>
  :
                (fetsh?.map((item) => (
                    <div className=" bg-white  px-4 py-6 rounded-md border border-spacing-1 space-y-3" key={item.id}>
                        <p className="capitalize font-medium ">{te('status')}: <span className="text-green-600">{item.status =="pending" ?te('pending'):(item.status == "shipped"? te('shipped'): (item.status == "completed"? te('completed'): te('return')))}</span></p>
                                <div className="flex gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                                         <Image
                                    
                                                    height={200}
                                                    width={200}
                                                     src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, 'image')}` || ''}
                                                    alt={getLocalizedField(item, 'tag') || ''}
                                                    priority
                                                  />
                                          
                                        </div>
            
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <h4 className="text-base font-bold text-gray-800 ">{getLocalizedField(item, 'title').slice(0,30)+".."}</h4>
                                                <div className="flex gap-2 flex-wrap">
                                        {!item.color ? "":   <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Color')}: {item.color}</p>}
                                         {!item.color ? "":  <p className="text-sm font-semibold text-gray-500 flex items-center ">|</p>}
                                         {!item.size ? "":   <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Size')}: {item.size}</p>}
                                         {!item.size ? "":    <p className="text-sm font-semibold text-gray-500 flex items-center">|</p>}
                                         <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Quantity')}: {item.quantity}</p>
                                    </div>
                                 
                                            </div>
            
                                       
                                        </div>  
                                    </div>
     
         
                                </div>
                                <p className=" capitalize text-gray-800">{te('order-info')}</p>
                                <div className="flex gap-4 text-gray-900">
                                          <p className=" capitalize text-sm text-gray-600">{te('address')}</p>   
                                          <div className="text-sm">
                                            <p className="capitalize font-semibold">{item.full_name}</p>
                                            <p>{item.phoneNumber}</p>
                                            <p>{item.address_line_1} {" "} {item.address_line_2}, {item.city}, {item.state}, {item.countryCode}, {item.postalCode}</p>
                                
                                          </div>

                                </div>
                                <div className=" text-gray-600 capitalize text-sm space-y-2">
                                    <p>{te('order-ID')}<span className="text-gray-900">{item.transation_ID_order}</span></p>
                                    <p>{te('Order-placed-on')}<span className="text-gray-900">{item.created_at}</span></p>
                                    {item.updated_at? <p>{te('Order-completed-on')}<span className="text-gray-900">{item.updated_at}</span></p> : ""}
                                    
                                    <p>{te('Payment-method')}<span className="text-gray-900">{item.payment_method}</span></p>
                                    {item.trakingNumber?
                                    <div className="flex gap-2 items-center">
                                        <p>{te('tracking-number')}<span className="text-gray-900">{item.trakingNumber}</span></p>
                                          <button
                                                        type="button"
                                                        onClick={() => handleCopyPassword(item.trakingNumber)}
                                                        className="text-gray-500 hover:text-gray-700"
                                                      >
                                                        <FaCopy className="w-3 h-3"/>
                                                      </button>
                                                      {isCopied === item.trakingNumber && <span className="text-sm text-green-500">{te('copied')}</span>}
                                    </div>
                                    : ""}
                                </div>
                                    <div className="flex gap-4 mt-4 justify-end flex-wrap">
                                        <button className="border border-spacing-1 rounded-xl border-black  py-1 px-3 text-sm capitalize hover:bg-gray-100"
                                         onClick={() => router.push(`/${l}/product/${getLocalizedField(item, 'url')}`)}
                                        >{te('view-product')}</button>
 {item.status == "completed" || item.status == "shipped" ? 

                                        <ReturnDemand orderNumber={item.orderN}/>
                                        :""}

                                       {item.status == "completed" && item.viewed == "no" ? 
                                     <WriteReview userid={item.user} productid={item.product} name={item.full_name} country={item.countryCode} orderid={item.id} color={item.color} size={item.size}/>
                                        : (item.status == "shipped" ? 
                                      <button className="border border-spacing-1 rounded-xl border-black  py-1 px-3 text-sm capitalize hover:bg-gray-100"
                                        onClick={() => handleSubmit(item.id, item.user, item.product)}
                                        >{te('Received')}</button> : 

                                        ( item.status == "completed" && item.viewed == "yes" ?  <button className="border border-spacing-1 rounded-xl border-black  py-1 px-3 text-sm capitalize hover:bg-gray-100"
                                         onClick={()=>handleDelete(item.id, item.user, item.product)}
                                          >{te('Delete')}</button> : 
                                        (item.status == "return"  ?  <button className="border border-spacing-1 rounded-xl border-black  py-1 px-3 text-sm capitalize hover:bg-gray-100"
                                          onClick={()=>handleDelete(item.id, item.user, item.product)}
                                           >{te('Delete')}</button>:"")
                                        )
                                        ) }
                                    </div>
            </div>
                            )))
                          }
                            </div>
     }                       </div>
          </div>  
         
          </div>
          <SuggestionsProducts/>
</div>
    )
}