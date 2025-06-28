import  useGlobalOrder  from "./createOrder";


export default function OrderButton() {
  const { handleSubmitOrder } = useGlobalOrder();
const transactionID = "45612387"
const paymentMethod = "crypto currencie"
  return (
    <button 
      onClick={() => handleSubmitOrder(transactionID, paymentMethod)}
      className="text-white cursor-pointer bg-gray-600 w-full p-3 flex justify-center"
    >
      Pay
    </button>
  );
}
