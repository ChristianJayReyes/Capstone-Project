import React, { useState } from 'react'
import '../../styles/listRoom.css';
import { roomsDummyData } from '../../assets/assets';
import Title from '../../components/Title';
 

const ListRoom = () => {
  
  const [rooms, setRooms] = useState(roomsDummyData)
  return (
    <div >
      <Title align='left' font='outfit' title='Rooms Listings' subtitle='none'/> 
    </div>
  )
}

export default ListRoom