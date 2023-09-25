import React from 'react'



export default function Table({columns, data}) {
  return (
    <div className='w-full shadow-md rounded-md overflow-hidden relative flex flex-col'>

    {/*Columns*/}
    <div className='w-full  relative hover:bg-[#ecf0f3] bg-[#F5F5F5] py-[10px]    flex '>
      <div className='w-[5%] px-1    text-gray-500 text-center  font-semibold  text-xs'>ID</div>
      <div className='w-full flex   justify-evenly'>
        {columns.map((column,index)=>  <div key={index} className=' w-full text-gray-500 truncate pr-2 text-center font-semibold text-xs'>{Object.keys(column)[0]}</div> )}
      </div>
    </div>



    {/*Data Rows*/}
     
     <div className='w-full flex flex-col '>
      {data?.map((pokemon,index)=>
      <div key={index} className='w-full py-[10px]  flex'>
        <div className='w-[5%] px-1    text-gray-500 text-center  font-semibold  text-xs'>{pokemon.id}</div>

        <div className='flex w-full justify-evenly '>
            {columns.map((column, index)=><div key={index} className=' w-full text-gray-500 truncate pr-1 text-center font-semibold text-xs'>
                {Object.values(column)[0] === 'type'
                  ? pokemon.type.join(', ')
                  : pokemon[Object.values(column)[0]]}</div>)}
         </div>
       

      </div>
      )}

     </div>
      

    </div>
  )
}
