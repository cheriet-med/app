import SearchPost from '@/components/post/searchpost';

import SearchInput from '@/components/SearchInput';
export default function SearchPage() {
  return (
    <div className='my-12'>
      <SearchInput/>
      <SearchPost/>
   
    </div>
  );
}