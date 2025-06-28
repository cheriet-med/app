import Search from "./search"
import LanguageSelect from "./languages"
import NewsletterDialog from "./newsletters"


export default function TopNav() {
    return (
      <div>
      <div className=" bg-secondary ">
  <div className="flex items-center  gap-4 w-full  px-6 h-10">
    <LanguageSelect/>
<NewsletterDialog/>
<Search/>
    </div>
    </div>
    </div>
    )}