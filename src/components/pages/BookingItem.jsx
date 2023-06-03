import React from 'react'
import { useParams } from "react-router-dom";

export default function BookingItem() {
    const { ownerId } = useParams();
    const userId = localStorage.getItem("userId");
    
    return (
        <div>
            This is BookingItem page for owner {ownerId} and user {userId}
        </div>
    )
}
