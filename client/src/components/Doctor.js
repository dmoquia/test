import React from "react";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      <h1 className="card-title">
        {doctor.firstName} {doctor.lastName}
      </h1>
      <hr />
      <p className="card-text">
        <b>Phone : </b>
        {doctor.phoneNumber}
      </p>
      <p className="card-text">
        <b>Address : </b>
        {doctor.address}
      </p>
      <p className="card-text">
        <b>fee per visit : </b>
        {doctor.feePerConsultation}
      </p>
      <p className="card-text">
        <b>Schedule : </b>
        {doctor.schedule[0]} - {doctor.schedule[1]}
      </p>
    </div>
  );
}

export default Doctor;
