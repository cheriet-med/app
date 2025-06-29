// app/map/page.tsx
import Map from '@/components/Map';

import SearchForm from '@/components/header/search';

export default function MapPage() {
  const sampleMarkers = [
    {
      position: [51.505, -0.09] as [number, number],
      popup: 'Hello from London!'
    },
    {
      position: [51.51, -0.1] as [number, number],
      popup: 'Another marker'
    }
  ];

  return (
    <div className="pt-32 ">
    
      <Map
        center={[51.505, -0.09]}
        zoom={13}
        height="500px"
        markers={sampleMarkers}
      />
   <div className='py-32'> 
        <SearchForm/>
      </div>
    
    </div>
  );
}