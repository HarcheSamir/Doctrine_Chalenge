import Table from "./components/Table";
import React, { useState, useEffect } from 'react';
import {MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'

function App() { 
  const [pokemonData, setPokemonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [maxItems, setMaxItems] = useState(10); // Initialize with a default value

  useEffect(() => {
    fetch('/pokemon.json')
      .then((response) => response.json())
      .then((data) => {
        const dataWithPower = data.map((pokemon) => ({
          ...pokemon,
          power:
            pokemon.hp +
            pokemon.attack +
            pokemon.defense +
            pokemon.special_attack +
            pokemon.special_defense +
            pokemon.speed,
        }));
        setPokemonData(dataWithPower);
        setTotalPages(Math.ceil(dataWithPower.length / itemsPerPage));
        setMaxItems(dataWithPower.length); // Set the maximum number of items
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
  };

  // Generate an array of numbers from 5 to maxItems
  const itemsPerPageOptions = Array.from({ length: maxItems - 4 }, (_, index) => index + 5);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pokemonData.slice(startIndex, endIndex);

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className='sm:w-[80%] w-[95%] pt-20'>
        <Table 
          columns={[{'name':'name'}, {'type':'type'}, {'health':'hp'}, {'attack':'attack'}, {'defense':'defense'}, {'special_attack':'special_attack'}, {'special_defense':'special_defense'}, {'speed':'speed'}, {'power':'power'}]}
          data={paginatedData}
        /> 
      </div>


      <div className='sm:w-[80%] mt-4 w-[95%] flex justify-end text-xs items-center select-none font-semibold text-zinc-400 px-8'>
   
          Rows per page:
          <select className='w-[37px]' value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
       

        <span className='ml-4'> {currentPage} of {totalPages}</span>
        <MdOutlineNavigateBefore className={`ml-2  cursor-pointer h-[18px] w-[18px] ${currentPage != 1 && 'text-zinc-700' }`} onClick={handlePreviousPage} disabled={currentPage === 1}/>
        <MdOutlineNavigateNext className={`ml-2  cursor-pointer h-[18px] w-[18px] ${currentPage != totalPages && 'text-zinc-700' }`} onClick={handleNextPage} disabled={currentPage === totalPages} />
      </div>
    </div>
  );
}

export default App;
