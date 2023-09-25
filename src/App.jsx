import Table from "./components/Table";
import React, { useState, useEffect, useMemo } from 'react';
import {MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import {TbHeartSearch} from 'react-icons/tb'
import {BiSearch} from 'react-icons/bi'

function App() { 
  const [pokemonData, setPokemonData] = useState([]); //total data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [maxItems, setMaxItems] = useState(10); 
  const [searchQuery, setSearchQuery] = useState('');
  const [powerThreshold, setPowerThreshold] = useState(0);
  const [minPower, setMinPower] = useState(0); 
  const [maxPower, setMaxPower] = useState(0);


  
  //fetch total data
  useEffect(() => {
    fetch('/pokemon.json')
      .then((response) => response.json())
      .then((data) => {
        setPokemonData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


    //prepare the displayed data (pagination + search by name and power threshold)
    const displayData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        //filter by name or power threshold
        const filteredData= pokemonData.filter((pokemon) =>pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&  pokemon.hp +pokemon.attack +pokemon.defense +pokemon.special_attack +pokemon.special_defense + pokemon.speed  >= powerThreshold) ;
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
        setMaxItems(filteredData.length);

    return filteredData.slice(startIndex, endIndex).map((pokemon) => ({
      ...pokemon,
      power:
        pokemon.hp +
        pokemon.attack +
        pokemon.defense +
        pokemon.special_attack +
        pokemon.special_defense +
        pokemon.speed,
    }));
  }, [currentPage, itemsPerPage,  pokemonData, searchQuery,  powerThreshold]);
  


//set Min and Max of Each page
  useEffect(() => {
    if (displayData.length > 0) {
      const powers = displayData.map((pokemon) => pokemon.power);
      setMinPower(Math.min(...powers));
      setMaxPower(Math.max(...powers));
    } else {
      // If there are no filtered results, reset minPower and maxPower to 0
      setMinPower(0);
      setMaxPower(0);
    }
  }, [displayData]);

 


  return (
    <div className="w-screen flex flex-col   items-center ">

     
     {/*Search and Info panel */} 

      <div className="sm:w-[80%] w-[95%] mt-4 flex flex-col overflow-hidden rounded-lg shadow-md px-8 py-4 ">
        <div className="w-full relative grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="w-full flex items-center py-2 rounded-md border border-gray-400 ">
  <BiSearch className="mx-2 text-gray-400"/>
        <input
        type="text"
        placeholder="Search..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-2 text-xs   "
      />
          </div>
          
    
<div className="w-full flex items-center py-2 rounded-md border border-gray-400 ">
  <TbHeartSearch className="mx-2 text-gray-400"/>
    <input
        type="number"
        placeholder="Power threshold"
        value={powerThreshold === 0 ? '' : powerThreshold}
        onChange={(e) => setPowerThreshold(e.target.value == '' ?  0 : parseInt(e.target.value))}
        className="w-full px-2 text-xs  "
      />
</div>
    

        </div>
        <p className="mt-4 text-xs font-bold text-zinc-500">Min Power: {minPower} </p>
        <p className="mt-2 text-xs font-bold text-zinc-500">Max Power: {maxPower} </p>



      </div>

    



      {/* Data Table ,with dynamic adaptable and customizable columns */} 

      <div className='sm:w-[80%] mt-6 w-[95%] '>
        <Table 
          columns={[{'name':'name'}, {'type':'type'}, {'health':'hp'}, {'attack':'attack'}, {'defense':'defense'}, {'special_attack':'special_attack'}, {'special_defense':'special_defense'}, {'speed':'speed'}, {'power':'power'}]}
          data={displayData}
        /> 
      </div>







       {/* Pagination Settings  */} 

      <div className='sm:w-[80%] mt-4 w-[95%]  flex justify-end text-xs items-center select-none font-semibold text-zinc-400 px-8'>
   

           {/* select input to set the number of rows per page */}
          Rows per page:
          <select className='w-[37px] cursor-pointer' value={itemsPerPage} onChange={(e)=>{setItemsPerPage(parseInt(e.target.value,10))}}>
            { Array.from({ length: maxItems -4}, (_, index) => index+5 ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
       

           {/* current page , total pages , and next and previous page buttons*/}
        <span className='ml-4'> {currentPage} of {totalPages}</span>
        <MdOutlineNavigateBefore className={`ml-2  cursor-pointer h-[18px] w-[18px] ${currentPage != 1 && 'text-zinc-700' }`} onClick={()=>{ setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}} disabled={currentPage === 1}/>
        <MdOutlineNavigateNext className={`ml-2  cursor-pointer h-[18px] w-[18px] ${currentPage != totalPages && 'text-zinc-700' }`} onClick={()=>{setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));}} disabled={currentPage === totalPages} />
      </div>

    </div>
  );
}

export default App;
